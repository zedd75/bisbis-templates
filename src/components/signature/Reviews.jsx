// Avis clients (template Signature) : cartes avec note en étoiles.
// Les avis viennent de CometStudio (table Supabase "avis") ; à défaut, de la
// config. Le restaurateur y recopie ses vrais avis Google.
import Reveal from "../shared/Reveal.jsx";

export default function Reviews({ config }) {
  const { avis } = config;
  const items = avis?.items || [];
  if (items.length === 0) return null;

  return (
    <section id="avis" className="section savis">
      <h2 className="section__title section__title--center">{avis.titre}</h2>

      <div className="savis__grid">
        {items.map((item, i) => (
          // Le nom seul ne suffit pas comme clé : deux clients peuvent
          // s'appeler pareil, et les avis viennent désormais de la base.
          <Reveal key={`${item.nom}-${i}`} delay={i * 0.12}>
            <article className="savis__card">
              {item.note > 0 && (
                <p className="savis__stars" aria-label={`${item.note} sur 5`}>
                  <span aria-hidden="true">
                    {"★".repeat(item.note)}
                    <span className="savis__stars-empty">
                      {"★".repeat(Math.max(0, 5 - item.note))}
                    </span>
                  </span>
                </p>
              )}
              <p className="savis__text">« {item.texte} »</p>
              {item.nom && <p className="savis__name">— {item.nom}</p>}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
