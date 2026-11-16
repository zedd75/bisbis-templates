// Charge le menu d'un restaurant depuis Supabase (la base pilotée par
// le back-office) et le reconstruit en onglets -> catégories -> plats.
// Si restaurantId est absent ou la requête échoue, renvoie onglets:null
// (le site garde alors son menu statique / menuSheet).
import { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_KEY } from "../lib/supabase.js";
import { ongletsDepuisRows } from "../utils/menuLignes.js";
import { lireCollectionSupabase } from "../lib/lectureSupabase.js";

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
      `&select=id,menu,categorie,nom,description,prix,ordre&order=ordre,id`;
    const urlResto =
      `${SUPABASE_URL}/rest/v1/restaurants?id=eq.${rid}` +
      `&select=notes_onglets,traductions`;
    const urlRevision =
      `${SUPABASE_URL}/rest/v1/restaurants?id=eq.${rid}&select=revision`;

    const lireRevision = () => fetch(urlRevision, { headers: entetes, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then((lignes) => lignes?.[0]?.revision);

    // Mentions et traductions sont accessoires : si leur lecture échoue, le
    // menu doit quand même s'afficher. On les isole dans leur propre repli.
    const lireResto = () => fetch(urlResto, { headers: entetes, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((lignes) => ({
        notes: lignes?.[0]?.notes_onglets || {},
        traductions: lignes?.[0]?.traductions || {},
      }))
      .catch(() => ({ notes: {}, traductions: {} }));

    lireCollectionSupabase(
      urlPlats,
      { headers: entetes, cache: "no-store" },
      fetch,
      lireRevision,
      lireResto,
    )
      .then(({ lignes: rows, associe: extra }) => {
        if (annule) return;
        setOnglets(ongletsDepuisRows(rows, extra.notes));
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
