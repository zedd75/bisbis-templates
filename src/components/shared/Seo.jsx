// COMPOSANT PARTAGÉ — SEO automatique.
// Génère depuis la config, pour N'IMPORTE quel template :
//   - le titre de l'onglet et la meta description
//   - les balises Open Graph (aperçu WhatsApp/réseaux sociaux)
//   - le JSON-LD schema.org/Restaurant AVEC le menu complet :
//     Google peut ainsi comprendre (et afficher) les plats, prix,
//     horaires et téléphone directement dans les résultats.
// Aucun template n'a besoin de s'en occuper : App.jsx le monte une fois.
import { useEffect } from "react";

// Récupère les catégories de plats quel que soit le template.
function trouverCategories(config) {
  return (
    config.menu?.categories || // Essentiel
    config.menus?.onglets?.[0]?.categories || // Signature
    config.contenu?.fr?.carte?.onglets?.[0]?.categories || // Prestige
    []
  );
}

// "7,50€" -> "7.50" (premier prix trouvé)
function prixNumerique(prix) {
  const m = (prix || "").match(/\d+(?:,\d+)?/);
  return m ? m[0].replace(",", ".") : null;
}

// Crée ou met à jour une balise <meta>.
function poserMeta(attribut, nom, contenu) {
  if (!contenu) return;
  let balise = document.head.querySelector(`meta[${attribut}="${nom}"]`);
  if (!balise) {
    balise = document.createElement("meta");
    balise.setAttribute(attribut, nom);
    document.head.appendChild(balise);
  }
  balise.setAttribute("content", contenu);
}

export default function Seo({ config }) {
  useEffect(() => {
    const description =
      config.seo?.description ||
      config.hero?.sousTitre ||
      config.contenu?.fr?.hero?.sousTitre ||
      "";

    // --- Titre + metas classiques ---
    document.title = config.seo?.titre || `${config.nom} — ${description}`;
    poserMeta("name", "description", description);
    poserMeta("property", "og:title", config.nom);
    poserMeta("property", "og:description", description);
    poserMeta("property", "og:type", "website");
    poserMeta("property", "og:site_name", config.nom);

    // --- JSON-LD schema.org/Restaurant ---
    const horaires = config.infos.horaires;
    const donnees = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: config.nom,
      description,
      telephone: config.infos.telephone,
      address: {
        "@type": "PostalAddress",
        streetAddress: config.infos.adresse,
        addressCountry: "FR",
      },
      openingHours: Array.isArray(horaires)
        ? horaires
            .filter((h) => !/ferm/i.test(h.heures))
            .map((h) => `${h.jour} ${h.heures}`)
        : [horaires].filter(Boolean),
      hasMenu: {
        "@type": "Menu",
        hasMenuSection: trouverCategories(config).map((cat) => ({
          "@type": "MenuSection",
          name: cat.nom,
          hasMenuItem: cat.plats
            .filter((p) => p.nom)
            .map((p) => {
              const item = { "@type": "MenuItem", name: p.nom };
              if (p.desc) item.description = p.desc;
              const prix = prixNumerique(p.prix);
              if (prix) {
                item.offers = {
                  "@type": "Offer",
                  price: prix,
                  priceCurrency: "EUR",
                };
              }
              return item;
            }),
        })),
      },
    };

    let script = document.getElementById("seo-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "seo-jsonld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(donnees);
  }, [config]);

  return null; // ce composant n'affiche rien
}
