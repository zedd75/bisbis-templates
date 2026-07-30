// Tests du parsing CSV -> menu et de son application selon le template.
import { describe, it, expect } from "vitest";
import {
  construireOnglets,
  appliquerMenu,
  reporterNotes,
  traduireOnglets,
} from "./menuSheet.js";

describe("construireOnglets (CSV -> menu)", () => {
  it("construit un menu / une catégorie / plusieurs plats", () => {
    const lignes = [
      ["menu", "categorie", "plat", "description", "prix"],
      ["La carte", "Entrées", "Houmous", "Pois chiches", "7€"],
      ["La carte", "Entrées", "Salade", "", "9€"],
    ];
    const onglets = construireOnglets(lignes);
    expect(onglets).toHaveLength(1);
    expect(onglets[0].nom).toBe("La carte");
    expect(onglets[0].id).toBe("la-carte");
    expect(onglets[0].categories[0].plats).toHaveLength(2);
    expect(onglets[0].categories[0].plats[0]).toEqual({
      nom: "Houmous", desc: "Pois chiches", prix: "7€",
    });
  });

  it("tolère les en-têtes accentués, en majuscules et dans le désordre", () => {
    const lignes = [
      ["Prix", "PLAT", "Catégorie"],
      ["12€", "Burger", "Plats"],
    ];
    const onglets = construireOnglets(lignes);
    expect(onglets[0].categories[0].nom).toBe("Plats");
    expect(onglets[0].categories[0].plats[0]).toMatchObject({ nom: "Burger", prix: "12€" });
  });

  it("utilise des valeurs par défaut quand menu/catégorie manquent", () => {
    const lignes = [["plat"], ["Café"]];
    const onglets = construireOnglets(lignes);
    expect(onglets[0].nom).toBe("La carte");
    expect(onglets[0].categories[0].nom).toBe("Notre sélection");
  });

  it("ignore les lignes sans nom de plat", () => {
    const lignes = [
      ["menu", "plat"],
      ["La carte", "Vrai plat"],
      ["La carte", "   "],
      ["La carte", ""],
    ];
    const onglets = construireOnglets(lignes);
    expect(onglets[0].categories[0].plats).toHaveLength(1);
  });

  it("renvoie [] sans colonne 'plat'", () => {
    expect(construireOnglets([["menu", "prix"], ["La carte", "5€"]])).toEqual([]);
  });

  it("renvoie [] pour une entrée vide ou trop courte", () => {
    expect(construireOnglets([])).toEqual([]);
    expect(construireOnglets([["plat"]])).toEqual([]);
    expect(construireOnglets(null)).toEqual([]);
  });
});

describe("appliquerMenu (application selon le template)", () => {
  const onglets = [
    { id: "carte", nom: "La carte", categories: [{ nom: "Entrées", plats: [] }] },
  ];

  it("essentiel : remplace les catégories du menu unique", () => {
    const config = { template: "essentiel", menu: { titre: "Notre carte", categories: [] } };
    const out = appliquerMenu(config, onglets);
    expect(out.menu.categories).toBe(onglets[0].categories);
    expect(out.menu.titre).toBe("Notre carte"); // le reste est conservé
  });

  it("signature : remplace les onglets", () => {
    const config = { template: "signature", menus: { style: "x", onglets: [] } };
    const out = appliquerMenu(config, onglets);
    expect(out.menus.onglets).toBe(onglets);
    expect(out.menus.style).toBe("x");
  });

  it("prestige : remplace la carte dans chaque langue", () => {
    const config = {
      template: "prestige",
      contenu: {
        fr: { carte: { onglets: [] }, autre: 1 },
        en: { carte: { onglets: [] } },
      },
    };
    const out = appliquerMenu(config, onglets);
    expect(out.contenu.fr.carte.onglets).toBe(onglets);
    expect(out.contenu.en.carte.onglets).toBe(onglets);
    expect(out.contenu.fr.autre).toBe(1); // le reste est conservé
  });

  it("renvoie la config inchangée si aucun onglet", () => {
    const config = { template: "prestige", contenu: {} };
    expect(appliquerMenu(config, [])).toBe(config);
    expect(appliquerMenu(config, null)).toBe(config);
  });

  it("renvoie la config inchangée pour un template inconnu", () => {
    const config = { template: "mystere" };
    expect(appliquerMenu(config, onglets)).toBe(config);
  });
});

describe("reporterNotes (les notes d'onglet survivent au menu piloté)", () => {
  const base = [
    { id: "menu-dejeuner", nom: "Menu déjeuner", categories: [] },
    { id: "boissons", nom: "Boissons", categories: [] },
  ];

  it("reprend la note quand les NOMS correspondent, malgré des id différents", () => {
    // C'est le cas réel : la config écrit id "dejeuner", la base "menu-dejeuner".
    const reference = [{ id: "dejeuner", nom: "Menu déjeuner", note: "Hors fériés" }];
    const out = reporterNotes(base, reference);
    expect(out[0].note).toBe("Hors fériés");
    expect(out[0].id).toBe("menu-dejeuner"); // l'id reste celui de la base
  });

  it("ne reporte rien si aucun nom ne correspond", () => {
    const reference = [{ id: "dejeuner", nom: "Lunch menu", note: "Weekdays only" }];
    expect(reporterNotes(base, reference)).toBe(base); // identité préservée
    expect(base[0].note).toBeUndefined();
  });

  it("ne reprend QUE la note : aucun autre champ de la config ne fuit", () => {
    const reference = [
      {
        id: "dejeuner",
        nom: "Menu déjeuner",
        note: "Hors fériés",
        categories: [{ nom: "Vieille catégorie", plats: [{ nom: "Vieux plat" }] }],
        extra: "ne doit pas passer",
      },
    ];
    const out = reporterNotes(base, reference);
    expect(out[0].categories).toBe(base[0].categories); // celles de la base
    expect(out[0].extra).toBeUndefined();
    expect(Object.keys(out[0]).sort()).toEqual(["categories", "id", "nom", "note"]);
  });

  it("laisse la priorité à une note déjà portée par la base", () => {
    const baseAvecNote = [{ id: "boissons", nom: "Boissons", note: "de la base" }];
    const reference = [{ nom: "Boissons", note: "de la config" }];
    expect(reporterNotes(baseAvecNote, reference)[0].note).toBe("de la base");
  });

  it("supporte une référence vide, absente ou une base absente", () => {
    expect(reporterNotes(base, [])).toBe(base);
    expect(reporterNotes(base, null)).toBe(base);
    expect(reporterNotes(base, undefined)).toBe(base);
    expect(reporterNotes(null, [{ nom: "x", note: "y" }])).toBe(null);
  });

  it("signature : la note revient après application du menu piloté", () => {
    const config = {
      template: "signature",
      menus: { onglets: [{ id: "spiritueux", nom: "Spiritueux", note: "Servis 4cl" }] },
    };
    const out = appliquerMenu(config, [
      { id: "spiritueux", nom: "Spiritueux", categories: [] },
    ]);
    expect(out.menus.onglets[0].note).toBe("Servis 4cl");
  });

  it("prestige : la note du français s'affiche aussi en anglais", () => {
    const config = {
      template: "prestige",
      contenu: {
        fr: { carte: { onglets: [{ nom: "Menu enfant", note: "Jusqu'à 12 ans" }] } },
        en: { carte: { onglets: [{ nom: "Kids menu", note: "Up to 12" }] } },
      },
    };
    // Le menu vient de la base, donc ses libellés sont en français.
    const out = appliquerMenu(config, [
      { id: "menu-enfant", nom: "Menu enfant", categories: [] },
    ]);
    expect(out.contenu.fr.carte.onglets[0].note).toBe("Jusqu'à 12 ans");
    expect(out.contenu.en.carte.onglets[0].note).toBe("Jusqu'à 12 ans");
  });

  it("la note survit a la traduction de la charpente", () => {
    const config = {
      template: "prestige",
      contenu: {
        fr: { carte: { onglets: [{ nom: "Menu enfant", note: "Jusqu'à 12 ans" }] } },
        en: { carte: { onglets: [] } },
      },
    };
    const traductions = { en: { onglets: { "Menu enfant": "Kids menu" } } };
    const out = appliquerMenu(
      config,
      [{ id: "menu-enfant", nom: "Menu enfant", categories: [] }],
      traductions
    );
    const en = out.contenu.en.carte.onglets[0];
    expect(en.nom).toBe("Kids menu"); // charpente traduite
    expect(en.note).toBe("Jusqu'à 12 ans"); // mention conservee
  });

  it("aller-retour complet : CSV -> onglets -> config, la note survit", () => {
    const onglets = construireOnglets([
      ["menu", "categorie", "plat", "prix"],
      ["Menu déjeuner", "Entrées", "Houmous", "7€"],
    ]);
    expect(onglets[0].id).toBe("menu-dejeuner"); // id dérivé, différent de la config
    const config = {
      template: "prestige",
      contenu: {
        fr: {
          carte: { onglets: [{ id: "dejeuner", nom: "Menu déjeuner", note: "Hors fériés" }] },
        },
      },
    };
    const out = appliquerMenu(config, onglets);
    const onglet = out.contenu.fr.carte.onglets[0];
    expect(onglet.note).toBe("Hors fériés");
    expect(onglet.categories[0].plats[0].nom).toBe("Houmous"); // plats bien ceux du CSV
  });
});

describe("traduireOnglets (charpente en anglais, plats en francais)", () => {
  const onglets = [
    {
      id: "menu-dejeuner",
      nom: "Menu déjeuner",
      categories: [
        { nom: "Entrées au choix", plats: [{ nom: "Houmous sésame", desc: "Pois chiches", prix: "7€" }] },
        { nom: "Pizzas", plats: [{ nom: "Tartufo", desc: "Truffe", prix: "21€" }] },
      ],
    },
  ];
  const dico = {
    onglets: { "Menu déjeuner": "Lunch menu" },
    categories: { "Entrées au choix": "Choice of starters" },
  };

  it("traduit le nom de l'onglet et les titres de categories", () => {
    const out = traduireOnglets(onglets, dico);
    expect(out[0].nom).toBe("Lunch menu");
    expect(out[0].categories[0].nom).toBe("Choice of starters");
  });

  it("ne traduit PAS les plats : c'est la decision assumee", () => {
    const out = traduireOnglets(onglets, dico);
    expect(out[0].categories[0].plats[0].nom).toBe("Houmous sésame");
    expect(out[0].categories[0].plats[0].desc).toBe("Pois chiches");
    expect(out[0].categories[0].plats).toBe(onglets[0].categories[0].plats);
  });

  it("garde le francais quand la traduction manque", () => {
    const out = traduireOnglets(onglets, dico);
    // "Pizzas" n'est pas dans le dictionnaire
    expect(out[0].categories[1].nom).toBe("Pizzas");
    expect(out[0].categories[1]).toBe(onglets[0].categories[1]);
  });

  it("ne change pas l'identifiant de l'onglet", () => {
    expect(traduireOnglets(onglets, dico)[0].id).toBe("menu-dejeuner");
  });

  it("renvoie le tableau d'origine si rien a traduire", () => {
    expect(traduireOnglets(onglets, null)).toBe(onglets);
    expect(traduireOnglets(onglets, undefined)).toBe(onglets);
    expect(traduireOnglets(onglets, {})).toBe(onglets);
    expect(traduireOnglets(onglets, { onglets: {}, categories: {} })).toBe(onglets);
    expect(traduireOnglets(onglets, { onglets: { "Absent": "Nope" } })).toBe(onglets);
    expect(traduireOnglets(null, dico)).toBe(null);
  });

  it("ne mute pas les onglets d'origine", () => {
    traduireOnglets(onglets, dico);
    expect(onglets[0].nom).toBe("Menu déjeuner");
    expect(onglets[0].categories[0].nom).toBe("Entrées au choix");
  });

  it("prestige : le francais reste francais, l'anglais est traduit", () => {
    const config = {
      template: "prestige",
      contenu: { fr: { carte: { onglets: [] } }, en: { carte: { onglets: [] } } },
    };
    const out = appliquerMenu(config, onglets, { en: dico });
    expect(out.contenu.fr.carte.onglets[0].nom).toBe("Menu déjeuner");
    expect(out.contenu.en.carte.onglets[0].nom).toBe("Lunch menu");
    // Les MEMES plats dans les deux langues
    expect(out.contenu.en.carte.onglets[0].categories[0].plats[0].nom).toBe("Houmous sésame");
    expect(out.contenu.fr.carte.onglets[0].categories[0].plats[0].nom).toBe("Houmous sésame");
  });

  it("prestige sans traductions : les deux langues restent en francais", () => {
    const config = {
      template: "prestige",
      contenu: { fr: { carte: { onglets: [] } }, en: { carte: { onglets: [] } } },
    };
    const out = appliquerMenu(config, onglets);
    expect(out.contenu.en.carte.onglets[0].nom).toBe("Menu déjeuner");
    expect(out.contenu.en.carte.onglets).toBe(onglets);
  });
});
