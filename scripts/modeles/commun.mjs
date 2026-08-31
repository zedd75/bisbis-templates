// Briques partagees par les trois modeles de config.
//
// Chaque modele exporte `construire(d)` et renvoie le CONTENU TEXTUEL du
// fichier de config. Le generateur se contente de l'ecrire sur le disque.
//
// `d` (les donnees collectees) contient :
//   nom, slug, restaurantId, slogan, adresse, telephone, email, instagram,
//   primaire, secondaire, fond

// Image de remplacement, aux couleurs du client : on voit tout de suite la
// mise en page sans attendre les vraies photos.
export function placeholder(d, texte, taille = "1600x900") {
  const p = d.primaire.replace("#", "");
  const f = d.fond.replace("#", "");
  return `https://placehold.co/${taille}/${p}/${f}?text=${encodeURIComponent(texte)}`;
}

export function mapsEmbed(adresse) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(adresse)}&output=embed`;
}

// En-tete commun a tous les fichiers generes.
export function entete(d, offre) {
  return `// ============================================================
//  CONFIG CLIENT — ${d.nom}  (offre ${offre})
//  Genere par : npm run nouveau-client
//
//  A PERSONNALISER : photos, textes, horaires.
//  La CARTE et les INFOS se pilotent depuis CometStudio : ce fichier
//  ne sert que de repli si la base est injoignable.
// ============================================================`;
}

// Le bloc horaires. Volontairement VIDE de valeurs plausibles : des horaires
// inventes qui restent en place sont pires qu'un champ manifestement a
// remplir. C'est le probleme rencontre sur les demos.
export function blocHoraires() {
  return `    horaires: [
      { jour: "Lundi", heures: "À renseigner" },
      { jour: "Mardi", heures: "À renseigner" },
      { jour: "Mercredi", heures: "À renseigner" },
      { jour: "Jeudi", heures: "À renseigner" },
      { jour: "Vendredi", heures: "À renseigner" },
      { jour: "Samedi", heures: "À renseigner" },
      { jour: "Dimanche", heures: "À renseigner" },
    ],`;
}

// Eclaircit une couleur hexadecimale (0 = inchange, 1 = blanc).
// Sert a fabriquer la variante sombre : la meme teinte, remontee en clarte
// pour rester lisible sur un fond fonce.
export function eclaircir(hex, facteur = 0.45) {
  const v = hex.replace("#", "");
  const n = v.length === 3 ? v.split("").map((c) => c + c).join("") : v;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  const melange = (c) => Math.round(c + (255 - c) * facteur);
  return (
    "#" +
    [melange(r), melange(g), melange(b)]
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")
  );
}

// Noir ou blanc, selon ce qui se lit le mieux SUR la couleur donnee.
// Repond au piege du "double role" : une couleur sert de fond de bouton ET
// de couleur de texte ; il faut declarer explicitement ce qu'on pose dessus.
export function surCouleur(hex) {
  const v = hex.replace("#", "");
  const n = v.length === 3 ? v.split("").map((c) => c + c).join("") : v;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  const lum = [r, g, b]
    .map((c) => c / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  const L = 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
  // contraste avec le blanc contre contraste avec le noir
  return (1.05) / (L + 0.05) >= (L + 0.05) / 0.05 ? "#ffffff" : "#1a1a1a";
}

// Bloc theme + variante sombre, commun a Essentiel et Signature.
// Prestige a son propre vocabulaire de couleurs (encre, or, creme...).
export function blocTheme(d) {
  return `  theme: {
    primaire: "${d.primaire}",
    surPrimaire: "${surCouleur(d.primaire)}",
    secondaire: "${d.secondaire}",
    fond: "${d.fond}",
    texte: "#2A2A2A",
    policeTitres: "'Playfair Display', serif",
    policeTexte: "'Inter', sans-serif",
  },

  // Apparence par defaut, et sa variante. Sans themeAlternatif, le bouton
  // clair/sombre du site existerait mais ne changerait RIEN.
  themeDefaut: "clair",
  themeAlternatif: {
    primaire: "${eclaircir(d.primaire)}",
    surPrimaire: "#1a1a1a",
    secondaire: "${eclaircir(d.secondaire, 0.25)}",
    fond: "#16130F",
    texte: "#F0E9DF",
    policeTitres: "'Playfair Display', serif",
    policeTexte: "'Inter', sans-serif",
  },`;
}

// Bloc infos + reseaux, commun a Essentiel et Signature.
export function blocInfos(d) {
  return `  infos: {
    adresse: "${d.adresse}",
    telephone: "${d.telephone}",
    email: "${d.email}",
${blocHoraires()}
    googleMapsEmbed: "${mapsEmbed(d.adresse)}",
  },

  reseaux: {
    instagram: "${d.instagram}",
    facebook: "",
  },`;
}
