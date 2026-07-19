// Barre de navigation Premium.
// - transparente par-dessus le hero de l'accueil, opaque ailleurs
//   ou après défilement
// - "La carte" est un menu déroulant (au survol) qui liste les
//   sections de la carte ; un clic amène directement à la section
// - sur mobile : bouton burger qui ouvre un panneau de liens
// - bouton Réserver (externe) + bascule de langue FR / EN
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import slugify from "../../utils/slugify.js";

export default function PremiumNav({ config, t, lang, setLang }) {
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

  return (
    <header className={`pnav ${solide ? "pnav--solid" : ""}`}>
      <div className="pnav__inner">
        <Link to="/" className="pnav__brand">
          {config.nom}
        </Link>

        <nav className="pnav__links">
          <Link to="/histoire">{t.nav.histoire}</Link>

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
            <Link
              to="/carte"
              className="pdrop__trigger"
              onClick={() => setCarteOuverte(false)}
            >
              {t.nav.carte}
              <span className="pdrop__chevron" aria-hidden="true">
                ▾
              </span>
            </Link>
            <div className="pdrop__menu">
              {entreesCarte.map((entree) => (
                <Link
                  key={entree.ancre}
                  to={`/carte#${entree.ancre}`}
                  onClick={() => setCarteOuverte(false)}
                >
                  {entree.nom}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/galerie">{t.nav.galerie}</Link>
        </nav>

        <div className="pnav__actions">
          <button
            className="pnav__lang"
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            aria-label="Changer de langue"
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>
          <a
            href={config.reservationUrl}
            target="_blank"
            rel="noreferrer"
            className="pbtn pbtn--gold"
          >
            {t.nav.reserver}
          </a>
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
          <Link to="/histoire">{t.nav.histoire}</Link>
          <Link to="/carte">{t.nav.carte}</Link>
          <Link to="/galerie">{t.nav.galerie}</Link>
          <a href={config.reservationUrl} target="_blank" rel="noreferrer">
            {t.nav.reserver}
          </a>
        </nav>
      )}
    </header>
  );
}
