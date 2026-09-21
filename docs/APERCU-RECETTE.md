# Aperçu intégré de recette

## Décision du 21 septembre 2026

Omar a autorisé l'accès public à **la seule adresse stable des vitrines
fictives** pour permettre leur affichage dans le CometStudio de recette.
L'exception Vercel porte sur :

`bisbis-templates-git-feat-is-d3f37c-zeddparispro-3146s-projects.vercel.app`

Les futurs déploiements sur cette adresse seront également publics. Ne jamais
y déployer de données privées. Le garde-fou de build interdit la base de
production en Preview. L'exception ne désactive ni la protection des autres
Previews ni celle de CometStudio. Aucun secret de contournement n'est utilisé.

## Pourquoi deux réglages ?

La connexion Vercel empêchait le chargement dans le cadre intégré. Après
l'exception, une seconde protection subsistait : `frame-ancestors` autorisait
uniquement le studio de production.

Dans `vercel.json`, deux règles exclusives (`has` / `missing`, hôte exact)
séparent les politiques : l'adresse de recette autorise uniquement son studio
de recette et elle-même ; les autres adresses gardent la politique antérieure.
Aucun joker `*.vercel.app`, aucune dépendance au Referer fourni par le visiteur,
aucune modification de la protection anti-intégration du studio.

## Vérification

Exécuter `node scripts/verifier-apercu-recette.mjs` après le déploiement.
Ce contrôle effectue uniquement des lectures HTTP sans authentification :
trois parcours de vitrine, politique d'intégration, base réellement compilée,
non-indexation, maintien de la connexion Vercel sur le studio et politique de
production inchangée. Il complète, sans remplacer, le test visuel du cadre
dans CometStudio avec la session administrateur de recette.

La vérification initiale a reproduit le refus d'intégration des trois parcours.
Un résultat de compilation réussi ne prouve pas que l'aperçu fonctionne.

Attention au cache après modification des seuls en-têtes : le 21 septembre,
le document gardait son ancien ETag. Vercel répondait 304 sans CSP et le
navigateur conservait son ancienne interdiction pour `/carte?client=doric`.
Les pages non visitées fonctionnaient déjà. Le marqueur de politique dans
`index.html` renouvelle le document (donc l'ETag) en même temps que la CSP.
Lors d'une future modification de cette politique, renouveler aussi ce
marqueur et tester avec l'ETag précédent, pas seulement avec un navigateur neuf.

## Retour arrière

Dans Vercel, projet **bisbis-templates**, Deployment Protection → Deployment
Protection Exceptions, retirer cette adresse rétablit la protection sur ses
déploiements actuels et futurs. L'aperçu intégré sera alors à nouveau bloqué.
La règle CSP peut être annulée séparément par un commit inverse ; ne pas
modifier la protection de tout le projet pour dépanner un seul aperçu.

Références :
- https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/deployment-protection-exceptions
- https://vercel.com/docs/project-configuration/vercel-json#headers
