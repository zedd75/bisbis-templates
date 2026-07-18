// Galerie photos (template Signature) : grille d'images avec zoom
// léger au survol + agrandissement au clic (lightbox).
import { useState } from "react";
import Reveal from "../shared/Reveal.jsx";

export default function Gallery({ config }) {
  const { galerie } = config;
  const [selection, setSelection] = useState(null);

  return (
    <section id="galerie" className="section sgalerie">
      <h2 className="section__title section__title--center">{galerie.titre}</h2>

      <Reveal>
        <div className="sgalerie__grid">
          {galerie.images.map((src, i) => (
            <button
              key={i}
              className="sgalerie__item"
              onClick={() => setSelection(src)}
              aria-label="Agrandir la photo"
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
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
