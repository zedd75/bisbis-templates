// Applique à la config les textes et les liens de réseaux sociaux saisis
// dans le back-office.
//
// Les textes arrivent dans un dictionnaire plat { clé: texte } :
//   - "hero.titre"          : chemin du texte dans la config ;
//   - "hero.titre@en"       : le même texte dans une autre langue ;
//   - "reseaux.instagram"   : lien d'un réseau social.
//
// TROIS RÈGLES.
//
// 1. LE SITE N'ÉCRIT QUE DANS LES EMPLACEMENTS QU'IL CONNAÎT.
//    La liste ci-dessous fait foi. Une clé inconnue est ignorée : sans cela,
//    un dictionnaire mal rempli pourrait remplacer une image, une couleur ou
//    l'identifiant du restaurant. Et un emplacement que ce site n'a pas
//    (un troisième bloc d'histoire, une langue absente) n'est jamais créé.
//
// 2. UN TEXTE VIDE GARDE LE TEXTE D'ORIGINE.
//    Un site sans titre d'accueil serait cassé. Vide ou absent, c'est le
//    texte écrit à la création du site qui s'affiche.
//
// 3. UN RÉSEAU SOCIAL, LUI, SE MASQUE.
//    Dès que sa clé existe, elle fait foi : un lien complet s'affiche, tout
//    le reste (vide, incomplet, dangereux) masque le réseau. Un restaurateur
//    qui ferme sa page doit pouvoir en retirer le lien. Clé absente : le
//    lien d'origine reste.
import { urlReservation as lienExterne } from "./reservation.js";

const UNE_PAGE = ["hero.titre", "hero.sousTitre", "apropos.titre", "apropos.texte"];

// Essentiel et Signature : chemins à la racine de la config.
// Prestige : chemins dans les textes de chaque langue (config.contenu).
const EMPLACEMENTS = {
  essentiel: UNE_PAGE,
  signature: UNE_PAGE,
  prestige: [
    "hero.label",
    "hero.titre",
    "hero.sousTitre",
    "histoire.chapo",
    "histoire.blocs.0.titre",
    "histoire.blocs.0.texte",
    "histoire.blocs.1.titre",
    "histoire.blocs.1.texte",
    "histoire.chef.texte",
    "histoire.chef.nom",
    "histoire.chef.role",
  ],
};

const RESEAUX = ["instagram", "facebook"];

const estObjet = (v) => !!v && typeof v === "object";

// Remplace le texte rangé à `chemin`, sans modifier l'objet d'origine.
// Ne fait rien si l'emplacement n'existe pas ou ne contient pas un texte.
function poser(objet, chemin, valeur) {
  const [cle, ...reste] = chemin;
  if (!estObjet(objet) || !Object.hasOwn(objet, cle)) return objet;
  const suite = reste.length ? poser(objet[cle], reste, valeur) : valeur;
  if (!reste.length && typeof objet[cle] !== "string") return objet;
  if (suite === objet[cle]) return objet;
  if (Array.isArray(objet)) {
    const copie = objet.slice();
    copie[cle] = suite;
    return copie;
  }
  return { ...objet, [cle]: suite };
}

// Pose dans `cible` les textes saisis pour une langue ("" = langue de saisie).
function poserTextes(cible, emplacements, textes, suffixe) {
  let sortie = cible;
  for (const emplacement of emplacements) {
    const cle = emplacement + suffixe;
    if (!Object.hasOwn(textes, cle)) continue;
    const valeur = textes[cle];
    if (typeof valeur !== "string" || !valeur.trim()) continue;
    sortie = poser(sortie, emplacement.split("."), valeur.trim());
  }
  return sortie;
}

function appliquerReseaux(config, textes) {
  let reseaux = config.reseaux;
  for (const id of RESEAUX) {
    const cle = `reseaux.${id}`;
    if (!Object.hasOwn(textes, cle)) continue;
    const lien = lienExterne(textes[cle]);
    if (reseaux?.[id] === lien) continue;
    reseaux = { ...reseaux, [id]: lien };
  }
  return reseaux === config.reseaux ? config : { ...config, reseaux };
}

export function appliquerTextes(config, textes) {
  if (!estObjet(textes) || Array.isArray(textes)) return config;
  const emplacements = EMPLACEMENTS[config.template];
  let sortie = appliquerReseaux(config, textes);
  if (!emplacements) return sortie;

  if (config.template === "prestige") {
    if (!estObjet(config.contenu)) return sortie;
    let contenu = config.contenu;
    for (const langue of Object.keys(config.contenu)) {
      const avant = contenu[langue];
      const apres = poserTextes(avant, emplacements, textes, langue === "fr" ? "" : `@${langue}`);
      if (apres !== avant) contenu = { ...contenu, [langue]: apres };
    }
    return contenu === config.contenu ? sortie : { ...sortie, contenu };
  }
  return poserTextes(sortie, emplacements, textes, "");
}
