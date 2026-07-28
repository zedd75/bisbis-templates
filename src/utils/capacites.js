// Fusionne les fonctionnalités activées depuis CometStudio
// (restaurants.site_sections) dans config.sections. Les valeurs distantes
// gagnent sur les valeurs locales de la config (c'est tout l'intérêt des
// interrupteurs : l'admin décide, la config statique n'est qu'un défaut).
export function appliquerCapacites(config, capacites) {
  if (!capacites || Object.keys(capacites).length === 0) return config;
  return { ...config, sections: { ...config.sections, ...capacites } };
}
