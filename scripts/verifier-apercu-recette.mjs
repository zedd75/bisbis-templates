// Controle HTTP reel, sans cookie, compte ni secret. Aucun appel d'ecriture.
// A lancer apres un deploiement : node scripts/verifier-apercu-recette.mjs
import assert from 'node:assert/strict';

const vitrine = 'https://bisbis-templates-git-feat-is-d3f37c-zeddparispro-3146s-projects.vercel.app';
const studio = 'https://comet-studio-git-feat-invita-e9b15a-zeddparispro-3146s-projects.vercel.app';
const erreurs = [];

async function verifier(nom, controle) {
  try {
    await controle();
    console.log(`OK : ${nom}`);
  } catch (erreur) {
    erreurs.push(nom);
    console.error(`ECHEC : ${nom} — ${erreur.message}`);
  }
}

async function lire(url) {
  return fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
}

for (const chemin of ['/?client=bistrot', '/?client=palma', '/carte?client=doric']) {
  await verifier(`integration recette ${chemin}`, async () => {
    const reponse = await lire(vitrine + chemin);
    assert.equal(reponse.status, 200, 'la vitrine fictive doit etre accessible sans authentification Vercel');
    assert.equal(reponse.headers.get('content-security-policy'), `frame-ancestors 'self' ${studio}`,
      'seul le studio de recette doit pouvoir integrer cette adresse');
    assert.equal(reponse.headers.get('x-frame-options'), null, 'pas de seconde regle contradictoire');
    assert.equal(reponse.headers.get('x-content-type-options'), 'nosniff');
    assert.match(reponse.headers.get('x-robots-tag') || '', /noindex/, 'la recette ne doit pas etre indexee');
  });
}

await verifier('la vitrine utilise exclusivement la base de recette', async () => {
  const reponse = await lire(`${vitrine}/comet-environnement.json`);
  assert.equal(reponse.status, 200);
  assert.equal((await reponse.json()).url, 'https://dajymftnsdvbxzbenqnc.supabase.co');
});

await verifier('la protection Vercel du studio reste active', async () => {
  const reponse = await lire(studio);
  assert.equal(reponse.status, 302, 'le studio doit rediriger le visiteur anonyme vers Vercel');
  const destination = new URL(reponse.headers.get('location'));
  assert.equal(destination.origin, 'https://vercel.com');
  assert.equal(destination.pathname, '/sso-api');
});

await verifier('la vitrine de production conserve sa politique', async () => {
  const reponse = await lire('https://bisbis-templates.vercel.app/');
  assert.equal(reponse.status, 200);
  assert.equal(reponse.headers.get('content-security-policy'), "frame-ancestors 'self' https://comet-studio.vercel.app");
});

if (erreurs.length) process.exitCode = 1;
