// Charge le menu d'un restaurant depuis Supabase (la base pilotée par
// CometStudio) et le reconstruit en onglets -> catégories -> plats.
// Si restaurantId est absent ou la requête échoue, renvoie onglets:null
// (le site garde alors son menu statique / menuSheet).
import { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_KEY } from "../lib/supabase.js";
import slugify from "../utils/slugify.js";

// Lignes plates (déjà triées par "ordre") -> onglets imbriqués.
function ongletsDepuisRows(rows) {
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
  return menus.map(({ id, nom, categories }) => ({ id, nom, categories }));
}

export default function useMenuSupabase(restaurantId) {
  const [onglets, setOnglets] = useState(null);

  useEffect(() => {
    if (!restaurantId) {
      setOnglets(null);
      return;
    }
    let annule = false;
    const url =
      `${SUPABASE_URL}/rest/v1/plats` +
      `?restaurant_id=eq.${encodeURIComponent(restaurantId)}` +
      `&select=menu,categorie,nom,description,prix,ordre&order=ordre`;

    fetch(url, { headers: { apikey: SUPABASE_KEY }, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then((rows) => {
        if (!annule) setOnglets(rows.length ? ongletsDepuisRows(rows) : null);
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

  return { onglets };
}
