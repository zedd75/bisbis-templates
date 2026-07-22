// CHEF D'ORCHESTRE
// 1. Charge la config du client actif
// 2. Choisit le bon template selon config.template
// 3. Transforme chaque couleur/police du thème en variable CSS
import Seo from "./components/shared/Seo.jsx";
import useMenuSheet from "./hooks/useMenuSheet.js";
import useMenuSupabase from "./hooks/useMenuSupabase.js";
import { appliquerMenu } from "./utils/menuSheet.js";
import useGalerieSupabase from "./hooks/useGalerieSupabase.js";
import { appliquerGalerie } from "./utils/galerie.js";
import bistrotConfig from "./config/client.config.js";
import palmaConfig from "./config/casa-palma.config.js";
import doricConfig from "./config/le-doric.config.js";
import EssentielTemplate from "./templates/EssentielTemplate.jsx";
import SignatureTemplate from "./templates/SignatureTemplate.jsx";
import PrestigeTemplate from "./templates/PrestigeTemplate.jsx";
import "./styles/theme.css";

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

export default function App() {
  // Menu piloté à distance. Priorité :
  //   1) Supabase (via config.restaurantId) — mis à jour par CometStudio
  //   2) sinon un CSV (config.menuSheet)
  //   3) sinon le menu statique de la config
  const { onglets: ongletsSupabase } = useMenuSupabase(config.restaurantId);
  const { onglets: ongletsSheet } = useMenuSheet(config.menuSheet);
  const { sections: galerieSections } = useGalerieSupabase(config.restaurantId);
  const onglets = ongletsSupabase || ongletsSheet;
  const configAvecMenu = onglets ? appliquerMenu(config, onglets) : config;
  const configFinal = appliquerGalerie(configAvecMenu, galerieSections);

  const Template = TEMPLATES[configFinal.template] || EssentielTemplate;

  // Chaque clé du thème devient une variable CSS.
  // Ex : { or: "#CAAF63" }  ->  --or: #CAAF63
  const themeVars = {};
  for (const [cle, valeur] of Object.entries(configFinal.theme)) {
    themeVars[`--${cle}`] = valeur;
  }

  return (
    <div className="site" style={themeVars}>
      <Seo config={configFinal} />
      <Template config={configFinal} />
    </div>
  );
}
