// Tests de LIVRAISON : un site tout juste généré (npm run nouveau-client)
// doit s'afficher sans erreur et accepter tout ce que le back-office sait
// piloter. Les démos sont remplies à la main et ne révèlent pas ces défauts :
// la page « Notre histoire » d'un site multi-pages généré plantait (chef
// absent), et ses blocs d'histoire ne pouvaient pas être saisis.
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import * as essentiel from "../../scripts/modeles/essentiel.mjs";
import * as signature from "../../scripts/modeles/signature.mjs";
import * as prestige from "../../scripts/modeles/prestige.mjs";
import { appliquerTextes, emplacementsTextes } from "./textes.js";
import { blocsAffichables, chefAffichable } from "./histoire.js";

const MODELES = { essentiel, signature, prestige };
const donnees = {
  nom: "Chez Essai", slug: "chez-essai", restaurantId: "chez-essai", slogan: "Slogan d'essai",
  primaire: "#8B2E2E", secondaire: "#C9A24B", fond: "#FDF8F0",
  adresse: "1 rue de Paris, 75001 Paris", telephone: "01 40 00 00 00", email: "", instagram: "",
};

// Le générateur rend le TEXTE d'un fichier de config. On l'écrit hors du
// dépôt, en pointant ses données partagées vers celles du dépôt, puis on le
// charge comme le ferait le site.
const dossierDonnees = pathToFileURL(join(process.cwd(), "src", "config", "data")).href;
let dossier;
const configs = {};

beforeAll(async () => {
  dossier = mkdtempSync(join(tmpdir(), "livraison-"));
  for (const [nom, modele] of Object.entries(MODELES)) {
    const source = modele.construire(donnees).replaceAll('from "./data/', `from "${dossierDonnees}/`);
    const fichier = join(dossier, `${nom}.config.mjs`);
    writeFileSync(fichier, source, "utf8");
    configs[nom] = (await import(/* @vite-ignore */ pathToFileURL(fichier).href)).default;
  }
});

afterAll(() => {
  if (dossier) rmSync(dossier, { recursive: true, force: true });
});

describe.each(Object.keys(MODELES))("site généré : %s", (nom) => {
  it("produit une config reliée au back-office", () => {
    expect(configs[nom].template).toBe(nom);
    expect(configs[nom].restaurantId).toBe("chez-essai");
    expect(configs[nom].nom).toBe("Chez Essai");
  });

  it("accepte tous les textes que le back-office sait envoyer", () => {
    const config = configs[nom];
    const langues = config.contenu ? Object.keys(config.contenu) : ["fr"];
    const textes = {};
    for (const langue of langues) {
      for (const emplacement of emplacementsTextes(nom)) {
        const cle = langue === "fr" ? emplacement : `${emplacement}@${langue}`;
        textes[cle] = `saisi:${cle}`;
      }
    }
    expect(Object.keys(textes).length).toBeGreaterThan(0);
    const rendu = JSON.stringify(appliquerTextes(config, textes));
    for (const valeur of Object.values(textes)) {
      expect(rendu, `texte non appliqué : ${valeur}`).toContain(JSON.stringify(valeur));
    }
  });

  it("accepte les liens de réseaux sociaux", () => {
    const sortie = appliquerTextes(configs[nom], {
      "reseaux.instagram": "https://instagram.com/chez-essai", "reseaux.facebook": "https://facebook.com/chez-essai",
    });
    expect(sortie.reseaux).toMatchObject({ instagram: "https://instagram.com/chez-essai", facebook: "https://facebook.com/chez-essai" });
  });
});

describe("site multi-pages généré : page Notre histoire", () => {
  it("n'a ni bloc ni chef à afficher, sans que ce soit une erreur", () => {
    for (const contenu of Object.values(configs.prestige.contenu)) {
      expect(blocsAffichables(contenu.histoire.blocs)).toEqual([]);
      expect(chefAffichable(contenu.histoire.chef)).toBe(false);
    }
  });

  it("affiche un bloc et le chef dès qu'ils sont saisis", () => {
    const sortie = appliquerTextes(configs.prestige, {
      "histoire.blocs.1.texte": "Second bloc saisi seul", "histoire.chef.nom": "Fatou D.",
    });
    const histoire = sortie.contenu.fr.histoire;
    // Le premier bloc, jamais saisi, existe mais ne s'affiche pas.
    expect(histoire.blocs).toHaveLength(2);
    expect(blocsAffichables(histoire.blocs)).toEqual([{ titre: "", texte: "Second bloc saisi seul" }]);
    expect(chefAffichable(histoire.chef)).toBe(true);
    expect(histoire.chef).toEqual({ nom: "Fatou D.", role: "", texte: "" });
    // L'autre langue n'a rien reçu : elle reste vide, sans erreur.
    expect(blocsAffichables(sortie.contenu.en.histoire.blocs)).toEqual([]);
    expect(chefAffichable(sortie.contenu.en.histoire.chef)).toBe(false);
  });
});
