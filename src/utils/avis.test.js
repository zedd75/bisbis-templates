// Tests de l'application des avis pilotés depuis CometStudio.
// Sans ce branchement, ce que le restaurateur saisit n'apparaît nulle part :
// le site affichait les avis écrits en dur dans le fichier de config.
import { describe, it, expect } from "vitest";
import { appliquerAvis } from "./avis.js";

const configDemo = () => ({
  template: "signature",
  avis: {
    titre: "Ils en parlent",
    items: [{ nom: "Camille R.", note: 5, texte: "Avis de la config" }],
  },
});

describe("appliquerAvis", () => {
  it("remplace les avis de la config par ceux de la base", () => {
    const base = [{ nom: "Elodie M", note: 5, texte: "Avis de la base" }];
    const out = appliquerAvis(configDemo(), base);
    expect(out.avis.items).toBe(base);
    expect(out.avis.items[0].texte).toBe("Avis de la base");
  });

  it("conserve le titre de la section", () => {
    const out = appliquerAvis(configDemo(), [{ nom: "X", note: 4, texte: "y" }]);
    expect(out.avis.titre).toBe("Ils en parlent");
  });

  it("garde ceux de la config quand la base est vide", () => {
    const config = configDemo();
    expect(appliquerAvis(config, [])).toBe(config);
    expect(appliquerAvis(config, null)).toBe(config);
    expect(appliquerAvis(config, undefined)).toBe(config);
  });

  it("ne touche a rien d'autre dans la config", () => {
    const config = { ...configDemo(), nom: "Casa Palma", sections: { avis: true } };
    const out = appliquerAvis(config, [{ nom: "X", note: 4, texte: "y" }]);
    expect(out.nom).toBe("Casa Palma");
    expect(out.sections).toBe(config.sections);
    expect(out.template).toBe("signature");
  });

  it("fonctionne meme si la config n'a aucun bloc avis", () => {
    const base = [{ nom: "Elodie M", note: 5, texte: "Avis de la base" }];
    const out = appliquerAvis({ template: "prestige" }, base);
    expect(out.avis.items).toBe(base);
    expect(out.avis.titre).toBeUndefined();
  });

  it("ne mute pas la config d'origine", () => {
    const config = configDemo();
    appliquerAvis(config, [{ nom: "X", note: 4, texte: "y" }]);
    expect(config.avis.items[0].texte).toBe("Avis de la config");
  });
});
