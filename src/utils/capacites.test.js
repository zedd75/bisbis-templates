// Tests de la fusion des fonctionnalités pilotées depuis CometStudio
// (restaurants.site_sections) dans config.sections.
import { describe, it, expect } from "vitest";
import { appliquerCapacites } from "./capacites.js";

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
