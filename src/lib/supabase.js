// Coordonnées Supabase pour la LECTURE du contenu (menu) par les sites.
// La clé "publishable" est publique par nature (protégée par les règles
// RLS : lecture seule autorisée). Aucune clé secrète ici.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
