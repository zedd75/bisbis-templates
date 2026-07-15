// PAGE ACCUEIL : hero + bande d'appel + infos pratiques.
import PremiumHero from "../../components/premium/PremiumHero.jsx";
import PremiumCtaBand from "../../components/premium/PremiumCtaBand.jsx";
import PremiumInfo from "../../components/premium/PremiumInfo.jsx";

export default function AccueilPage({ config, t }) {
  return (
    <>
      <PremiumHero config={config} t={t} />
      <PremiumCtaBand config={config} t={t} />
      <PremiumInfo config={config} t={t} />
    </>
  );
}
