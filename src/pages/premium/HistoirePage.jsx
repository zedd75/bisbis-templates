// PAGE NOTRE HISTOIRE : en-tête + blocs storytelling alternés +
// citation du chef. Les blocs et le chef sont facultatifs : un site tout
// juste généré n'en a pas encore (voir utils/histoire.js).
import PageHeading from "../../components/premium/PageHeading.jsx";
import PremiumStory from "../../components/premium/PremiumStory.jsx";
import Reveal from "../../components/shared/Reveal.jsx";
import { blocsAffichables, chefAffichable } from "../../utils/histoire.js";

export default function HistoirePage({ config, t }) {
  const h = t.histoire;

  return (
    <section className="ppage phistoire">
      <PageHeading label={h.label} titre={h.titre} texte={h.chapo} />

      <PremiumStory
        blocs={blocsAffichables(h.blocs)}
        images={[config.images.story1, config.images.story2]}
      />

      {/* --- Citation du chef --- */}
      {chefAffichable(h.chef) && (
        <Reveal>
          <div className="pchef">
            <div className="pdivider">
              <span className="pdivider__line" />
              <span className="pdivider__diamond" />
              <span className="pdivider__line" />
            </div>
            {h.chef.texte && <p className="pchef__quote">{h.chef.texte}</p>}
            {h.chef.nom && <p className="pchef__name">{h.chef.nom}</p>}
            {h.chef.role && <p className="pchef__role">{h.chef.role}</p>}
          </div>
        </Reveal>
      )}
    </section>
  );
}
