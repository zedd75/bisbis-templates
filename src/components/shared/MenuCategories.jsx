// COMPOSANT PARTAGÉ (Essentiel + Signature)
// Affiche une liste de catégories -> plats { nom, desc?, prix? }.
// C'est la brique de base de tous les menus : on lui donne les
// données, il ne s'occupe que de l'affichage.
export default function MenuCategories({ categories }) {
  return (
    <div className="menu__grid">
      {categories.map((categorie) => (
        <div key={categorie.nom} className="menu__category">
          <h3 className="menu__category-title">{categorie.nom}</h3>
          <ul className="menu__list">
            {categorie.plats.map((plat) => (
              <li key={plat.nom} className="menu__item">
                <div className="menu__item-head">
                  <span className="menu__item-name">{plat.nom}</span>
                  <span className="menu__item-dots" />
                  {plat.prix && (
                    <span className="menu__item-price">{plat.prix}</span>
                  )}
                </div>
                {plat.desc && <p className="menu__item-desc">{plat.desc}</p>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
