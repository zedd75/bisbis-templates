// Charge la galerie d'un restaurant depuis Supabase et la regroupe en sections.
// Lit deux ressources : les photos (galerie) et la liste ordonnée des sections
// (restaurants.galerie_sections). Regroupe les photos par section, dans l'ordre
// des sections, et ÉCARTE les sections vides. Renvoie sections:null en cas
// d'absence/erreur (le site garde alors ses images statiques de config).
import { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_KEY } from "../lib/supabase.js";

export default function useGalerieSupabase(restaurantId) {
  const [sections, setSections] = useState(null);

  useEffect(() => {
    if (!restaurantId) {
      setSections(null);
      return;
    }
    let annule = false;
    const base = `${SUPABASE_URL}/rest/v1`;
    const q = (chemin) =>
      fetch(base + chemin, { headers: { apikey: SUPABASE_KEY }, cache: "no-store" }).then(
        (r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)))
      );
    const rid = encodeURIComponent(restaurantId);

    Promise.all([
      q(`/galerie?restaurant_id=eq.${rid}&select=url,legende,position,section_id,ordre&order=ordre`),
      q(`/restaurants?id=eq.${rid}&select=galerie_sections`),
    ])
      .then(([photos, restos]) => {
        if (annule) return;
        const defs = (restos[0] && restos[0].galerie_sections) || [];
        const groupes = [...defs]
          .sort((a, b) => a.ordre - b.ordre)
          .map((s) => ({
            id: s.id,
            nom: s.nom,
            photos: photos
              .filter((p) => p.section_id === s.id && p.url)
              .map((p) => ({
                url: p.url,
                texte: p.legende || "",
                position: p.position || "bas",
              })),
          }))
          .filter((s) => s.photos.length > 0);
        setSections(groupes.length ? groupes : null);
      })
      .catch((e) => {
        if (!annule) {
          console.warn("[galerieSupabase] lecture impossible :", e.message);
          setSections(null);
        }
      });

    return () => {
      annule = true;
    };
  }, [restaurantId]);

  return { sections };
}
