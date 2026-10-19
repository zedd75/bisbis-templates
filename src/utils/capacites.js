// Fusionne les fonctionnalités activées depuis le back-office
// (restaurants.site_sections) dans config.sections. Les valeurs distantes
// gagnent sur les valeurs locales de la config (c'est tout l'intérêt des
// interrupteurs : l'admin décide, la config statique n'est qu'un défaut).
export function appliquerCapacites(config, capacites) {
  if (!capacites || Object.keys(capacites).length === 0) return config;
  return { ...config, sections: { ...config.sections, ...capacites } };
}

// Une capacité est-elle active pour ce restaurant ?
//
// ABSENTE vaut ACTIVE. Les configurations statiques écrites avant les
// interrupteurs n'ont pas de clé `sections` complète : les traiter comme
// désactivées ferait disparaître la navigation de sites qui fonctionnent.
// Seul un `false` explicite masque — et c'est exactement ce que le back-office
// écrit, puisque `sectionsDeLOffre()` pose les huit clés, y compris à false.
export function capaciteActive(config, cle) {
  return config?.sections?.[cle] !== false;
}
