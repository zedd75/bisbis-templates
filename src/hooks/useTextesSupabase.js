// Charge les textes et les liens de réseaux sociaux saisis dans le
// back-office pour ce restaurant (voir utils/textes.js).
//
// Requête SÉPARÉE, volontairement. La colonne peut ne pas exister encore
// dans la base : la demander avec les images et la galerie ferait échouer
// toute cette lecture, et le site perdrait ses photos pour un texte. Ici,
// un échec rend simplement null : le site garde ses textes d'origine.
import { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_KEY } from "../lib/supabase.js";

export default function useTextesSupabase(restaurantId) {
  const [textes, setTextes] = useState(null);
  useEffect(() => {
    let annule = false;
    setTextes(null);
    if (!restaurantId) return;
    fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${encodeURIComponent(restaurantId)}&select=textes`, {
      headers: { apikey: SUPABASE_KEY }, cache: "no-store",
    }).then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((rows) => { if (!annule) setTextes(rows[0]?.textes || null); })
      .catch(() => { if (!annule) setTextes(null); });
    return () => { annule = true; };
  }, [restaurantId]);
  return textes;
}
