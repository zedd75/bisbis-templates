// Tests du parsing CSV -> menu et de son application selon le template.
import { describe, it, expect } from "vitest";
import { construireOnglets, appliquerMenu } from "./menuSheet.js";

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
