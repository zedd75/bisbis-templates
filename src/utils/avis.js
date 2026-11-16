// Applique les avis pilotés depuis le back-office à la config du site.
//
// Les deux templates concernés (Signature et Prestige) lisent la même liste
// config.avis.items ; seul le titre de la section diffère : Signature le prend
// dans config.avis.titre, Prestige dans les textes de la langue affichée.
//
// Aucun avis en base = on garde ceux de la config. C'est ce qui permet à une
// démo de rester présentable tant que le restaurateur n'a rien saisi.
// Si rien ne change, on renvoie la config d'origine (identité préservée).
//
// Un avis sans texte est une saisie en cours dans le back-office : il n'a rien
// à montrer, on ne l'affiche pas. La liste reçue est rendue telle quelle quand
// tous ses avis sont affichables (identité préservée).
export function appliquerAvis(config, avis) {
  if (!avis || avis.length === 0) return config;
  const affichables = avis.filter((a) => String(a?.texte ?? "").trim());
  if (affichables.length === 0) return config;
  const items = affichables.length === avis.length ? avis : affichables;
  return { ...config, avis: { ...config.avis, items } };
}
