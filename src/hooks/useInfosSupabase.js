// Charge les infos pratiques d'un restaurant depuis Supabase (la base
// pilotée par CometStudio) : adresse, téléphone, email, lien de
// réservation, horaires.
//
// Sans ce branchement, le module « Infos & horaires » de CometStudio
// écrivait dans le vide : les sites affichaient les valeurs figées dans
// leur fichier de config. Or les horaires sont l'information la plus
// souvent modifiée d'un site de restaurant.
import { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_KEY } from "../lib/supabase.js";

export default function useInfosSupabase(restaurantId) {
  const [infos, setInfos] = useState(null);

  useEffect(() => {
    if (!restaurantId) {
      setInfos(null);
      return;
    }
    let annule = false;
    const url =
      `${SUPABASE_URL}/rest/v1/infos` +
      `?restaurant_id=eq.${encodeURIComponent(restaurantId)}` +
      `&select=adresse,telephone,email,reservation_url,horaires`;

    fetch(url, { headers: { apikey: SUPABASE_KEY }, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then((lignes) => {
        if (!annule) setInfos(lignes?.[0] || null);
      })
      .catch((e) => {
        if (!annule) {
          console.warn("[infosSupabase] lecture impossible :", e.message);
          setInfos(null);
        }
      });

    return () => {
      annule = true;
    };
  }, [restaurantId]);

  return { infos };
}
