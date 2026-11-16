// Tests de la reconstruction du menu lu en base.
// Le back-office enregistre à chaque frappe : une ligne ajoutée mais pas
// encore nommée existe donc en base. Elle ne doit pas apparaître sur le site
// comme une ligne blanche avec un prix.
import { describe, it, expect } from "vitest";
import { ongletsDepuisRows } from "./menuLignes.js";

const ligne = (menu, categorie, nom, prix = "10€") => ({ menu, categorie, nom, description: "", prix });

describe("ongletsDepuisRows", () => {
  it("regroupe les lignes en onglets et catégories, dans l'ordre reçu", () => {
    const onglets = ongletsDepuisRows([
      ligne("La carte", "Entrées", "Houmous"),
      ligne("La carte", "Plats", "Burger"),
      ligne("Boissons", "Vins", "Rouge"),
    ]);
    expect(onglets.map((o) => [o.nom, o.categories.map((c) => c.nom)])).toEqual([
      ["La carte", ["Entrées", "Plats"]],
      ["Boissons", ["Vins"]],
    ]);
    expect(onglets[0].categories[0].plats).toEqual([{ nom: "Houmous", desc: "", prix: "10€" }]);
  });

  it("pose la mention de l'onglet quand il y en a une", () => {
    const onglets = ongletsDepuisRows([ligne("Spiritueux", "Whisky", "Single malt")], { Spiritueux: "Servis 4cl" });
    expect(onglets[0].note).toBe("Servis 4cl");
    expect(Object.hasOwn(ongletsDepuisRows([ligne("Vins", "Rouges", "Bordeaux")])[0], "note")).toBe(false);
  });

  it("ignore un plat sans nom, même s'il a un prix", () => {
    const onglets = ongletsDepuisRows([
      ligne("La carte", "Entrées", "Houmous"),
      ligne("La carte", "Entrées", "", "12€"),
      ligne("La carte", "Entrées", "   "),
      ligne("La carte", "Entrées", null),
    ]);
    expect(onglets[0].categories[0].plats.map((p) => p.nom)).toEqual(["Houmous"]);
  });

  it("ne crée ni onglet ni catégorie pour des lignes sans nom seulement", () => {
    const onglets = ongletsDepuisRows([
      ligne("La carte", "Entrées", "Houmous"),
      ligne("La carte", "Desserts", ""),
      ligne("Nouveau menu", "Nouvelle catégorie", ""),
    ]);
    expect(onglets.map((o) => [o.nom, o.categories.map((c) => c.nom)])).toEqual([["La carte", ["Entrées"]]]);
  });

  it("rend une liste vide quand rien n'est affichable : le vide est respecté", () => {
    expect(ongletsDepuisRows([ligne("La carte", "Entrées", "")])).toEqual([]);
    expect(ongletsDepuisRows([])).toEqual([]);
  });
});
