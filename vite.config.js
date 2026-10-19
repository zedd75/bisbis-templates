import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { configurationSupabase, verifierApercu } from './config/environnement.js'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const config = configurationSupabase({
    command, mode, vercelEnv: process.env.VERCEL_ENV,
    env: loadEnv(mode, process.cwd(), 'VITE_'),
  });
  return {
    plugins: [react(), {
      name: 'isolation-recette',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'environnement.json', source: JSON.stringify({ url: config.url }) });
      },
      configurePreviewServer(server) {
        let manifeste;
        try {
          manifeste = JSON.parse(readFileSync(resolve(server.config.root, server.config.build.outDir, 'environnement.json'), 'utf8'));
        } catch {
          throw new Error('Build sans environnement identifie : reconstruisez la recette.');
        }
        verifierApercu(manifeste, config);
      },
    }],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(config.url),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(config.key),
    },
  };
})
