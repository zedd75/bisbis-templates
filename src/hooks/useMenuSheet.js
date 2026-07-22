// Charge un menu depuis une URL CSV (Google Sheet publié OU fichier local).
// Renvoie { statut, onglets }.
//   statut : "inactif" | "chargement" | "pret" | "vide" | "erreur"
//   onglets: le menu construit, ou null.
// En cas d'échec (réseau, Sheet privé...), onglets reste null : le site
// garde alors le menu statique écrit dans la config. Aucune page blanche.
import { useEffect, useState } from "react";
import parseCsv from "../utils/csv.js";
import { construireOnglets } from "../utils/menuSheet.js";

export default function useMenuSheet(url) {
  const [etat, setEtat] = useState({
    statut: url ? "chargement" : "inactif",
    onglets: null,
  });

  useEffect(() => {
    if (!url) {
      setEtat({ statut: "inactif", onglets: null });
      return;
    }
    let annule = false;
    setEtat({ statut: "chargement", onglets: null });

    fetch(url, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then((texte) => {
        if (annule) return;
        const onglets = construireOnglets(parseCsv(texte));
        setEtat({
          statut: onglets.length ? "pret" : "vide",
          onglets: onglets.length ? onglets : null,
        });
      })
      .catch((e) => {
        if (annule) return;
        console.warn("[menuSheet] chargement impossible :", e.message);
        setEtat({ statut: "erreur", onglets: null });
      });

    return () => {
      annule = true;
    };
  }, [url]);

  return etat;
}
