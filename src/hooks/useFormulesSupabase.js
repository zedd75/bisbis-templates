import { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_KEY } from "../lib/supabase.js";

export default function useFormulesSupabase(restaurantId) {
  const [formules, setFormules] = useState(null);
  useEffect(() => {
    let annule = false;
    setFormules(null);
    if (!restaurantId) return;
    fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${encodeURIComponent(restaurantId)}&select=formules`, {
      headers: { apikey: SUPABASE_KEY }, cache: "no-store",
    }).then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((rows) => { if (!annule) setFormules(rows[0]?.formules || null); })
      .catch(() => { if (!annule) setFormules(null); });
    return () => { annule = true; };
  }, [restaurantId]);
  return formules;
}
