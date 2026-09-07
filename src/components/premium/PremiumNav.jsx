// Barre de navigation Premium.
// - transparente par-dessus le hero de l'accueil, opaque ailleurs
//   ou après défilement
// - "La carte" est un menu déroulant (au survol) qui liste les
//   sections de la carte ; un clic amène directement à la section
// - sur mobile : bouton burger qui ouvre un panneau de liens
// - bouton Réserver (externe) + bascule de langue FR / EN
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LienInterne from "../shared/LienInterne.jsx";
import { capaciteActive } from "../../utils/capacites.js";
import slugify from "../../utils/slugify.js";
import BasculeTheme from "../shared/BasculeTheme.jsx";

export default function PremiumNav({ config, t, lang, setLang, mode, onChangerTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [burgerOuvert, setBurgerOuvert] = useState(false);
  const [carteOuverte, setCarteOuverte] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Referme le panneau mobile à chaque changement de page.
  useEffect(() => {
    setBurgerOuvert(false);
  }, [pathname]);

  // Opaque si on a défilé, si on n'est pas sur l'accueil, ou si le
  // panneau mobile est ouvert.
  const solide = scrolled || pathname !== "/" || burgerOuvert;

  // Entrées du menu déroulant :
  //  - les catégories du 1er menu (À partager, Currys & grillades...)
  //  - puis les autres menus (Brunch...) en une entrée chacun
  const [principal, ...autresMenus] = t.carte.onglets;
  const entreesCarte = [
    ...principal.categories.map((cat) => ({
      nom: cat.nom,
      ancre: slugify(cat.nom),
    })),
    ...autresMenus.map((menu) => ({ nom: menu.nom, ancre: menu.id })),
  ];

  // Une capacité ABSENTE de la config vaut active : les configurations
  // écrites avant les interrupteurs ne doivent pas perdre leur navigation.
  // Seul un `false` explicite masque — et c'est ce que CometStudio écrit.
  //
  // Sans ce filtre, la barre affichait la galerie, la bascule de langue et
  // le bouton Réserver même quand l'offre du restaurant ne les comprend pas.
  // On vendait une différence entre formules que le rendu ignorait.
  const actif = (cle) => capaciteActive(config, cle);
  // Un lien de réservation vide donnerait `href=""`, c'est-à-dire un lien
  // vers la page courante : un bouton qui ne fait rien.
  const reservationVisible = actif("reservation") && !!config.reservationUrl;

  return (
    <header className={`pnav ${solide ? "pnav--solid" : ""}`}>
      <div className="pnav__inner">
        <LienInterne to="/" className="pnav__brand">
          {config.logo ? (
            <img src={config.logo} alt={config.nom} className="pnav__logo" />
          ) : (
            config.nom
          )}
        </LienInterne>

        <nav className="pnav__links">
          <LienInterne to="/histoire">{t.nav.histoire}</LienInterne>

          {/* --- Menu déroulant "La carte" ---
              Ouvert au survol (souris) OU au focus clavier ; se
              referme dès qu'on clique un élément. */}
          <div
            className={`pdrop ${carteOuverte ? "pdrop--open" : ""}`}
            onMouseEnter={() => setCarteOuverte(true)}
            onMouseLeave={() => setCarteOuverte(false)}
            onFocus={() => setCarteOuverte(true)}
            onBlur={(e) => {
              // ne referme que si le focus quitte tout le menu
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setCarteOuverte(false);
              }
            }}
          >
            <LienInterne
              to="/carte"
              className="pdrop__trigger"
              onClick={() => setCarteOuverte(false)}
            >
              {t.nav.carte}
              <span className="pdrop__chevron" aria-hidden="true">
                ▾
              </span>
            </LienInterne>
            <div className="pdrop__menu">
              {entreesCarte.map((entree) => (
                <LienInterne
                  key={entree.ancre}
                  to={`/carte#${entree.ancre}`}
                  onClick={() => setCarteOuverte(false)}
                >
                  {entree.nom}
                </LienInterne>
              ))}
            </div>
          </div>

          {actif("galerie") && (
            <LienInterne to="/galerie">{t.nav.galerie}</LienInterne>
          )}
        </nav>

        <div className="pnav__actions">
          <BasculeTheme config={config} mode={mode} onChanger={onChangerTheme} />
          {actif("bilingue") && (
            <button
              className="pnav__lang"
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              aria-label="Changer de langue"
            >
              {lang === "fr" ? "EN" : "FR"}
            </button>
          )}
          {reservationVisible && (
            <a
              href={config.reservationUrl}
              target="_blank"
              rel="noreferrer"
              className="pbtn pbtn--gold"
            >
              {t.nav.reserver}
            </a>
          )}
          {/* --- Burger (mobile uniquement, voir prestige.css) --- */}
          <button
            className="pnav__burger"
            onClick={() => setBurgerOuvert(!burgerOuvert)}
            aria-expanded={burgerOuvert}
            aria-label="Ouvrir le menu"
          >
            {burgerOuvert ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* --- Panneau mobile --- */}
      {burgerOuvert && (
        <nav className="pnav__mobile">
          <LienInterne to="/histoire">{t.nav.histoire}</LienInterne>
          <LienInterne to="/carte">{t.nav.carte}</LienInterne>
          {actif("galerie") && (
            <LienInterne to="/galerie">{t.nav.galerie}</LienInterne>
          )}
          {reservationVisible && (
            <a href={config.reservationUrl} target="_blank" rel="noreferrer">
              {t.nav.reserver}
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
