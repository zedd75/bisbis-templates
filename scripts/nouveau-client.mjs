// ============================================================
//  GENERATEUR DE CLIENT — l'usine a sites.
//  Lancez :  npm run nouveau-client
//
//  ORDRE DES OPERATIONS, important :
//    1. Creez d'abord le restaurant DANS COMETSTUDIO (console admin,
//       « + Ajouter un restaurant »). Il vous donne un IDENTIFIANT.
//    2. Lancez ce script et donnez-lui cet identifiant.
//
//  Pourquoi cet ordre : l'identifiant est genere par CometStudio et
//  comporte un suffixe imprevisible. Le deviner produirait un site
//  DECONNECTE — le restaurateur modifierait dans le vide.
//
//  Le script ecrit la config ET enregistre le client dans App.jsx.
// ============================================================
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { enregistrerDansApp } from "../src/utils/enregistrerClient.js";
import * as essentiel from "./modeles/essentiel.mjs";
import * as signature from "./modeles/signature.mjs";
import * as prestige from "./modeles/prestige.mjs";

const MODELES = { essentiel, signature, prestige };

const rl = createInterface({ input: stdin, output: stdout });
const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

// File d'attente : fonctionne en interactif comme avec des reponses collees.
const enAttente = [];
let ferme = false;
rl.on("line", (l) => enAttente.push(l));
rl.on("close", () => {
  ferme = true;
});

async function demander(question, defaut) {
  stdout.write(`${question} [${defaut}] : `);
  while (enAttente.length === 0 && !ferme) {
    await new Promise((r) => setTimeout(r, 25));
  }
  const brut = enAttente.shift() ?? "";
  if (ferme) stdout.write(`${brut}\n`);
  return brut.trim() || defaut;
}

const slugifier = (t) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

console.log("\n===============================================");
console.log("  NOUVEAU CLIENT — generateur de site vitrine");
console.log("===============================================");
console.log("\n⚠️  Creez d'abord le restaurant dans CometStudio,");
console.log("    puis reportez ici l'identifiant qu'il affiche.\n");

const nom = await demander("Nom du restaurant", "Chez Fatou");
const restaurantId = await demander(
  "Identifiant CometStudio (obligatoire)",
  ""
);
const slug = slugifier(
  await demander("Identifiant du site (?client=...)", slugifier(nom))
);
const template = await demander("Offre : essentiel | signature | prestige", "essentiel");
const slogan = await demander("Slogan / sous-titre", "Cuisine generreuse au coeur de Paris");
const primaire = await demander("Couleur principale (hex)", "#8B2E2E");
const secondaire = await demander("Couleur d'accent (hex)", "#C9A24B");
const fond = await demander("Couleur de fond (hex)", "#FDF8F0");
const adresse = await demander("Adresse", "1 rue de Paris, 75001 Paris");
const telephone = await demander("Telephone", "01 40 00 00 00");
const email = await demander("Email du restaurant", "");
const instagram = await demander("Instagram (URL, vide = masque)", "");
if (!ferme) rl.close();

// ---- Verifications avant d'ecrire quoi que ce soit -----------
const echec = (m) => {
  console.error(`\n❌ ${m}\n`);
  process.exit(1);
};

if (!restaurantId) {
  echec(
    "L'identifiant CometStudio est obligatoire.\n" +
      "   Sans lui, le site serait DECONNECTE du back-office :\n" +
      "   le restaurateur modifierait sans qu'il ne se passe rien.\n" +
      "   Creez le restaurant dans CometStudio, puis relancez."
  );
}
const modele = MODELES[template];
if (!modele) {
  echec(`Offre inconnue : "${template}". Attendu : essentiel, signature ou prestige.`);
}

const cible = join(racine, "src", "config", `${slug}.config.js`);
if (existsSync(cible)) {
  echec(`src/config/${slug}.config.js existe deja — choisissez un autre identifiant.`);
}

const cheminApp = join(racine, "src", "App.jsx");
const appSource = readFileSync(cheminApp, "utf8");

// On calcule le nouvel App.jsx AVANT d'ecrire la config : si l'enregistrement
// echoue, rien n'a ete cree et il n'y a pas de demi-etat a nettoyer.
let appModifie;
try {
  appModifie = enregistrerDansApp(appSource, slug);
} catch (e) {
  echec(`Enregistrement dans App.jsx impossible : ${e.message}`);
}

// ---- Ecriture ------------------------------------------------
const donnees = {
  nom,
  slug,
  restaurantId,
  slogan,
  primaire,
  secondaire,
  fond,
  adresse,
  telephone,
  email,
  instagram,
};

writeFileSync(cible, modele.construire(donnees), "utf8");
writeFileSync(cheminApp, appModifie, "utf8");

console.log(`\n✅ Offre ${modele.offre} — client « ${nom} » cree.`);
console.log(`   • src/config/${slug}.config.js`);
console.log(`   • src/App.jsx mis a jour (import + registre CLIENTS)`);
console.log(`   • relie a CometStudio via restaurantId: "${restaurantId}"`);
console.log(`\nOuvrez :  http://localhost:5173/?client=${slug}`);
console.log("\nIl reste a faire, a la main :");
console.log("   1. Creer le COMPTE du restaurateur (Supabase > Authentication)");
console.log("   2. Remplacer les photos et les textes marques « A renseigner »");
console.log("   3. Renseigner les horaires dans CometStudio\n");
