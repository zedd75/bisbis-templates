// Menu interactif à onglets (template Signature) :
//  - bloc "Formules" optionnel (prix alignés à droite)
//  - onglets cliquables (La carte / Boissons / Vins...)
//  - les catégories du menu actif sont affichées via le composant
//    partagé MenuCategories (le même que l'Essentiel).
import { useState } from "react";
import MenuCategories from "../shared/MenuCategories.jsx";
import Reveal from "../shared/Reveal.jsx";

export default function MenuTabs({ config }) {
  const { menus } = config;
  const [actif, setActif] = useState(menus.onglets[0].id);
  const ongletActif =
    menus.onglets.find((o) => o.id === actif) || menus.onglets[0];

  return (
    <section id="menu" className="section smenu">
      <h2 className="section__title section__title--center">{menus.titre}</h2>

      {/* --- Formules (optionnel) --- */}
      {menus.formules && (
        <Reveal>
          <div className="sformules">
            <h3 className="sformules__title">{menus.formules.titre}</h3>
            <p className="sformules__note">{menus.formules.note}</p>
            <ul className="sformules__list">
              {menus.formules.items.map((f) => (
                <li key={f.nom}>
                  <span>{f.nom}</span>
                  <span className="sdots" />
                  <span className="sprix">{f.prix}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}

      {/* --- Onglets --- */}
      <div className="stabs">
        {menus.onglets.map((o) => (
          <button
            key={o.id}
            className={`stab ${o.id === actif ? "is-active" : ""}`}
            onClick={() => setActif(o.id)}
          >
            {o.nom}
          </button>
        ))}
      </div>

      {ongletActif.note && <p className="smenu__note">{ongletActif.note}</p>}

      <MenuCategories categories={ongletActif.categories} />
    </section>
  );
}
