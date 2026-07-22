// Applique les sections de galerie venues de Supabase à la config, UNIQUEMENT
// pour le template Prestige (v1). Les autres templates gardent leur galerie
// statique. Range les sections dans un nouveau champ images.galerieSections.
export function appliquerGalerie(config, sections) {
  if (!sections || sections.length === 0) return config;
  if (config.template === "prestige") {
    return { ...config, images: { ...config.images, galerieSections: sections } };
  }
  return config;
}
