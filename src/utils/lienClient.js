// Reporte l'identité du restaurant d'une URL à l'autre.
//
// LE PROBLÈME QU'ELLE RÉSOUT
// Le `Link` de React Router remplace l'URL entière, requête comprise. Depuis
// `/?client=doric`, un lien vers `/carte` produisait donc `/carte` tout court.
// Tant qu'on restait dans l'onglet, `sessionStorage` sauvait la mise. Mais
// l'adresse ainsi produite est celle que le visiteur copie, partage, met en
// favori ou ouvre dans un nouvel onglet — et là elle menait au restaurant par
// défaut, pas au sien. Une carte partagée montrait le mauvais restaurant.
//
// CE N'EST PAS LA SOLUTION DÉFINITIVE
// Un vrai client doit être identifié par SON domaine, pas par un paramètre
// d'URL. Ceci rend les liens partageables en attendant, et deviendra inutile
// le jour où chaque restaurant aura son domaine : rien n'est ajouté quand
// aucun `?client=` n'est présent.
export function avecClient(destination, recherche) {
  const client = new URLSearchParams(recherche || "").get("client");
  if (!client) return destination;

  const [chemin, ancre] = String(destination).split("#");
  // Une destination qui porte déjà sa propre requête garde la sienne.
  if (chemin.includes("?")) return destination;

  const suffixe = `?client=${encodeURIComponent(client)}`;
  return ancre ? `${chemin}${suffixe}#${ancre}` : `${chemin}${suffixe}`;
}
