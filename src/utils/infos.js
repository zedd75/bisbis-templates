// Applique les infos pratiques pilotées depuis CometStudio à la config.
//
// Deux points à connaître :
//
// 1. LES HORAIRES SONT UNE LISTE, PARTOUT.
//    La base les stocke en tableau [{ jour, heures }] et les trois
//    templates l'affichent tel quel. Prestige les écrasait sur une seule
//    ligne : les jours de fermeture y disparaissaient, alors que c'est
//    précisément ce qu'un client cherche à savoir.
//
// 2. LA CARTE SUIT L'ADRESSE.
//    L'URL de la carte n'est que l'adresse encodée. La stocker séparément
//    garantissait qu'un jour les deux divergent : un restaurant qui
//    déménage aurait corrigé son adresse et gardé l'ancienne carte. On la
//    déduit donc de l'adresse. Un champ de moins, une incohérence de moins.

// Adresse -> URL d'intégration Google Maps.
export function carteDepuisAdresse(adresse) {
  if (!adresse || !adresse.trim()) return "";
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    adresse.trim()
  )}&output=embed`;
}

export function appliquerInfos(config, infos) {
  if (!infos) return config;

  // La liste jour par jour est transmise TELLE QUELLE aux trois templates :
  // Prestige sait désormais l'afficher (il l'écrasait sur une ligne, ce qui
  // faisait disparaître les jours de fermeture).
  // Même règle pour les horaires : une liste vide volontaire est respectée,
  // seule une colonne absente rend la main à la config.
  const horaires = Array.isArray(infos.horaires)
    ? infos.horaires
    : config.infos?.horaires;

  // ABSENT n'est pas VIDE.
  //
  // Cette fonction remettait la valeur de la config dès qu'un champ était
  // vide en base. Un restaurateur qui effaçait son email voyait donc
  // réapparaître celui de la démonstration, en croyant l'avoir retiré. Sur
  // un vrai site, cela envoie de vrais clients vers un faux numéro ou une
  // fausse adresse : c'est pire qu'une absence.
  //
  // La règle est donc : la ligne existe, elle fait foi. Seule une colonne
  // jamais renseignée (null) laisse la place à la config. La lecture ratée,
  // elle, est déjà traitée plus haut — le hook renvoie `infos` absent, et
  // un site sans rien serait pire qu'un site un peu daté.
  const garde = (valeur, origine) => {
    if (valeur === null || valeur === undefined) return origine;
    return typeof valeur === "string" ? valeur.trim() : valeur;
  };

  const adresse = garde(infos.adresse, config.infos?.adresse);
  // Prestige lit le lien de réservation à la RACINE de la config
  // (PremiumNav, PremiumHero, PremiumCtaBand). Le poser uniquement dans
  // "infos" l'aurait laissé figé alors que le module propose de l'éditer.
  const reservationUrl = garde(infos.reservation_url, config.reservationUrl);

  return {
    ...config,
    reservationUrl,
    infos: {
      ...config.infos,
      adresse,
      telephone: garde(infos.telephone, config.infos?.telephone),
      email: garde(infos.email, config.infos?.email),
      reservationUrl,
      horaires,
      // Recalculée à partir de l'adresse retenue, jamais lue depuis la base.
      googleMapsEmbed:
        carteDepuisAdresse(adresse) || config.infos?.googleMapsEmbed || "",
    },
  };
}
