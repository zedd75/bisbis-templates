// Pied de page + barre d'appel fixe visible uniquement sur mobile.
export default function Footer({ config }) {
  const tel = config.infos.telephone.replace(/\s/g, "");
  const annee = new Date().getFullYear();

  return (
    <>
      <footer className="footer">
        <div className="footer__inner">
          <span className="footer__brand">{config.nom}</span>

          <div className="footer__social">
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

          {/* Obligation légale : ces pages doivent être accessibles depuis
              chaque page du site. Liens classiques (pas de navigation
              interne) : App.jsx lit le chemin au chargement. */}
          <nav className="footer__legalliens">
            <a href="/mentions-legales">Mentions légales</a>
            <a href="/confidentialite">Confidentialité</a>
          </nav>

          <p className="footer__legal">
            © {annee} {config.nom}. Tous droits réservés
          </p>
        </div>
      </footer>

      {/* Barre d'appel fixe : n'apparaît que sur mobile (voir theme.css) */}
      <a href={`tel:${tel}`} className="mobile-call-bar">
        📞 Appeler le restaurant
      </a>
    </>
  );
}
