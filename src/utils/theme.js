// Choix du jeu de couleurs selon le mode d'affichage.
// Chaque config porte son thème d'origine (config.theme) + la variante opposée
// (config.themeAlternatif), et dit lequel est son défaut (config.themeDefaut).
// Ainsi l'apparence habituelle d'un template n'est jamais modifiée.
const MODES = ["clair", "sombre"];

export function modeOppose(mode) {
  return mode === "sombre" ? "clair" : "sombre";
}

export function themeActif(config, mode) {
  const defaut = config.themeDefaut === "sombre" ? "sombre" : "clair";
  if (!MODES.includes(mode) || mode === defaut) return config.theme;
  return config.themeAlternatif || config.theme;
}
