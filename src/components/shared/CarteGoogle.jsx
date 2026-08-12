// CARTE GOOGLE — chargée seulement si le visiteur le demande.
//
// Pourquoi : une carte Google encastrée contacte les serveurs de Google dès
// l'ouverture de la page. Google reçoit alors l'adresse IP du visiteur et peut
// déposer ses cookies, même si personne ne regarde le plan. Ce n'est pas un
// stockage « strictement nécessaire » : en toute rigueur, il faudrait un
// bandeau de consentement.
//
// En ne chargeant la carte qu'au clic, on renverse la logique : rien n'est
// envoyé à Google tant que le visiteur n'a pas choisi. Le site reste donc sans
// aucun traceur au chargement — ce qui est un argument de vente, pas seulement
// une mise en conformité.
//
// L'aperçu est un plan STYLISÉ dessiné sur place, pas une capture. Il n'y a
// donc aucun fichier à produire par client, et il prend automatiquement les
// couleurs du site. Ce n'est pas une vue réelle du quartier, c'est un décor
// qui annonce une carte.
import { useState } from "react";

// Plan schématique : quelques axes, deux pâtés de maisons, un repère au
// centre. Purement décoratif, donc masqué aux lecteurs d'écran.
function PlanStylise() {
  return (
    <svg
      className="cartepreview__plan"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {/* Pâtés de maisons */}
      <g className="cartepreview__blocs">
        <rect x="28" y="34" width="104" height="72" rx="4" />
        <rect x="264" y="24" width="112" height="86" rx="4" />
        <rect x="40" y="192" width="128" height="80" rx="4" />
        <rect x="286" y="204" width="90" height="70" rx="4" />
      </g>
      {/* Axes */}
      <g className="cartepreview__rues">
        <path d="M0 148 H400" strokeWidth="10" />
        <path d="M206 0 V300" strokeWidth="8" />
        <path d="M0 34 H400" strokeWidth="3" />
        <path d="M0 262 H400" strokeWidth="3" />
        <path d="M92 0 V300" strokeWidth="3" />
        <path d="M330 0 V300" strokeWidth="3" />
        <path d="M206 148 L330 34" strokeWidth="4" />
      </g>
    </svg>
  );
}

// Repère de localisation. Volontairement SÉPARÉ du plan : place dans le
// dessin, il finissait caché derrière la fiche d'adresse dès que le
// conteneur se rétrécissait. Positionné en CSS dans un coin, il reste
// toujours dégagé, quelle que soit la largeur.
function Repere() {
  return (
    <svg
      className="cartepreview__repere"
      viewBox="0 0 60 60"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="30" cy="30" r="26" className="cartepreview__halo" />
      <path d="M30 14 c-8 0 -14 6 -14 14 c0 10 14 24 14 24 s14 -14 14 -24 c0 -8 -6 -14 -14 -14 z" />
      <circle cx="30" cy="28" r="5" className="cartepreview__pointe" />
    </svg>
  );
}

export default function CarteGoogle({ embedUrl, adresse, classe = "" }) {
  const [affichee, setAffichee] = useState(false);
  if (!embedUrl) return null;

  const lienExterne = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    adresse || ""
  )}`;

  if (affichee) {
    return (
      <div className={classe}>
        <iframe
          title="Localisation du restaurant"
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  return (
    <div className={classe}>
      <div className="cartepreview">
        <PlanStylise />
        <Repere />
        <div className="cartepreview__contenu">
          <p className="cartepreview__adresse">{adresse}</p>
          <button
            type="button"
            className="cartepreview__bouton"
            onClick={() => setAffichee(true)}
          >
            Afficher le plan
          </button>
          <a
            className="cartepreview__lien"
            href={lienExterne}
            target="_blank"
            rel="noreferrer"
          >
            Ouvrir dans Google Maps
          </a>
          <p className="cartepreview__note">
            Le plan est fourni par Google. Il n'est chargé que si vous le
            demandez, pour qu'aucune donnée ne parte sans votre accord.
          </p>
        </div>
      </div>
    </div>
  );
}
