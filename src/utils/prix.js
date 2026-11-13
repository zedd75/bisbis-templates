// Prix lisible par une machine, pour les données structurées de la page.
// "7,50€" et "7.50€" donnent tous deux "7.50" : la carte accepte les deux
// écritures, et n'en reconnaître qu'une annonçait « 7 » pour un plat affiché
// à 7.50. On prend le premier prix trouvé ; sans prix, on n'annonce rien.
export function prixNumerique(prix) {
  if (typeof prix !== "string") return null;
  // Un séparateur ne compte que s'il est suivi d'un ou deux chiffres :
  // « 25. Service compris » reste 25.
  const m = prix.match(/(\d+)(?:[.,](\d{1,2})(?!\d))?/);
  if (!m) return null;
  return m[2] ? `${m[1]}.${m[2].padEnd(2, "0")}` : m[1];
}
