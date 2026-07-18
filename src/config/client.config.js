// ============================================================
//  FICHIER DE CONFIGURATION CLIENT — démo ESSENTIEL
// ------------------------------------------------------------
//  Pour créer un NOUVEAU site :
//    1. Dupliquez ce fichier (ex: chez-fatou.config.js)
//    2. Changez uniquement les valeurs ci-dessous
//    3. Importez-le dans App.jsx
//  => Vous ne touchez JAMAIS au reste du code.
// ============================================================
import { nourriture } from "./data/carte-auteuil.data.js";

const config = {
  // --- Quel modèle de site ? -------------------------------
  //  "essentiel"  = 1 page simple      (offre Low Cost)
  //  "signature"  = 1 page + animations (offre Middle)   [à venir]
  //  "prestige"   = multi-pages          (offre Premium) [à venir]
  template: "essentiel",

  // --- Identité --------------------------------------------
  nom: "Le Petit Marais",
  logo: null, // null = on affiche le nom en texte. Sinon: "/logo.png"

  // --- Thème : couleurs & polices --------------------------
  //  Changez ces couleurs et TOUT le site s'adapte.
  theme: {
    primaire: "#8B2E2E",    // couleur principale (boutons, titres)
    secondaire: "#C9A24B",  // couleur d'accent (doré)
    fond: "#FDF8F0",        // fond de page (crème)
    texte: "#2A2A2A",       // couleur du texte
    policeTitres: "'Playfair Display', serif",
    policeTexte: "'Inter', sans-serif",
  },

  // --- Section HERO (grande image d'accueil) ---------------
  hero: {
    // Remplacez par la vraie photo du client (ex: "/photos/salle.jpg")
    image: "https://placehold.co/1600x900/8B2E2E/FDF8F0?text=Photo+d%27accueil",
    titre: "Le Petit Marais",
    sousTitre: "Bistrot parisien — cuisine de saison, au cœur du 3ᵉ",
  },

  // --- Section À PROPOS ------------------------------------
  apropos: {
    titre: "Notre maison",
    texte:
      "Niché dans une rue pavée du Marais, Le Petit Marais revisite les " +
      "classiques du bistrot avec des produits frais et de saison. Une " +
      "cuisine généreuse, une ardoise qui change chaque semaine, et " +
      "l'accueil chaleureux d'une équipe passionnée.",
    image: "https://placehold.co/800x600/C9A24B/2A2A2A?text=Photo+du+chef",
  },

  // --- MENU / La carte -------------------------------------
  //  Les plats viennent du fichier partagé data/carte-auteuil.data.js
  //  (le même que la démo Premium). Pour un vrai client : remplacez
  //  par ses propres catégories/plats.
  menu: {
    titre: "La carte",
    categories: [
      { nom: "Mezzés — à partager", plats: nourriture.mezzes },
      { nom: "Pâtes & risotto", plats: nourriture.patesRisotto },
      { nom: "Pizzas", plats: nourriture.pizzas },
      { nom: "Crus", plats: nourriture.crus },
      { nom: "Salades", plats: nourriture.salades },
      { nom: "Grillades & plancha", plats: nourriture.grillades },
      { nom: "Sucrés & glacés", plats: nourriture.desserts },
    ],
  },

  // --- INFOS PRATIQUES -------------------------------------
  infos: {
    adresse: "12 rue de Bretagne, 75003 Paris",
    telephone: "01 42 00 00 00",
    email: "contact@lepetitmarais.fr",
    horaires: [
      { jour: "Lundi", heures: "Fermé" },
      { jour: "Mardi – Vendredi", heures: "12h–14h30 · 19h–22h30" },
      { jour: "Samedi", heures: "19h–23h" },
      { jour: "Dimanche", heures: "12h–15h" },
    ],
    // Carte Google (aucune clé nécessaire) : changez juste l'adresse
    // dans le lien après "q=".
    googleMapsEmbed:
      "https://maps.google.com/maps?q=12%20rue%20de%20Bretagne%2075003%20Paris&output=embed",
  },

  // --- Réseaux sociaux (laissez "" pour masquer) -----------
  reseaux: {
    instagram: "https://instagram.com/lepetitmarais",
    facebook: "",
  },

  // --- Sections activées -----------------------------------
  //  Mettez false pour masquer une section (sans supprimer de code).
  sections: {
    apropos: true,
    menu: true,
  },
};

export default config;
