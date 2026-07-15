// CHEF D'ORCHESTRE
// 1. Charge la config du client actif
// 2. Choisit le bon template selon config.template
// 3. Transforme chaque couleur/police du thème en variable CSS
import { useEffect } from "react";
import bistrotConfig from "./config/client.config.js";
import doricConfig from "./config/le-doric.config.js";
import EssentielTemplate from "./templates/EssentielTemplate.jsx";
import PrestigeTemplate from "./templates/PrestigeTemplate.jsx";
import "./styles/theme.css";

// 👇 CHANGEZ CETTE LIGNE pour afficher un autre client :
//    bistrotConfig = démo Essentiel   |   doricConfig = démo Premium
const config = doricConfig;

// Associe un nom de template à son composant.
const TEMPLATES = {
  essentiel: EssentielTemplate,
  prestige: PrestigeTemplate,
};

export default function App() {
  const Template = TEMPLATES[config.template] || EssentielTemplate;

  // Titre de l'onglet du navigateur = nom du restaurant.
  useEffect(() => {
    document.title = config.nom;
  }, []);

  // Chaque clé du thème devient une variable CSS.
  // Ex : { or: "#CAAF63" }  ->  --or: #CAAF63
  const themeVars = {};
  for (const [cle, valeur] of Object.entries(config.theme)) {
    themeVars[`--${cle}`] = valeur;
  }

  return (
    <div className="site" style={themeVars}>
      <Template config={config} />
    </div>
  );
}
