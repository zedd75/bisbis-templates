// PAGE GALERIE : sections (titre + grille de photos) ou repli plat.
// Données : config.images.galerieSections (Supabase/CometStudio) = liste de
// { id, nom, photos:[{url, texte, position}] }. Repli : config.images.galerie
// (liste d'URL statiques). Chaque photo garde son texte positionné + lightbox.
import { useState } from "react";
import PageHeading from "../../components/premium/PageHeading.jsx";

export default function GaleriePage({ config, t }) {
  const g = t.galerie;
  const sections = config.images.galerieSections || null;
  const flat = (config.images.galerie || []).map((it) =>
    typeof it === "string" ? { url: it, texte: "", position: null } : it
  );
  const [selection, setSelection] = useState(null);

  const grille = (photos) => (
    <div className="pgalerie__grid">
      {photos.map((img, i) => (
        <button
          key={i}
          className="pgalerie__item"
          onClick={() => setSelection(img.url)}
          aria-label="Agrandir la photo"
        >
          <img src={img.url} alt={img.texte || ""} loading="lazy" />
          {img.texte && (
            <span
              className={`pgalerie__legende pgalerie__legende--${img.position || "bas"}`}
            >
              {img.texte}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <section className="ppage pgalerie">
      <PageHeading label={g.label} titre={g.titre} texte={g.texte} />

      {sections
        ? sections.map((s) => (
            <div key={s.id} className="pgalerie__section">
              <h2 className="pgalerie__titre">{s.nom}</h2>
              {grille(s.photos)}
            </div>
          ))
        : grille(flat)}

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
