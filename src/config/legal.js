// ============================================================
//  DONNÉES LÉGALES — communes à tous les sites.
//
//  Deux cas, un seul mécanisme :
//   - SITE VENDU : le fichier de config du client contient un bloc
//     `legal`. Les mentions affichent alors SES informations, car
//     l'éditeur du site est le restaurateur.
//   - SITE DE DÉMONSTRATION : pas de bloc `legal` dans la config.
//     Les mentions basculent sur EDITEUR_DEMO ci-dessous et signalent
//     clairement qu'il s'agit d'une démonstration.
//
//  Les mentions légales sont OBLIGATOIRES (LCEN, art. 6 III, revue par
//  la loi SREN n° 2024-449). Leur absence est punie de 75 000 € et un an
//  d'emprisonnement pour une personne physique, 375 000 € pour une
//  société.
//
//  ⚠️ Ceci n'est pas un avis juridique. Faire relire par un
//  professionnel avant le premier vrai client.
// ============================================================

// Hébergeur de tous les sites. C'est l'ENTREPRISE QUI HÉBERGE, pas toi :
// la loi impose de l'identifier pour qu'on puisse la joindre en cas de
// contenu litigieux. Ne pas remplacer par ton nom — le tien va dans
// EDITEUR_DEMO juste en dessous.
export const HEBERGEUR = {
  nom: "Vercel Inc.",
  adresse: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  site: "https://vercel.com",
};

// ------------------------------------------------------------
//  ÉDITEUR DES SITES DE DÉMONSTRATION
//  À COMPLÉTER. Tant que `nom` est vide, la page affiche un
//  avertissement au lieu de faire semblant d'être en règle.
//
//  Sans SIRET, tu es « éditeur non professionnel » : le nom et un
//  moyen de contact suffisent, ton adresse personnelle n'a PAS à
//  être publiée. Le jour où tu t'immatricules, remplis `siret` (et
//  `rcs`, `capital`, `tva` si tu passes en société) : la page
//  s'adapte toute seule.
// ------------------------------------------------------------
export const EDITEUR_DEMO = {
  nom: "Omar Ben achour",
  // Adresse découpée en deux : elle n'apparaît jamais entière, ni dans ce
  // dépôt (qui est PUBLIC), ni dans le fichier JavaScript livré au
  // navigateur. Elle n'est recomposée qu'au moment de l'affichage.
  // Ça arrête les robots collecteurs qui balaient du texte à la recherche
  // de « quelquechose@quelquechose ». Ça n'arrête PAS un robot qui exécute
  // la page — aucune technique ne le fait.
  // Une adresse en clair reste acceptée : `email: "contact@exemple.fr"`.
  courriel: { utilisateur: "zedd.paris.pro", domaine: "gmail.com" },
  telephone: "", // facultatif
  // Champs professionnels : laisser vide tant que non immatriculé.
  formeJuridique: "", // ex. "SASU", "Micro-entreprise"
  siret: "",
  rcs: "",
  capital: "",
  tva: "",
  adresse: "", // obligatoire seulement pour un professionnel
  directeurPublication: "", // à défaut, `nom` est utilisé
};

// Chemins des pages légales. Servent à la fois au routage (App.jsx)
// et à la dérogation de redirection (index.html).
export const CHEMIN_MENTIONS = "/mentions-legales";
export const CHEMIN_CONFIDENTIALITE = "/confidentialite";

// Ce que les sites stockent réellement dans le navigateur du visiteur.
// Aucun traceur, aucune mesure d'audience, aucun cookie publicitaire :
// ces stockages sont « strictement nécessaires », donc exemptés de
// consentement. C'est pour ça qu'aucun bandeau cookies n'est affiché —
// c'est un choix, pas un oubli.
export const STOCKAGES = [
  {
    nom: "Choix du site affiché",
    type: "sessionStorage",
    role: "Retenir quelle démonstration vous consultez, le temps de l'onglet.",
    duree: "Effacé à la fermeture de l'onglet",
  },
  {
    nom: "Préférence d'affichage",
    type: "localStorage",
    role: "Retenir votre choix entre le mode clair et le mode sombre.",
    duree: "Jusqu'à effacement par vos soins",
  },
];
