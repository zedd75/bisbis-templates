// Coordonnees publiques de la production, jamais de cle secrete.
export const PRODUCTION = Object.freeze({
  url: "https://ailvltkprmbmwimkuhyp.supabase.co",
  key: "sb_publishable_N6OPsHP6sPKlR9Unvlm3lg_Hlwr0GkY",
});

export function verifierApercu(manifeste, config) {
  if (!manifeste?.url || manifeste.url === PRODUCTION.url || manifeste.url !== config.url) {
    throw new Error("Apercu bloque : reconstruisez le build de recette avec npm run build -- --mode recette.");
  }
}

export function configurationSupabase({ command, mode, vercelEnv, env = {} } = {}) {
  if (vercelEnv === "production" && mode !== "production") {
    throw new Error("Le deploiement production exige le mode production.");
  }
  // Vitest et les recettes interceptees n'ont besoin d'aucune vraie base.
  if (mode === "test" && !vercelEnv) {
    return { url: "https://comet-tests.invalid", key: "sb_publishable_tests_fictifs" };
  }
  // Un Preview Vercel utilise aussi "vite build" : MODE seul ne suffit pas.
  const production = vercelEnv
    ? vercelEnv === "production" && mode === "production"
    : command === "build" && mode === "production";
  const brut = String(env.VITE_SUPABASE_URL || "").trim();
  const key = String(env.VITE_SUPABASE_PUBLISHABLE_KEY || "").trim();
  if (!brut && !key && production) return PRODUCTION;
  if (!brut) throw new Error("Base de recette manquante. Renseignez .env.local a partir de .env.example.");
  let url;
  try { url = new URL(brut); } catch { throw new Error("URL Supabase invalide."); }
  if (url.protocol !== "https:" || !url.hostname.endsWith(".supabase.co")
    || url.username || url.password || url.port || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("URL Supabase invalide : utilisez l'origine HTTPS du projet.");
  }
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) {
    throw new Error("Une cle publique sb_publishable_ est requise, jamais une cle secrete.");
  }
  if (!production && (url.origin === PRODUCTION.url || key === PRODUCTION.key)) {
    throw new Error("La production est interdite pour les essais. Utilisez un projet de recette separe.");
  }
  if (production && (url.origin !== PRODUCTION.url || key !== PRODUCTION.key)) {
    throw new Error("Deploiement production bloque : les coordonnees ne correspondent pas au projet de production.");
  }
  return { url: url.origin, key };
}
