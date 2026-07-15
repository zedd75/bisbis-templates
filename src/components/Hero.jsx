// Grande image d'accueil plein écran avec le nom, le slogan et 2 boutons.
export default function Hero({ config }) {
  const tel = config.infos.telephone.replace(/\s/g, "");

  return (
    <section
      id="hero"
      className="hero"
      style={{ backgroundImage: `url(${config.hero.image})` }}
    >
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__title">{config.hero.titre}</h1>
        <p className="hero__subtitle">{config.hero.sousTitre}</p>
        <div className="hero__actions">
          <a href="#menu" className="btn btn--primary">
            Voir la carte
          </a>
          <a href={`tel:${tel}`} className="btn btn--outline">
            Réserver une table
          </a>
        </div>
      </div>
    </section>
  );
}
