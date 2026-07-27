// Tests de la fusion des sections de galerie dans la config du site.
// Les sections sont rangées à la racine (config.galerieSections) — même
// convention pour tous les templates qui savent afficher une galerie.
import { describe, it, expect } from "vitest";
import { appliquerGalerie } from "./galerie.js";

const sections = [
  { id: "salle", nom: "Salle", photos: [{ url: "a", texte: "", position: "bas" }] },
];

describe("appliquerGalerie", () => {
  it("pose les sections à la racine pour prestige", () => {
    const config = { template: "prestige", images: { galerie: ["x"] } };
    const out = appliquerGalerie(config, sections);
    expect(out.galerieSections).toBe(sections);
    // Ne casse pas les images d'origine (repli).
    expect(out.images.galerie).toEqual(["x"]);
  });

  it("pose les sections à la racine pour signature", () => {
    const config = { template: "signature", galerie: { titre: "En images", images: ["x"] } };
    const out = appliquerGalerie(config, sections);
    expect(out.galerieSections).toBe(sections);
    // La galerie statique reste disponible en repli.
    expect(out.galerie.images).toEqual(["x"]);
  });

  it("ne modifie PAS essentiel (pas de galerie dans ce template)", () => {
    const config = { template: "essentiel" };
    expect(appliquerGalerie(config, sections)).toBe(config);
  });

  it("renvoie la config inchangée si aucune section", () => {
    const config = { template: "prestige", images: {} };
    expect(appliquerGalerie(config, null)).toBe(config);
    expect(appliquerGalerie(config, [])).toBe(config);
  });

  it("ne mute pas la config d'origine (immutabilité)", () => {
    const config = { template: "prestige", images: { galerie: ["x"] } };
    appliquerGalerie(config, sections);
    expect(config.galerieSections).toBeUndefined();
  });
});
