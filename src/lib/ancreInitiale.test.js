import { describe, expect, it } from "vitest";
import { suivreAncreInitiale } from "./ancreInitiale.js";

// Le navigateur est injecté : on mesure la destination et l'arrêt du suivi,
// sans remplacer la logique de navigation ni installer un DOM artificiel.
function environnement(hash = "#menu") {
  const fenetre = new EventTarget();
  fenetre.location = { hash };
  const frames = new Map();
  let numero = 0, observer, position = 0, hauteurCible = 1500, presente = true;
  const mouvements = [];
  fenetre.requestAnimationFrame = (fn) => { frames.set(++numero, fn); return numero; };
  fenetre.cancelAnimationFrame = (id) => frames.delete(id);
  const cible = { scrollIntoView(options) { position = hauteurCible - 100; mouvements.push(options); } };
  const page = { body: {}, getElementById: (id) => presente && id === "menu" ? cible : null };
  class Observer {
    constructor(fn) { this.fn = fn; observer = this; }
    observe() { this.actif = true; }
    disconnect() { this.actif = false; }
  }
  return {
    deps: { fenetre, page, Observer }, mouvements,
    position: () => position,
    cible: (hauteur, existe = true) => { hauteurCible = hauteur; presente = existe; },
    redimensionner: () => { if (observer?.actif) observer.fn(); },
    evenement: (type) => fenetre.dispatchEvent(new Event(type)),
    afficher: () => { const enAttente = [...frames.values()]; frames.clear(); enAttente.forEach((fn) => fn()); },
  };
}

describe("arrivée directe sur une ancre", () => {
  it("rejoint la section après le montage, puis après un chargement qui la déplace", () => {
    const e = environnement();
    suivreAncreInitiale(e.deps);
    e.afficher();
    expect(e.position()).toBe(1400);
    e.cible(900);
    e.redimensionner();
    e.afficher();
    expect(e.position()).toBe(800);
    expect(e.mouvements.at(-1)).toEqual({ block: "start", behavior: "instant" });
  });

  it.each(["wheel", "touchstart", "pointerdown", "keydown", "hashchange"])(
    "ne ramène plus le visiteur après %s, même avec un recalage en attente", (type) => {
      const e = environnement();
      suivreAncreInitiale(e.deps);
      e.afficher();
      e.cible(900); e.redimensionner();
      e.evenement(type); e.afficher();
      e.redimensionner(); e.afficher();
      expect(e.position()).toBe(1400);
      expect(e.mouvements).toHaveLength(1);
    },
  );

  it("attend une section qui apparaît après le premier affichage", () => {
    const e = environnement(); e.cible(1500, false);
    suivreAncreInitiale(e.deps); e.afficher();
    expect(e.mouvements).toHaveLength(0);
    e.cible(1500); e.redimensionner(); e.afficher();
    expect(e.position()).toBe(1400);
  });

  it.each(["", "#", "#%E0%A4%A", "#absent"])("ne déplace pas la page pour %s", (hash) => {
    const e = environnement(hash);
    const arreter = suivreAncreInitiale(e.deps);
    e.afficher(); e.redimensionner(); e.afficher(); arreter();
    expect(e.mouvements).toHaveLength(0);
  });

  it("décode l'identifiant de l'ancre", () => {
    const e = environnement("#%6Denu");
    suivreAncreInitiale(e.deps); e.afficher();
    expect(e.position()).toBe(1400);
  });

  it("annule le suivi et la frame au démontage", () => {
    const e = environnement();
    const arreter = suivreAncreInitiale(e.deps);
    arreter(); arreter(); e.afficher(); e.redimensionner(); e.afficher();
    expect(e.mouvements).toHaveLength(0);
  });
});
