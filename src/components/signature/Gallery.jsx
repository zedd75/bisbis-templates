// Galerie photos (template Signature) : grille d'images avec zoom léger au
// survol + agrandissement au clic (lightbox).
// Deux sources possibles :
//   - config.galerieSections (piloté depuis CometStudio) : un titre + une
//     grille par section, et un texte positionné possible sur chaque photo ;
//   - sinon config.galerie.images : la liste statique d'origine (repli).
import { useState } from "react";
import Reveal from "../shared/Reveal.jsx";

export default function Gallery({ config }) {
  const { galerie } = config;
  const sections = config.galerieSections || null;
  const [selection, setSelection] = useState(null);

  const grille = (photos) => (
    <div className="sgalerie__grid">
      {photos.map((img, i) => (
        <button
          key={i}
          className="sgalerie__item"
          onClick={() => setSelection(img.url)}
          aria-label="Agrandir la photo"
        >
          <img src={img.url} alt={img.texte || ""} loading="lazy" />
          {img.texte && (
            <span
              className={`sgalerie__legende sgalerie__legende--${img.position || "bas"}`}
            >
              {img.texte}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  // Repli : la liste statique est convertie au même format que les sections.
  const plates = (galerie.images || []).map((src) =>
    typeof src === "string" ? { url: src, texte: "", position: null } : src
  );

  return (
    <section id="galerie" className="section sgalerie">
      <h2 className="section__title section__title--center">{galerie.titre}</h2>

      <Reveal>
        {sections ? (
          sections.map((s) => (
            <div key={s.id} className="sgalerie__section">
              <h3 className="sgalerie__titre">{s.nom}</h3>
              {grille(s.photos)}
            </div>
          ))
        ) : (
          grille(plates)
        )}
      </Reveal>

      {/* Lightbox : cliquer n'importe où ferme */}
      {selection && (
        <div className="slightbox" onClick={() => setSelection(null)}>
          <button className="slightbox__close" aria-label="Fermer">
            ×
          </button>
          <img src={selection} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
