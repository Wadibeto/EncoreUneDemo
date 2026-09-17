/** Isolated PostgreSQL checks. Never reads .env or connects to hosted Supabase.
 * npm install --prefix work/sql-verification --no-save @electric-sql/pglite
 * node supabase/tests/character-tier-lists.mjs work/sql-verification/node_modules/@electric-sql/pglite/dist/index.js
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const { PGlite } = await import(process.argv[2]
  ? pathToFileURL(resolve(process.argv[2])).href
  : "@electric-sql/pglite");
const db = new PGlite();
const owner = "11111111-1111-4111-8111-111111111111";
const member = "22222222-2222-4222-8222-222222222222";
const outsider = "33333333-3333-4333-8333-333333333333";
let assertions = 0;
function check(actual, expected) { assert.deepEqual(actual, expected); assertions += 1; }
async function query(sql, args = []) { return (await db.query(sql, args)).rows; }
async function scalar(sql, args = []) { return Object.values((await query(sql, args))[0])[0]; }
async function denied(sql, args, pattern) {
  await assert.rejects(() => query(sql, args), pattern);
  assertions += 1;
}
async function asUser(id, role = "authenticated") {
  await db.exec("reset role");
  await query("select set_config('request.jwt.claim.sub', $1, false)", [id]);
  await db.exec(`set role ${role}`);
}
async function apply(name) {
  let sql = await readFile(new URL(`../migrations/${name}`, import.meta.url), "utf8");
  // PGlite exposes PostgreSQL's built-in gen_random_uuid, but not the optional
  // pgcrypto package. This is the only production SQL statement skipped.
  sql = sql.replace("create extension if not exists pgcrypto;", "");
  await db.exec(sql);
}
try {
  await db.exec(`
    create role anon;
    create role authenticated;
    create schema auth;
    create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to authenticated, anon;
    grant execute on function auth.uid() to authenticated, anon;
    create publication supabase_realtime;
  `);
  for (const file of ["001_initial_schema.sql", "002_tier_operations.sql", "003_api_grants.sql", "004_tier_customization.sql", "005_replace_games_catalog.sql"]) await apply(file);
  await query("insert into auth.users(id,email,raw_user_meta_data) values ($1,'owner@example.test','{}'),($2,'member@example.test','{}'),($3,'outsider@example.test','{}')", [owner, member, outsider]);
  await asUser(owner);
  const gameList = await scalar("select public.create_tier_list('Original games', 'T-ABCDEFGH')");
  const originalGameIds = await query("select id,game_id from public.tier_list_items where tier_list_id=$1 order by id", [gameList]);
  const guessSession = await scalar("select public.create_guess_session('Original Guess Who', 'G-ABCDEFGH')");
  await asUser(member);
  await query("select public.join_guess_session('G-ABCDEFGH')");
  await asUser(owner);
  await query("select public.start_guess_round($1)", [guessSession]);
  const originalSecret = await query("select secret_game_id, round from public.guess_player_secrets where session_id=$1", [guessSession]);
  await db.exec("reset role");
  await apply("006_character_tier_lists.sql");
  await apply("007_settings_business_conflict.sql");
  await asUser(owner);
  check(await query("select id,game_id from public.tier_list_items where tier_list_id=$1 order by id", [gameList]), originalGameIds);
  check(await scalar("select category from public.tier_lists where id=$1", [gameList]), "games");
  const freshGameList = await scalar("select public.create_tier_list('New games', 'T-23456789')");
  check(await scalar("select category from public.tier_lists where id=$1", [freshGameList]), "games");
  check(await scalar("select count(*)::int from public.tier_list_items where tier_list_id=$1", [freshGameList]), originalGameIds.length);
  check(await query("select secret_game_id, round from public.guess_player_secrets where session_id=$1", [guessSession]), originalSecret);
  check(await scalar("select status from public.guess_sessions where id=$1", [guessSession]), "active");
  await query("select public.pass_guess_turn($1)", [guessSession]);
  check(await scalar("select current_turn from public.guess_sessions where id=$1", [guessSession]), member);

  const catalogue = await query("select c.id,c.game,array_agg(v.id order by v.id) variants from public.character_catalog c join public.character_variants v on v.character_id=c.id group by c.id,c.game order by c.id");
  assert(catalogue.length > 1, "Migration must seed the verified character catalogue");
  assertions += 1;
  const catalogueSource = await readFile(new URL("../../lib/character-catalog.ts", import.meta.url), "utf8");
  const catalogueJs = ts.transpileModule(catalogueSource, {compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022}}).outputText;
  const { CHARACTERS } = await import(`data:text/javascript;base64,${Buffer.from(catalogueJs).toString("base64")}`);
  check(catalogue, CHARACTERS.map((c) => ({id:c.id, game:c.game, variants:c.variants.map((v)=>v.id).sort()})).sort((a,b)=>a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const payload = catalogue.map((c) => ({ character_id: c.id, variant_id: c.variants[0] }));
  const board = await scalar("select public.create_character_tier_list($1,$2,$3,$4)", ["Armures", "T-JKLMNPQR", "all", JSON.stringify(payload)]);
  const items = await query("select * from public.tier_list_items where tier_list_id=$1 order by position", [board]);
  check(items.length, payload.length);
  check(items.every((i) => i.game_id === null && i.character_id !== null && i.variant_id !== null), true);
  await denied("select public.create_character_tier_list($1,$2,$3,$4)", ["Invalid", "T-STUVWXYZ", "all", JSON.stringify([{character_id:"forged",variant_id:"fake"}])], /Unknown character/);
  await denied("select public.create_character_tier_list($1,$2,$3,$4)", ["Invalid", "T-STUVWXYZ", "all", JSON.stringify([payload[0],payload[0]])], /Duplicate character/);
  const filteredGame = catalogue[0].game;
  const wrongGame = catalogue.find((c) => c.game !== filteredGame);
  assert(wrongGame, "Both game catalogues must be populated");
  await denied("select public.create_character_tier_list($1,$2,$3,$4)", ["Invalid", "T-STUVWXYZ", filteredGame, JSON.stringify([{character_id:wrongGame.id,variant_id:wrongGame.variants[0]}])], /Unknown character/);
  const filteredPayload = payload.filter((p) => catalogue.find((c) => c.id === p.character_id).game === filteredGame);
  const filtered = await scalar("select public.create_character_tier_list($1,$2,$3,$4)", ["Un univers", "T-STUVWXYZ", filteredGame, JSON.stringify(filteredPayload)]);
  check(await scalar("select count(*)::int from public.tier_list_items where tier_list_id=$1", [filtered]), filteredPayload.length);

  await asUser(member);
  check(await scalar("select public.join_tier_list('T-JKLMNPQR')"), board);
  await asUser(outsider);
  check(await scalar("select count(*)::int from public.tier_lists where id=$1", [board]), 0);
  await denied("select public.join_tier_list('T-JKLMNPQR')", [], /full/);
  await denied("select public.move_tier_item($1,$2,'S')", [board, items[0].id], /Not a member/);
  await denied("select public.set_tier_item_variant($1,$2,$3)", [board, items[0].id,items[0].variant_id], /Not a member/);
  await denied("select public.reset_tier_list($1)", [board], /Not a member/);
  await denied("select public.update_tier_settings($1,'Intrusion','[]',0)", [board], /Not a member/);
  await asUser(owner);
  await denied("update public.tier_lists set title='Bypass' where id=$1", [board], /permission denied/);
  await denied("update public.tier_list_items set tier='S' where id=$1", [items[0].id], /permission denied/);
  await denied("insert into public.character_catalog(id,game) values ('forged','crown-gambit')", [], /permission denied/);

  // Moves operate on current database order, never a stale full-board snapshot.
  await query("select public.move_tier_item($1,$2,'S')", [board,items[0].id]);
  await asUser(member);
  await query("select public.move_tier_item($1,$2,'A')", [board,items[1].id]);
  check(await scalar("select tier from public.tier_list_items where id=$1", [items[0].id]), "S");
  await query("select public.move_tier_item($1,$2,'S',$3)", [board,items[1].id,items[0].id]);
  check((await query("select id from public.tier_list_items where tier_list_id=$1 and tier='S' order by position", [board])).map((i)=>i.id), [items[1].id,items[0].id]);
  await query("select public.move_tier_item($1,$2,'A',$3)", [board,items[0].id,items[1].id]);
  check(await scalar("select tier from public.tier_list_items where id=$1", [items[0].id]), "A");
  await denied("select public.move_tier_item($1,$2,'missing')", [board,items[0].id], /Unknown target/);
  await denied("select public.move_tier_item($1,$2,'S')", [board,originalGameIds[0].id], /Unknown tier item/);
  await denied("select public.set_tier_item_variant($1,$2,'forged')", [board,items[0].id], /Unknown character variant/);
  const multi = catalogue.find((c) => c.variants.length > 1);
  if (multi) {
    const item = items.find((i) => i.character_id === multi.id);
    await query("select public.set_tier_item_variant($1,$2,$3)", [board,item.id,multi.variants[1]]);
    check(await scalar("select variant_id from public.tier_list_items where id=$1", [item.id]), multi.variants[1]);
  }

  const config = [{key:"favorite",label:"  Favoris  ",color:"#AaBBcC"},{key:"unranked",label:"Réserve",color:"#28343d"}];
  check(await scalar("select public.update_tier_settings($1,$2,$3,0)", [board,"Notre galerie",JSON.stringify(config)]),1);
  check(await scalar("select count(*)::int from public.tier_list_items where tier_list_id=$1 and tier<>'unranked'", [board]),0);
  check(await scalar("select tier_config->0->>'label' from public.tier_lists where id=$1", [board]),"Favoris");
  check(await scalar("select tier_config->0->>'color' from public.tier_lists where id=$1", [board]),"#aabbcc");
  await denied("select public.update_tier_settings($1,$2,$3,0)", [board,"Stale",JSON.stringify(config)], {code:"P0001",message:/Settings changed/});
  check(await scalar("select title from public.tier_lists where id=$1", [board]),"Notre galerie");
  for (const bad of [null,[],[config[0]], [{...config[0],key:"unranked"},config[1]], [{...config[0],label:null},config[1]], [{...config[0],color:"red"},config[1]], [{...config[0],key:"bad key"},config[1]], [...Array.from({length:21},(_,i)=>({...config[0],key:`tier${i}`})),config[1]]]) {
    await denied("select public.update_tier_settings($1,$2,$3,1)", [board,"Invalid",JSON.stringify(bad)], /Invalid|Duplicate|Use between/);
  }
  await query("select public.move_tier_item($1,$2,'favorite')", [board,items[0].id]);
  check(await scalar("select revision from public.tier_lists where id=$1", [board]),1);
  await query("select public.update_tier_config($1,$2)", [board,JSON.stringify(config)]);
  check(await scalar("select revision from public.tier_lists where id=$1", [board]),2);
  await query("select public.reorder_tier_items($1,$2)", [board,JSON.stringify([{id:items[1].id,tier:"favorite",position:1}])]);
  check(await scalar("select tier from public.tier_list_items where id=$1", [items[1].id]),"favorite");
  await query("select public.reset_tier_list($1)", [board]);
  check(await scalar("select count(*)::int from public.tier_list_items where tier_list_id=$1 and tier<>'unranked'", [board]),0);
  check(await scalar("select count(distinct position)::int from public.tier_list_items where tier_list_id=$1", [board]),items.length);

  // The original game board still supports the same operations. Adding a game
  // must affect game lists only; character count is stable.
  await asUser(owner);
  await query("select public.move_tier_item($1,$2,'S')", [gameList,originalGameIds[0].id]);
  await query("select public.reset_tier_list($1)", [gameList]);
  await db.exec("reset role");
  await query("insert into public.games(title) values ('Migration verification fixture')");
  check(await scalar("select count(*)::int from public.tier_list_items where tier_list_id=$1", [gameList]),originalGameIds.length+1);
  check(await scalar("select count(*)::int from public.tier_list_items where tier_list_id=$1", [board]),items.length);
  await denied("insert into public.tier_list_items(tier_list_id,game_id) select $1,id from public.games limit 1", [board], /does not match/);
  await asUser("", "anon");
  await denied("select public.create_character_tier_list('No','T-23456789','all','[]')", [], /permission denied/);
  await denied("select public.move_tier_item($1,$2,'S')", [board,items[0].id], /permission denied/);
  console.log(`PASS: ${assertions} PostgreSQL assertions; migration compatibility, RLS, authorization, custom tiers, variants, revision conflicts, ordering, and resets.`);
} finally {
  await db.close();
}
