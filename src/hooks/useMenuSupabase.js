// Charge le menu d'un restaurant depuis Supabase (la base pilotée par
// CometStudio) et le reconstruit en onglets -> catégories -> plats.
// Si restaurantId est absent ou la requête échoue, renvoie onglets:null
// (le site garde alors son menu statique / menuSheet).
import { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_KEY } from "../lib/supabase.js";
import slugify from "../utils/slugify.js";

// Lignes plates (déjà triées par "ordre") -> onglets imbriqués.
// "notes" = mentions saisies dans CometStudio, indexées par NOM de menu
// (colonne restaurants.notes_onglets). Sans mention, la clé "note" reste
// absente : la note déclarée dans la config prend alors le relais
// (voir reporterNotes dans utils/menuSheet.js).
function ongletsDepuisRows(rows, notes = {}) {
  const menus = [];
  const parMenu = new Map();
  for (const l of rows) {
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

export default function useMenuSupabase(restaurantId) {
  const [onglets, setOnglets] = useState(null);
  // Traductions de la charpente du menu, par langue. {} = aucune, on reste
  // dans la langue de saisie.
  const [traductions, setTraductions] = useState({});

  useEffect(() => {
    if (!restaurantId) {
      setOnglets(null);
      setTraductions({});
      return;
    }
    let annule = false;
    const rid = encodeURIComponent(restaurantId);
    const entetes = { apikey: SUPABASE_KEY };
    const urlPlats =
      `${SUPABASE_URL}/rest/v1/plats?restaurant_id=eq.${rid}` +
      `&select=menu,categorie,nom,description,prix,ordre&order=ordre`;
    const urlResto =
      `${SUPABASE_URL}/rest/v1/restaurants?id=eq.${rid}` +
      `&select=notes_onglets,traductions`;

    // Mentions et traductions sont accessoires : si leur lecture échoue, le
    // menu doit quand même s'afficher. On les isole dans leur propre repli.
    const lireResto = fetch(urlResto, { headers: entetes, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((lignes) => ({
        notes: lignes?.[0]?.notes_onglets || {},
        traductions: lignes?.[0]?.traductions || {},
      }))
      .catch(() => ({ notes: {}, traductions: {} }));

    const lirePlats = fetch(urlPlats, { headers: entetes, cache: "no-store" }).then(
      (r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)))
    );

    Promise.all([lirePlats, lireResto])
      .then(([rows, extra]) => {
        if (annule) return;
        setOnglets(rows.length ? ongletsDepuisRows(rows, extra.notes) : null);
        setTraductions(extra.traductions);
      })
      .catch((e) => {
        if (!annule) {
          console.warn("[menuSupabase] lecture impossible :", e.message);
          setOnglets(null);
        }
      });

    return () => {
      annule = true;
    };
  }, [restaurantId]);

  return { onglets, traductions };
}
