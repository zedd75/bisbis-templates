// Applique les sections de galerie venues de Supabase à la config du site.
// Les sections sont rangées à la racine (config.galerieSections) : même
// convention pour tous les templates qui savent afficher une galerie.
// La galerie statique d'origine reste en place et sert de repli.
//
// Essentiel n'a pas de galerie dans son template : un client qui en veut une
// passe à la formule Signature.
const TEMPLATES_AVEC_GALERIE = ["prestige", "signature"];

export function appliquerGalerie(config, sections) {
  if (!sections || sections.length === 0) return config;
  if (!TEMPLATES_AVEC_GALERIE.includes(config.template)) return config;
  return { ...config, galerieSections: sections };
}
