// PAGE ACCUEIL : hero + bande d'appel + avis + infos pratiques.
import PremiumHero from "../../components/premium/PremiumHero.jsx";
import PremiumCtaBand from "../../components/premium/PremiumCtaBand.jsx";
import PremiumAvis from "../../components/premium/PremiumAvis.jsx";
import PremiumInfo from "../../components/premium/PremiumInfo.jsx";

export default function AccueilPage({ config, t }) {
  return (
    <>
      <PremiumHero config={config} t={t} />
      <PremiumCtaBand config={config} t={t} />
      {config.sections?.avis && <PremiumAvis config={config} t={t} />}
      <PremiumInfo config={config} t={t} />
    </>
  );
}
