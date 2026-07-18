// ============================================================
//  CONFIG CLIENT — démo SIGNATURE "Casa Palma" (fictif)
//  Offre Middle : one-page enrichi — galerie photos, avis
//  clients, menu interactif à onglets, animations au scroll.
//  Le menu vient du fichier partagé data/carte-auteuil.data.js
//  (le même que les démos Essentiel et Premium).
// ============================================================
import {
  nourriture,
  dejeuner,
  enfant,
  boissons,
  spiritueux,
  vins,
} from "./data/carte-auteuil.data.js";

const config = {
  template: "signature",
  nom: "Casa Palma",
  logo: null,

  // --- Thème (terracotta / ivoire) ---------------------------
  theme: {
    primaire: "#9A3B26",    // terracotta
    secondaire: "#E0A458",  // ocre doré
    fond: "#FAF6EF",        // ivoire
    texte: "#26221E",
    policeTitres: "'Playfair Display', serif",
    policeTexte: "'Inter', sans-serif",
  },

  // --- Hero --------------------------------------------------
  hero: {
    image: "https://placehold.co/1600x900/9A3B26/FAF6EF?text=Photo+d%27accueil",
    titre: "Casa Palma",
    sousTitre: "Trattoria méditerranéenne — mezzés, pizzas et grillades au feu de bois",
  },

  // --- À propos ----------------------------------------------
  apropos: {
    titre: "La maison",
    texte:
      "Chez Casa Palma, la Méditerranée s'invite à table : mezzés à partager, " +
      "pâtes fraîches, pizzas au feu de bois et grillades généreuses. Une " +
      "cuisine de produits frais, une terrasse ensoleillée et une équipe qui " +
      "reçoit comme à la maison.",
    image: "https://placehold.co/800x600/E0A458/26221E?text=Photo+de+la+salle",
  },

  // --- Galerie photos ----------------------------------------
  galerie: {
    titre: "En images",
    images: [
      "https://placehold.co/800x600/9A3B26/FAF6EF?text=Salle",
      "https://placehold.co/800x600/E0A458/26221E?text=Pizza",
      "https://placehold.co/800x600/26221E/E0A458?text=Terrasse",
      "https://placehold.co/800x600/9A3B26/FAF6EF?text=Mezz%C3%A9s",
      "https://placehold.co/800x600/E0A458/26221E?text=Cocktail",
      "https://placehold.co/800x600/26221E/E0A458?text=Dessert",
    ],
  },

  // --- Menus (mêmes données que la démo Premium) -------------
  menus: {
    titre: "Cartes & menus",
    formules: {
      titre: "Menu déjeuner",
      note: "Du lundi au vendredi midi, hors jours fériés — boisson non comprise",
      items: [
        { nom: "Entrée + Plat", prix: "22,50€" },
        { nom: "Plat + Dessert", prix: "22,50€" },
        { nom: "Entrée + Plat + Dessert", prix: "25,50€" },
        { nom: "Menu enfant (jusqu'à 12 ans)", prix: "15,00€" },
      ],
    },
    onglets: [
      {
        id: "carte",
        nom: "La carte",
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
      {
        id: "dejeuner",
        nom: "Menu déjeuner",
        note: "Lundi au vendredi midi, hors fériés — Entrée + Plat ou Plat + Dessert 22,50€ · Entrée + Plat + Dessert 25,50€",
        categories: [
          { nom: "Entrées au choix", plats: dejeuner.entrees },
          { nom: "Plats au choix", plats: dejeuner.plats },
          { nom: "Desserts au choix", plats: dejeuner.desserts },
        ],
      },
      {
        id: "enfant",
        nom: "Menu enfant",
        note: "Jusqu'à 12 ans — 15,00€",
        categories: [
          { nom: "Plat au choix", plats: enfant.plats },
          { nom: "Dessert au choix", plats: enfant.desserts },
          { nom: "Boisson au choix", plats: enfant.boissons },
        ],
      },
      {
        id: "boissons",
        nom: "Boissons",
        categories: [
          { nom: "Apéritifs", plats: boissons.aperitifs },
          { nom: "Anisés", plats: boissons.anises },
          { nom: "Vermouths, bitters & amari", plats: boissons.vermouths },
          { nom: "Spritz", plats: boissons.spritz },
          { nom: "Cocktails création", plats: boissons.creation },
          { nom: "Cocktails classiques", plats: boissons.classiques },
          { nom: "Sans alcool & fruits frais", plats: boissons.sansAlcool },
          { nom: "Bières", plats: boissons.bieres },
          { nom: "Boissons fraîches", plats: boissons.fraiches },
          { nom: "Eaux minérales", plats: boissons.eaux },
          { nom: "Jus & nectars", plats: boissons.jus },
          { nom: "Boissons chaudes", plats: boissons.chaudes },
          { nom: "Thés & infusions", plats: boissons.thes },
        ],
      },
      {
        id: "spiritueux",
        nom: "Spiritueux",
        note: "Servis 4cl — supplément accompagnement 2,50€",
        categories: [
          { nom: "Gins", plats: spiritueux.gins },
          { nom: "Whiskies", plats: spiritueux.whiskies },
          { nom: "Vodkas", plats: spiritueux.vodkas },
          { nom: "Tequilas, mezcals & cachaça", plats: spiritueux.agaves },
          { nom: "Rhums", plats: spiritueux.rhums },
          { nom: "Calvados, cognacs & armagnacs", plats: spiritueux.brandies },
          { nom: "Eaux-de-vie & liqueurs", plats: spiritueux.liqueurs },
        ],
      },
      {
        id: "vins",
        nom: "Vins & champagnes",
        categories: [
          { nom: "Champagnes", plats: vins.champagnes },
          { nom: "Vins blancs au verre", plats: vins.verreBlancs },
          { nom: "Vins rosés au verre", plats: vins.verreRoses },
          { nom: "Vins rouges au verre", plats: vins.verreRouges },
          { nom: "Blancs — bouteilles", plats: vins.btlBlancs },
          { nom: "Rosés — bouteilles", plats: vins.btlRoses },
          { nom: "Rouges — bouteilles", plats: vins.btlRouges },
        ],
      },
    ],
  },

  // --- Avis clients (copiés depuis Google, avec accord) ------
  avis: {
    titre: "Ils en parlent",
    items: [
      {
        nom: "Camille R.",
        note: 5,
        texte:
          "La planche méditerranéenne est incroyable, et la terrasse est un vrai coin de vacances en plein Paris. On reviendra !",
      },
      {
        nom: "Karim B.",
        note: 5,
        texte:
          "Pizzas au feu de bois parfaites, service souriant et rapide même un samedi soir. Le tiramisù glacé vaut le détour.",
      },
      {
        nom: "Élodie M.",
        note: 4,
        texte:
          "Très belle découverte pour un déjeuner d'équipe : la formule du midi est d'un excellent rapport qualité-prix.",
      },
    ],
  },

  // --- Infos pratiques ---------------------------------------
  infos: {
    adresse: "24 rue de la Roquette, 75011 Paris",
    telephone: "01 43 00 00 00",
    email: "contact@casapalma.fr",
    horaires: [
      { jour: "Lundi", heures: "Fermé" },
      { jour: "Mardi – Vendredi", heures: "12h–14h30 · 19h–23h" },
      { jour: "Samedi", heures: "12h–15h · 19h–23h30" },
      { jour: "Dimanche", heures: "12h–16h" },
    ],
    googleMapsEmbed:
      "https://maps.google.com/maps?q=24%20rue%20de%20la%20Roquette%2075011%20Paris&output=embed",
  },

  reseaux: {
    instagram: "https://instagram.com/",
    facebook: "",
  },

  // --- Sections activées -------------------------------------
  sections: {
    apropos: true,
    galerie: true,
    menu: true,
    avis: true,
  },
};

export default config;
