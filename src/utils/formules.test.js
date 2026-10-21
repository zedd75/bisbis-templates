import { it, expect } from "vitest";
import { appliquerFormules } from "./formules.js";
import { lienReservation } from "./reservation.js";

const fr = { titre: "Déjeuner", note: "Le midi", items: [{ nom: "Entrée + plat", prix: "24,50€" }] };
it("affiche le prix modifié dans les deux langues sans perdre la traduction", () => {
  const config = { template: "prestige", contenu: { fr: { carte: {} }, en: { carte: {} } } };
  const sortie = appliquerFormules(config, { fr, en: { titre: "Lunch", note: "Lunch time", items: [{ nom: "Starter + main", prix: "ancien" }] } });
  expect(sortie.contenu.fr.carte.formules).toEqual(fr);
  expect(sortie.contenu.en.carte.formules.items).toEqual([{ nom: "Starter + main", prix: "24,50€" }]);
  expect(config.contenu.en.carte).toEqual({});
});
it("respecte les formules vidées et conserve le repli si la lecture échoue", () => {
  const config = { template: "signature", menus: { formules: fr } };
  expect(appliquerFormules(config, null)).toBe(config);
  expect(appliquerFormules(config, { fr: { ...fr, items: [] } }).menus.formules.items).toEqual([]);
});
it("n'ajoute pas un bloc de formules à l'Essentiel", () => {
  const config = { template: "essentiel" };
  expect(appliquerFormules(config, { fr })).toBe(config);
});
it("masque la réservation désactivée même avec une adresse valide", () => {
  expect(lienReservation({ sections: { reservation: false }, reservationUrl: "https://example.com" })).toBe("");
  expect(lienReservation({ sections: { reservation: true }, reservationUrl: "javascript:alert(1)" })).toBe("");
  expect(lienReservation({ sections: { reservation: true }, reservationUrl: "https://example.com" })).toBe("https://example.com");
});
