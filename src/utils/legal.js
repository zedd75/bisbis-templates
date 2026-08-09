// Construit les données affichées par les pages légales, à partir de la
// config du client.
//
// Règle centrale : l'éditeur d'un site, c'est celui qui en publie le
// contenu. Pour un site VENDU, c'est le restaurateur — ses informations
// vivent dans son fichier de config. Pour une DÉMONSTRATION, il n'y a
// aucun restaurateur derrière : c'est celui qui met la démo en ligne.
import { EDITEUR_DEMO, HEBERGEUR } from "../config/legal.js";

// Un champ rempli = une chaîne non vide une fois détourée.
const rempli = (v) => typeof v === "string" && v.trim().length > 0;

// Recompose l'adresse de contact au moment de l'affichage.
// Deux formes acceptées :
//   - `email: "contact@exemple.fr"` : simple, l'adresse est en clair
//     dans le code.
//   - `courriel: { utilisateur, domaine }` : l'adresse n'existe nulle
//     part en entier avant l'exécution, ce qui la soustrait aux robots
//     collecteurs qui se contentent de lire du texte.
export function assemblerCourriel(editeur) {
  if (rempli(editeur?.email)) return editeur.email.trim();
  const c = editeur?.courriel;
  if (rempli(c?.utilisateur) && rempli(c?.domaine)) {
    return `${c.utilisateur.trim()}@${c.domaine.trim()}`;
  }
  return "";
}

export function donneesLegales(config) {
  const bloc = config?.legal;
  const editeur = bloc?.editeur || EDITEUR_DEMO;
  // Recomposée ici, à l'exécution : c'est le seul endroit où l'adresse
  // existe en entier.
  const email = assemblerCourriel(editeur);

  // Sans bloc `legal` nommé dans la config, le site est une démonstration.
  const estDemo = !rempli(bloc?.editeur?.nom);

  // Le SIRET fait basculer dans le régime professionnel, qui impose des
  // mentions supplémentaires (adresse, et RCS/capital/TVA pour une société).
  const estProfessionnel = rempli(editeur.siret);

  // Ce qui manque pour que la page soit réellement conforme. On préfère
  // l'afficher franchement plutôt que de publier une page qui a l'air en
  // règle sans l'être.
  const manquants = [];
  if (!rempli(editeur.nom)) manquants.push("le nom de l'éditeur");
  if (!rempli(email) && !rempli(editeur.telephone)) {
    manquants.push("un moyen de contact (courriel ou téléphone)");
  }
  if (estProfessionnel && !rempli(editeur.adresse)) {
    manquants.push("l'adresse de l'établissement");
  }

  return {
    estDemo,
    estProfessionnel,
    complet: manquants.length === 0,
    manquants,
    editeur: {
      ...editeur,
      email,
      // À défaut de directeur de la publication désigné, c'est l'éditeur.
      directeurPublication: rempli(editeur.directeurPublication)
        ? editeur.directeurPublication
        : editeur.nom,
    },
    hebergeur: HEBERGEUR,
    // Le restaurant concerné par le site, pour situer la page.
    restaurant: {
      nom: config?.nom || "",
      adresse: config?.infos?.adresse || "",
      telephone: config?.infos?.telephone || "",
    },
  };
}
