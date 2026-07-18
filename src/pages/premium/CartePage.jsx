// PAGE CARTE (structure inspirée d'Auteuil Brasserie) :
//  - un bloc "Formules déjeuner" (prix alignés à droite)
//  - des onglets pour changer de menu (La carte / Brunch)
//  - chaque menu = catégories -> plats (nom, description, prix)
//  - chaque catégorie a une ancre (#a-partager...) : le menu déroulant
//    de la nav y amène directement, en activant le bon onglet
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageHeading from "../../components/premium/PageHeading.jsx";
import Reveal from "../../components/shared/Reveal.jsx";
import slugify from "../../utils/slugify.js";

export default function CartePage({ t }) {
  const { carte } = t;
  const location = useLocation();
  const [actif, setActif] = useState(carte.onglets[0].id);
  const ongletActif =
    carte.onglets.find((o) => o.id === actif) || carte.onglets[0];

  // Réagit à l'ancre dans l'URL (ex: /carte#currys-grillades ou /carte#brunch)
  useEffect(() => {
    const ancre = decodeURIComponent(location.hash.replace("#", ""));
    if (!ancre) return;

    // 1) L'ancre est-elle un menu entier (ex: brunch) ? -> on l'active
    const menuVise = carte.onglets.find((o) => o.id === ancre);
    if (menuVise) {
      setActif(menuVise.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 2) Sinon c'est une catégorie : on active son menu, puis on défile
    const menuParent = carte.onglets.find((o) =>
      o.categories.some((cat) => slugify(cat.nom) === ancre)
    );
    if (menuParent) setActif(menuParent.id);

    // Petit délai : on laisse React afficher la section avant de défiler
    const minuteur = setTimeout(() => {
      const cible = document.getElementById(ancre);
      if (cible) cible.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(minuteur);
  }, [location.hash, carte]);

  return (
    <section className="ppage pcarte">
      <PageHeading label={carte.label} titre={carte.titre} texte={carte.texte} />

      {/* --- Formules déjeuner --- */}
      <Reveal>
        <div className="pformules">
          <h2 className="pformules__title">{carte.formules.titre}</h2>
          <p className="pformules__note">{carte.formules.note}</p>
          <ul className="pformules__list">
            {carte.formules.items.map((f) => (
              <li key={f.nom}>
                <span>{f.nom}</span>
                <span className="pdots" />
                <span className="por">{f.prix}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* --- Onglets de menus --- */}
      <div className="pcarte__tabs">
        {carte.onglets.map((o) => (
          <button
            key={o.id}
            className={`pcarte__tab ${o.id === actif ? "is-active" : ""}`}
            onClick={() => setActif(o.id)}
          >
            {o.nom}
          </button>
        ))}
      </div>

      {ongletActif.note && <p className="pcarte__note">{ongletActif.note}</p>}

      {/* --- Catégories et plats du menu actif --- */}
      <div className="pcarte__menu">
        {ongletActif.categories.map((cat) => (
          <div key={cat.nom} id={slugify(cat.nom)} className="pcat">
            <h3 className="pcat__title">{cat.nom}</h3>
            <ul className="pcat__list">
              {cat.plats.map((p) => (
                <li key={p.nom} className="pdish">
                  <div className="pdish__head">
                    <span className="pdish__name">{p.nom}</span>
                    <span className="pdots" />
                    {p.prix && <span className="pdish__price por">{p.prix}</span>}
                  </div>
                  {p.desc && <p className="pdish__desc">{p.desc}</p>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
