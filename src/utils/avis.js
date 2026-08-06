// Applique les avis pilotés depuis CometStudio à la config du site.
//
// Les deux templates concernés (Signature et Prestige) lisent la même liste
// config.avis.items ; seul le titre de la section diffère : Signature le prend
// dans config.avis.titre, Prestige dans les textes de la langue affichée.
//
// Aucun avis en base = on garde ceux de la config. C'est ce qui permet à une
// démo de rester présentable tant que le restaurateur n'a rien saisi.
// Si rien ne change, on renvoie la config d'origine (identité préservée).
export function appliquerAvis(config, avis) {
  if (!avis || avis.length === 0) return config;
  return { ...config, avis: { ...config.avis, items: avis } };
}
