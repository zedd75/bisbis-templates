import { describe, expect, it } from "vitest";
import { lireCollectionSupabase } from "./lectureSupabase.js";

const url = "https://example.test/rest/v1/plats?restaurant_id=eq.resto&select=id,nom&order=ordre,id";
function serveur(lignes, plafond = 1000, transformer = (_debut, r) => r) {
  return async (adresse) => {
    const q = new URL(adresse).searchParams;
    const debut = Number(q.get("offset") || 0);
    const taille = Math.min(Number(q.get("limit") || plafond), plafond);
    const data = lignes.slice(debut, debut + taille);
    return transformer(debut, new Response(JSON.stringify(data), {
      headers: { "content-range": `${data.length ? `${debut}-${debut + data.length - 1}` : "*"}/${lignes.length}` },
    }));
  };
}

describe("A02 : collections publiques completes", () => {
  it("lit les 1001 elements au lieu de tronquer la derniere page", async () => {
    const lignes = Array.from({ length: 1001 }, (_, i) => ({ id: i + 1, nom: `Plat ${i + 1}` }));
    const resultat = await lireCollectionSupabase(url, {}, serveur(lignes));
    expect(resultat).toHaveLength(1001);
    expect(resultat[1000].nom).toBe("Plat 1001");
  });
  it("supporte un plafond serveur plus petit que la page demandee", async () => {
    const resultat = await lireCollectionSupabase(url, {}, serveur([{ id: 1 }, { id: 2 }, { id: 3 }], 1));
    expect(resultat.map((r) => r.id)).toEqual([1, 2, 3]);
  });
  it("refuse une page manquante", async () => {
    const requete = serveur([{ id: 1 }, { id: 2 }], 1, (debut, r) => debut
      ? new Response("[]", { headers: { "content-range": "*/2" } }) : r);
    await expect(lireCollectionSupabase(url, {}, requete)).rejects.toThrow();
  });
  it("refuse un total absent", async () => {
    await expect(lireCollectionSupabase(url, {}, async () => new Response("[]"))).rejects.toThrow();
  });
  it("respecte une collection volontairement vide", async () => {
    expect(await lireCollectionSupabase(url, {}, serveur([]))).toEqual([]);
  });
  it("refuse un doublon entre deux pages", async () => {
    await expect(lireCollectionSupabase(url, {}, serveur([{ id: 1 }, { id: 1 }], 1))).rejects.toThrow();
  });

  it("refuse un melange de pages si la revision change sans changer le total", async () => {
    const revisions = [1, 2];
    let appelRevision = 0;
    const ancienne = [{ id: 1, nom: "Ancien 1" }, { id: 2, nom: "Ancien 2" }];
    const nouvelle = [{ id: 3, nom: "Nouveau 1" }, { id: 4, nom: "Nouveau 2" }];
    let appelsPages = 0;
    const requete = async (adresse) => {
      const debut = Number(new URL(adresse).searchParams.get("offset") || 0);
      const source = appelsPages++ === 0 ? ancienne : nouvelle;
      const data = source.slice(debut, debut + 1);
      return new Response(JSON.stringify(data), {
        headers: { "content-range": `${debut}-${debut}/2` },
      });
    };

    await expect(lireCollectionSupabase(
      url,
      {},
      requete,
      () => Promise.resolve(revisions[appelRevision++]),
    )).rejects.toThrow(/modifiee/);
  });

  it("demarre une lecture associee seulement apres la revision initiale", async () => {
    const ordre = [];
    let numeroRevision = 0;
    const resultat = await lireCollectionSupabase(
      url,
      {},
      serveur([{ id: 1, nom: "Plat stable" }]),
      async () => {
        ordre.push(numeroRevision++ === 0 ? "revision avant" : "revision apres");
        return 1;
      },
      async () => {
        ordre.push("metadonnees");
        return { notes: { Carte: "Fait maison" } };
      },
    );

    expect(resultat).toEqual({
      lignes: [{ id: 1, nom: "Plat stable" }],
      associe: { notes: { Carte: "Fait maison" } },
    });
    expect(ordre).toEqual(["revision avant", "metadonnees", "revision apres"]);
  });
});
