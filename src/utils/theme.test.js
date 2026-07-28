// Tests du choix du jeu de couleurs selon le mode clair/sombre.
import { describe, it, expect } from "vitest";
import { themeActif, modeOppose } from "./theme.js";

const configClair = {
  themeDefaut: "clair",
  theme: { fond: "#FFF", texte: "#000" },
  themeAlternatif: { fond: "#000", texte: "#FFF" },
};

const configSombre = {
  themeDefaut: "sombre",
  theme: { encre: "#0F1215", creme: "#F4EDE1" },
  themeAlternatif: { encre: "#F7F2E8", creme: "#1A1D21" },
};

describe("themeActif", () => {
  it("renvoie le thème par défaut quand le mode correspond au défaut", () => {
    expect(themeActif(configClair, "clair")).toBe(configClair.theme);
    expect(themeActif(configSombre, "sombre")).toBe(configSombre.theme);
  });

  it("renvoie la variante quand le mode est l'opposé du défaut", () => {
    expect(themeActif(configClair, "sombre")).toBe(configClair.themeAlternatif);
    expect(themeActif(configSombre, "clair")).toBe(configSombre.themeAlternatif);
  });

  it("retombe sur le thème par défaut si aucune variante n'est définie", () => {
    const sansVariante = { themeDefaut: "clair", theme: { fond: "#FFF" } };
    expect(themeActif(sansVariante, "sombre")).toBe(sansVariante.theme);
  });

  it("retombe sur le thème par défaut si le mode est absent ou inconnu", () => {
    expect(themeActif(configClair, null)).toBe(configClair.theme);
    expect(themeActif(configClair, "fluo")).toBe(configClair.theme);
  });

  it("considère 'clair' comme défaut implicite si themeDefaut manque", () => {
    const sansDefaut = { theme: { fond: "#FFF" }, themeAlternatif: { fond: "#000" } };
    expect(themeActif(sansDefaut, "clair")).toBe(sansDefaut.theme);
    expect(themeActif(sansDefaut, "sombre")).toBe(sansDefaut.themeAlternatif);
  });
});

describe("modeOppose", () => {
  it("inverse clair et sombre", () => {
    expect(modeOppose("clair")).toBe("sombre");
    expect(modeOppose("sombre")).toBe("clair");
  });
});
