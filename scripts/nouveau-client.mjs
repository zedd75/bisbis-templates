// ============================================================
//  GÉNÉRATEUR DE CLIENT — l'usine à sites.
//  Lancez :  npm run nouveau-client
//  Répondez aux questions, le fichier de config est créé tout
//  seul dans src/config/. Il ne reste qu'à :
//    1. l'enregistrer dans App.jsx (2 lignes, affichées à la fin)
//    2. remplacer les photos et ajuster la carte
// ============================================================
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const rl = createInterface({ input: stdin, output: stdout });
const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

// File d'attente des réponses : fonctionne aussi bien en interactif
// qu'avec des réponses collées d'avance (ou un fichier en entrée).
const reponsesEnAttente = [];
let entreeFermee = false;
rl.on("line", (ligne) => reponsesEnAttente.push(ligne));
rl.on("close", () => {
  entreeFermee = true;
});

// "Chez Fatou" -> "chez-fatou"
const slugifier = (texte) =>
  texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Pose une question avec une valeur par défaut entre [crochets].
async function demander(question, defaut) {
  stdout.write(`${question} [${defaut}] : `);
  while (reponsesEnAttente.length === 0 && !entreeFermee) {
    await new Promise((r) => setTimeout(r, 25));
  }
  const brut = reponsesEnAttente.shift() ?? "";
  if (entreeFermee) stdout.write(`${brut}\n`); // écho en mode non interactif
  return brut.trim() || defaut;
}

console.log("\n===============================================");
console.log("  NOUVEAU CLIENT — générateur de site vitrine");
console.log("===============================================\n");

const nom = await demander("Nom du restaurant", "Chez Fatou");
const slug = slugifier(await demander("Identifiant (URL ?client=...)", slugifier(nom)));
const template = await demander("Template : essentiel | signature", "essentiel");
const slogan = await demander("Slogan / sous-titre", "Cuisine généreuse au cœur de Paris");
const primaire = await demander("Couleur principale (hex)", "#8B2E2E");
const secondaire = await demander("Couleur d'accent (hex)", "#C9A24B");
const fond = await demander("Couleur de fond (hex)", "#FDF8F0");
const adresse = await demander("Adresse", "1 rue de Paris, 75001 Paris");
const telephone = await demander("Téléphone", "01 40 00 00 00");
const instagram = await demander("Instagram (URL, vide = masqué)", "");
if (!entreeFermee) rl.close();

const cible = join(racine, "src", "config", `${slug}.config.js`);
if (existsSync(cible)) {
  console.error(`\n❌ ${slug}.config.js existe déjà — choisissez un autre identifiant.`);
  process.exit(1);
}

const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(adresse)}&output=embed`;
const ph = (texteImage) =>
  `https://placehold.co/1600x900/${primaire.replace("#", "")}/${fond.replace("#", "")}?text=${encodeURIComponent(texteImage)}`;

// ---- Blocs spécifiques au template Signature ----------------
const blocSignature = `
  galerie: {
    titre: "En images",
    images: [
      "${ph("Photo 1")}",
      "${ph("Photo 2")}",
      "${ph("Photo 3")}",
      "${ph("Photo 4")}",
      "${ph("Photo 5")}",
      "${ph("Photo 6")}",
    ],
  },

  menus: {
    titre: "Cartes & menus",
    formules: {
      titre: "Menu déjeuner",
      note: "Du lundi au vendredi midi — à personnaliser",
      items: [
        { nom: "Entrée + Plat", prix: "22,50€" },
        { nom: "Plat + Dessert", prix: "22,50€" },
        { nom: "Entrée + Plat + Dessert", prix: "25,50€" },
      ],
    },
    onglets: [
      {
        id: "carte",
        nom: "La carte",
        categories: [
          { nom: "Mezzés — à partager", plats: nourriture.mezzes },
          { nom: "Pâtes & risotto", plats: nourriture.patesRisotto },
          { nom: "Pizzas", plats: nourriture.pizzas },
          { nom: "Grillades & plancha", plats: nourriture.grillades },
          { nom: "Sucrés & glacés", plats: nourriture.desserts },
        ],
      },
    ],
  },

  avis: {
    titre: "Ils en parlent",
    items: [
      { nom: "Client 1 (exemple à remplacer)", note: 5, texte: "Un accueil chaleureux et une cuisine délicieuse." },
      { nom: "Client 2 (exemple à remplacer)", note: 5, texte: "Une très belle découverte, on reviendra !" },
      { nom: "Client 3 (exemple à remplacer)", note: 4, texte: "Excellent rapport qualité-prix le midi." },
    ],
  },
`;

const blocEssentielMenu = `
  menu: {
    titre: "La carte",
    categories: [
      { nom: "Mezzés — à partager", plats: nourriture.mezzes },
      { nom: "Pâtes & risotto", plats: nourriture.patesRisotto },
      { nom: "Pizzas", plats: nourriture.pizzas },
      { nom: "Grillades & plancha", plats: nourriture.grillades },
      { nom: "Sucrés & glacés", plats: nourriture.desserts },
    ],
  },
`;

// ---- Contenu du fichier de config ---------------------------
const contenu = `// ============================================================
//  CONFIG CLIENT — ${nom}
//  Généré par : npm run nouveau-client
//  ⚠️ À personnaliser : photos, carte, horaires, avis.
// ============================================================
import { nourriture } from "./data/carte-auteuil.data.js";

const config = {
  template: "${template}",
  nom: "${nom}",
  logo: null,

  theme: {
    primaire: "${primaire}",
    secondaire: "${secondaire}",
    fond: "${fond}",
    texte: "#26221E",
    policeTitres: "'Playfair Display', serif",
    policeTexte: "'Inter', sans-serif",
  },

  hero: {
    image: "${ph("Photo d'accueil")}",
    titre: "${nom}",
    sousTitre: "${slogan}",
  },

  apropos: {
    titre: "Notre maison",
    texte:
      "Présentez ici votre restaurant en 3-4 phrases : votre histoire, " +
      "votre cuisine, ce qui vous rend unique. (Texte à personnaliser.)",
    image: "${ph("Photo de la salle")}",
  },
${template === "signature" ? blocSignature : blocEssentielMenu}
  infos: {
    adresse: "${adresse}",
    telephone: "${telephone}",
    email: "",
    horaires: [
      { jour: "Lundi", heures: "Fermé" },
      { jour: "Mardi – Vendredi", heures: "12h–14h30 · 19h–22h30" },
      { jour: "Samedi", heures: "19h–23h" },
      { jour: "Dimanche", heures: "12h–15h" },
    ],
    googleMapsEmbed: "${mapsEmbed}",
  },

  reseaux: {
    instagram: "${instagram}",
    facebook: "",
  },

  sections: {
    apropos: true,
    menu: true,${template === "signature" ? "\n    galerie: true,\n    avis: true," : ""}
  },
};

export default config;
`;

writeFileSync(cible, contenu, "utf8");

console.log(`\n✅ Fichier créé : src/config/${slug}.config.js`);
console.log("\nDernière étape — enregistrez le client dans src/App.jsx :");
console.log(`  1. En haut :   import ${slug.replace(/-/g, "_")}Config from "./config/${slug}.config.js";`);
console.log(`  2. Dans CLIENTS :   "${slug}": ${slug.replace(/-/g, "_")}Config,`);
console.log(`\nPuis ouvrez :  http://localhost:5173/?client=${slug}\n`);
