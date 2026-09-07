// La logique du lien est extraite pour etre testable sans monter de
// composant : le projet ne teste que des fonctions pures.
//
// Ce que ces tests protegent : une carte partagee doit montrer LE BON
// restaurant. Avant, `/carte` copie depuis `/?client=doric` ouvrait le
// restaurant par defaut chez celui qui recevait le lien.
import { describe, it, expect } from "vitest";
import { avecClient } from "./lienClient.js";

describe("avecClient", () => {
  it("reporte le client sur la destination", () => {
    expect(avecClient("/carte", "?client=doric")).toBe("/carte?client=doric");
  });

  it("place le parametre AVANT l'ancre, sinon il en fait partie", () => {
    expect(avecClient("/carte#entrees", "?client=doric")).toBe(
      "/carte?client=doric#entrees",
    );
  });

  it("ne touche a rien sans client dans l'URL courante", () => {
    expect(avecClient("/carte", "")).toBe("/carte");
    expect(avecClient("/carte", "?autre=1")).toBe("/carte");
    expect(avecClient("/carte")).toBe("/carte");
  });

  it("respecte une destination qui porte deja sa propre requete", () => {
    expect(avecClient("/carte?vue=liste", "?client=doric")).toBe("/carte?vue=liste");
  });

  it("echappe un identifiant contenant des caracteres speciaux", () => {
    expect(avecClient("/carte", "?client=a%20b")).toBe("/carte?client=a%20b");
  });
});
