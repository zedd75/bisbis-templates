// En-tête fixe en haut de page : nom/logo à gauche, bascule de thème et
// bouton Appeler à droite.
import BasculeTheme from "./shared/BasculeTheme.jsx";

export default function Header({ config, mode, onChangerTheme }) {
  const tel = config.infos.telephone.replace(/\s/g, "");

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
        <BasculeTheme config={config} mode={mode} onChanger={onChangerTheme} />
        <a href={`tel:${tel}`} className="btn btn--phone">
          📞 <span className="btn__label">Appeler</span>
        </a>
      </div>
    </header>
  );
}
