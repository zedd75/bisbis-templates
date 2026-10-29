// Le navigateur peut chercher l'ancre avant que React ait monté la section.
// Les photos et les données reçues ensuite peuvent encore la déplacer.
// On accompagne cette arrivée seulement jusqu'à la première interaction :
// un chargement tardif ne doit jamais ramener un visiteur qui a commencé à lire.
export function suivreAncreInitiale({ fenetre, page, Observer }) {
  let id;
  try {
    id = decodeURIComponent(fenetre.location.hash.slice(1));
  } catch {
    return () => {};
  }
  if (!id) return () => {};

  let actif = true;
  let frame = null;
  const interactions = ["wheel", "touchstart", "pointerdown", "keydown", "hashchange"];
  const observer = Observer ? new Observer(programmer) : null;

  function programmer() {
    if (!actif || frame !== null) return;
    frame = fenetre.requestAnimationFrame(() => {
      frame = null;
      if (!actif) return;
      // getElementById accepte l'identifiant tel quel, sans sélecteur CSS.
      // Le déplacement instantané conserve la marge d'ancre de la feuille CSS.
      page.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  function arreter() {
    actif = false;
    if (frame !== null) fenetre.cancelAnimationFrame(frame);
    frame = null;
    observer?.disconnect();
    for (const type of interactions) fenetre.removeEventListener(type, arreter, true);
    fenetre.removeEventListener("load", programmer, true);
  }

  for (const type of interactions) fenetre.addEventListener(type, arreter, { capture: true, passive: true });
  fenetre.addEventListener("load", programmer, true);
  observer?.observe(page.body);
  programmer();
  return arreter;
}
