// CHEF D'ORCHESTRE
// 1. Charge la config du client actif
// 2. Choisit le bon template selon config.template
// 3. Transforme chaque couleur/police du thème en variable CSS
import Seo from "./components/shared/Seo.jsx";
import useMenuSheet from "./hooks/useMenuSheet.js";
import useMenuSupabase from "./hooks/useMenuSupabase.js";
import { appliquerMenu } from "./utils/menuSheet.js";
import useGalerieSupabase from "./hooks/useGalerieSupabase.js";
import useAvisSupabase from "./hooks/useAvisSupabase.js";
import { appliquerGalerie } from "./utils/galerie.js";
import { appliquerAvis } from "./utils/avis.js";
import { appliquerImages } from "./utils/images.js";
import { appliquerCapacites } from "./utils/capacites.js";
import { themeActif } from "./utils/theme.js";
import useTheme from "./hooks/useTheme.js";
import bistrotConfig from "./config/client.config.js";
import palmaConfig from "./config/casa-palma.config.js";
import doricConfig from "./config/le-doric.config.js";
import EssentielTemplate from "./templates/EssentielTemplate.jsx";
import SignatureTemplate from "./templates/SignatureTemplate.jsx";
import PrestigeTemplate from "./templates/PrestigeTemplate.jsx";
import PageLegale from "./components/shared/PageLegale.jsx";
import { CHEMIN_MENTIONS, CHEMIN_CONFIDENTIALITE } from "./config/legal.js";
import "./styles/theme.css";
import "./styles/legal.css";

// ------------------------------------------------------------
//  SÉLECTION DU CLIENT AFFICHÉ
//  1) ?client=xxx dans l'URL   (ex: http://localhost:5173/?client=doric)
//  2) sinon le dernier choix mémorisé dans cet onglet
//  3) sinon le client par défaut ci-dessous
//  Chaque nouveau client généré s'ajoute dans ce registre.
// ------------------------------------------------------------
const CLIENTS = {
  bistrot: bistrotConfig, // démo Essentiel
  palma: palmaConfig,     // démo Signature
  doric: doricConfig,     // démo Premium
};
const parametre = new URLSearchParams(window.location.search).get("client");
if (parametre && CLIENTS[parametre]) {
  sessionStorage.setItem("client", parametre);
}
const config = CLIENTS[sessionStorage.getItem("client")] || palmaConfig;

// Associe un nom de template à son composant.
const TEMPLATES = {
  essentiel: EssentielTemplate,
  signature: SignatureTemplate,
  prestige: PrestigeTemplate,
};

// ------------------------------------------------------------
//  PAGES LÉGALES
//  Elles remplacent le template au lieu de s'y ajouter : elles sont
//  communes aux 3 offres et ne dépendent d'aucune mise en scène.
//  Lu une seule fois : on n'y arrive que par un vrai chargement de page
//  (lien du pied de page, ou adresse tapée), jamais en navigation interne.
//  ⚠️ index.html doit connaître ces mêmes chemins, sinon sa redirection
//  vers le showroom les rendrait injoignables dans un onglet neuf.
// ------------------------------------------------------------
const cheminActuel = window.location.pathname.replace(/\/+$/, "") || "/";
const PAGE_LEGALE =
  cheminActuel === CHEMIN_MENTIONS
    ? "mentions"
    : cheminActuel === CHEMIN_CONFIDENTIALITE
      ? "confidentialite"
      : null;

export default function App() {
  // Menu piloté à distance. Priorité :
  //   1) Supabase (via config.restaurantId) — mis à jour par CometStudio
  //   2) sinon un CSV (config.menuSheet)
  //   3) sinon le menu statique de la config
  const { onglets: ongletsSupabase, traductions } = useMenuSupabase(config.restaurantId);
  const { onglets: ongletsSheet } = useMenuSheet(config.menuSheet);
  const { sections: galerieSections, images: imagesSite, capacites } = useGalerieSupabase(
    config.restaurantId
  );
  const { avis } = useAvisSupabase(config.restaurantId);
  const onglets = ongletsSupabase || ongletsSheet;
  const configAvecMenu = onglets
    ? appliquerMenu(config, onglets, traductions)
    : config;
  const configAvecGalerie = appliquerGalerie(configAvecMenu, galerieSections);
  const configAvecAvis = appliquerAvis(configAvecGalerie, avis);
  const configAvecImages = appliquerImages(configAvecAvis, imagesSite);
  const configFinal = appliquerCapacites(configAvecImages, capacites);

  const Template = TEMPLATES[configFinal.template] || EssentielTemplate;

  // Mode d'affichage choisi par le visiteur (défaut : celui du template).
  const [mode, setMode] = useTheme(configFinal);

  // Chaque clé du thème ACTIF devient une variable CSS.
  // Ex : { or: "#CAAF63" }  ->  --or: #CAAF63
  const themeVars = {};
  for (const [cle, valeur] of Object.entries(themeActif(configFinal, mode))) {
    themeVars[`--${cle}`] = valeur;
  }

  // Sortie APRÈS tous les hooks : leur ordre doit rester constant.
  // Seo n'est pas monté ici, il écraserait le titre de la page légale.
  if (PAGE_LEGALE) {
    return (
      <div className="site" style={themeVars} data-theme={mode}>
        <PageLegale
          config={configFinal}
          page={PAGE_LEGALE}
          mode={mode}
          onChangerTheme={setMode}
        />
      </div>
    );
  }

  return (
    <div className="site" style={themeVars} data-theme={mode}>
      <Seo config={configFinal} />
      <Template config={configFinal} mode={mode} onChangerTheme={setMode} />
    </div>
  );
}
