// TEMPLATE PRESTIGE (offre Premium) — site multi-pages.
// Gère la langue active (FR / EN) et la navigation entre pages
// (React Router). La nav et le footer sont partagés par toutes
// les pages.
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PremiumNav from "../components/premium/PremiumNav.jsx";
import PremiumFooter from "../components/premium/PremiumFooter.jsx";
import ScrollToTop from "../components/premium/ScrollToTop.jsx";
import AccueilPage from "../pages/premium/AccueilPage.jsx";
import CartePage from "../pages/premium/CartePage.jsx";
import HistoirePage from "../pages/premium/HistoirePage.jsx";
import GaleriePage from "../pages/premium/GaleriePage.jsx";
import "../styles/prestige.css";

export default function PrestigeTemplate({ config }) {
  const [lang, setLang] = useState("fr");
  const t = config.contenu[lang]; // textes de la langue active

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="prestige">
        <PremiumNav config={config} t={t} lang={lang} setLang={setLang} />
        <main>
          <Routes>
            <Route path="/" element={<AccueilPage config={config} t={t} />} />
            <Route path="/carte" element={<CartePage config={config} t={t} />} />
            <Route
              path="/histoire"
              element={<HistoirePage config={config} t={t} />}
            />
            <Route
              path="/galerie"
              element={<GaleriePage config={config} t={t} />}
            />
          </Routes>
        </main>
        <PremiumFooter config={config} />
      </div>
    </BrowserRouter>
  );
}
