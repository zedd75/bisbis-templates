// Applique les images pilotées depuis CometStudio à la config du site.
// Chaque template range ses images différemment : ce fichier sait où poser
// chaque emplacement. Une valeur vide ou absente laisse l'image d'origine.
export function appliquerImages(config, images) {
  if (!images || Object.keys(images).length === 0) return config;

  const v = (id) => {
    const x = images[id];
    return typeof x === "string" && x.trim() ? x.trim() : null;
  };

  let out = config;
  if (v("logo")) out = { ...out, logo: v("logo") };

  if (config.template === "prestige") {
    const maj = {};
    for (const id of ["hero", "story1", "story2"]) {
      if (v(id)) maj[id] = v(id);
    }
    if (Object.keys(maj).length) {
      out = { ...out, images: { ...out.images, ...maj } };
    }
    return out;
  }

  // Essentiel et Signature : hero.image et apropos.image
  if (v("hero")) out = { ...out, hero: { ...out.hero, image: v("hero") } };
  if (v("apropos")) out = { ...out, apropos: { ...out.apropos, image: v("apropos") } };
  return out;
}
