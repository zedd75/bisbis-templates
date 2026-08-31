// Modele SIGNATURE — une page, plus riche : galerie, onglets de carte, avis.
import { entete, blocTheme, blocInfos, placeholder } from "./commun.mjs";

export const offre = "Signature";

export function construire(d) {
  const photo = (n) => placeholder(d, `Photo ${n}`);
  return `${entete(d, offre)}
import { nourriture } from "./data/carte-auteuil.data.js";

const config = {
  template: "signature",
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

  // Galerie de repli. Les vraies photos viennent de CometStudio.
  galerie: {
    titre: "En images",
    images: [
      "${photo(1)}",
      "${photo(2)}",
      "${photo(3)}",
      "${photo(4)}",
      "${photo(5)}",
      "${photo(6)}",
    ],
  },

  // Carte de repli. La vraie carte vient de CometStudio.
  menus: {
    titre: "Cartes & menus",
    formules: {
      titre: "Menu dejeuner",
      note: "A personnaliser",
      items: [
        { nom: "Entree + Plat", prix: "0€" },
        { nom: "Plat + Dessert", prix: "0€" },
        { nom: "Entree + Plat + Dessert", prix: "0€" },
      ],
    },
    onglets: [
      {
        id: "carte",
        nom: "La carte",
        categories: [
          { nom: "Entrees", plats: nourriture.mezzes },
          { nom: "Plats", plats: nourriture.grillades },
          { nom: "Desserts", plats: nourriture.desserts },
        ],
      },
    ],
  },

  // Avis de repli. Les vrais avis viennent de CometStudio.
  // A remplir avec de VRAIS avis Google recopies : inventer un avis
  // tombe sous l'article L.132-2 du code de la consommation.
  avis: {
    titre: "Ils en parlent",
    items: [],
  },

${blocInfos(d)}

  sections: {
    apropos: true,
    menu: true,
    galerie: true,
    avis: true,
  },
};

export default config;
`;
}
