// Hero plein écran : label doré, grand titre serif, filet + losange,
// sous-titre en italique, deux boutons. L'entrée est animée en CSS
// (classe phero__content--enter).
import { Link } from "react-router-dom";

export default function PremiumHero({ config, t }) {
  return (
    <section
      id="top"
      className="phero"
      style={{ backgroundImage: `url(${config.images.hero})` }}
    >
      <div className="phero__overlay" />
      <div className="phero__content phero__content--enter">
        <p className="phero__label">{t.hero.label}</p>
        <h1 className="phero__title">{t.hero.titre}</h1>

        <div className="pdivider">
          <span className="pdivider__line" />
          <span className="pdivider__diamond" />
          <span className="pdivider__line" />
        </div>

        <p className="phero__subtitle">{t.hero.sousTitre}</p>

        <div className="phero__actions">
          <a
            href={config.reservationUrl}
            target="_blank"
            rel="noreferrer"
            className="pbtn pbtn--gold"
          >
            {t.hero.cta1}
          </a>
          <Link to="/carte" className="pbtn pbtn--outline">
            {t.hero.cta2}
          </Link>
        </div>
      </div>
    </section>
  );
}
