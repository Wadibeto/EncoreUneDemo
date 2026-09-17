# Installation de la galerie collaborative

Le code de cette version attend les migrations `supabase/migrations/006_character_tier_lists.sql` et `007_settings_business_conflict.sql`, après les migrations 001 à 005. Ces fichiers ne modifient pas automatiquement la base Supabase hébergée.

## Mise en service

1. Vérifier que les migrations 001 à 005 sont déjà appliquées sur le projet Supabase utilisé par Vercel. Sauvegarder la base selon la procédure habituelle du projet.
2. Exécuter **tout** le fichier `006_character_tier_lists.sql`, puis `007_settings_business_conflict.sql`, dans l’éditeur SQL du projet Supabase, ou utiliser le déploiement de migrations Supabase déjà configuré pour ce projet. Si la migration 006 est déjà appliquée, appliquer uniquement 007. Chaque fichier utilise une transaction : une erreur annule l’ensemble de cette migration.
3. Déployer cette version de l’application après la migration. Aucun nouveau secret ni aucune nouvelle variable d’environnement ne sont nécessaires. Conserver `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` existantes.
4. Ouvrir une ancienne liste de jeux, créer une galerie de personnages, et vérifier l’invitation avec deux comptes. Tester un déplacement, un changement de visuel, le renommage d’une ligne et sa suppression. Les deux fenêtres doivent converger vers la même configuration et les mêmes cartes.

La migration conserve les listes de jeux, leurs classements et leurs membres. Les tables et règles du mode « Qui est-ce ? » ne sont pas modifiées. Le déclencheur d’ajout d’un jeu ne remplit désormais que les listes de catégorie `games`.

## Données et droits

- `tier_lists.category` vaut `games` ou `characters`; `catalog_filter` vaut `all`, `crown-gambit` ou `sovereign-tower`.
- `tier_lists.revision` est un entier incrémenté pour chaque modification du titre ou des lignes. Les déplacements et changements de visuel ne le modifient pas.
- Une entrée possède soit `game_id`, soit le couple `character_id` / `variant_id`, jamais les deux. Une contrainte interdit les doublons d’un personnage dans une liste.
- `character_catalog` et `character_variants` ne contiennent que l’autorisation des identifiants. Les descriptions, sources, crédits et images sont définis dans `lib/character-catalog.ts`. Les utilisateurs connectés peuvent lire ces tables mais pas les modifier.
- Les créations et changements de variante vérifient cette liste d’identifiants côté PostgreSQL, même si un client contourne l’interface ou l’action serveur.
- Les modifications d’un classement sont réservées aux membres. Les deux membres peuvent personnaliser les lignes et le titre. L’invitation reste limitée à deux comptes. Les droits de suppression d’une liste restent réservés à son propriétaire.
- Les modifications directes du titre depuis l’API sont retirées pour imposer les contrôles de révision. Les anciennes fonctions `create_tier_list`, `update_tier_config`, `reorder_tier_items` et `reset_tier_list` restent disponibles; le nouveau client utilise les opérations plus précises ci-dessous.

## Contrat des fonctions SQL

| Fonction | Paramètres | Résultat et comportement |
| --- | --- | --- |
| `create_character_tier_list` | `p_title text`, `p_invite_code text`, `p_catalog_filter text`, `p_characters jsonb` | Retourne l’UUID. Le JSON contient des objets `{character_id, variant_id}` issus du catalogue serveur; les identifiants, doublons et univers sont vérifiés en base. |
| `move_tier_item` | `p_list_id uuid`, `p_item_id uuid`, `p_target_tier text`, `p_before_item_id uuid = null` | Déplace une carte avant l’ancre ou en fin de ligne. Si l’ancre a quitté cette ligne, ajoute à la fin. Recalcule les positions sur les données courantes. |
| `set_tier_item_variant` | `p_list_id uuid`, `p_item_id uuid`, `p_variant_id text` | Enregistre le visuel partagé d’un personnage, après validation de son appartenance à ce personnage. |
| `update_tier_settings` | `p_list_id uuid`, `p_title text`, `p_config jsonb`, `p_expected_revision integer` | Retourne la nouvelle révision. Un conflit renvoie le code PostgreSQL `P0001` (HTTP 400), avec le message `Settings changed. Reload before saving.`, et exige de recharger la configuration avant d’enregistrer. |
| `reset_tier_list` | `p_list_id uuid` | Renvoie toutes les cartes dans la réserve, sans modifier le titre, les lignes ni les variantes choisies. |

Les lignes utilisent des clés stables distinctes des noms affichés : 1 à 20 lignes classées et exactement une réserve `unranked`. Les clés acceptent 1 à 40 lettres/chiffres/tirets/underscores et commencent par une lettre ou un chiffre. Les noms comportent 1 à 32 caractères après suppression des espaces de bord. Les couleurs sont au format `#RRGGBB`. La réserve est toujours placée en dernier. Supprimer une ligne renvoie ses cartes dans la réserve dans la même transaction.

Toutes les opérations de classement prennent un verrou sur la liste, dans le même ordre, avant de modifier les cartes. Le nouveau client envoie une intention de déplacement plutôt qu’un instantané complet : deux déplacements portant sur des cartes différentes ne réécrivent pas le travail de l’autre. Le dernier déplacement validé d’une même carte gagne. La fonction historique `reorder_tier_items` reste une opération en lot et n’offre pas cette protection contre les instantanés périmés; ne pas l’utiliser dans un nouveau client.

Les événements Supabase Realtime concernent `tier_lists` et `tier_list_items`, déjà publiées par les migrations précédentes. La migration confirme leur présence dans `supabase_realtime`. Le client doit relire l’état après un événement ou une reconnexion; les événements d’une transaction ne sont pas un instantané complet.

La migration 007 corrige le code d’erreur des éditions périmées. `40001` signale une erreur de sérialisation transitoire et peut provoquer une boucle de transactions dans PostgREST 14; ce code ne doit pas être utilisé pour un conflit métier définitif. Le code `P0001` renvoie immédiatement l’erreur au client. Si un appel lancé avant la correction tourne encore, identifier le processus concerné dans les journaux PostgreSQL et `pg_stat_activity` avant de l’arrêter; modifier la fonction ne termine pas les appels déjà en cours. Voir la [procédure Supabase sur les boucles SQLSTATE 40001](https://supabase.com/docs/guides/troubleshooting/high-cpu-and-infinite-transaction-retries-when-using-custom-error-codes-in-rpc-functions-77326b).

## Faire évoluer le catalogue

Ajouter les données et illustrations sourcées dans `lib/character-catalog.ts`, puis créer une nouvelle migration d’insertion pour les identifiants de `character_catalog` et `character_variants`. Ne pas modifier rétroactivement la migration 006 une fois appliquée. Conserver les anciens identifiants pour préserver les listes existantes. Un nouveau personnage sera proposé à la création d’une nouvelle liste; il n’est pas ajouté automatiquement aux galeries déjà commencées.

## Vérification PostgreSQL isolée

Le test `supabase/tests/character-tier-lists.mjs` charge les sept migrations dans PostgreSQL embarqué PGlite. Il prépare des comptes fictifs, imite `auth.uid()` et n’utilise aucun fichier `.env`, aucune connexion au projet hébergé et aucune donnée personnelle. Il vérifie explicitement que les conflits de révision renvoient `P0001`.

```powershell
npm install --prefix work/sql-verification --no-audit --no-fund @electric-sql/pglite
node supabase/tests/character-tier-lists.mjs work/sql-verification/node_modules/@electric-sql/pglite/dist/index.js
```

Le test couvre la conservation des listes antérieures et d’une partie « Qui est-ce ? » active, la création filtrée, les permissions et RLS, les tentatives d’injection d’identifiants, les déplacements, les variantes, les lignes personnalisées, les conflits de révision, les suppressions de lignes et les remises à zéro. Il compare aussi les identifiants des personnages et de leurs vues entre le catalogue TypeScript et la migration SQL. PGlite fournit `gen_random_uuid()` en standard; seule l’instruction facultative `create extension pgcrypto` est ignorée dans ce test. Il ne remplace pas une vérification à deux navigateurs des abonnements Realtime de l’instance Supabase.
