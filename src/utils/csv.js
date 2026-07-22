// Parse un texte CSV en tableau de lignes (chaque ligne = tableau de
// champs). Gère les champs entre guillemets, les virgules à l'intérieur
// des guillemets, les guillemets échappés ("") et les retours à la ligne.
// C'est exactement le format qu'exporte Google Sheets.
export default function parseCsv(texte) {
  const lignes = [];
  let champ = "";
  let ligne = [];
  let dansGuillemets = false;
  const t = (texte || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (dansGuillemets) {
      if (c === '"') {
        if (t[i + 1] === '"') {
          champ += '"';
          i++; // guillemet échappé ""
        } else {
          dansGuillemets = false;
        }
      } else {
        champ += c;
      }
    } else if (c === '"') {
      dansGuillemets = true;
    } else if (c === ",") {
      ligne.push(champ);
      champ = "";
    } else if (c === "\n") {
      ligne.push(champ);
      lignes.push(ligne);
      champ = "";
      ligne = [];
    } else {
      champ += c;
    }
  }
  // Dernier champ / dernière ligne (si le fichier ne finit pas par \n)
  if (champ.length > 0 || ligne.length > 0) {
    ligne.push(champ);
    lignes.push(ligne);
  }
  return lignes;
}
