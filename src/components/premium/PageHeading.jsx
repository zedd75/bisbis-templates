// En-tête réutilisé en haut des pages : petit label doré, grand titre,
// filet + losange, et un texte d'introduction optionnel.
import Reveal from "../shared/Reveal.jsx";

export default function PageHeading({ label, titre, texte }) {
  return (
    <div className="ppagehead">
      <Reveal>
        <p className="psurtitre">{label}</p>
        <h1 className="ppagehead__title">{titre}</h1>
        <div className="pdivider">
          <span className="pdivider__line" />
          <span className="pdivider__diamond" />
          <span className="pdivider__line" />
        </div>
        {texte && <p className="ppagehead__text">{texte}</p>}
      </Reveal>
    </div>
  );
}
