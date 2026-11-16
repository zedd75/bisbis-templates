// Page « Notre histoire » : ce qui mérite d'être affiché.
//
// Un site tout juste généré n'a ni bloc d'histoire ni chef : ils se
// renseignent ensuite, depuis le back-office ou dans la config. La page doit
// donc vivre avec leur absence. Elle lisait le texte du chef sans vérifier
// qu'il existait, et un site généré affichait une page blanche.
const rempli = (v) => typeof v === "string" && v.trim() !== "";

// Les blocs qui ont au moins un titre ou un texte, dans l'ordre.
// Rend la liste d'origine quand rien n'est écarté.
export function blocsAffichables(blocs) {
  if (!Array.isArray(blocs)) return [];
  const gardes = blocs.filter((b) => b && typeof b === "object" && (rempli(b.titre) || rempli(b.texte)));
  return gardes.length === blocs.length ? blocs : gardes;
}

// Le chef s'affiche s'il a un nom ou une citation. Une fonction seule
// (« Chef de cuisine ») ne dit rien au visiteur.
export function chefAffichable(chef) {
  return !!chef && typeof chef === "object" && (rempli(chef.nom) || rempli(chef.texte));
}
