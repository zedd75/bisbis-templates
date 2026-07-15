// Infos pratiques : horaires, coordonnées cliquables et carte Google.
export default function PracticalInfo({ config }) {
  const { infos } = config;
  const tel = infos.telephone.replace(/\s/g, "");

  return (
    <section id="infos" className="section infos">
      <h2 className="section__title section__title--center">Nous trouver</h2>

      <div className="infos__grid">
        <div className="infos__details">
          <h3 className="infos__subtitle">Horaires</h3>
          <ul className="infos__hours">
            {infos.horaires.map((h) => (
              <li key={h.jour}>
                <span>{h.jour}</span>
                <span>{h.heures}</span>
              </li>
            ))}
          </ul>

          <h3 className="infos__subtitle">Coordonnées</h3>
          <p>{infos.adresse}</p>
          <p>
            <a href={`tel:${tel}`}>{infos.telephone}</a>
          </p>
          {infos.email && (
            <p>
              <a href={`mailto:${infos.email}`}>{infos.email}</a>
            </p>
          )}
        </div>

        {infos.googleMapsEmbed && (
          <div className="infos__map">
            <iframe
              title="Localisation du restaurant"
              src={infos.googleMapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </section>
  );
}
