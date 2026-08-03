-- Synchronize the hosted catalogue with JeuxMathis.txt.
-- Removed games are deleted from the catalogue. Guess sessions whose secret used a
-- removed game are deleted first to satisfy the restrict foreign key.
drop table if exists pg_temp.sync_games_catalog;

create temp table sync_games_catalog (
  title text primary key,
  cover_url text,
  release_year int,
  genre text,
  tags text[] not null,
  description text
);

insert into sync_games_catalog (title, cover_url, release_year, genre, tags, description) values
('Monster Hunter Wilds', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2246340/header.jpg?t=1781071959', 2025, 'Action RPG', array['action','rpg','chasse'], 'Chasse aux monstres dans un monde ouvert avec arsenal massif et creatures imposantes.'),
('Absolum', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1904480/65f868078425ea29b87cb85075fcd1b3a8b71400/header.jpg?t=1782461798', 2025, 'Beat them up', array['action','coop','roguelite'], 'Beat them up fantasy nerveux avec progression de run et combats en equipe.'),
('Baladins', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1866320/header.jpg?t=1747989779', 2024, 'RPG narratif', array['aventure','coop','narratif'], 'Aventure de role legere ou les choix du groupe font avancer une histoire coloree.'),
('Before Your Eyes', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1082430/header.jpg?t=1785351860', 2021, 'Aventure narrative', array['solo','narratif','emotion'], 'Recit interactif qui parcourt une vie a travers des souvenirs et des choix intimes.'),
('Bread & Fred', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1607680/header.jpg?t=1773071421', 2023, 'Plateforme', array['coop','physique','difficile'], 'Deux grimpeurs relies progressent ensemble dans une ascension tres punitive.'),
('Dangerous Mountain Together', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3955660/bcdbe736d1fe4849853c2bf9608f59c471fd6fcd/header.jpg?t=1778141488', 2026, 'Simulation', array['coop','conduite','physique'], 'Conduite chaotique en montagne avec vehicules relies et entraide obligatoire.'),
('Don''t Panic! It is Just Turbulence', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4187140/c4a129e4e5c32ab8933eec6045b92d550754da40/header.jpg?t=1780587338', 2026, 'Puzzle', array['coop','communication','avion'], 'Un pilote et un controleur doivent communiquer vite pour sauver un avion en panne.'),
('Keep Talking and Nobody Explodes', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/341800/header.jpg?t=1699020889', 2015, 'Puzzle', array['coop','communication','bombe'], 'Desamorcage asymetrique ou un joueur voit la bombe et les autres lisent le manuel.'),
('REANIMAL', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2129530/4cdda917a0155258a2e7909d7869f35d8f980f96/header.jpg?t=1784646020', 2026, 'Horreur', array['coop','horreur','aventure'], 'Aventure horrifique sombre centree sur deux enfants face a des creatures inquietantes.'),
('Risk of Rain 2', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/632360/header.jpg?t=1783621122', 2020, 'Roguelite', array['coop','action','loot'], 'Roguelite 3D ou chaque run empile objets, ennemis et boss de plus en plus dangereux.'),
('RV There Yet?', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3949040/cae24b4ed7f4531be51f0d63f785b7d253f92dc3/header.jpg?t=1778071815', 2025, 'Aventure', array['coop','conduite','physique'], 'Road trip cooperatif en camping-car avec routes improvisees et accidents constants.'),
('The Dark Queen of Mortholme', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3587610/53fc20436572df147c0deedf6065f6916c64e7aa/header.jpg?t=1785280788', 2025, 'Indie', array['solo','boss','narratif'], 'Conte sombre inverse autour d une reine finale qui affronte un heros obstine.'),
('No, I''m not a Human', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3180070/fadebc14211b17b5a6603926612ead9294cad9ce/header.jpg?t=1782490040', 2025, 'Simulation', array['horreur','deduction','survie'], 'Horreur paranoiaque ou il faut identifier qui est humain avant d ouvrir la porte.'),
('Until Then', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1574820/header.jpg?t=1781809421', 2024, 'Visual novel', array['solo','narratif','pixel art'], 'Recit adolescent melancolique entre quotidien, messages et evenement inexplicable.'),
('We Were Here Expeditions: The FriendShip', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2296990/header.jpg?t=1764331912', 2023, 'Puzzle', array['coop','communication','enigmes'], 'Episode court de puzzles asymetriques pour tester la communication du duo.'),
('We Were Here Forever', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1341290/header.jpg?t=1764331788', 2022, 'Puzzle', array['coop','communication','enigmes'], 'Grande aventure cooperative dans Castle Rock avec enigmes separees et radios.'),
('Buckshot Roulette', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2835570/header.jpg?t=1783085442', 2024, 'Simulation', array['horreur','strategie','risque'], 'Duel tendu autour d un fusil, d objets et de probabilites mortelles.'),
('Crashout Crew', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3583210/9eb7862ff717a04dcc02123ce1e773a3e1c226af/header.jpg?t=1781802315', 2026, 'Party game', array['multijoueur','chaos','coop'], 'Jeu multijoueur de chaos social ou la coordination tient rarement longtemps.'),
('Gamble With Your Friends', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3892270/395e6d7972474333a698b26f8aa5597bf38109a1/header.jpg?t=1784926504', 2026, 'Simulation', array['multijoueur','casino','party'], 'Mini-jeux de pari entre amis avec bluff, hasard et retournements rapides.'),
('Lethal Company', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1966720/header.jpg?t=1775380053', 2023, 'Horreur', array['coop','horreur','extraction'], 'Recuperation de ferraille sur des lunes hostiles ou le quota compte plus que la securite.'),
('PHOGS!', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/850320/header.jpg?t=1741171193', 2020, 'Puzzle', array['coop','physique','plateforme'], 'Deux tetes reliees par un meme corps explorent des mondes remplis d enigmes physiques.'),
('Rosalie', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4268470/05816436f069511cf57ad5e156923a298ca0226d/header.jpg?t=1784909777', 2026, 'Action-aventure', array['indie','aventure','action'], 'Aventure independante coloree avec exploration, action et progression accessible.'),
('SWORN', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1763250/header.jpg?t=1780480778', 2025, 'Roguelite', array['action','coop','rpg'], 'Action roguelite dans une legende arthurienne corrompue, jouable seul ou en equipe.'),
('Thick As Thieves', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3341000/1bb597a16a8b245b9849e8d14368d99ad46e3e24/header.jpg?t=1782401957', 2026, 'Infiltration', array['multijoueur','stealth','vol'], 'Simulation de cambriolage competitif ou chaque voleur cherche le meilleur coup.'),
('Fears to Fathom', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1671340/header.jpg?t=1761626927', 2021, 'Horreur', array['solo','horreur','psychologique'], 'Anthologie d horreur psychologique inspiree de temoignages et de situations ordinaires.'),
('ROUTINE', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/606160/ebdc630cc5e78005f5912721bca3a70bdc620a7e/header.jpg?t=1780562819', 2025, 'Horreur', array['solo','science-fiction','survie'], 'Horreur de science-fiction dans une base lunaire retro-futuriste devenue silencieuse.'),
('YAPYAP', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3834090/399b7aa5bd9ea359e6d77cec3032758ea27c597b/header.jpg?t=1784273304', 2026, 'Action', array['multijoueur','chaos','party'], 'Action multijoueur compacte faite pour les cris, les coups bas et les manches rapides.'),
('BAPBAP', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2226280/02658c8c0de61231dbdd4044ee58cb8cbc947607/header.jpg?t=1775195204', 2025, 'Battle royale', array['multijoueur','action','free to play'], 'Battle royale en arene avec heros lisibles, combats rapides et equipes improvisees.'),
('Super Battle Golf', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4069520/89e942c838b6cb0bb0c2127c113a86c59d6ce92f/header_alt_assets_1.jpg?t=1784798117', 2026, 'Sport', array['golf','multijoueur','party'], 'Golf arcade competitif ou tout le monde joue en meme temps sur des parcours pieges.'),
('Together: Moon Escape', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3744430/2b1989c2b09a474a13a9dc3db410248ad9fc04e4/header.jpg?t=1778172724', 2026, 'Puzzle', array['coop','escape room','communication'], 'Escape game cooperatif sur la Lune avec roles separes et enigmes a synchroniser.'),
('Backseat Drivers', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3558400/2dc867af11f5ed2794aa5566ff9f5a0cb8efd978/header.jpg?t=1773298919', 2025, 'Course', array['coop','conduite','communication'], 'Conduite asymetrique ou le passager doit guider un conducteur prive d informations.'),
('WheelMates', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3905450/46df0b3db6a0f467a851f532dc787103359d2433/header.jpg?t=1784646812', 2026, 'Course', array['coop','conduite','aventure'], 'Aventure de conduite cooperative ou deux joueurs partagent les problemes de route.'),
('Flipping is Hard', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3826670/18e27c43c6b7805af228c4f5f1308430fd2811e2/header.jpg?t=1785735778', 2026, 'Plateforme', array['action','physique','difficile'], 'Defi physique base sur le mouvement et les retournements precis.'),
('Keep It Contained', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4251090/213c7f10a147e86882f053fc390c5e5966507614/header.jpg?t=1785532450', null, 'Simulation', array['coop','gestion','early access'], 'Gestion chaotique ou il faut contenir des situations qui degenerent vite.'),
('We Were Here Tomorrow', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2315050/f5267efff988ad5375e15f8125e8e26667db3b45/header.jpg?t=1785740588', 2026, 'Puzzle', array['coop','communication','enigmes'], 'Nouvel episode de puzzles cooperatifs asymetriques dans l univers We Were Here.'),
('Frogging Around', null, 2021, 'Prototype', array['indie','html5','mini-jeu'], 'Petit prototype de jam autour d une grenouille et d une nuit a traverser.'),
('FiresOut!', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3983200/b289d619a90e5559f7f26d478d357240459aaeb2/header_alt_assets_0.jpg?t=1782106241', null, 'Simulation', array['coop','casual','action'], 'Experience cooperative legere ou il faut gerer le feu avant que tout parte en vrille.'),
('Balatro', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2379780/7a85430784e4d613cdb0547414d8cf16ffa45747/header.jpg?t=1785428554', 2024, 'Cartes', array['solo','roguelike','strategie'], 'Roguelike de poker ou les jokers et multiplicateurs cassent les regles main apres main.'),
('Gambonanza', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3509230/header.jpg?t=1780392882', 2026, 'Simulation', array['casino','strategie','casual'], 'Jeu de pari et de machines a combos ou la chance se planifie autant qu elle se subit.'),
('over the hill', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2929250/header.jpg?t=1782899368', 2026, 'Conduite', array['exploration','offroad','coop'], 'Exploration off-road tranquille en vehicules anciens sur des chemins ouverts.'),
('KallaX', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1818280/header.jpg?t=1736436044', 2023, 'Party game', array['coop','organisation','chaos'], 'Cooperation en entrepot ou il faut preparer des commandes sans perdre le fil.'),
('PEAK', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3527290/31bac6b2eccf09b368f5e95ce510bae2baf3cfcd/header.jpg?t=1775581133', 2025, 'Aventure', array['coop','escalade','survie'], 'Ascension cooperative en montagne ou la physique et les ressources punissent chaque erreur.'),
('Clair Obscur: Expedition 33', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1903340/be3305b02d4db0dffa3458537118423bf2792d7e/header.jpg?t=1782830877', 2025, 'RPG', array['tour par tour','action','fantasy'], 'RPG au tour par tour reactif dans un monde inspire de la Belle Epoque sombre.'),
('Cuphead', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/268910/header.jpg?t=1709068852', 2017, 'Run and gun', array['coop','boss','difficile'], 'Boss rush dessine comme un dessin anime ancien avec timing strict et cooperation locale.'),
('Mobile Legends: Bang Bang', null, 2016, 'MOBA', array['mobile','multijoueur','competitif'], 'MOBA mobile en 5 contre 5 avec heros, lanes et matchs courts orientes equipe.'),
('CookieRun: Kingdom', null, 2021, 'Gacha RPG', array['mobile','rpg','gestion'], 'RPG mobile avec collection de cookies, combats automatiques et construction de royaume.'),
('Superior: Vengeance', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1297490/header.jpg?t=1709228083', 2023, 'Action', array['roguelite','shooter','coop'], 'Shooter roguelite ou des chasseurs traquent des super-heros corrompus.'),
('How 2 Escape', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2264140/header.jpg?t=1751497531', 2023, 'Puzzle', array['coop','escape room','asymetrique'], 'Escape game asymetrique ou deux joueurs collaborent sur deux appareils differents.'),
('How 2 Escape: Lost Submarine', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3530680/8b2495501f0c8c91a28dc0c52646181578e07bc5/header.jpg?t=1753784743', 2025, 'Puzzle', array['coop','escape room','asymetrique'], 'Suite sous-marine de How 2 Escape avec roles complementaires et enigmes plus denses.'),
('Log Riders', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4082750/15e7ebf51d35bd641b04b8299ab7aeeee9abc809/header.jpg?t=1785511172', 2026, 'Aventure', array['coop','physique','course'], 'Descente cooperative sur rondins ou l equilibre collectif fait toute la difference.'),
('Rain World', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/312520/dc5bd100e86dbdb088e7ff17cdb601e7eb2e00bc/header.jpg?t=1781113199', 2017, 'Survie', array['solo','plateforme','ecosysteme'], 'Survie-platformer exigeant dans un ecosysteme vivant ou le joueur est une proie.'),
('Frog Sqwad', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3989960/7cf40cfaff04f6a192df76a81d9f38463b73c50e/header.jpg?t=1781613814', 2026, 'Plateforme', array['coop','extraction','physique'], 'Cooperation jusqu a huit joueurs avec grenouilles, langues physiques et collecte en egouts.'),
('Cat Mail Co.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4380490/9c206d8a7c8a6133230628b6326f4f08a683b40e/header.jpg?t=1785247200', 2026, 'Simulation', array['indie','livraison','casual'], 'Simulation de livraison feutree ou des chats assurent le courrier avec style.'),
('Am I Nami', null, null, 'Indie', array['a verifier','indie','liste'], 'Titre conserve depuis la liste originale, avec details publics a completer si besoin.'),
('Operation: Tango', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1335790/header.jpg?t=1762781027', 2021, 'Puzzle', array['coop','communication','espionnage'], 'Un agent et un hacker doivent s echanger les bonnes informations pour remplir leurs missions.'),
('Spacelines from the Far Out', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1412850/header.jpg?t=1770277043', 2022, 'Simulation', array['coop','gestion','espace'], 'Gestion cooperative d une compagnie spatiale avec passagers, incidents et panique a bord.'),
('Beavers Be Dammed', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/764570/header.jpg?t=1516362408', 2018, 'Simulation', array['coop','casual','arcade'], 'Deux castors braquent une scierie dans un jeu court de cooperation et timing.');

insert into public.games (title, cover_url, release_year, genre, tags, description)
select title, cover_url, release_year, genre, tags, description
from sync_games_catalog
on conflict (title) do update set
  cover_url = excluded.cover_url,
  release_year = excluded.release_year,
  genre = excluded.genre,
  tags = excluded.tags,
  description = excluded.description;

with catalog_games as (
  select game.id, game.title
  from public.games game
  join sync_games_catalog catalog on catalog.title = game.title
),
missing_items as (
  select
    list.id as tier_list_id,
    game.id as game_id,
    (coalesce(base.max_position, -1) + row_number() over (partition by list.id order by game.title))::int as position
  from public.tier_lists list
  cross join catalog_games game
  left join public.tier_list_items existing
    on existing.tier_list_id = list.id and existing.game_id = game.id
  left join lateral (
    select max(position) as max_position
    from public.tier_list_items item
    where item.tier_list_id = list.id and item.tier = 'unranked'
  ) base on true
  where existing.id is null
)
insert into public.tier_list_items (tier_list_id, game_id, tier, position)
select tier_list_id, game_id, 'unranked', position
from missing_items
on conflict (tier_list_id, game_id) do nothing;

delete from public.guess_sessions guess_session
where exists (
  select 1
  from public.guess_player_secrets secret
  join public.games game on game.id = secret.secret_game_id
  where secret.session_id = guess_session.id
    and not exists (select 1 from sync_games_catalog catalog where catalog.title = game.title)
);

delete from public.games game
where not exists (select 1 from sync_games_catalog catalog where catalog.title = game.title);

drop table if exists pg_temp.sync_games_catalog;
