// Reconstruit le menu lu en base : lignes plates -> onglets > catégories >
// plats. Extrait du hook useMenuSupabase pour être testable sans réseau.
import slugify from "./slugify.js";

// Lignes plates (déjà triées par "ordre") -> onglets imbriqués.
// "notes" = mentions saisies dans le back-office, indexées par NOM de menu
// (colonne restaurants.notes_onglets). Sans mention, la clé "note" reste
// absente : la note déclarée dans la config prend alors le relais
// (voir reporterNotes dans utils/menuSheet.js).
export function ongletsDepuisRows(rows, notes = {}) {
  const menus = [];
  const parMenu = new Map();
  for (const l of rows) {
    // Un plat sans nom est une ligne en cours de saisie dans le back-office :
    // on ne l'affiche pas, comme une ligne vide d'un fichier CSV (menuSheet.js).
    // Testé AVANT de créer l'onglet : un onglet qui n'aurait que des lignes
    // sans nom ne doit pas apparaître vide.
    if (!String(l.nom ?? "").trim()) continue;
    let menu = parMenu.get(l.menu);
    if (!menu) {
      menu = { id: slugify(l.menu), nom: l.menu, categories: [], _c: new Map() };
      parMenu.set(l.menu, menu);
      menus.push(menu);
    }
    let cat = menu._c.get(l.categorie);
    if (!cat) {
      cat = { nom: l.categorie, plats: [] };
      menu._c.set(l.categorie, cat);
      menu.categories.push(cat);
    }
    cat.plats.push({ nom: l.nom, desc: l.description || "", prix: l.prix || "" });
  }
  return menus.map(({ id, nom, categories }) => {
    const note = notes[nom];
    return note ? { id, nom, note, categories } : { id, nom, categories };
  });
}
