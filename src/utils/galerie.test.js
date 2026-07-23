// Tests de la fusion des sections de galerie dans la config du site.
import { describe, it, expect } from "vitest";
import { appliquerGalerie } from "./galerie.js";

const sections = [
  { id: "salle", nom: "Salle", photos: [{ url: "a", texte: "", position: "bas" }] },
];

describe("appliquerGalerie", () => {
  it("pose les sections dans images.galerieSections pour le template prestige", () => {
    const config = { template: "prestige", images: { galerie: ["x"] } };
    const out = appliquerGalerie(config, sections);
    expect(out.images.galerieSections).toBe(sections);
    // Ne casse pas le reste des images.
    expect(out.images.galerie).toEqual(["x"]);
  });

  it("ne modifie PAS les autres templates (signature, essentiel)", () => {
    const config = { template: "signature", images: {} };
    expect(appliquerGalerie(config, sections)).toBe(config);
    const config2 = { template: "essentiel", images: {} };
    expect(appliquerGalerie(config2, sections)).toBe(config2);
  });

  it("renvoie la config inchangée si aucune section", () => {
    const config = { template: "prestige", images: {} };
    expect(appliquerGalerie(config, null)).toBe(config);
    expect(appliquerGalerie(config, [])).toBe(config);
  });

  it("ne mute pas la config d'origine (immutabilité)", () => {
    const config = { template: "prestige", images: { galerie: ["x"] } };
    appliquerGalerie(config, sections);
    expect(config.images.galerieSections).toBeUndefined();
  });
});
