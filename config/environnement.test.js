import { describe, expect, it } from "vitest";
import { configurationSupabase, verifierApercu, PRODUCTION } from "./environnement.js";

const recette = {
  VITE_SUPABASE_URL: "https://projet-recette.supabase.co",
  VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_recette",
};
describe("Isolation de la base de test", () => {
it("refuse un build de recette publie dans l'environnement production Vercel", () => {
    expect(() => configurationSupabase({ command: "build", mode: "recette", vercelEnv: "production", env: recette })).toThrow(/production/);
  });
  it("refuse un serveur preview avec un build de production", () => {
    expect(() => verifierApercu({ url: PRODUCTION.url }, { url: recette.VITE_SUPABASE_URL })).toThrow(/build/);
  });
  it("autorise un serveur preview avec le build de la meme recette", () => {
    expect(() => verifierApercu({ url: recette.VITE_SUPABASE_URL }, { url: recette.VITE_SUPABASE_URL })).not.toThrow();
  });
  it("bloque le serveur local sans base de recette", () => {
    expect(() => configurationSupabase({ command: "serve", mode: "development" })).toThrow(/recette/);
  });
  it("refuse la production dans le serveur local meme explicite", () => {
    expect(() => configurationSupabase({ command: "serve", env: {
      VITE_SUPABASE_URL: PRODUCTION.url, VITE_SUPABASE_PUBLISHABLE_KEY: PRODUCTION.key,
    } })).toThrow(/production/);
  });
  it("refuse la production sur un deploiement Preview", () => {
    expect(() => configurationSupabase({ command: "build", mode: "production", vercelEnv: "preview" })).toThrow(/recette/);
  });
  it("utilise la recette configuree pour les essais", () => {
    expect(configurationSupabase({ command: "serve", env: recette })).toEqual({
      url: "https://projet-recette.supabase.co", key: "sb_publishable_recette",
    });
  });
  it("ne redirige pas un deploiement production vers une recette locale", () => {
    expect(() => configurationSupabase({ command: "build", mode: "production", vercelEnv: "production", env: recette })).toThrow(/production/);
  });
  it("conserve les coordonnees du deploiement production existant", () => {
    expect(configurationSupabase({ command: "build", mode: "production" })).toEqual(PRODUCTION);
  });
  it("permet un build de recette isole", () => {
    expect(configurationSupabase({ command: "build", mode: "recette", env: recette }).url).toBe("https://projet-recette.supabase.co");
  });
  it("utilise une origine non routable pour les tests unitaires", () => {
    expect(configurationSupabase({ command: "serve", mode: "test" }).url).toBe("https://vitrines-tests.invalid");
  });
  it.each(["sb_secret_interdit", "eyJhbGci.secret.signature", ""])("refuse une cle non publishable : %s", (key) => {
    expect(() => configurationSupabase({ command: "serve", env: { ...recette, VITE_SUPABASE_PUBLISHABLE_KEY: key } })).toThrow(/publishable/);
  });
  it.each(["http://projet-recette.supabase.co", "https://projet-recette.supabase.co/path", "https://user:pass@projet-recette.supabase.co", "https://projet-recette.supabase.co?x=y"])("refuse une origine ambigue : %s", (url) => {
    expect(() => configurationSupabase({ command: "serve", env: { ...recette, VITE_SUPABASE_URL: url } })).toThrow(/URL/);
  });
  it("refuse la production avec une casse ou barre finale differente", () => {
    expect(() => configurationSupabase({ command: "serve", env: {
      ...recette, VITE_SUPABASE_URL: "https://AILVLTKPRMBMWIMKUHYP.supabase.co/",
    } })).toThrow(/production/);
  });
});
