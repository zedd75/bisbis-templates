// ============================================================
//  CONFIG CLIENT — exemple PREMIUM "Le Doric" (enseigne fictive)
//  Direction artistique inspirée du style Sir Winston :
//  fond encre, accent or/laiton, typographies serif élégantes.
//  Carte complète inspirée d'Auteuil Brasserie (contenu de démo).
//  Bilingue FR/EN : les textes traduisibles sont dans "contenu".
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
  template: "prestige",
  nom: "Le Doric",

  // Menu piloté par CometStudio (via Supabase), pour ce restaurant.
  restaurantId: "le-doric",

  theme: {
    encre: "#0F1215",
    charcoal: "#1E2024",
    or: "#CAAF63",
    creme: "#F4EDE1",
    vert: "#1B3A2F",
    policeTitres: "'Playfair Display', serif",
    policeCaps: "'Cormorant Garamond', serif",
    policeTexte: "'Lato', sans-serif",
  },

  images: {
    hero: "https://placehold.co/1920x1080/0F1215/2a2a2a?text=+",
    story1: "https://placehold.co/900x1100/1E2024/CAAF63?text=Salle",
    story2: "https://placehold.co/900x1100/1E2024/CAAF63?text=Chef",
    galerie: [
      "https://placehold.co/800x1000/1E2024/CAAF63?text=Salle",
      "https://placehold.co/800x600/0F1215/CAAF63?text=Bar",
      "https://placehold.co/800x600/1B3A2F/F4EDE1?text=Plat",
      "https://placehold.co/800x1000/0F1215/CAAF63?text=Terrasse",
      "https://placehold.co/800x600/1E2024/F4EDE1?text=Cocktail",
      "https://placehold.co/800x1000/1B3A2F/CAAF63?text=Dessert",
    ],
  },

  reservationUrl: "https://www.zenchef.com/",

  infos: {
    adresse: "137 Av. des Champs-Élysées, 75008 Paris",
    telephone: "01 40 00 00 00",
    horaires: "Lun – Dim · 08h00 – 02h00",
    metro: "Charles de Gaulle – Étoile",
    googleMapsEmbed:
      "https://maps.google.com/maps?q=137%20Avenue%20des%20Champs-Elysees%2075008%20Paris&output=embed",
  },

  reseaux: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },

  // ============================================================
  //  CONTENU BILINGUE — les plats/boissons viennent du fichier
  //  data/carte-auteuil.data.js (partagés entre FR et EN),
  //  seuls les libellés changent de langue.
  // ============================================================
  contenu: {
    fr: {
      nav: {
        carte: "Cartes & menus",
        histoire: "Notre histoire",
        galerie: "Galerie",
        reserver: "Réserver",
      },
      hero: {
        label: "Paris · Maison fondée en 1926",
        titre: "Le Doric",
        sousTitre:
          "Cuisine anglo-indienne dans un écrin Art déco de bois, cuir et laiton.",
        cta1: "Réserver une table",
        cta2: "Découvrir la carte",
      },
      ctaBand: {
        titre: "Réservez votre table",
        texte: "Du café du matin aux cocktails du soir, sept jours sur sept.",
        bouton: "Réserver",
      },
      infosTitre: "Nous trouver",
      labelHoraires: "Horaires",
      labelAdresse: "Adresse",
      labelMetro: "Métro",

      // --- PAGE CARTES & MENUS ---
      carte: {
        label: "À table",
        titre: "Cartes & menus",
        texte:
          "Mezzés à partager, grillades, douceurs et belle carte de boissons — une cuisine généreuse aux accents méditerranéens, du matin au soir.",
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

      // --- PAGE HISTOIRE ---
      histoire: {
        label: "Depuis 1926",
        titre: "Notre histoire",
        chapo:
          "Né entre Londres et Bombay, Le Doric raconte la rencontre de deux cultures autour d'une même table.",
        blocs: [
          {
            titre: "Une adresse, un voyage",
            texte:
              "À deux pas de l'Arc de Triomphe, la maison a toujours cultivé l'art de recevoir. Le décor, pensé dans les moindres détails — bois sombre, cuir patiné, laiton doré — invite au voyage sans quitter Paris.",
          },
          {
            titre: "L'esprit British, l'âme indienne",
            texte:
              "Du pub anglais nous gardons la convivialité ; de l'Inde, la générosité des épices. Une cuisine vivante qui accompagne chaque moment de la journée, du café du matin aux cocktails du soir.",
          },
        ],
        chef: {
          nom: "Manoj S.",
          role: "Chef de cuisine",
          texte:
            "« Je revisite les classiques du pub avec les épices de mon enfance. Chaque plat est un pont entre deux mondes. »",
        },
      },

      // --- PAGE GALERIE ---
      galerie: {
        label: "En images",
        titre: "Galerie",
        texte:
          "L'ambiance, la salle, les assiettes — quelques instantanés de la maison.",
      },
    },

    en: {
      nav: {
        carte: "Menus",
        histoire: "Our story",
        galerie: "Gallery",
        reserver: "Book",
      },
      hero: {
        label: "Paris · Established 1926",
        titre: "Le Doric",
        sousTitre:
          "Anglo-Indian cuisine in an Art Deco setting of wood, leather and brass.",
        cta1: "Book a table",
        cta2: "See the menu",
      },
      ctaBand: {
        titre: "Book your table",
        texte: "From morning coffee to evening cocktails, seven days a week.",
        bouton: "Book",
      },
      infosTitre: "Find us",
      labelHoraires: "Opening hours",
      labelAdresse: "Address",
      labelMetro: "Metro",

      carte: {
        label: "At the table",
        titre: "Menus",
        texte:
          "Mezze to share, grills, sweet treats and a fine drinks list — generous Mediterranean-inspired cuisine, from morning to night.",
        formules: {
          titre: "Lunch menu",
          note: "Monday to Friday lunchtime, excluding public holidays — drink not included",
          items: [
            { nom: "Starter + Main", prix: "22,50€" },
            { nom: "Main + Dessert", prix: "22,50€" },
            { nom: "Starter + Main + Dessert", prix: "25,50€" },
            { nom: "Kids menu (up to 12)", prix: "15,00€" },
          ],
        },
        onglets: [
          {
            id: "carte",
            nom: "The menu",
            categories: [
              { nom: "Mezze — to share", plats: nourriture.mezzes },
              { nom: "Pasta & risotto", plats: nourriture.patesRisotto },
              { nom: "Pizzas", plats: nourriture.pizzas },
              { nom: "Raw bar", plats: nourriture.crus },
              { nom: "Salads", plats: nourriture.salades },
              { nom: "Grills & plancha", plats: nourriture.grillades },
              { nom: "Desserts & ice cream", plats: nourriture.desserts },
            ],
          },
          {
            id: "dejeuner",
            nom: "Lunch menu",
            note: "Monday to Friday lunchtime, excluding public holidays — Starter + Main or Main + Dessert €22.50 · Starter + Main + Dessert €25.50",
            categories: [
              { nom: "Choice of starters", plats: dejeuner.entrees },
              { nom: "Choice of mains", plats: dejeuner.plats },
              { nom: "Choice of desserts", plats: dejeuner.desserts },
            ],
          },
          {
            id: "enfant",
            nom: "Kids menu",
            note: "Up to 12 years old — €15.00",
            categories: [
              { nom: "Choice of main", plats: enfant.plats },
              { nom: "Choice of dessert", plats: enfant.desserts },
              { nom: "Choice of drink", plats: enfant.boissons },
            ],
          },
          {
            id: "boissons",
            nom: "Drinks",
            categories: [
              { nom: "Aperitifs", plats: boissons.aperitifs },
              { nom: "Aniseed spirits", plats: boissons.anises },
              { nom: "Vermouths, bitters & amari", plats: boissons.vermouths },
              { nom: "Spritz", plats: boissons.spritz },
              { nom: "Signature cocktails", plats: boissons.creation },
              { nom: "Classic cocktails", plats: boissons.classiques },
              { nom: "Alcohol-free & fresh fruit", plats: boissons.sansAlcool },
              { nom: "Beers", plats: boissons.bieres },
              { nom: "Cold drinks", plats: boissons.fraiches },
              { nom: "Mineral waters", plats: boissons.eaux },
              { nom: "Juices & nectars", plats: boissons.jus },
              { nom: "Hot drinks", plats: boissons.chaudes },
              { nom: "Teas & infusions", plats: boissons.thes },
            ],
          },
          {
            id: "spiritueux",
            nom: "Spirits",
            note: "Served 4cl — mixer supplement €2.50",
            categories: [
              { nom: "Gins", plats: spiritueux.gins },
              { nom: "Whiskies", plats: spiritueux.whiskies },
              { nom: "Vodkas", plats: spiritueux.vodkas },
              { nom: "Tequilas, mezcals & cachaça", plats: spiritueux.agaves },
              { nom: "Rums", plats: spiritueux.rhums },
              { nom: "Calvados, cognacs & armagnacs", plats: spiritueux.brandies },
              { nom: "Eaux-de-vie & liqueurs", plats: spiritueux.liqueurs },
            ],
          },
          {
            id: "vins",
            nom: "Wines & champagnes",
            categories: [
              { nom: "Champagnes", plats: vins.champagnes },
              { nom: "White wines by the glass", plats: vins.verreBlancs },
              { nom: "Rosé wines by the glass", plats: vins.verreRoses },
              { nom: "Red wines by the glass", plats: vins.verreRouges },
              { nom: "Whites — bottles", plats: vins.btlBlancs },
              { nom: "Rosés — bottles", plats: vins.btlRoses },
              { nom: "Reds — bottles", plats: vins.btlRouges },
            ],
          },
        ],
      },

      histoire: {
        label: "Since 1926",
        titre: "Our story",
        chapo:
          "Born between London and Bombay, Le Doric tells the story of two cultures meeting around one table.",
        blocs: [
          {
            titre: "One address, one journey",
            texte:
              "A stone's throw from the Arc de Triomphe, the house has always cultivated the art of hospitality. The interior — dark wood, patinated leather, golden brass — invites you to travel without leaving Paris.",
          },
          {
            titre: "British spirit, Indian soul",
            texte:
              "From the English pub we keep conviviality; from India, the generosity of spices. A lively cuisine for every moment of the day, from morning coffee to evening cocktails.",
          },
        ],
        chef: {
          nom: "Manoj S.",
          role: "Head chef",
          texte:
            "“I reinvent pub classics with the spices of my childhood. Every dish is a bridge between two worlds.”",
        },
      },

      galerie: {
        label: "In pictures",
        titre: "Gallery",
        texte:
          "The atmosphere, the room, the plates — a few snapshots of the house.",
      },
    },
  },
};

export default config;
