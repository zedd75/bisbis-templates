// Transforme un titre en identifiant d'ancre utilisable dans l'URL.
// Ex : "À partager"  ->  "a-partager"
//      "Currys & grillades" -> "currys-grillades"
export default function slugify(texte) {
  return texte
    .toLowerCase()
    .normalize("NFD") // sépare les accents des lettres
    .replace(/[̀-ͯ]/g, "") // supprime les accents
    .replace(/[^a-z0-9]+/g, "-") // tout le reste devient des tirets
    .replace(/^-+|-+$/g, ""); // pas de tiret en début/fin
}
