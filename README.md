# Bisbis — Templates de sites vitrines pour restaurants

Système modulable pour créer et vendre des sites vitrines de restaurants,
construit avec **React + Vite**. Une seule base de code, **un fichier de
configuration par client** : on produit un nouveau site en quelques minutes
sans jamais toucher au code des composants.

## Les 3 gammes

| Template | Offre | Contenu |
|----------|-------|---------|
| **Essentiel** | Low cost | Site une page : hero, carte, infos pratiques, carte Google, bouton d'appel. |
| **Signature** | Intermédiaire | Une page enrichie : galerie photos, menus à onglets, avis clients, animations au défilement. |
| **Prestige** | Premium | Multi-pages (React Router) : direction artistique sur mesure, bilingue FR/EN, carte complète, histoire, galerie, réservation. |

## Démarrer

```bash
npm install
npm run dev
```

Puis, dans le navigateur :

- `http://localhost:5173/demos.html` — le **showroom** (les 3 gammes)
- `http://localhost:5173/?client=bistrot` — démo Essentiel
- `http://localhost:5173/?client=palma` — démo Signature
- `http://localhost:5173/?client=doric` — démo Prestige

## Créer un nouveau client

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
├── config/                  Un fichier de config par client (+ data/ pour les cartes)
├── components/
│   ├── shared/              Briques communes aux 3 templates (Reveal, MenuCategories, Seo)
│   ├── signature/           Composants propres à la Signature
│   └── premium/             Composants propres au Prestige
├── pages/premium/           Pages du site Prestige (React Router)
├── templates/               EssentielTemplate · SignatureTemplate · PrestigeTemplate
├── styles/                  theme.css (base) · signature.css · prestige.css
└── App.jsx                  Sélectionne le client + le template, applique le thème
```

Principes : **mobile-first**, thème piloté par variables CSS depuis la config,
**SEO automatique** (meta, Open Graph et JSON-LD `schema.org/Restaurant` avec le
menu complet) généré pour chaque template.

## Déploiement

Build statique (`npm run build`) déployable sur Vercel / Netlify. Le fichier
`vercel.json` gère les routes du template Prestige.

---

> Le contenu des démos (cartes, noms de plats) est fictif ou à titre
> d'illustration ; pour un vrai client, on remplace par ses propres données.
