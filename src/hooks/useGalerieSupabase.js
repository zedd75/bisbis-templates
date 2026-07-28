// Charge depuis Supabase tout ce que CometStudio pilote pour ce restaurant :
// la galerie (regroupée en sections), les images du site, et les
// FONCTIONNALITÉS ACTIVÉES (restaurants.site_sections -> "capacites" ici,
// pour ne pas confondre avec les sections de galerie). Regroupe les photos
// par section de galerie, dans l'ordre, et ÉCARTE les sections vides.
// Renvoie des valeurs à null en cas d'absence/erreur (le site garde alors
// son comportement statique de config).
import { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_KEY } from "../lib/supabase.js";

export default function useGalerieSupabase(restaurantId) {
  const [donnees, setDonnees] = useState({ sections: null, images: null, capacites: null });

  useEffect(() => {
    if (!restaurantId) {
      setDonnees({ sections: null, images: null, capacites: null });
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
      q(`/restaurants?id=eq.${rid}&select=galerie_sections,images,site_sections`),
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
        setDonnees({
          sections: groupes.length ? groupes : null,
          images: (restos[0] && restos[0].images) || null,
          capacites: (restos[0] && restos[0].site_sections) || null,
        });
      })
      .catch((e) => {
        if (!annule) {
          console.warn("[galerieSupabase] lecture impossible :", e.message);
          setDonnees({ sections: null, images: null, capacites: null });
        }
      });

    return () => {
      annule = true;
    };
  }, [restaurantId]);

  return donnees;
}
