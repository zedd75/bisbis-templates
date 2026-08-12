// Infos pratiques Premium : horaires, adresse, métro + carte Google.
// La carte n'est chargée qu'au clic du visiteur (voir CarteGoogle).
import Reveal from "../shared/Reveal.jsx";
import CarteGoogle from "../shared/CarteGoogle.jsx";

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

        <CarteGoogle
          embedUrl={infos.googleMapsEmbed}
          adresse={infos.adresse}
          classe="pinfos__map"
        />
      </div>
    </section>
  );
}
