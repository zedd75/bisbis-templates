// Tests de l'application des images pilotées depuis CometStudio.
import { describe, it, expect } from "vitest";
import { appliquerImages } from "./images.js";

describe("appliquerImages", () => {
  it("pose logo, hero et apropos pour essentiel/signature", () => {
    const config = { template: "signature", logo: null, hero: { image: "a" }, apropos: { image: "b" } };
    const out = appliquerImages(config, { logo: "L", hero: "H", apropos: "A" });
    expect(out.logo).toBe("L");
    expect(out.hero.image).toBe("H");
    expect(out.apropos.image).toBe("A");
  });

  it("pose hero, story1, story2 et logo pour prestige", () => {
    const config = { template: "prestige", images: { hero: "a", story1: "b", story2: "c" } };
    const out = appliquerImages(config, { logo: "L", hero: "H", story1: "S1", story2: "S2" });
    expect(out.logo).toBe("L");
    expect(out.images.hero).toBe("H");
    expect(out.images.story1).toBe("S1");
    expect(out.images.story2).toBe("S2");
  });

  it("garde l'image d'origine si la valeur est vide, blanche ou absente", () => {
    const config = { template: "prestige", images: { hero: "origine" } };
    expect(appliquerImages(config, { hero: "" }).images.hero).toBe("origine");
    expect(appliquerImages(config, { hero: "   " }).images.hero).toBe("origine");
    expect(appliquerImages(config, {}).images.hero).toBe("origine");
  });

  it("renvoie la config inchangée si images est nul ou vide", () => {
    const config = { template: "prestige", images: { hero: "a" } };
    expect(appliquerImages(config, null)).toBe(config);
    expect(appliquerImages(config, {})).toBe(config);
  });

  it("ne mute pas la config d'origine", () => {
    const config = { template: "signature", hero: { image: "a" }, apropos: { image: "b" } };
    appliquerImages(config, { hero: "H" });
    expect(config.hero.image).toBe("a");
  });
});
