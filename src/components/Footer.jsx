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

          <p className="footer__legal">
            © {annee} {config.nom} — Tous droits réservés
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
