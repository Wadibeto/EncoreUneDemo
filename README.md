# DuoTier

DuoTier est une application privée pour deux joueurs : tier lists collaboratives, catalogue d’environ 50 jeux et mode « Qui est-ce ? » persistant. Elle utilise Next.js 15, TypeScript, Tailwind CSS, Supabase (Auth, PostgreSQL, RLS, Realtime) et Zustand.

## Fonctionnalités

- Authentification e-mail/mot de passe et profils joueur.
- Dashboard avec création, reprise et invitation par code non séquentiel.
- Catalogue filtrable et CRUD réservé aux administrateurs.
- Tier list à 9 niveaux, zone « À classer », drag & drop optimiste, présence, Realtime, reset et exports JSON/PNG.
- « Qui est-ce ? » à deux : grille et notes privées, éliminations optimistes, tours, proposition, victoire, abandon et nouvelle manche.
- Sauvegarde PostgreSQL à chaque action et reprise après fermeture de la page.
- RLS sur toutes les données privées, opérations sensibles atomiques dans des fonctions PostgreSQL.

## Stack et architecture

```text
Navigateur (React 19)
  ├─ composants client : DnD, présence, optimistic UI, Zustand
  ├─ Supabase Realtime : événements filtrés et présence
  └─ Server Actions : validation Zod, création/jonction de sessions
          │
Next.js 15 App Router / middleware SSR Auth
          │
Supabase
  ├─ Auth + profils
  ├─ PostgreSQL + RLS
  ├─ RPC SECURITY DEFINER validées
  └─ Realtime PostgreSQL
```

Le `SUPABASE_SERVICE_ROLE_KEY` n’est pas utilisé par l’application. Toutes les requêtes applicatives passent avec l’identité de l’utilisateur et restent soumises aux politiques RLS. Ne placez jamais une service role key dans une variable `NEXT_PUBLIC_*`.

### Protection du jeu secret

Le secret n’est pas une colonne de `guess_players`. Il réside dans `guess_player_secrets`, avec une politique `SELECT` limitée à `user_id = auth.uid()`. L’adversaire peut lire le profil et l’état public du joueur, jamais sa ligne secrète. `make_guess` compare la proposition au secret dans PostgreSQL et ne renvoie qu’un booléen. Les fonctions sensibles fixent un `search_path` vide, contrôlent l’appartenance à la session et ne donnent aucune donnée secrète au client adverse.

### Arborescence

```text
.
├─ app/
│  ├─ actions/sessions.ts
│  ├─ auth/confirm/route.ts
│  ├─ dashboard/page.tsx
│  ├─ games/{actions.ts,game-manager.tsx,page.tsx}
│  ├─ guess/[id]/page.tsx
│  ├─ join/[code]/page.tsx
│  ├─ login/{actions.ts,auth-form.tsx,page.tsx}
│  ├─ tierlists/[id]/page.tsx
│  ├─ globals.css, layout.tsx, loading.tsx, not-found.tsx, page.tsx
├─ components/
│  ├─ ui/{button,card,confirm-dialog,dialog,input,textarea}.tsx
│  ├─ app-header.tsx, app-shell.tsx, create-session-modal.tsx
│  ├─ empty-state.tsx, game-card.tsx, guess-game-card.tsx
│  ├─ guess-grid.tsx, guess-session.tsx, invite-code.tsx
│  ├─ join-session-modal.tsx, loading-state.tsx, logo.tsx
│  ├─ player-badge.tsx, session-card.tsx, tier-board.tsx, tier-row.tsx
├─ lib/
│  ├─ supabase/{client,env,middleware,server}.ts
│  ├─ constants.ts, types.ts, utils.ts
├─ stores/tier-board-store.ts
├─ supabase/
│  ├─ migrations/001_initial_schema.sql
│  ├─ migrations/002_tier_operations.sql
│  ├─ migrations/003_api_grants.sql
│  ├─ config.toml
│  └─ seed.sql
├─ .env.example, .eslintrc.json, middleware.ts, next.config.ts
├─ package.json, tailwind.config.ts, tsconfig.json
└─ README.md
```

## Installation locale rapide

Prérequis : Node.js 20 LTS ou 22 LTS, npm, Docker Desktop et Supabase CLI.

```bash
git clone <url-du-repo>
cd EncoreUneDemo
npm install
npx supabase start
npx supabase db reset
```

`db reset` applique les deux migrations puis `supabase/seed.sql`. Récupérez ensuite les clés locales :

```bash
npx supabase status
```

Créez `.env.local` à partir de `.env.example` :

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key affichée par supabase status>
```

Lancez l’application :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000), créez deux comptes dans deux profils de navigateur, puis partagez un code `T-…` ou `G-…`.

Par défaut, la confirmation e-mail est désactivée dans la configuration locale. Elle peut être activée dans `supabase/config.toml` avec `enable_confirmations = true`.

## Mise en place avec un projet Supabase hébergé

1. Créez un projet sur Supabase et conservez son project ref.
2. Installez/connectez la CLI :

   ```bash
   npx supabase login
   npx supabase link --project-ref <project-ref>
   npx supabase db push
   ```

3. Chargez le seed dans **SQL Editor** en copiant `supabase/seed.sql`. Une autre option est d’utiliser `psql` avec l’URL PostgreSQL du projet :

   ```bash
   psql "<DATABASE_URL>" -f supabase/seed.sql
   ```

4. Dans **Authentication → URL Configuration**, définissez :

   - Site URL : `http://localhost:3000` en développement, puis l’URL Vercel en production.
   - Redirect URLs : `http://localhost:3000/auth/confirm` et `https://votre-domaine.vercel.app/auth/confirm`.

5. Dans **Authentication → Providers → Email**, activez Email/Password et choisissez si la confirmation d’e-mail est obligatoire.
6. Vérifiez dans **Database → Replication** que les tables ajoutées à `supabase_realtime` par la migration sont actives : `tier_list_items`, `tier_list_members`, `guess_sessions`, `guess_players` et `guess_player_secrets`.
7. Copiez l’URL du projet et l’`anon key` dans `.env.local`.

### Promouvoir le premier administrateur

Après son inscription, exécutez cette requête une fois dans SQL Editor :

```sql
update public.profiles
set is_admin = true
where id = (select id from auth.users where email = 'votre-email@exemple.fr');
```

Les utilisateurs ordinaires ne peuvent pas modifier `is_admin` : RLS et les permissions de colonne l’interdisent.

## Commandes npm

```bash
npm run dev        # serveur local avec Turbopack
npm run typecheck  # vérification TypeScript sans émission
npm run lint       # ESLint Next.js
npm run build      # build de production
npm run start      # exécute le build de production
```

Validation recommandée avant chaque déploiement :

```bash
npm run typecheck
npm run build
```

## Déploiement Vercel

1. Poussez le dépôt sur GitHub, GitLab ou Bitbucket.
2. Dans Vercel, choisissez **Add New → Project**, importez le dépôt et conservez le preset Next.js.
3. Ajoutez pour Production, Preview et Development :

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. N’ajoutez `SUPABASE_SERVICE_ROLE_KEY` que si une future fonction strictement serveur en a réellement besoin. Le code livré n’en dépend pas.
5. Déployez, copiez l’URL Vercel dans les URL autorisées Supabase, puis redéployez si nécessaire.
6. Testez avec deux comptes : inscription/connexion, code d’invitation, déplacement Realtime, secret non lisible depuis le second compte et reprise après rechargement.

Commande alternative avec la CLI Vercel :

```bash
npx vercel
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel --prod
```

## Modèle de données

- `profiles` : pseudo, avatar et rôle admin.
- `games` : catalogue modifiable et tags indexés en GIN.
- `tier_lists`, `tier_list_members`, `tier_list_items` : propriété, membres et classement.
- `guess_sessions`, `guess_players` : état public de la partie et participants.
- `guess_player_secrets` : secrets isolés par joueur.
- `guess_eliminations`, `guess_notes` : données privées par joueur.

Les codes utilisent 8 caractères issus d’un alphabet sans caractères ambigus, générés via `crypto.randomInt`, préfixés par le type de session (`T-` ou `G-`) et protégés par une contrainte d’unicité. Les RPC de création/jonction sont atomiques et une session refuse un troisième membre.

## Performance et synchronisation

- Les cartes de jeux sont mémoïsées et les images utilisent `next/image`.
- Le board ne conserve dans Zustand que ses items, sans état global massif.
- Le déplacement et les éliminations sont optimistes ; la base confirme ensuite l’opération.
- Le réordonnancement est envoyé en un seul payload JSON et exécuté dans une transaction PostgreSQL.
- Les événements Realtime déclenchent une recharge courte et débouncée de la tier list, évitant les rafales de rendu.
- Chaque effet Realtime supprime explicitement son channel au démontage.
- Les notes privées sont sauvegardées après 500 ms d’inactivité.

## Modifier le seed

Éditez simplement `supabase/seed.sql`. Le seed fait un `ON CONFLICT (title) DO UPDATE`, il peut donc être rejoué sans dupliquer les titres. Pour réinitialiser la base locale :

```bash
npx supabase db reset
```

Les images d’exemple utilisent le CDN Steam. `GameCard` affiche un fallback si une image n’est plus disponible.
