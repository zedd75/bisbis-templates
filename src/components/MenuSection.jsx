// La carte (template Essentiel) : titre + catégories -> plats.
// L'affichage des catégories est délégué au composant partagé
// MenuCategories (aussi utilisé par le template Signature).
import MenuCategories from "./shared/MenuCategories.jsx";

export default function MenuSection({ config }) {
  const { menu } = config;

  return (
    <section id="menu" className="section menu">
      <h2 className="section__title section__title--center">{menu.titre}</h2>
      <MenuCategories categories={menu.categories} />
    </section>
  );
}
