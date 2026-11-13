// Le prix annoncé aux moteurs de recherche doit être celui que lit le client.
import { describe, it, expect } from "vitest";
import { prixNumerique } from "./prix.js";

describe("prixNumerique", () => {
  it("lit la virgule comme le point", () => {
    expect(prixNumerique("7,50€")).toBe("7.50");
    expect(prixNumerique("7.50€")).toBe("7.50");
    expect(prixNumerique("7.5 €")).toBe("7.50");
  });

  it("garde un prix entier tel quel", () => {
    expect(prixNumerique("12 €")).toBe("12");
    expect(prixNumerique("€ 9")).toBe("9");
  });

  it("prend le premier prix d'une fourchette", () => {
    expect(prixNumerique("12 / 18 €")).toBe("12");
    expect(prixNumerique("4,50€ · 8,00€")).toBe("4.50");
  });

  it("ne prend pas un point de fin de phrase pour une décimale", () => {
    expect(prixNumerique("Menu à 25. Service compris")).toBe("25");
  });

  it("n'annonce rien quand il n'y a pas de prix", () => {
    for (const vide of ["", null, undefined, "Sur demande", 12]) {
      expect(prixNumerique(vide)).toBe(null);
    }
  });
});
