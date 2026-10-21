// null garde la configuration historique ; items:[] masque volontairement le bloc.
export function appliquerFormules(config, formules) {
  if (!formules?.fr) return config;
  const pourLangue = (langue) => {
    const fr = formules.fr;
    const trad = formules[langue];
    return {
      titre: trad?.titre || fr.titre,
      note: trad?.note || fr.note,
      items: fr.items.map((item, i) => ({
        nom: trad?.items?.[i]?.nom || item.nom,
        prix: item.prix,
      })),
    };
  };
  if (config.template === "signature") {
    return { ...config, menus: { ...config.menus, formules: pourLangue("fr") } };
  }
  if (config.template === "prestige") {
    return { ...config, contenu: Object.fromEntries(Object.entries(config.contenu).map(([langue, t]) => [langue, {
      ...t, carte: { ...t.carte, formules: pourLangue(langue) },
    }])) };
  }
  return config;
}
