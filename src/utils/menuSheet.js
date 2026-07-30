// Transforme les lignes d'un CSV (Google Sheet) en structure de menu,
// puis l'applique à la config selon le template.
//
// Colonnes attendues dans le Sheet (l'ordre n'importe pas, les accents
// et majuscules sont tolérés) :
//   menu | categorie | plat | description | prix
// Exemple :
//   La carte | Entrées | Salade César | Poulet, parmesan | 12€
import slugify from "./slugify.js";

// Normalise un en-tête : minuscules, sans accents, sans espaces autour.
function norm(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

// Cherche l'indice d'une colonne parmi plusieurs noms possibles.
function trouverColonne(entetes, nomsPossibles) {
  for (let i = 0; i < entetes.length; i++) {
    if (nomsPossibles.includes(norm(entetes[i]))) return i;
  }
  return -1;
}

// Lignes CSV -> [{ id, nom, categories: [{ nom, plats: [{nom, desc, prix}] }] }]
export function construireOnglets(lignes) {
  if (!lignes || lignes.length < 2) return [];

  const entetes = lignes[0];
  const iMenu = trouverColonne(entetes, ["menu", "onglet", "carte"]);
  const iCat = trouverColonne(entetes, ["categorie", "category", "rubrique"]);
  const iPlat = trouverColonne(entetes, ["plat", "nom", "name", "produit", "article"]);
  const iDesc = trouverColonne(entetes, ["description", "desc", "detail", "details"]);
  const iPrix = trouverColonne(entetes, ["prix", "price", "tarif"]);
  if (iPlat === -1) return []; // sans colonne "plat", impossible de construire

  const ordre = []; // conserve l'ordre d'apparition des menus
  const parMenu = new Map();

  for (let r = 1; r < lignes.length; r++) {
    const ligne = lignes[r];
    const nomPlat = (ligne[iPlat] || "").trim();
    if (!nomPlat) continue; // ligne vide -> ignorée

    const nomMenu =
      (iMenu >= 0 && (ligne[iMenu] || "").trim()) || "La carte";
    const nomCat =
      (iCat >= 0 && (ligne[iCat] || "").trim()) || "Notre sélection";

    let menu = parMenu.get(nomMenu);
    if (!menu) {
      menu = { id: slugify(nomMenu), nom: nomMenu, categories: [], _cats: new Map() };
      parMenu.set(nomMenu, menu);
      ordre.push(menu);
    }
    let cat = menu._cats.get(nomCat);
    if (!cat) {
      cat = { nom: nomCat, plats: [] };
      menu._cats.set(nomCat, cat);
      menu.categories.push(cat);
    }
    cat.plats.push({
      nom: nomPlat,
      desc: iDesc >= 0 ? (ligne[iDesc] || "").trim() : "",
      prix: iPrix >= 0 ? (ligne[iPrix] || "").trim() : "",
    });
  }

  // Nettoie les champs internes avant de renvoyer.
  return ordre.map(({ id, nom, categories }) => ({ id, nom, categories }));
}

// Les onglets venus de la base (ou d'un CSV) n'ont PAS de note : la table
// "plats" ne stocke qu'un plat par ligne, sans place pour une mention d'onglet
// (« Servis 4cl, supplément 2,50€ »). On reprend donc celle déclarée dans la
// config, en appariant les onglets par NOM.
//
// Pourquoi le nom et pas l'identifiant : la config écrit des id courts à la
// main ("dejeuner", "vins") alors que la base les dérive du libellé
// ("menu-dejeuner", "vins-champagnes"). 4 id sur 6 ne correspondent pas ; les
// noms, eux, correspondent tous ("Menu déjeuner", "Vins & champagnes").
//
// Seule la note est reprise : tout le reste vient de la base. Un onglet qui
// porte déjà une note la garde — la base aura la priorité le jour où elle
// saura en stocker une.
// Si rien n'est repris, on renvoie le tableau d'origine (identité préservée).
export function reporterNotes(ongletsBase, ongletsReference) {
  if (!ongletsBase || !ongletsReference || ongletsReference.length === 0) {
    return ongletsBase;
  }
  let repris = false;
  const sortie = ongletsBase.map((onglet) => {
    if (onglet.note) return onglet;
    const reference = ongletsReference.find((o) => o.nom === onglet.nom);
    if (!reference || !reference.note) return onglet;
    repris = true;
    return { ...onglet, note: reference.note };
  });
  return repris ? sortie : ongletsBase;
}

// Applique les onglets à la config, au bon endroit selon le template.
// Ne remplace QUE la liste des plats : couleurs, formules, textes... restent.
export function appliquerMenu(config, onglets) {
  if (!onglets || onglets.length === 0) return config;

  if (config.template === "essentiel") {
    // Une seule liste de catégories : on prend celles du 1er menu.
    // Ce template n'a pas d'onglets, donc pas de note à reporter.
    return { ...config, menu: { ...config.menu, categories: onglets[0].categories } };
  }

  if (config.template === "signature") {
    const avecNotes = reporterNotes(onglets, config.menus?.onglets);
    return { ...config, menus: { ...config.menus, onglets: avecNotes } };
  }

  if (config.template === "prestige") {
    const contenu = { ...config.contenu };
    const langues = Object.keys(contenu);
    // Les noms de menus en base sont dans la langue de saisie du restaurateur.
    // On prend donc les notes de la PREMIÈRE langue de la config (le français)
    // et on les affiche telles quelles dans toutes les langues : une note
    // unique, pas de traduction. Lu avant la boucle, qui réécrit "contenu".
    const avecNotes = reporterNotes(onglets, contenu[langues[0]]?.carte?.onglets);
    for (const langue of langues) {
      contenu[langue] = {
        ...contenu[langue],
        carte: { ...contenu[langue].carte, onglets: avecNotes },
      };
    }
    return { ...config, contenu };
  }

  return config;
}
