export async function lireVersionStable(lireRevision, lireContenu) {
  const avant = await lireRevision();
  if (!Number.isSafeInteger(avant) || avant < 1) throw new Error("Revision de lecture invalide.");
  const contenu = await lireContenu();
  const apres = await lireRevision();
  if (apres !== avant) throw new Error("Lecture modifiee pendant le chargement.");
  return contenu;
}

export async function lireCollectionSupabase(url, options, requete = fetch, lireRevision, lireAssocie) {
  const lirePages = async () => {
    const lignes = [];
    const ids = new Set();
    let total;
    do {
      const page = new URL(url);
      page.searchParams.set("offset", lignes.length);
      page.searchParams.set("limit", "500");
      const headers = new Headers(options?.headers);
      headers.set("Prefer", "count=exact");
      const reponse = await requete(page.href, { ...options, headers });
      if (!reponse.ok) throw new Error("HTTP " + reponse.status);
      const plage = reponse.headers.get("content-range") || "";
      const nombre = /\/(\d+)$/.exec(plage);
      const count = nombre ? Number(nombre[1]) : NaN;
      const data = await reponse.json();
      if (!Array.isArray(data) || !Number.isSafeInteger(count)
        || (total !== undefined && total !== count)) throw new Error("Lecture incomplete ou modifiee.");
      total = count;
      for (const ligne of data) {
        if (ligne.id == null || ids.has(ligne.id)) throw new Error("Pagination incoherente.");
        ids.add(ligne.id);
        lignes.push(ligne);
      }
      if (lignes.length > total || (!data.length && lignes.length < total)) throw new Error("Lecture tronquee.");
    } while (lignes.length < total);
    return lignes;
  };
  const lireContenu = lireAssocie
    ? async () => {
      const [lignes, associe] = await Promise.all([lirePages(), lireAssocie()]);
      return { lignes, associe };
    }
    : lirePages;
  return lireRevision ? lireVersionStable(lireRevision, lireContenu) : lireContenu();
}
