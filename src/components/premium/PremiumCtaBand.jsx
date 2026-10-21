// Bande d'appel à l'action sur fond encre : invite à réserver.
import Reveal from "../shared/Reveal.jsx";
import { lienReservation } from "../../utils/reservation.js";

export default function PremiumCtaBand({ config, t }) {
  const reservationUrl = lienReservation(config);
  if (!reservationUrl) return null;
  return (
    <section className="pcta">
      <Reveal>
        <div className="pdivider">
          <span className="pdivider__line" />
          <span className="pdivider__diamond" />
          <span className="pdivider__line" />
        </div>
        <h2 className="pcta__title">{t.ctaBand.titre}</h2>
        <p className="pcta__text">{t.ctaBand.texte}</p>
        <a
          href={reservationUrl}
          target="_blank"
          rel="noreferrer"
          className="pbtn pbtn--gold"
        >
          {t.ctaBand.bouton}
        </a>
      </Reveal>
    </section>
  );
}
