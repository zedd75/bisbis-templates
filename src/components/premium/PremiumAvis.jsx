// Avis clients (template Prestige) : cartes sobres avec note en étoiles.
// Les avis viennent de CometStudio (table Supabase "avis") ; à défaut, de la
// config. Le titre suit la langue affichée.
import Reveal from "../shared/Reveal.jsx";

export default function PremiumAvis({ config, t }) {
  const items = config.avis?.items || [];
  if (items.length === 0) return null;

  const titre = t?.avis?.titre || config.avis?.titre || "Ils en parlent";

  return (
    <section id="avis" className="pavis">
      <Reveal>
        <h2 className="pavis__title">{titre}</h2>
      </Reveal>

      <div className="pavis__grid">
        {items.map((item, i) => (
          <Reveal key={`${item.nom}-${i}`} delay={i * 0.12}>
            <article className="pavis__card">
              {item.note > 0 && (
                <p className="pavis__stars" aria-label={`${item.note} sur 5`}>
                  <span aria-hidden="true">
                    {"★".repeat(item.note)}
                    <span className="pavis__stars-empty">
                      {"★".repeat(Math.max(0, 5 - item.note))}
                    </span>
                  </span>
                </p>
              )}
              <p className="pavis__text">« {item.texte} »</p>
              {item.nom && <p className="pavis__name">{item.nom}</p>}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
