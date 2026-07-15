// Sections "storytelling" alternées (texte / image), qui apparaissent
// en fondu au défilement. Piloté par des props : liste de blocs
// { titre, texte, surtitre? } + liste d'images.
import Reveal from "./Reveal.jsx";

export default function PremiumStory({ blocs, images }) {
  return (
    <div className="pstory">
      {blocs.map((bloc, i) => {
        const image = images[i % images.length];
        const inverse = i % 2 === 1; // alterne le sens une ligne sur deux
        return (
          <div
            key={bloc.titre}
            className={`pstory__row ${inverse ? "pstory__row--reverse" : ""}`}
          >
            <div className="pstory__media">
              <img src={image} alt={bloc.titre} loading="lazy" />
            </div>
            <div className="pstory__text">
              <Reveal>
                {bloc.surtitre && <p className="psurtitre">{bloc.surtitre}</p>}
                <h2 className="pstory__title">{bloc.titre}</h2>
                <p className="pstory__body">{bloc.texte}</p>
              </Reveal>
            </div>
          </div>
        );
      })}
    </div>
  );
}
