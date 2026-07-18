// En-tête Signature : nom/logo + liens d'ancrage vers les sections
// + bouton Appeler. Sur mobile, un bouton burger ouvre un panneau.
// Les liens ne s'affichent que si la section est activée dans
// config.sections.
import { useState } from "react";

export default function SignatureHeader({ config }) {
  const [burgerOuvert, setBurgerOuvert] = useState(false);
  const tel = config.infos.telephone.replace(/\s/g, "");

  const liens = [
    config.sections.apropos && { ancre: "#apropos", label: "La maison" },
    config.sections.galerie && { ancre: "#galerie", label: "Galerie" },
    config.sections.menu && { ancre: "#menu", label: "La carte" },
    config.sections.avis && { ancre: "#avis", label: "Avis" },
    { ancre: "#infos", label: "Contact" },
  ].filter(Boolean);

  return (
    <header className="header">
      <div className="header__inner">
        <a href="#hero" className="header__brand">
          {config.logo ? (
            <img src={config.logo} alt={config.nom} className="header__logo" />
          ) : (
            config.nom
          )}
        </a>

        <nav className="sheader__nav">
          {liens.map((lien) => (
            <a key={lien.ancre} href={lien.ancre}>
              {lien.label}
            </a>
          ))}
        </nav>

        <div className="sheader__actions">
          <a href={`tel:${tel}`} className="btn btn--phone">
            📞 <span className="btn__label">Appeler</span>
          </a>
          <button
            className="sheader__burger"
            onClick={() => setBurgerOuvert(!burgerOuvert)}
            aria-expanded={burgerOuvert}
            aria-label="Ouvrir le menu"
          >
            {burgerOuvert ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Panneau mobile : un clic sur un lien referme le panneau */}
      {burgerOuvert && (
        <nav className="sheader__mobile" onClick={() => setBurgerOuvert(false)}>
          {liens.map((lien) => (
            <a key={lien.ancre} href={lien.ancre}>
              {lien.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
