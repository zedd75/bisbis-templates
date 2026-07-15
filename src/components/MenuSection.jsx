// La carte : parcourt les catégories du menu et affiche chaque plat + prix.
export default function MenuSection({ config }) {
  const { menu } = config;

  return (
    <section id="menu" className="section menu">
      <h2 className="section__title section__title--center">{menu.titre}</h2>

      <div className="menu__grid">
        {menu.categories.map((categorie) => (
          <div key={categorie.nom} className="menu__category">
            <h3 className="menu__category-title">{categorie.nom}</h3>
            <ul className="menu__list">
              {categorie.plats.map((plat) => (
                <li key={plat.nom} className="menu__item">
                  <div className="menu__item-head">
                    <span className="menu__item-name">{plat.nom}</span>
                    <span className="menu__item-dots" />
                    <span className="menu__item-price">{plat.prix}</span>
                  </div>
                  {plat.description && (
                    <p className="menu__item-desc">{plat.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
