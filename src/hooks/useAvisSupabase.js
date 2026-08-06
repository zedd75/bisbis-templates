// Charge les avis d'un restaurant depuis Supabase (la base pilotée par
// CometStudio). Si restaurantId est absent ou la requête échoue, renvoie
// avis:null et le site garde ceux écrits dans sa config.
//
// Les avis sont destinés à recevoir de VRAIS avis clients, recopiés par le
// restaurateur depuis sa fiche Google. Le site ne fait que les afficher.
import { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_KEY } from "../lib/supabase.js";

export default function useAvisSupabase(restaurantId) {
  const [avis, setAvis] = useState(null);

  useEffect(() => {
    if (!restaurantId) {
      setAvis(null);
      return;
    }
    let annule = false;
    const url =
      `${SUPABASE_URL}/rest/v1/avis` +
      `?restaurant_id=eq.${encodeURIComponent(restaurantId)}` +
      `&select=nom,note,texte`;

    fetch(url, { headers: { apikey: SUPABASE_KEY }, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then((lignes) => {
        if (!annule) setAvis(lignes.length ? lignes : null);
      })
      .catch((e) => {
        if (!annule) {
          console.warn("[avisSupabase] lecture impossible :", e.message);
          setAvis(null);
        }
      });

    return () => {
      annule = true;
    };
  }, [restaurantId]);

  return { avis };
}
