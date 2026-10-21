import { capaciteActive } from "./capacites.js";

// Un lien externe complet seulement : aucun code, identifiant ou chemin local.
export function urlReservation(valeur) {
  if (typeof valeur !== "string") return "";
  const lien = valeur.trim();
  if (!/^https?:\/\//i.test(lien) || /[\s\\]/u.test(lien)) return "";
  try {
    const url = new URL(lien);
    return url.hostname && !url.username && !url.password ? lien : "";
  } catch {
    return "";
  }
}

export function lienReservation(config) {
  return capaciteActive(config, "reservation") ? urlReservation(config.reservationUrl) : "";
}
