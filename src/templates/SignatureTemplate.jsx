// TEMPLATE SIGNATURE (offre Middle) : one-page enrichi.
// = Tout l'Essentiel + galerie photos, menu interactif à onglets,
//   avis clients et animations d'apparition au défilement.
// Réutilise les composants de l'Essentiel (Hero, About, Infos,
// Footer) : seule la mise en scène change.
import SignatureHeader from "../components/signature/SignatureHeader.jsx";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Gallery from "../components/signature/Gallery.jsx";
import MenuTabs from "../components/signature/MenuTabs.jsx";
import Reviews from "../components/signature/Reviews.jsx";
import PracticalInfo from "../components/PracticalInfo.jsx";
import Footer from "../components/Footer.jsx";
import Reveal from "../components/shared/Reveal.jsx";
import "../styles/signature.css";

export default function SignatureTemplate({ config }) {
  return (
    <>
      <SignatureHeader config={config} />
      <main>
        <Hero config={config} />
        {config.sections.apropos && (
          <Reveal>
            <About config={config} />
          </Reveal>
        )}
        {config.sections.galerie && <Gallery config={config} />}
        {config.sections.menu && <MenuTabs config={config} />}
        {config.sections.avis && <Reviews config={config} />}
        <Reveal>
          <PracticalInfo config={config} />
        </Reveal>
      </main>
      <Footer config={config} />
    </>
  );
}
