// Tests des infos pratiques pilotées depuis le back-office.
// Sans ce branchement, un restaurateur modifiait ses horaires et son
// téléphone dans le back-office sans que son site ne change : c'est
// l'information la plus souvent mise à jour d'un site de restaurant.
import { describe, it, expect } from "vitest";
import { appliquerInfos, carteDepuisAdresse } from "./infos.js";

const enBase = (extra = {}) => ({
  adresse: "9 rue Neuve, 75002 Paris",
  telephone: "01 55 00 00 00",
  email: "bonjour@resto.fr",
  reservation_url: "https://resto.thefork.com",
  horaires: [
    { jour: "Lundi", heures: "Fermé" },
    { jour: "Mardi", heures: "12h–14h30" },
  ],
  ...extra,
});

// Essentiel et Signature : horaires en TABLEAU
const configTableau = () => ({
  template: "signature",
  infos: {
    adresse: "1 vieille rue, 75001 Paris",
    telephone: "01 00 00 00 00",
    horaires: [{ jour: "Lundi", heures: "ancien" }],
    googleMapsEmbed: "https://maps.google.com/maps?q=vieille&output=embed",
  },
});

// Prestige : horaires en CHAÎNE, et lien de réservation à la RACINE
const configTexte = () => ({
  template: "prestige",
  reservationUrl: "https://ancien-zenchef.com",
  infos: {
    adresse: "137 Av. des Champs-Élysées, 75008 Paris",
    telephone: "01 40 00 00 00",
    horaires: "Lun – Dim · 08h00 – 02h00",
    metro: "Charles de Gaulle – Étoile",
  },
});

describe("appliquerInfos : remplacement", () => {
  it("remplace adresse, telephone et email", () => {
    const out = appliquerInfos(configTableau(), enBase());
    expect(out.infos.adresse).toBe("9 rue Neuve, 75002 Paris");
    expect(out.infos.telephone).toBe("01 55 00 00 00");
    expect(out.infos.email).toBe("bonjour@resto.fr");
  });

  // CHANGEMENT DE REGLE ASSUME. Ces trois tests decrivaient
  // l'ancien comportement : un champ vide en base rendait la main a la
  // config, donc a la valeur de demonstration. Un restaurateur qui effacait
  // son email le voyait reapparaitre, et de vrais clients ecrivaient a une
  // fausse adresse. Un champ vide est desormais respecte.
  it("respecte un champ VIDE : le restaurateur a voulu le retirer", () => {
    const out = appliquerInfos(configTableau(), enBase({ telephone: "   ", email: "" }));
    expect(out.infos.telephone).toBe("");
    expect(out.infos.email).toBe("");
  });

  it("garde la valeur d'origine quand la colonne est ABSENTE, pas vide", () => {
    const out = appliquerInfos(configTableau(), enBase({ telephone: null }));
    expect(out.infos.telephone).toBe("01 00 00 00 00");
  });

  it("ne touche a rien sans infos en base", () => {
    const config = configTableau();
    expect(appliquerInfos(config, null)).toBe(config);
    expect(appliquerInfos(config, undefined)).toBe(config);
  });

  it("conserve les champs que la base ne connait pas", () => {
    // "metro" n'existe pas dans la table infos : il ne doit pas disparaitre.
    const out = appliquerInfos(configTexte(), enBase());
    expect(out.infos.metro).toBe("Charles de Gaulle – Étoile");
  });
});

describe("appliquerInfos : horaires", () => {
  it("transmet la liste telle quelle a Essentiel et Signature", () => {
    const out = appliquerInfos(configTableau(), enBase());
    expect(Array.isArray(out.infos.horaires)).toBe(true);
    expect(out.infos.horaires).toHaveLength(2);
  });

  it("transmet la MEME liste a Prestige, sans l'ecraser sur une ligne", () => {
    const out = appliquerInfos(configTexte(), enBase());
    expect(Array.isArray(out.infos.horaires)).toBe(true);
    expect(out.infos.horaires).toEqual(enBase().horaires);
  });

  it("conserve les jours de fermeture", () => {
    // Les ecraser sur une ligne les faisait disparaitre, alors que c'est
    // justement ce qu'un client cherche a savoir.
    const out = appliquerInfos(configTexte(), enBase());
    expect(out.infos.horaires.find((h) => h.jour === "Lundi").heures).toBe("Fermé");
  });

  it("respecte une liste d'horaires VIDE", () => {
    const out = appliquerInfos(configTexte(), enBase({ horaires: [] }));
    expect(out.infos.horaires).toEqual([]);
  });

  it("garde les horaires d'origine si la colonne est ABSENTE", () => {
    const out = appliquerInfos(configTexte(), enBase({ horaires: null }));
    expect(out.infos.horaires).toBe("Lun – Dim · 08h00 – 02h00");
  });
});

describe("appliquerInfos : la carte suit l'adresse", () => {
  it("recalcule la carte depuis la nouvelle adresse", () => {
    const out = appliquerInfos(configTableau(), enBase());
    expect(out.infos.googleMapsEmbed).toContain(encodeURIComponent("9 rue Neuve, 75002 Paris"));
    expect(out.infos.googleMapsEmbed).not.toContain("vieille");
  });

  it("un restaurant qui demenage ne garde pas l'ancienne carte", () => {
    // C'est tout l'interet de deduire l'URL au lieu de la stocker.
    const out = appliquerInfos(configTableau(), enBase({ adresse: "Ailleurs, 75020 Paris" }));
    expect(out.infos.googleMapsEmbed).toContain(encodeURIComponent("Ailleurs"));
  });

  it("carteDepuisAdresse renvoie vide sur une adresse absente", () => {
    expect(carteDepuisAdresse("")).toBe("");
    expect(carteDepuisAdresse("   ")).toBe("");
    expect(carteDepuisAdresse(null)).toBe("");
  });
});

describe("appliquerInfos : lien de reservation", () => {
  it("le pose a la RACINE, la ou Prestige le lit vraiment", () => {
    const out = appliquerInfos(configTexte(), enBase());
    expect(out.reservationUrl).toBe("https://resto.thefork.com");
  });

  it("le pose aussi dans infos, pour les usages futurs", () => {
    expect(appliquerInfos(configTexte(), enBase()).infos.reservationUrl).toBe(
      "https://resto.thefork.com"
    );
  });

  it("retire le lien quand le restaurateur l'a vide", () => {
    const out = appliquerInfos(configTexte(), enBase({ reservation_url: "" }));
    expect(out.reservationUrl).toBe("");
  });

  it("garde l'ancien lien si la colonne est ABSENTE", () => {
    const out = appliquerInfos(configTexte(), enBase({ reservation_url: null }));
    expect(out.reservationUrl).toBe("https://ancien-zenchef.com");
  });
});
