// TEMPLATE ESSENTIEL (offre Low Cost) : un site d'une seule page.
// Il assemble les sections dans l'ordre. Les sections "apropos" et
// "menu" peuvent être masquées via config.sections.
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import MenuSection from "../components/MenuSection.jsx";
import PracticalInfo from "../components/PracticalInfo.jsx";
import Footer from "../components/Footer.jsx";

export default function EssentielTemplate({ config }) {
  return (
    <>
      <Header config={config} />
      <main>
        <Hero config={config} />
        {config.sections.apropos && <About config={config} />}
        {config.sections.menu && <MenuSection config={config} />}
        <PracticalInfo config={config} />
      </main>
      <Footer config={config} />
    </>
  );
}
