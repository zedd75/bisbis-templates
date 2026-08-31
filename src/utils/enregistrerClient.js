// Enregistrement d'un nouveau client dans src/App.jsx.
//
// C'est la seule etape du generateur qui MODIFIE un fichier existant. Elle est
// donc pure et testee : on lui passe le contenu du fichier, elle renvoie le
// nouveau contenu. Le generateur se charge de lire et d'ecrire sur le disque.
//
// Toute anomalie leve une erreur : mieux vaut refuser bruyamment que produire
// un App.jsx casse que personne ne remarquerait avant le prochain build.

// "chez-fatou" -> "chezFatouConfig". Une variable JS ne peut pas commencer par
// un chiffre : on prefixe alors par "client".
export function nomVariable(slug) {
  const camel = String(slug)
    .split("-")
    .filter(Boolean)
    .map((mot, i) => (i === 0 ? mot : mot.charAt(0).toUpperCase() + mot.slice(1)))
    .join("");
  const sur = /^[0-9]/.test(camel)
    ? "client" + camel.charAt(0).toUpperCase() + camel.slice(1)
    : camel;
  return sur + "Config";
}

export function enregistrerDansApp(source, slug) {
  const variable = nomVariable(slug);
  const chemin = `./config/${slug}.config.js`;

  if (source.includes(chemin) || source.includes(`"${slug}":`)) {
    throw new Error(`Le client "${slug}" est deja enregistre dans App.jsx.`);
  }

  // 1. L'import, place APRES le dernier import de config : les imports de
  //    templates et de styles restent groupes en dessous.
  const imports = [...source.matchAll(/^import .*? from "\.\/config\/.*?";$/gm)];
  if (imports.length === 0) {
    throw new Error("Aucun import de config trouve dans App.jsx.");
  }
  const dernier = imports[imports.length - 1];
  const finImport = dernier.index + dernier[0].length;
  const ligneImport = `\nimport ${variable} from "${chemin}";`;
  let sortie = source.slice(0, finImport) + ligneImport + source.slice(finImport);

  // 2. L'entree dans le registre CLIENTS.
  const marqueur = "const CLIENTS = {";
  const pos = sortie.indexOf(marqueur);
  if (pos === -1) {
    throw new Error("Registre CLIENTS introuvable dans App.jsx.");
  }
  const apres = pos + marqueur.length;
  sortie = sortie.slice(0, apres) + `\n  "${slug}": ${variable},` + sortie.slice(apres);

  return sortie;
}
