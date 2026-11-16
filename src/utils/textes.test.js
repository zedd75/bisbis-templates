// Tests de l'application des textes et des liens de réseaux sociaux saisis
// dans le back-office. Les risques : un champ vide qui efface un titre, une
// clé inattendue qui écrit n'importe où dans la config, un lien de réseau
// qu'on ne peut pas masquer, ou un lien dangereux affiché tel quel.
import { describe, it, expect } from "vitest";
import { appliquerTextes } from "./textes.js";

const unePage = (template = "signature") => ({
  template,
  nom: "Chez Fatou",
  hero: { image: "/hero.jpg", titre: "Titre d'origine", sousTitre: "Accroche d'origine" },
  apropos: { titre: "La maison", texte: "Présentation d'origine", image: "/a.jpg" },
  reseaux: { instagram: "https://instagram.com/origine", facebook: "" },
});

const prestige = () => ({
  template: "prestige",
  nom: "Le Doric",
  reseaux: { instagram: "https://instagram.com/origine", facebook: "https://facebook.com/origine" },
  contenu: {
    fr: {
      hero: { label: "Mention", titre: "Le Doric", sousTitre: "Accroche", cta1: "Réserver" },
      histoire: {
        chapo: "Chapo",
        blocs: [{ titre: "Bloc 1", texte: "Texte 1" }, { titre: "Bloc 2", texte: "Texte 2" }],
        chef: { nom: "Manoj", role: "Chef", texte: "Citation" },
      },
    },
    en: {
      hero: { label: "Label", titre: "Le Doric", sousTitre: "Tagline", cta1: "Book" },
      histoire: {
        chapo: "Intro",
        blocs: [{ titre: "Block 1", texte: "Text 1" }, { titre: "Block 2", texte: "Text 2" }],
        chef: { nom: "Manoj", role: "Head chef", texte: "Quote" },
      },
    },
  },
});

describe("appliquerTextes : rien à appliquer", () => {
  it("rend la config telle quelle sans textes (lecture ratée, colonne absente)", () => {
    const config = unePage();
    for (const textes of [null, undefined, {}, [], "texte", 12]) {
      expect(appliquerTextes(config, textes)).toBe(config);
    }
  });

  it("rend la même config quand aucune clé connue n'est saisie", () => {
    const config = unePage();
    expect(appliquerTextes(config, { "cle.inconnue": "x", "hero.titre": "   " })).toBe(config);
  });
});

describe("appliquerTextes : une page (Essentiel, Signature)", () => {
  it.each(["essentiel", "signature"])("remplace les textes saisis, garde les autres (%s)", (template) => {
    const config = unePage(template);
    const sortie = appliquerTextes(config, { "hero.titre": "  Nouveau titre  ", "apropos.texte": "Nouvelle présentation" });
    expect(sortie.hero).toEqual({ image: "/hero.jpg", titre: "Nouveau titre", sousTitre: "Accroche d'origine" });
    expect(sortie.apropos).toEqual({ titre: "La maison", texte: "Nouvelle présentation", image: "/a.jpg" });
    // La config d'origine n'est jamais modifiée : elle est partagée.
    expect(config.hero.titre).toBe("Titre d'origine");
    expect(config.apropos.texte).toBe("Présentation d'origine");
  });

  it("un texte vide ou fait d'espaces garde le texte d'origine", () => {
    const sortie = appliquerTextes(unePage(), { "hero.titre": "", "hero.sousTitre": "   ", "apropos.titre": "Nous" });
    expect(sortie.hero.titre).toBe("Titre d'origine");
    expect(sortie.hero.sousTitre).toBe("Accroche d'origine");
    expect(sortie.apropos.titre).toBe("Nous");
  });

  it("ignore une valeur qui n'est pas un texte", () => {
    const config = unePage();
    expect(appliquerTextes(config, { "hero.titre": 12, "apropos.texte": { a: 1 }, "hero.sousTitre": null })).toBe(config);
  });

  it("n'écrit que dans les emplacements prévus", () => {
    const config = unePage();
    const sortie = appliquerTextes(config, {
      "hero.image": "https://exemple.invalid/x.jpg", "template": "prestige", "nom": "Pirate",
      "theme.primaire": "#000", "__proto__.pollue": "oui", "constructor.prototype.pollue": "oui",
      "hero.titre@en": "English", "restaurantId": "autre",
    });
    expect(sortie).toBe(config);
    expect({}.pollue).toBeUndefined();
  });

  it("ne crée pas un emplacement que le site n'a pas", () => {
    const { apropos: _sans, ...config } = unePage();
    const sortie = appliquerTextes(config, { "apropos.texte": "Présentation", "hero.titre": "Nouveau" });
    expect(sortie).not.toHaveProperty("apropos");
    expect(sortie.hero.titre).toBe("Nouveau");
  });
});

describe("appliquerTextes : Prestige, deux langues", () => {
  it("pose chaque texte dans sa langue", () => {
    const config = prestige();
    const sortie = appliquerTextes(config, {
      "hero.titre": "Maison Doric", "hero.sousTitre@en": "A new tagline", "histoire.chef.role@en": "Executive chef",
    });
    expect(sortie.contenu.fr.hero).toEqual({ label: "Mention", titre: "Maison Doric", sousTitre: "Accroche", cta1: "Réserver" });
    expect(sortie.contenu.en.hero).toEqual({ label: "Label", titre: "Le Doric", sousTitre: "A new tagline", cta1: "Book" });
    expect(sortie.contenu.en.histoire.chef).toEqual({ nom: "Manoj", role: "Executive chef", texte: "Quote" });
    expect(sortie.contenu.fr.histoire).toBe(config.contenu.fr.histoire);
    expect(config.contenu.fr.hero.titre).toBe("Le Doric");
  });

  it("remplace un bloc de la page histoire sans toucher à l'autre", () => {
    const config = prestige();
    const sortie = appliquerTextes(config, { "histoire.blocs.1.texte": "Nouveau texte 2", "histoire.chapo": "Nouveau chapo" });
    expect(sortie.contenu.fr.histoire.blocs).toEqual([{ titre: "Bloc 1", texte: "Texte 1" }, { titre: "Bloc 2", texte: "Nouveau texte 2" }]);
    expect(Array.isArray(sortie.contenu.fr.histoire.blocs)).toBe(true);
    expect(sortie.contenu.fr.histoire.chapo).toBe("Nouveau chapo");
    expect(config.contenu.fr.histoire.blocs[1].texte).toBe("Texte 2");
    expect(sortie.contenu.en).toBe(config.contenu.en);
  });

  it("ignore un bloc ou une langue que le site n'a pas", () => {
    const config = prestige();
    expect(appliquerTextes(config, { "histoire.blocs.2.titre": "Troisième", "hero.titre@de": "Deutsch" })).toBe(config);
  });

  it("n'applique pas les clés d'une page unique à un Prestige", () => {
    const config = prestige();
    expect(appliquerTextes(config, { "apropos.texte": "Présentation" })).toBe(config);
  });
});

describe("appliquerTextes : réseaux sociaux", () => {
  it("sans clé saisie, garde les liens d'origine", () => {
    const config = unePage();
    expect(appliquerTextes(config, { "hero.titre": "Nouveau" }).reseaux).toBe(config.reseaux);
  });

  it("remplace un lien par celui saisi", () => {
    const sortie = appliquerTextes(unePage(), { "reseaux.instagram": " https://instagram.com/nouveau ", "reseaux.facebook": "https://facebook.com/nouveau" });
    expect(sortie.reseaux).toEqual({ instagram: "https://instagram.com/nouveau", facebook: "https://facebook.com/nouveau" });
  });

  it("une clé vide masque le réseau, même si le site avait un lien d'origine", () => {
    const sortie = appliquerTextes(unePage(), { "reseaux.instagram": "" });
    expect(sortie.reseaux).toEqual({ instagram: "", facebook: "" });
  });

  it.each([
    "instagram.com/sans-protocole", "javascript:alert(1)", "data:text/html,x", "//instagram.com/x",
    "https://user:mdp@instagram.com/x", "https://instagram.com/mon resto", "ftp://instagram.com/x", 12, null,
  ])("masque un lien inutilisable ou dangereux (%j)", (valeur) => {
    expect(appliquerTextes(unePage(), { "reseaux.instagram": valeur }).reseaux.instagram).toBe("");
  });

  it("fonctionne sur un site qui n'avait aucun réseau", () => {
    const { reseaux: _sans, ...config } = unePage();
    expect(appliquerTextes(config, { "reseaux.facebook": "https://facebook.com/x" }).reseaux).toEqual({ facebook: "https://facebook.com/x" });
  });

  it("vaut pour les trois modèles", () => {
    const sortie = appliquerTextes(prestige(), { "reseaux.facebook": "" });
    expect(sortie.reseaux).toEqual({ instagram: "https://instagram.com/origine", facebook: "" });
  });

  it("ignore un réseau inconnu", () => {
    const config = unePage();
    expect(appliquerTextes(config, { "reseaux.tiktok": "https://tiktok.com/@x" })).toBe(config);
  });
});
