// Tests de la page « Notre histoire » : ce qui s'affiche quand un bloc ou le
// chef n'est pas (encore) renseigné. Un site généré arrive sans bloc ni chef,
// et la page plantait en lisant le texte d'un chef absent.
import { describe, it, expect } from "vitest";
import { blocsAffichables, chefAffichable } from "./histoire.js";

describe("blocsAffichables", () => {
  it("rend une liste vide pour une valeur absente ou inattendue", () => {
    for (const v of [undefined, null, "", {}, 12]) expect(blocsAffichables(v)).toEqual([]);
  });

  it("garde les blocs qui ont un titre ou un texte, dans l'ordre", () => {
    const blocs = [
      { titre: "Une adresse", texte: "Un texte" },
      { titre: "", texte: "   " },
      { titre: "Titre seul" },
      { texte: "Texte seul" },
      null,
      "bloc",
    ];
    expect(blocsAffichables(blocs)).toEqual([blocs[0], blocs[2], blocs[3]]);
  });

  it("rend la même liste quand tous les blocs s'affichent", () => {
    const blocs = [{ titre: "A", texte: "a" }, { titre: "B", texte: "b" }];
    expect(blocsAffichables(blocs)).toBe(blocs);
  });
});

describe("chefAffichable", () => {
  it("refuse un chef absent ou entièrement vide", () => {
    for (const v of [undefined, null, {}, "chef", { nom: "", role: "  ", texte: "" }, { role: "Chef de cuisine" }]) {
      expect(chefAffichable(v), JSON.stringify(v)).toBe(false);
    }
  });

  it("accepte un chef qui a un nom ou une citation", () => {
    expect(chefAffichable({ nom: "Manoj S." })).toBe(true);
    expect(chefAffichable({ texte: "« Une citation »" })).toBe(true);
    expect(chefAffichable({ nom: "Manoj S.", role: "Chef", texte: "« Une citation »" })).toBe(true);
  });
});
