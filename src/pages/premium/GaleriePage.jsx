// PAGE GALERIE : grille de photos + agrandissement au clic (lightbox).
import { useState } from "react";
import PageHeading from "../../components/premium/PageHeading.jsx";

export default function GaleriePage({ config, t }) {
  const g = t.galerie;
  const images = config.images.galerie;
  const [selection, setSelection] = useState(null);

  return (
    <section className="ppage pgalerie">
      <PageHeading label={g.label} titre={g.titre} texte={g.texte} />

      <div className="pgalerie__grid">
        {images.map((src, i) => (
          <button
            key={i}
            className="pgalerie__item"
            onClick={() => setSelection(src)}
            aria-label="Agrandir la photo"
          >
            <img src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>

      {/* Lightbox : cliquer n'importe où ferme */}
      {selection && (
        <div className="plightbox" onClick={() => setSelection(null)}>
          <button className="plightbox__close" aria-label="Fermer">
            ×
          </button>
          <img src={selection} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
