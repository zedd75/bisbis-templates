// Tests de la fusion des fonctionnalités pilotées depuis CometStudio
// (restaurants.site_sections) dans config.sections.
import { describe, it, expect } from "vitest";
import { appliquerCapacites, capaciteActive } from "./capacites.js";

describe("appliquerCapacites", () => {
  it("fusionne les capacités dans config.sections (les distantes gagnent)", () => {
    const config = { sections: { apropos: true, galerie: false } };
    const out = appliquerCapacites(config, { galerie: true, theme: true });
    expect(out.sections).toEqual({ apropos: true, galerie: true, theme: true });
  });

  it("crée config.sections si absent (cas Prestige)", () => {
    const config = { template: "prestige" };
    const out = appliquerCapacites(config, { theme: true, menu: true });
    expect(out.sections).toEqual({ theme: true, menu: true });
  });

  it("renvoie la config inchangée si capacites est nul ou vide", () => {
    const config = { sections: { apropos: true } };
    expect(appliquerCapacites(config, null)).toBe(config);
    expect(appliquerCapacites(config, {})).toBe(config);
  });

  it("ne mute pas la config d'origine", () => {
    const config = { sections: { apropos: true } };
    appliquerCapacites(config, { theme: true });
    expect(config.sections).toEqual({ apropos: true });
  });
});

describe("capaciteActive", () => {
  it("masque sur un false EXPLICITE, seul cas de masquage", () => {
    expect(capaciteActive({ sections: { galerie: false } }, "galerie")).toBe(false);
  });

  it("affiche quand la capacite est active", () => {
    expect(capaciteActive({ sections: { galerie: true } }, "galerie")).toBe(true);
  });

  it("affiche quand la cle est ABSENTE : une vieille config garde sa navigation", () => {
    expect(capaciteActive({ sections: { menu: true } }, "galerie")).toBe(true);
    expect(capaciteActive({}, "galerie")).toBe(true);
    expect(capaciteActive(null, "galerie")).toBe(true);
  });
});
