// Modele ESSENTIEL — une page unique, navigation par ancres.
import { entete, blocTheme, blocInfos, placeholder } from "./commun.mjs";

export const offre = "Essentiel";

export function construire(d) {
  return `${entete(d, offre)}
import { nourriture } from "./data/carte-auteuil.data.js";

const config = {
  template: "essentiel",
  nom: "${d.nom}",
  logo: null,

  // Relie ce site a CometStudio. SANS cette ligne, le restaurateur
  // modifierait dans le vide : ses changements ne remonteraient jamais.
  restaurantId: "${d.restaurantId}",

${blocTheme(d)}

  hero: {
    image: "${placeholder(d, "Photo d'accueil")}",
    titre: "${d.nom}",
    sousTitre: "${d.slogan}",
  },

  apropos: {
    titre: "Notre maison",
    texte:
      "Presentez ici le restaurant en trois ou quatre phrases : son histoire, " +
      "sa cuisine, ce qui le rend unique. (Texte a personnaliser.)",
    image: "${placeholder(d, "Photo de la salle")}",
  },

  // Carte de repli. La vraie carte vient de CometStudio.
  menu: {
    titre: "La carte",
    categories: [
      { nom: "Entrees", plats: nourriture.mezzes },
      { nom: "Plats", plats: nourriture.grillades },
      { nom: "Desserts", plats: nourriture.desserts },
    ],
  },

${blocInfos(d)}

  sections: {
    apropos: true,
    menu: true,
  },
};

export default config;
`;
}
