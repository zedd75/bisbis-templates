// PAGE LÉGALE — partagée par les 3 templates.
// Rendue par App.jsx À LA PLACE du template quand l'URL est
// /mentions-legales ou /confidentialite. Elle hérite des variables de
// thème du site, donc elle s'habille aux couleurs du client.
//
// ⚠️ Trames rédigées avec soin mais NON validées par un juriste.
// À faire relire avant le premier client payant.
import { useEffect } from "react";
import { STOCKAGES } from "../../config/legal.js";
import { donneesLegales } from "../../utils/legal.js";

// Ligne « intitulé : valeur », masquée si la valeur est vide.
function Ligne({ label, children }) {
  if (!children) return null;
  return (
    <p className="legal__ligne">
      <span className="legal__label">{label}</span>
      <span className="legal__valeur">{children}</span>
    </p>
  );
}

export default function PageLegale({ config, page, mode, onChangerTheme }) {
  const d = donneesLegales(config);
  const estMentions = page !== "confidentialite";
  const titre = estMentions ? "Mentions légales" : "Politique de confidentialité";

  useEffect(() => {
    document.title = `${titre} — ${d.restaurant.nom}`;
  }, [titre, d.restaurant.nom]);

  return (
    <div className="legal">
      <header className="legal__tete">
        <a className="legal__retour" href="/">
          ← Retour au site
        </a>
        {onChangerTheme && (
          <button
            className="legal__theme"
            onClick={() => onChangerTheme(mode === "sombre" ? "clair" : "sombre")}
          >
            {mode === "sombre" ? "Passer en mode clair" : "Passer en mode sombre"}
          </button>
        )}
      </header>

      <main className="legal__corps">
        <h1 className="legal__titre">{titre}</h1>

        {d.estDemo && (
          <p className="legal__encart">
            <strong>Site de démonstration.</strong> {d.restaurant.nom} est un
            établissement <strong>fictif</strong>. Ce site présente un modèle de
            site vitrine ; aucun des textes, plats, photos ou avis affichés ne
            correspond à un restaurant réel.
          </p>
        )}

        {!d.complet && (
          <p className="legal__alerte">
            <strong>Mentions incomplètes.</strong> Il manque :{" "}
            {d.manquants.join(", ")}. À compléter dans{" "}
            <code>src/config/legal.js</code> avant toute mise en ligne
            publique.
          </p>
        )}

        {estMentions ? (
          <>
            <section className="legal__bloc">
              <h2>Éditeur du site</h2>
              <Ligne label="Nom">{d.editeur.nom}</Ligne>
              <Ligne label="Forme juridique">{d.editeur.formeJuridique}</Ligne>
              <Ligne label="Adresse">{d.editeur.adresse}</Ligne>
              <Ligne label="Courriel">
                {d.editeur.email && (
                  <a href={`mailto:${d.editeur.email}`}>{d.editeur.email}</a>
                )}
              </Ligne>
              <Ligne label="Téléphone">{d.editeur.telephone}</Ligne>
              <Ligne label="SIRET">{d.editeur.siret}</Ligne>
              <Ligne label="RCS">{d.editeur.rcs}</Ligne>
              <Ligne label="Capital social">{d.editeur.capital}</Ligne>
              <Ligne label="TVA intracommunautaire">{d.editeur.tva}</Ligne>
              {!d.estProfessionnel && d.editeur.nom && (
                <p className="legal__note">
                  L'éditeur agit en qualité de personne physique non
                  professionnelle. À ce titre, la publication de son adresse
                  n'est pas requise.
                </p>
              )}
            </section>

            <section className="legal__bloc">
              <h2>Directeur de la publication</h2>
              <Ligne label="Responsable">{d.editeur.directeurPublication}</Ligne>
            </section>

            <section className="legal__bloc">
              <h2>Hébergeur</h2>
              <Ligne label="Société">{d.hebergeur.nom}</Ligne>
              <Ligne label="Adresse">{d.hebergeur.adresse}</Ligne>
              <Ligne label="Site">
                <a href={d.hebergeur.site} target="_blank" rel="noreferrer">
                  {d.hebergeur.site}
                </a>
              </Ligne>
            </section>

            <section className="legal__bloc">
              <h2>Propriété intellectuelle</h2>
              <p>
                L'ensemble des contenus de ce site (textes, images, mise en
                page) est protégé par le droit d'auteur. Toute reproduction,
                même partielle, est interdite sans autorisation écrite
                préalable de l'éditeur.
              </p>
            </section>

            <section className="legal__bloc">
              <h2>Signaler un contenu</h2>
              <p>
                Pour toute demande de rectification ou signalement de contenu,
                écrivez à l'adresse de contact indiquée ci-dessus. Une réponse
                vous sera apportée dans les meilleurs délais.
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="legal__bloc">
              <h2>Responsable du traitement</h2>
              <Ligne label="Nom">{d.editeur.nom}</Ligne>
              <Ligne label="Courriel">
                {d.editeur.email && (
                  <a href={`mailto:${d.editeur.email}`}>{d.editeur.email}</a>
                )}
              </Ligne>
            </section>

            <section className="legal__bloc">
              <h2>Quelles données sont collectées&nbsp;?</h2>
              <p>
                <strong>Aucune donnée personnelle n'est collectée par ce
                site.</strong> Il ne comporte ni formulaire, ni création de
                compte, ni inscription à une lettre d'information, ni mesure
                d'audience.
              </p>
              <p>
                Si vous nous contactez par téléphone ou par courriel, les
                informations que vous transmettez servent uniquement à vous
                répondre et ne sont ni conservées ni réutilisées à d'autres
                fins.
              </p>
            </section>

            <section className="legal__bloc">
              <h2>Ce qui est stocké dans votre navigateur</h2>
              <p>
                Aucun cookie publicitaire, aucun traceur, aucun outil de
                statistiques. Seuls les stockages ci-dessous sont utilisés, et
                ils sont strictement nécessaires au fonctionnement du site —
                ils ne permettent pas de vous identifier.
              </p>
              <ul className="legal__liste">
                {STOCKAGES.map((s) => (
                  <li key={s.nom}>
                    <strong>{s.nom}</strong> ({s.type}) — {s.role}{" "}
                    <em>{s.duree}.</em>
                  </li>
                ))}
              </ul>
            </section>

            <section className="legal__bloc">
              <h2>Services tiers</h2>
              <p>
                La page « nous trouver » affiche une carte fournie par{" "}
                <strong>Google Maps</strong>. Lorsque cette carte se charge,
                Google reçoit votre adresse IP et peut déposer ses propres
                cookies, sur lesquels ce site n'a pas la main. Consultez la{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                >
                  politique de confidentialité de Google
                </a>{" "}
                pour en connaître le détail.
              </p>
              <p>
                Le site est hébergé par <strong>{d.hebergeur.nom}</strong>, qui
                conserve des journaux techniques de connexion à des fins de
                sécurité et de bon fonctionnement.
              </p>
            </section>

            <section className="legal__bloc">
              <h2>Vos droits</h2>
              <p>
                Vous disposez d'un droit d'accès, de rectification,
                d'effacement et d'opposition sur les données vous concernant.
                Pour l'exercer, écrivez à l'adresse de contact ci-dessus. Vous
                pouvez également introduire une réclamation auprès de la{" "}
                <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
                  CNIL
                </a>
                .
              </p>
            </section>
          </>
        )}

        <nav className="legal__liens">
          <a href={estMentions ? "/confidentialite" : "/mentions-legales"}>
            {estMentions ? "Politique de confidentialité" : "Mentions légales"}
          </a>
          <a href="/">Retour au site</a>
        </nav>
      </main>
    </div>
  );
}
