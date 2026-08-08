// Pied de page Premium : nom, réseaux, mentions.
export default function PremiumFooter({ config }) {
  const annee = new Date().getFullYear();

  return (
    <footer className="pfooter">
      <span className="pfooter__brand">{config.nom}</span>

      <div className="pfooter__social">
        {config.reseaux.instagram && (
          <a href={config.reseaux.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        )}
        {config.reseaux.facebook && (
          <a href={config.reseaux.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        )}
      </div>

      {/* Obligation légale : accessibles depuis chaque page du site. */}
      <nav className="pfooter__legalliens">
        <a href="/mentions-legales">Mentions légales</a>
        <a href="/confidentialite">Confidentialité</a>
      </nav>

      <p className="pfooter__legal">
        © {annee} {config.nom}. Tous droits réservés
      </p>
    </footer>
  );
}
