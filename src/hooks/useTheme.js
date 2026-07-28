// Mode d'affichage choisi par le VISITEUR (clair ou sombre).
// Au premier passage, on prend l'apparence par défaut du template ; ensuite on
// se souvient du choix du visiteur sur SON appareil (localStorage).
import { useEffect, useState } from "react";

const CLE = "cometstudio.theme";

export default function useTheme(config) {
  const defaut = config.themeDefaut === "sombre" ? "sombre" : "clair";
  const cle = `${CLE}.${config.restaurantId || config.template || "site"}`;

  const [mode, setMode] = useState(() => {
    try {
      const memorise = localStorage.getItem(cle);
      return memorise === "clair" || memorise === "sombre" ? memorise : defaut;
    } catch {
      return defaut; // navigation privée / stockage indisponible
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(cle, mode);
    } catch {
      // sans gravité : le choix ne sera juste pas mémorisé
    }
  }, [cle, mode]);

  return [mode, setMode];
}
