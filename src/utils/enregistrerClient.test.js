// Enregistrement d'un nouveau client dans App.jsx.
// C'est la seule etape du generateur qui MODIFIE un fichier existant : elle
// merite d'etre pure et testee plutot que bricolee a coups d'expressions
// regulieres non verifiees.
import { describe, it, expect } from "vitest";
import { nomVariable, enregistrerDansApp } from "./enregistrerClient.js";

const APP = `import bistrotConfig from "./config/client.config.js";
import palmaConfig from "./config/casa-palma.config.js";
import doricConfig from "./config/le-doric.config.js";
import EssentielTemplate from "./templates/EssentielTemplate.jsx";

const CLIENTS = {
  bistrot: bistrotConfig, // démo Essentiel
  palma: palmaConfig,     // démo Signature
  doric: doricConfig,     // démo Premium
};
const parametre = new URLSearchParams(window.location.search).get("client");
`;

describe("nomVariable", () => {
  it("transforme un identifiant en nom de variable valide", () => {
    expect(nomVariable("chez-fatou")).toBe("chezFatouConfig");
    expect(nomVariable("la-trattoria-k7f")).toBe("laTrattoriaK7fConfig");
  });

  it("supporte un identifiant sans tiret", () => {
    expect(nomVariable("doric")).toBe("doricConfig");
  });

  it("ne commence jamais par un chiffre", () => {
    // Un identifiant peut commencer par un chiffre ; une variable JS non.
    expect(nomVariable("3-brasseurs")).toBe("client3BrasseursConfig");
  });
});

describe("enregistrerDansApp", () => {
  const ligneImport = 'import a from "./config/a.config.js";';
  const saut = String.fromCharCode(10);
  it("ajoute l'import apres le dernier import de config", () => {
    const sortie = enregistrerDansApp(APP, "chez-fatou");
    expect(sortie).toContain(
      'import chezFatouConfig from "./config/chez-fatou.config.js";'
    );
    // il doit se placer APRES les imports de config, avant ceux des templates
    const posImport = sortie.indexOf("import chezFatouConfig");
    const posTemplate = sortie.indexOf("import EssentielTemplate");
    expect(posImport).toBeLessThan(posTemplate);
  });

  it("ajoute l'entree dans le registre CLIENTS", () => {
    const sortie = enregistrerDansApp(APP, "chez-fatou");
    expect(sortie).toContain('"chez-fatou": chezFatouConfig,');
  });

  it("laisse les clients existants intacts", () => {
    const sortie = enregistrerDansApp(APP, "chez-fatou");
    expect(sortie).toContain("bistrot: bistrotConfig");
    expect(sortie).toContain("palma: palmaConfig");
    expect(sortie).toContain("doric: doricConfig");
  });

  it("refuse d'enregistrer deux fois le meme client", () => {
    const unePasse = enregistrerDansApp(APP, "chez-fatou");
    expect(() => enregistrerDansApp(unePasse, "chez-fatou")).toThrow(
      /deja enregistre/i
    );
  });

  it("leve une erreur claire si le registre CLIENTS est introuvable", () => {
    // Mieux vaut echouer bruyamment que produire un App.jsx casse.
    const sansRegistre = [ligneImport, "const x = 1;"].join(saut);
    expect(() => enregistrerDansApp(sansRegistre, "chez-fatou")).toThrow(
      /CLIENTS/
    );
  });

  it("leve une erreur claire s'il n'y a aucun import de config", () => {
    expect(() => enregistrerDansApp("const x = 1;", "chez-fatou")).toThrow(
      /import de config/
    );
  });

  it("ne touche a rien d'autre dans le fichier", () => {
    const sortie = enregistrerDansApp(APP, "chez-fatou");
    expect(sortie).toContain("const parametre = new URLSearchParams");
    expect(sortie).toContain("import EssentielTemplate");
  });
});
