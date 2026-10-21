import { describe, it, expect } from "vitest";
import { appliquerMenu } from "./menuSheet.js";
import { appliquerGalerie } from "./galerie.js";

describe("contenus volontairement vides", () => {
  it("retire les plats statiques de l'Essentiel", () => {
    const config = { template: "essentiel", menu: { categories: [{ nom: "Démo" }] } };
    expect(appliquerMenu(config, []).menu.categories).toEqual([]);
    expect(appliquerMenu(config, null)).toBe(config);
  });
  it("retire les onglets statiques de Signature", () => {
    const config = { template: "signature", menus: { onglets: [{ nom: "Démo" }] } };
    expect(appliquerMenu(config, []).menus.onglets).toEqual([]);
  });
  it("retire les onglets statiques dans les deux langues du Prestige", () => {
    const config = { template: "prestige", contenu: { fr: { carte: { onglets: [{ nom: "Démo" }] } }, en: { carte: { onglets: [{ nom: "Demo" }] } } } };
    const sortie = appliquerMenu(config, []);
    expect(sortie.contenu.fr.carte.onglets).toEqual([]);
    expect(sortie.contenu.en.carte.onglets).toEqual([]);
  });
  it.each(["signature", "prestige"])("respecte une galerie vide sur %s", (template) => {
    const config = { template };
    expect(appliquerGalerie(config, []).galerieSections).toEqual([]);
    expect(appliquerGalerie(config, null)).toBe(config);
  });
});
