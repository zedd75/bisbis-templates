# Bisbis — Templates de sites vitrines pour restaurants

Système modulable de sites vitrines de restaurants, construit avec
**React + Vite**. Une seule base de code, **un fichier de configuration par
site** : on crée un nouveau site en changeant uniquement sa config, sans
toucher au code des composants.

## Les 3 templates

| Template | Description |
|----------|-------------|
| **Essentiel** | Site une page : hero, carte, infos pratiques, carte Google, bouton d'appel. |
| **Signature** | Une page enrichie : galerie photos, menus à onglets, avis clients, animations au défilement. |
| **Prestige** | Multi-pages (React Router) : direction artistique sur mesure, bilingue FR/EN, carte complète, histoire, galerie, réservation. |

## Démarrer

```bash
npm install
npm run dev
```

Puis, dans le navigateur :

- `http://localhost:5173/demos.html` — la page qui liste les 3 templates
- `http://localhost:5173/?client=bistrot` — démo Essentiel
- `http://localhost:5173/?client=palma` — démo Signature
- `http://localhost:5173/?client=doric` — démo Prestige

## Créer un nouveau site

```bash
npm run nouveau-client
```

Le script pose quelques questions (nom, couleurs, adresse…) et génère un fichier
de configuration prêt à l'emploi dans `src/config/`. Il ne reste qu'à
l'enregistrer dans `src/App.jsx` (2 lignes indiquées à la fin du script) et à
remplacer les photos.

## Architecture

```
src/
├── config/                  Un fichier de config par site (+ data/ pour les cartes)
├── components/
│   ├── shared/              Briques communes aux 3 templates (Reveal, MenuCategories, Seo)
│   ├── signature/           Composants propres au template Signature
│   └── premium/             Composants propres au template Prestige
├── pages/premium/           Pages du template Prestige (React Router)
├── templates/               EssentielTemplate · SignatureTemplate · PrestigeTemplate
├── styles/                  theme.css (base) · signature.css · prestige.css
└── App.jsx                  Sélectionne le site + le template, applique le thème
```

Principes : **mobile-first**, thème piloté par variables CSS depuis la config,
**SEO automatique** (meta, Open Graph et JSON-LD `schema.org/Restaurant` avec le
menu complet) généré pour chaque template.

## Déploiement

Build statique (`npm run build`) déployable sur Vercel / Netlify. Le fichier
`vercel.json` gère les routes du template Prestige.

---

> Le contenu des démos (cartes, noms de plats) est fictif ou à titre
> d'illustration.
