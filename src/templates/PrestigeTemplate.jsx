// TEMPLATE PRESTIGE (offre Premium) — site multi-pages.
// Gère la langue active (FR / EN) et la navigation entre pages
// (React Router). La nav et le footer sont partagés par toutes
// les pages.
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { capaciteActive } from "../utils/capacites.js";
import PremiumNav from "../components/premium/PremiumNav.jsx";
import PremiumFooter from "../components/premium/PremiumFooter.jsx";
import ScrollToTop from "../components/premium/ScrollToTop.jsx";
import AccueilPage from "../pages/premium/AccueilPage.jsx";
import CartePage from "../pages/premium/CartePage.jsx";
import HistoirePage from "../pages/premium/HistoirePage.jsx";
import GaleriePage from "../pages/premium/GaleriePage.jsx";
import "../styles/prestige.css";

function PageActive({ config, capacite, children }) {
  const { search } = useLocation();
  return capaciteActive(config, capacite) ? children : <Navigate to={{ pathname: "/", search }} replace />;
}

export default function PrestigeTemplate({ config, mode, onChangerTheme }) {
  const [lang, setLang] = useState("fr");
  const t = config.contenu[lang]; // textes de la langue active

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="prestige">
        <PremiumNav
          config={config}
          t={t}
          lang={lang}
          setLang={setLang}
          mode={mode}
          onChangerTheme={onChangerTheme}
        />
        <main>
          <Routes>
            <Route path="/" element={<AccueilPage config={config} t={t} />} />
            <Route path="/carte" element={<PageActive config={config} capacite="menu"><CartePage config={config} t={t} /></PageActive>} />
            <Route
              path="/histoire"
              element={<PageActive config={config} capacite="apropos"><HistoirePage config={config} t={t} /></PageActive>}
            />
            <Route
              path="/galerie"
              element={<PageActive config={config} capacite="galerie"><GaleriePage config={config} t={t} /></PageActive>}
            />
          </Routes>
        </main>
        <PremiumFooter config={config} />
      </div>
    </BrowserRouter>
  );
}
