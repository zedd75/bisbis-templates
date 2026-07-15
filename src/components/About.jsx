// Section "À propos" : un texte de présentation + une photo.
export default function About({ config }) {
  const { apropos } = config;

  return (
    <section id="apropos" className="section about">
      <div className="about__text">
        <h2 className="section__title">{apropos.titre}</h2>
        <p>{apropos.texte}</p>
      </div>
      {apropos.image && (
        <div className="about__image">
          <img src={apropos.image} alt={apropos.titre} loading="lazy" />
        </div>
      )}
    </section>
  );
}
