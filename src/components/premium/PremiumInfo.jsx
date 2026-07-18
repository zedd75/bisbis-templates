// Infos pratiques Premium : horaires, adresse, métro + carte Google.
import Reveal from "../shared/Reveal.jsx";

export default function PremiumInfo({ config, t }) {
  const { infos } = config;
  const tel = infos.telephone.replace(/\s/g, "");

  return (
    <section id="acces" className="pinfos">
      <Reveal>
        <h2 className="pinfos__title">{t.infosTitre}</h2>
      </Reveal>

      <div className="pinfos__grid">
        <div className="pinfos__col">
          <p className="psurtitre">{t.labelHoraires}</p>
          <p className="pinfos__value">{infos.horaires}</p>

          <p className="psurtitre">{t.labelAdresse}</p>
          <p className="pinfos__value">{infos.adresse}</p>
          <p className="pinfos__value">
            <a href={`tel:${tel}`}>{infos.telephone}</a>
          </p>

          <p className="psurtitre">{t.labelMetro}</p>
          <p className="pinfos__value">{infos.metro}</p>
        </div>

        <div className="pinfos__map">
          <iframe
            title="Localisation"
            src={infos.googleMapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
