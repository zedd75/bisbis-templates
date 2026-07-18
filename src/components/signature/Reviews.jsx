// Avis clients (template Signature) : cartes avec note en étoiles.
// Les avis sont copiés manuellement dans la config (depuis Google).
import Reveal from "../shared/Reveal.jsx";

export default function Reviews({ config }) {
  const { avis } = config;

  return (
    <section id="avis" className="section savis">
      <h2 className="section__title section__title--center">{avis.titre}</h2>

      <div className="savis__grid">
        {avis.items.map((item, i) => (
          <Reveal key={item.nom} delay={i * 0.12}>
            <article className="savis__card">
              <p className="savis__stars" aria-label={`${item.note} sur 5`}>
                {"★".repeat(item.note)}
                <span className="savis__stars-empty">
                  {"★".repeat(5 - item.note)}
                </span>
              </p>
              <p className="savis__text">« {item.texte} »</p>
              <p className="savis__name">— {item.nom}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
