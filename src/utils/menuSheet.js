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

// Applique les onglets à la config, au bon endroit selon le template.
// Ne remplace QUE la liste des plats : couleurs, formules, textes... restent.
export function appliquerMenu(config, onglets) {
  if (!onglets || onglets.length === 0) return config;

  if (config.template === "essentiel") {
    // Une seule liste de catégories : on prend celles du 1er menu.
    return { ...config, menu: { ...config.menu, categories: onglets[0].categories } };
  }

  if (config.template === "signature") {
    return { ...config, menus: { ...config.menus, onglets } };
  }

  if (config.template === "prestige") {
    const contenu = { ...config.contenu };
    for (const langue of Object.keys(contenu)) {
      contenu[langue] = {
        ...contenu[langue],
        carte: { ...contenu[langue].carte, onglets },
      };
    }
    return { ...config, contenu };
  }

  return config;
}
