// Modele PRESTIGE — multi-pages (react-router), bilingue FR/EN.
//
// Prestige n'est PAS « Signature en plus riche » : sa config a une autre
// forme. Son theme utilise son propre vocabulaire de couleurs (encre, or,
// creme...), ses textes vivent dans un bloc `contenu` par langue, et ses
// horaires sont une CHAINE, pas un tableau.
//
// Regle du bilingue, decidee sur le projet : « charpente en anglais, plats
// en francais ». On traduit la navigation et les titres ; jamais les
// intitules de plats.
import { entete, mapsEmbed, placeholder } from "./commun.mjs";

export const offre = "Prestige";

export function construire(d) {
  const img = (t, taille) => placeholder(d, t, taille);
  return `${entete(d, offre)}
import {
  nourriture,
  dejeuner,
  enfant,
  boissons,
} from "./data/carte-auteuil.data.js";

const config = {
  template: "prestige",
  nom: "${d.nom}",

  // Relie ce site a CometStudio. SANS cette ligne, le restaurateur
  // modifierait dans le vide : ses changements ne remonteraient jamais.
  restaurantId: "${d.restaurantId}",

  // Prestige a son propre vocabulaire de couleurs.
  theme: {
    encre: "#0F1215",
    charcoal: "#1E2024",
    or: "${d.secondaire}",
    creme: "#F4EDE1",
    vert: "${d.primaire}",
    policeTitres: "'Playfair Display', serif",
    policeCaps: "'Cormorant Garamond', serif",
    policeTexte: "'Lato', sans-serif",
  },

  // Ce template est SOMBRE par defaut : c'est son identite.
  // En variante claire, l'accent doit etre ASSOMBRI, sinon il devient
  // illisible sur fond clair.
  themeDefaut: "sombre",
  themeAlternatif: {
    encre: "#F7F2E8",
    charcoal: "#FFFFFF",
    or: "#775F22",
    creme: "#1A1D21",
    vert: "${d.primaire}",
    policeTitres: "'Playfair Display', serif",
    policeCaps: "'Cormorant Garamond', serif",
    policeTexte: "'Lato', sans-serif",
  },

  // Images de repli. Les vraies viennent de CometStudio.
  images: {
    hero: "${img("Photo d'accueil", "1920x1080")}",
    story1: "${img("Salle", "900x1100")}",
    story2: "${img("Chef", "900x1100")}",
    galerie: [
      "${img("Photo 1", "1200x800")}",
      "${img("Photo 2", "1200x800")}",
      "${img("Photo 3", "1200x800")}",
    ],
  },

  reservationUrl: "",

  infos: {
    adresse: "${d.adresse}",
    telephone: "${d.telephone}",
    horaires: "À renseigner",
    metro: "À renseigner",
    googleMapsEmbed: "${mapsEmbed(d.adresse)}",
  },

  reseaux: {
    instagram: "${d.instagram}",
    facebook: "",
  },

  contenu: {
    fr: {
      nav: {
        carte: "Cartes & menus",
        histoire: "Notre histoire",
        galerie: "Galerie",
        reserver: "Réserver",
      },
      hero: {
        label: "À renseigner",
        titre: "${d.nom}",
        sousTitre: "${d.slogan}",
        cta1: "Réserver une table",
        cta2: "Découvrir la carte",
      },
      ctaBand: {
        titre: "Réservez votre table",
        texte: "À personnaliser.",
        bouton: "Réserver",
      },
      infosTitre: "Nous trouver",
      labelHoraires: "Horaires",
      labelAdresse: "Adresse",
      labelMetro: "Métro",

      carte: {
        label: "La carte",
        titre: "Cartes & menus",
        texte: "À personnaliser.",
        formules: {
          titre: "Menu déjeuner",
          note: "À personnaliser",
          items: [
            { nom: "Entrée + Plat", prix: "0€" },
            { nom: "Plat + Dessert", prix: "0€" },
          ],
        },
        onglets: [
          {
            id: "carte",
            nom: "La carte",
            categories: [
              { nom: "Entrées", plats: nourriture.mezzes },
              { nom: "Plats", plats: nourriture.grillades },
              { nom: "Desserts", plats: nourriture.desserts },
            ],
          },
          {
            id: "dejeuner",
            nom: "Menu déjeuner",
            categories: [
              { nom: "Entrées au choix", plats: dejeuner.entrees },
              { nom: "Plats au choix", plats: dejeuner.plats },
              { nom: "Desserts au choix", plats: dejeuner.desserts },
            ],
          },
          {
            id: "enfant",
            nom: "Menu enfant",
            categories: [{ nom: "Au choix", plats: enfant.plats }],
          },
          {
            id: "boissons",
            nom: "Boissons",
            categories: [{ nom: "Softs", plats: boissons.sansAlcool }],
          },
        ],
      },

      histoire: {
        label: "Notre histoire",
        titre: "À renseigner",
        chapo: "À personnaliser.",
        blocs: [],
        chef: null,
      },

      galerie: {
        label: "Galerie",
        titre: "En images",
        texte: "À personnaliser.",
      },

      avis: { titre: "Ils en parlent" },
    },

    en: {
      nav: {
        carte: "Menus",
        histoire: "Our story",
        galerie: "Gallery",
        reserver: "Book",
      },
      hero: {
        label: "To be filled in",
        titre: "${d.nom}",
        sousTitre: "To be translated.",
        cta1: "Book a table",
        cta2: "See the menu",
      },
      ctaBand: {
        titre: "Book your table",
        texte: "To be translated.",
        bouton: "Book",
      },
      infosTitre: "Find us",
      labelHoraires: "Opening hours",
      labelAdresse: "Address",
      labelMetro: "Metro",

      // Les intitules de plats restent en francais : c'est l'usage des
      // cartes francaises, et la traduction automatique y est mauvaise.
      carte: {
        label: "Menus",
        titre: "Menus",
        texte: "To be translated.",
        formules: {
          titre: "Lunch menu",
          note: "To be translated",
          items: [
            { nom: "Starter + Main", prix: "0€" },
            { nom: "Main + Dessert", prix: "0€" },
          ],
        },
        onglets: [
          {
            id: "carte",
            nom: "The menu",
            categories: [
              { nom: "Starters", plats: nourriture.mezzes },
              { nom: "Mains", plats: nourriture.grillades },
              { nom: "Desserts", plats: nourriture.desserts },
            ],
          },
          {
            id: "dejeuner",
            nom: "Lunch menu",
            categories: [
              { nom: "Starters", plats: dejeuner.entrees },
              { nom: "Mains", plats: dejeuner.plats },
              { nom: "Desserts", plats: dejeuner.desserts },
            ],
          },
          {
            id: "enfant",
            nom: "Children's menu",
            categories: [{ nom: "Choice of", plats: enfant.plats }],
          },
          {
            id: "boissons",
            nom: "Drinks",
            categories: [{ nom: "Soft drinks", plats: boissons.sansAlcool }],
          },
        ],
      },

      histoire: {
        label: "Our story",
        titre: "To be filled in",
        chapo: "To be translated.",
        blocs: [],
        chef: null,
      },

      galerie: {
        label: "Gallery",
        titre: "In pictures",
        texte: "To be translated.",
      },

      avis: { titre: "What they say" },
    },
  },
};

export default config;
`;
}
