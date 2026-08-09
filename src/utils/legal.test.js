// Tests du modèle des pages légales.
// L'enjeu : ne jamais publier une page qui a l'air en règle sans l'être,
// et ne jamais présenter une démo fictive comme un vrai établissement.
import { describe, it, expect } from "vitest";
import { donneesLegales, assemblerCourriel } from "./legal.js";
import { EDITEUR_DEMO, HEBERGEUR } from "../config/legal.js";

const clientReel = (editeur = {}) => ({
  nom: "Chez Marcel",
  infos: { adresse: "3 rue des Lilas, 75011 Paris", telephone: "01 43 00 00 00" },
  legal: {
    editeur: {
      nom: "SARL Marcel",
      email: "contact@chezmarcel.fr",
      adresse: "3 rue des Lilas, 75011 Paris",
      siret: "12345678900012",
      ...editeur,
    },
  },
});

const demo = () => ({
  nom: "Casa Palma",
  infos: { adresse: "12 rue de Bretagne, 75003 Paris", telephone: "01 42 00 00 00" },
});

describe("donneesLegales : démo ou client réel", () => {
  it("bascule en mode demo quand la config n'a pas de bloc legal", () => {
    expect(donneesLegales(demo()).estDemo).toBe(true);
  });

  it("n'est plus une demo des que l'editeur est nomme", () => {
    expect(donneesLegales(clientReel()).estDemo).toBe(false);
  });

  it("un bloc legal vide reste une demo", () => {
    const config = { ...demo(), legal: { editeur: { nom: "   " } } };
    expect(donneesLegales(config).estDemo).toBe(true);
  });

  it("reprend le restaurant pour situer la page", () => {
    const d = donneesLegales(clientReel());
    expect(d.restaurant.nom).toBe("Chez Marcel");
    expect(d.restaurant.adresse).toBe("3 rue des Lilas, 75011 Paris");
  });
});

describe("donneesLegales : regime professionnel", () => {
  it("le SIRET fait basculer en professionnel", () => {
    expect(donneesLegales(clientReel()).estProfessionnel).toBe(true);
  });

  it("sans SIRET, on reste non professionnel", () => {
    const d = donneesLegales(clientReel({ siret: "" }));
    expect(d.estProfessionnel).toBe(false);
  });

  it("un professionnel sans adresse est signale comme incomplet", () => {
    const d = donneesLegales(clientReel({ adresse: "" }));
    expect(d.complet).toBe(false);
    expect(d.manquants).toContain("l'adresse de l'établissement");
  });

  it("un NON professionnel sans adresse reste complet", () => {
    // L'adresse personnelle d'un particulier n'a pas a etre publiee.
    const d = donneesLegales(clientReel({ siret: "", adresse: "" }));
    expect(d.complet).toBe(true);
    expect(d.manquants).toEqual([]);
  });
});

describe("donneesLegales : mentions manquantes", () => {
  it("signale l'absence de nom", () => {
    // Editeur explicitement vide : le test porte sur le COMPORTEMENT, il ne
    // doit pas dependre de ce qui est reellement rempli dans config/legal.js.
    const d = donneesLegales({ nom: "X", legal: { editeur: { nom: "", email: "" } } });
    expect(d.complet).toBe(false);
    expect(d.manquants).toContain("le nom de l'éditeur");
  });

  it("signale l'absence de tout moyen de contact", () => {
    const d = donneesLegales(clientReel({ email: "", telephone: "" }));
    expect(d.manquants).toContain("un moyen de contact (courriel ou téléphone)");
  });

  it("un telephone seul suffit comme moyen de contact", () => {
    const d = donneesLegales(clientReel({ email: "", telephone: "01 43 00 00 00" }));
    expect(d.manquants).not.toContain("un moyen de contact (courriel ou téléphone)");
  });

  it("une config complete ne signale rien", () => {
    const d = donneesLegales(clientReel());
    expect(d.complet).toBe(true);
    expect(d.manquants).toEqual([]);
  });
});

describe("donneesLegales : directeur de la publication", () => {
  it("reprend l'editeur par defaut", () => {
    expect(donneesLegales(clientReel()).editeur.directeurPublication).toBe("SARL Marcel");
  });

  it("respecte un directeur explicitement designe", () => {
    const d = donneesLegales(clientReel({ directeurPublication: "Marcel Dupont" }));
    expect(d.editeur.directeurPublication).toBe("Marcel Dupont");
  });
});

describe("donneesLegales : hebergeur", () => {
  it("est toujours publie, meme en mode demo", () => {
    expect(donneesLegales(demo()).hebergeur).toBe(HEBERGEUR);
    expect(donneesLegales(clientReel()).hebergeur).toBe(HEBERGEUR);
    expect(HEBERGEUR.nom).toBeTruthy();
    expect(HEBERGEUR.adresse).toBeTruthy();
  });

  it("designe bien l'entreprise qui heberge, pas l'editeur", () => {
    // Erreur facile a commettre en remplissant le fichier : y mettre son
    // propre nom. L'hebergeur doit rester identifiable et joignable.
    expect(HEBERGEUR.nom).toMatch(/vercel/i);
    expect(HEBERGEUR.adresse).not.toMatch(/@/); // une adresse postale, pas un courriel
  });
});

describe("les demos ne doivent jamais etre mises en ligne incompletes", () => {
  it("EDITEUR_DEMO porte au moins un nom et un moyen de contact", () => {
    // Garde-fou : si ce test casse, les 3 demos affichent le bandeau orange
    // « Mentions incompletes » en production.
    const d = donneesLegales(demo());
    expect(d.manquants).toEqual([]);
    expect(d.complet).toBe(true);
  });

  it("une demo reste signalee comme demonstration", () => {
    // Meme completes, les mentions doivent dire que l'etablissement est fictif.
    expect(donneesLegales(demo()).estDemo).toBe(true);
  });
});

describe("assemblerCourriel (adresse soustraite aux robots collecteurs)", () => {
  it("recompose une adresse decoupee en deux morceaux", () => {
    const e = { courriel: { utilisateur: "contact", domaine: "exemple.fr" } };
    expect(assemblerCourriel(e)).toBe("contact@exemple.fr");
  });

  it("accepte aussi une adresse en clair", () => {
    expect(assemblerCourriel({ email: "contact@exemple.fr" })).toBe("contact@exemple.fr");
  });

  it("l'adresse en clair a la priorite si les deux sont presentes", () => {
    const e = { email: "clair@exemple.fr", courriel: { utilisateur: "x", domaine: "y.fr" } };
    expect(assemblerCourriel(e)).toBe("clair@exemple.fr");
  });

  it("renvoie une chaine vide si l'adresse est incomplete ou absente", () => {
    expect(assemblerCourriel({})).toBe("");
    expect(assemblerCourriel(null)).toBe("");
    expect(assemblerCourriel({ courriel: { utilisateur: "contact" } })).toBe("");
    expect(assemblerCourriel({ courriel: { domaine: "exemple.fr" } })).toBe("");
    expect(assemblerCourriel({ email: "   " })).toBe("");
  });

  it("le fichier de config ne contient JAMAIS l'adresse en entier", () => {
    // C'est tout l'interet du decoupage : un robot qui lit le depot public
    // ou le fichier JavaScript livre ne doit trouver aucune adresse complete.
    expect(EDITEUR_DEMO.email).toBeUndefined();
    expect(EDITEUR_DEMO.courriel.utilisateur).not.toContain("@");
    expect(EDITEUR_DEMO.courriel.domaine).not.toContain("@");
  });

  it("mais l'adresse est bien recomposee a l'affichage", () => {
    const email = donneesLegales({ nom: "X" }).editeur.email;
    expect(email).toContain("@");
    expect(email.split("@")).toHaveLength(2);
  });
});

describe("donneesLegales : robustesse", () => {
  it("ne plante pas sur une config vide ou absente", () => {
    expect(() => donneesLegales({})).not.toThrow();
    expect(() => donneesLegales(null)).not.toThrow();
    expect(donneesLegales(null).estDemo).toBe(true);
    expect(donneesLegales(null).restaurant.nom).toBe("");
  });
});
