/** Verified character art and published views. See docs/character-sources.md for coverage and credits. */
export type CharacterGame = 'crown-gambit' | 'sovereign-tower'
export type CharacterVariant = {
  id: string
  label: string
  image: string
  sourceUrl: string
  credit: string
  spoiler?: boolean
  sourceType?: 'official' | 'community'
}
export type Character = {
  id: string
  name: string
  game: CharacterGame
  role: string
  description: string
  variants: CharacterVariant[]
  tags: string[]
}
export const GAME_LABELS: Record<CharacterGame, string> = {
  'crown-gambit': 'Crown Gambit',
  'sovereign-tower': 'Sovereign Tower',
}
export const CATALOG_LAST_VERIFIED = '2026-09-17'
export const CATALOG_COVERAGE_NOTE = 'Illustrations officielles et portraits de jeu issus d’archives communautaires créditées. Les vues sont identifiées par leur source ; la galerie ne prétend pas réunir tous les PNJ ni toutes les armures alternatives.'
export const CHARACTERS: Character[] = [
  {
    "id": "cg-aliza",
    "name": "Aliza",
    "game": "crown-gambit",
    "role": "Paladin du trio",
    "description": "Une silhouette rouge nerveuse, une longue cape et une arme façonnée dans le sang.",
    "tags": [
      "Paladine",
      "Rouge",
      "Sang"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Silhouette · illustration de Gobert",
        "image": "/characters/crown-gambit/3lrt6axf63k2g-0.webp",
        "sourceUrl": "https://bsky.app/profile/gobertillu.bsky.social/post/3lrt6axf63k2g",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "dialogue",
        "label": "Portrait en jeu · Grâce ancestrale",
        "image": "/characters/crown-gambit/cg-shot-1.webp",
        "sourceUrl": "https://www.serenityforge.com/games/crown-gambit/press-kit",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": true,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-rollo",
    "name": "Rollo",
    "game": "crown-gambit",
    "role": "Paladin du trio",
    "description": "Une armure massive, une cape ocre et une ancre monumentale : toute la force du trio.",
    "tags": [
      "Paladin",
      "Ocre",
      "Ancre"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Silhouette · illustration de Gobert",
        "image": "/characters/crown-gambit/3lrt6axf63k2g-1.webp",
        "sourceUrl": "https://bsky.app/profile/gobertillu.bsky.social/post/3lrt6axf63k2g",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "dialogue",
        "label": "Portrait en jeu · trio",
        "image": "/characters/crown-gambit/cg-shot-11.webp",
        "sourceUrl": "https://www.serenityforge.com/games/crown-gambit/press-kit",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-hael",
    "name": "Hael",
    "game": "crown-gambit",
    "role": "Paladin du trio",
    "description": "Drapés blancs, lignes fines et masse lumineuse : le contraste clair du trio.",
    "tags": [
      "Paladin",
      "Blanc",
      "Lumière"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Silhouette · illustration de Gobert",
        "image": "/characters/crown-gambit/3lrt6axf63k2g-2.webp",
        "sourceUrl": "https://bsky.app/profile/gobertillu.bsky.social/post/3lrt6axf63k2g",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "dialogue",
        "label": "Portrait en jeu",
        "image": "/characters/crown-gambit/cg-shot-12.webp",
        "sourceUrl": "https://www.serenityforge.com/games/crown-gambit/press-kit",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-kenwaer",
    "name": "Kenwaer",
    "game": "crown-gambit",
    "role": "Assassin",
    "description": "Masque allongé, capuche violette et chaînes : un design construit autour du secret.",
    "tags": [
      "Assassin",
      "Violet",
      "Masque"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Silhouette · illustration de Gobert",
        "image": "/characters/crown-gambit/3lbhwwtev5s2t-0.webp",
        "sourceUrl": "https://bsky.app/profile/gobertillu.bsky.social/post/3lbhwwtev5s2t",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "portrait",
        "label": "Portrait · étude de Gobert",
        "image": "/characters/crown-gambit/3lbhwwtev5s2t-1.webp",
        "sourceUrl": "https://bsky.app/profile/gobertillu.bsky.social/post/3lbhwwtev5s2t",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-sylir",
    "name": "Sylir",
    "game": "crown-gambit",
    "role": "Paladin",
    "description": "Un voile blanc, un encensoir et des volutes de fumée dessinent une présence presque fantomatique.",
    "tags": [
      "Paladin",
      "Blanc",
      "Fumée"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Illustration officielle",
        "image": "/characters/crown-gambit/3lko74tz67c2f-0.webp",
        "sourceUrl": "https://bsky.app/profile/gobertillu.bsky.social/post/3lko74tz67c2f",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-hunan",
    "name": "Hunan",
    "game": "crown-gambit",
    "role": "Paladin",
    "description": "Des gantelets électriques, une armure segmentée et des éclairs bleus qui rythment la silhouette.",
    "tags": [
      "Paladin",
      "Bleu",
      "Foudre"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Illustration officielle",
        "image": "/characters/crown-gambit/3ljl2khziss2p-0.webp",
        "sourceUrl": "https://bsky.app/profile/gobertillu.bsky.social/post/3ljl2khziss2p",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-gwinblenn",
    "name": "Gwinblenn",
    "game": "crown-gambit",
    "role": "Paladin",
    "description": "Une silhouette orange acérée, un casque à flèches et une longue arme horizontale. Publié sous « Gwinblen » par Gobert.",
    "tags": [
      "Paladin",
      "Orange",
      "Gwinblen"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Illustration officielle",
        "image": "/characters/crown-gambit/3ll7vxqt2lc2s-0.webp",
        "sourceUrl": "https://bsky.app/profile/gobertillu.bsky.social/post/3ll7vxqt2lc2s",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-flamme",
    "name": "Flamme de la Lanterne",
    "game": "crown-gambit",
    "role": "Guerrier du culte",
    "description": "Une figure du culte de la Lanterne, publiée par Gobert sous le titre « Flame ». Ce titre désigne un rang, pas un nom propre.",
    "tags": [
      "Culte",
      "Lanterne",
      "Or"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Concept · guerrier du culte",
        "image": "/characters/crown-gambit/3lihqbkbaps2o-0.webp",
        "sourceUrl": "https://bsky.app/profile/gobertillu.bsky.social/post/3lihqbkbaps2o",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-aquilon",
    "name": "Aquilon",
    "game": "crown-gambit",
    "role": "Paladin",
    "description": "Armure sombre, reflets turquoise et sabre courbe. L’éditeur emploie aussi l’orthographe « Aquillon ».",
    "tags": [
      "Paladin",
      "Turquoise",
      "Aquillon"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Illustration officielle",
        "image": "/characters/crown-gambit/3ls2fuwdf2c2p-0.webp",
        "sourceUrl": "https://bsky.app/profile/playdigious.bsky.social/post/3ls2fuwdf2c2p",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "duo",
        "label": "Illustration en duo · avec Yster",
        "image": "/characters/crown-gambit/3lteuprbgrc23-0.webp",
        "sourceUrl": "https://bsky.app/profile/playdigious.bsky.social/post/3lteuprbgrc23",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-yster",
    "name": "Yster",
    "game": "crown-gambit",
    "role": "Paladin",
    "description": "Une armure bleue imposante et une épée lumineuse. Sur l’illustration officielle en duo, Yster est à droite et Aquilon à gauche.",
    "tags": [
      "Paladin",
      "Bleu",
      "Duo"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Illustration en duo · Yster à droite",
        "image": "/characters/crown-gambit/3lteuprbgrc23-0.webp",
        "sourceUrl": "https://bsky.app/profile/playdigious.bsky.social/post/3lteuprbgrc23",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-kryomer",
    "name": "Kryomer",
    "game": "crown-gambit",
    "role": "Paladin",
    "description": "Fourrure claire, masque sombre et palette turquoise composent une silhouette imposante.",
    "tags": [
      "Paladin",
      "Turquoise",
      "Fourrure"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Illustration officielle",
        "image": "/characters/crown-gambit/3lteuprbgrc23-2.webp",
        "sourceUrl": "https://bsky.app/profile/playdigious.bsky.social/post/3lteuprbgrc23",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-gwendor",
    "name": "Gwendor",
    "game": "crown-gambit",
    "role": "Paladin",
    "description": "Une armure argentée très ornée, un grand bouclier et des éclats d’or.",
    "tags": [
      "Paladin",
      "Argent",
      "Bouclier"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Illustration officielle",
        "image": "/characters/crown-gambit/3lteuprbgrc23-3.webp",
        "sourceUrl": "https://bsky.app/profile/playdigious.bsky.social/post/3lteuprbgrc23",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-silence",
    "name": "Silence",
    "game": "crown-gambit",
    "role": "Paladin",
    "description": "Les oiseaux noirs encadrent une armure violette au dessin foisonnant.",
    "tags": [
      "Paladin",
      "Violet",
      "Oiseaux"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Illustration officielle",
        "image": "/characters/crown-gambit/3ls2fuwdf2c2p-1.webp",
        "sourceUrl": "https://bsky.app/profile/playdigious.bsky.social/post/3ls2fuwdf2c2p",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-toull",
    "name": "Toull",
    "game": "crown-gambit",
    "role": "Paladin",
    "description": "Une armure noire et magenta aux lignes fluides, accompagnée de formes circulaires.",
    "tags": [
      "Paladin",
      "Magenta",
      "Cercles"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Illustration officielle",
        "image": "/characters/crown-gambit/3ls2fuwdf2c2p-2.webp",
        "sourceUrl": "https://bsky.app/profile/playdigious.bsky.social/post/3ls2fuwdf2c2p",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-alann",
    "name": "Alann",
    "game": "crown-gambit",
    "role": "Paladin",
    "description": "Une grande arme rayonnante, un casque effilé et des étoffes olive emportées par le mouvement.",
    "tags": [
      "Paladin",
      "Olive",
      "Silhouette"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Illustration officielle",
        "image": "/characters/crown-gambit/3ls2fuwdf2c2p-3.webp",
        "sourceUrl": "https://bsky.app/profile/playdigious.bsky.social/post/3ls2fuwdf2c2p",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-hermet",
    "name": "Hermet",
    "game": "crown-gambit",
    "role": "Paladin",
    "description": "Un portrait violet aux ornements géométriques, diffusé officiellement à l’occasion du premier correctif.",
    "tags": [
      "Paladin",
      "Violet",
      "Portrait"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait · publication officielle",
        "image": "/characters/crown-gambit/cg-hermet.webp",
        "sourceUrl": "https://steamcommunity.com/app/2447980/allnews/",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-lutig",
    "name": "Lutig",
    "game": "crown-gambit",
    "role": "Paladin · la Chandelle",
    "description": "Une armure dorée monumentale surmontée de chandelles. Vue d’introduction provenant du kit presse officiel.",
    "tags": [
      "Paladin",
      "Or",
      "Chandelles"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Armure · introduction officielle",
        "image": "/characters/crown-gambit/cg-shot-3.webp",
        "sourceUrl": "https://www.serenityforge.com/games/crown-gambit/press-kit",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "cg-gallenore",
    "name": "Gallenore",
    "game": "crown-gambit",
    "role": "Princesse",
    "description": "Un portrait de cour aux couleurs chaudes, visible dans une capture officielle du jeu.",
    "tags": [
      "Cour",
      "Or",
      "Portrait"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait en jeu · capture officielle",
        "image": "/characters/crown-gambit/cg-shot-0.webp",
        "sourceUrl": "https://www.serenityforge.com/games/crown-gambit/press-kit",
        "credit": "Gobert · WILD WITS · Crown Gambit",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "st-angelica",
    "name": "Angelica",
    "game": "sovereign-tower",
    "role": "Chevalière de Clovermont",
    "description": "Une armure aux motifs de trèfle, une cape verte et une chevelure cuivrée. Sa présentation officielle insiste sur sa bienveillance.",
    "tags": [
      "Chevalière",
      "Vert",
      "Trèfles"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/angelica-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1824459501607058",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "artist",
        "label": "Illustration de Gobert",
        "image": "/characters/sovereign-tower/angelica-artist.webp",
        "sourceUrl": "https://bsky.app/profile/gobertillu.bsky.social/post/3mf5la2htm22w",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "community",
        "label": "Avec son chat · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-angelica-cat.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-angelica",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-gwendan",
    "name": "Gwendan",
    "game": "sovereign-tower",
    "role": "Chevalier de Villador",
    "description": "Une armure dorée généreusement décorée, aussi démonstrative que son propriétaire.",
    "tags": [
      "Chevalier",
      "Or",
      "Noblesse"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/gwendan-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1824459501607058",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "artist",
        "label": "Illustration de Gobert",
        "image": "/characters/sovereign-tower/gwendan-artist.webp",
        "sourceUrl": "https://bsky.app/profile/gobertillu.bsky.social/post/3mfmqjk3u2s2p",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-gwendan-smiling.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-gwendan",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-ursula",
    "name": "Ursula",
    "game": "sovereign-tower",
    "role": "Chevalière de Brimwood",
    "description": "Une armure sombre abîmée et deux tresses : un contraste saisissant avec les ors de la cour.",
    "tags": [
      "Chevalière",
      "Sombre",
      "Armure usée"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/ursula-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1826362059924546",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "artist",
        "label": "Illustration de Gobert",
        "image": "/characters/sovereign-tower/ursula-artist.webp",
        "sourceUrl": "https://bsky.app/profile/gobertillu.bsky.social/post/3mgnj2msuds2j",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-ursula-neutral.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-ursula",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-gideon",
    "name": "Gideon",
    "game": "sovereign-tower",
    "role": "Chevalier · duelliste",
    "description": "Une silhouette soignée, une chevelure spectaculaire et le goût de la mise en scène.",
    "tags": [
      "Chevalier",
      "Duel",
      "Élégance"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/gideon-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1826362059924546",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "artist",
        "label": "Illustration de Gobert",
        "image": "/characters/sovereign-tower/gideon-artist.webp",
        "sourceUrl": "https://bsky.app/profile/gobertillu.bsky.social/post/3mgxhief6f22x",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "dialogue",
        "label": "Vue en jeu · capture officielle",
        "image": "/characters/sovereign-tower/st-shot-21.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1821922921813159",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-gideon-smiling.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-gideon",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-goberto",
    "name": "Goberto",
    "game": "sovereign-tower",
    "role": "Chevalier de Naoned",
    "description": "Un chevalier enthousiaste en armure, candidat aux grands exploits et au tournoi d’Almor.",
    "tags": [
      "Chevalier",
      "Acier",
      "Tournoi"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/goberto-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1828441623104600",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "artist",
        "label": "Illustration de Gobert",
        "image": "/characters/sovereign-tower/goberto-artist.webp",
        "sourceUrl": "https://bsky.app/profile/gobertillu.bsky.social/post/3mhj4c7i6y224",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-goberto-smiling.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-goberto",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-dulahan",
    "name": "Dulahan",
    "game": "sovereign-tower",
    "role": "Chevalier mystérieux",
    "description": "Une présence en armure qui tient beaucoup à préciser qu’elle est humaine.",
    "tags": [
      "Chevalier",
      "Armure",
      "Mystère"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/dulahan-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1828441623104600",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-dulahan-stoical.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-dulahan",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-rufus",
    "name": "Rufus",
    "game": "sovereign-tower",
    "role": "Chevalier de Groveshire",
    "description": "Un chevalier sauvage attaché aux bois et à ses compagnons.",
    "tags": [
      "Chevalier",
      "Nature",
      "Groveshire"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/rufus-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1830163047255528",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-rufus-smiling.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-rufus",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-silgur",
    "name": "Silgur",
    "game": "sovereign-tower",
    "role": "Chasseur de Groveshire",
    "description": "Un chasseur solitaire présenté avec son arc, habitué aux créatures dangereuses de Brizh.",
    "tags": [
      "Chevalier",
      "Arc",
      "Chasse"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/silgur-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1830163047255528",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-silgur-smiling.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-silgur",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-brunhilda",
    "name": "Brunhilda",
    "game": "sovereign-tower",
    "role": "Princesse de Gavault",
    "description": "Une princesse rebelle passionnée de savoir occulte et de magie, présentée avec son oncle Tarcus.",
    "tags": [
      "Chevalière",
      "Magie",
      "Gavault"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/brunhilda-official.webp",
        "sourceUrl": "https://store.steampowered.com/news/app/4113940/view/654854646561506081",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-brunhilda-smiling.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-brunhilda",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-tarcus",
    "name": "Tarcus",
    "game": "sovereign-tower",
    "role": "Chevalier de Gavault",
    "description": "Un vétéran de fer dont la présence imposante tranche avec l’enthousiasme de Brunhilda.",
    "tags": [
      "Chevalier",
      "Vétéran",
      "Gavault"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/tarcus-official.webp",
        "sourceUrl": "https://store.steampowered.com/news/app/4113940/view/654854646561506081",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-tarcus-smiling.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-tarcus",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-chester",
    "name": "Chester",
    "game": "sovereign-tower",
    "role": "Bouffon de la cour",
    "description": "Un bouffon qui demande à devenir chevalier pour affronter son ennemie : une oie.",
    "tags": [
      "Cour",
      "Bouffon",
      "Fantaisie"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/chester-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1833334318572025",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "community",
        "label": "Tenue de chevalier · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-chester-knight-crazier.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-chester",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community",
        "spoiler": true
      }
    ]
  },
  {
    "id": "st-goose",
    "name": "L’Oie",
    "game": "sovereign-tower",
    "role": "Créature · les bains",
    "description": "L’adversaire aussi bruyant que territorial de Chester. Sa présence dans la galerie est parfaitement sérieuse.",
    "tags": [
      "Créature",
      "Oie",
      "Fantaisie"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/goose-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1833334318572025",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "st-alwena",
    "name": "Alwena",
    "game": "sovereign-tower",
    "role": "Intendante de la Tour",
    "description": "L’intendante veille sur l’administration de la Tour et recueille les secrets de ses chevaliers.",
    "tags": [
      "Cour",
      "Intendance",
      "Portrait"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/alwena-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1835871199307180",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "dialogue",
        "label": "Vue en jeu · capture officielle",
        "image": "/characters/sovereign-tower/st-shot-15.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1826992588595855",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-alwena-worried.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-alwena",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-carina",
    "name": "Carina",
    "game": "sovereign-tower",
    "role": "Forgeronne",
    "description": "La forgeronne de la Tour, spécialiste des armes, des boucliers et de la réparation des armures.",
    "tags": [
      "Cour",
      "Forge",
      "Artisanat"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/carina-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1835871199307180",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "dialogue",
        "label": "Vue en jeu · capture officielle",
        "image": "/characters/sovereign-tower/st-shot-16.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1826992588595855",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "st-rowan",
    "name": "Rowan",
    "game": "sovereign-tower",
    "role": "Palefrenier",
    "description": "Un spécialiste des chevaux venu de Kutnar, chargé des écuries de la Tour.",
    "tags": [
      "Cour",
      "Écuries",
      "Kutnar"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/rowan-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1835871199307180",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "st-belladona",
    "name": "Belladona",
    "game": "sovereign-tower",
    "role": "Alchimiste",
    "description": "La préparatrice de potions de la Tour, présentée parmi ses fioles et ses savoirs.",
    "tags": [
      "Cour",
      "Alchimie",
      "Potions"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/belladona-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1839041357024215",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      },
      {
        "id": "dialogue",
        "label": "Vue en jeu · capture officielle",
        "image": "/characters/sovereign-tower/st-shot-17.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1826992588595855",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "st-rupin",
    "name": "Rupin",
    "game": "sovereign-tower",
    "role": "Marchand de curiosités",
    "description": "Un marchand de Brimwood qui vient proposer ses services à la Tour.",
    "tags": [
      "Cour",
      "Marchand",
      "Brimwood"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/rupin-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1839041357024215",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "st-sagadin",
    "name": "Sagadin",
    "game": "sovereign-tower",
    "role": "Maître d’armes",
    "description": "Un ancien chevalier devenu instructeur après une blessure, au service des futurs exploits de votre table.",
    "tags": [
      "Cour",
      "Vétéran",
      "Instruction"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Portrait officiel",
        "image": "/characters/sovereign-tower/sagadin-official.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1839041357024215",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "st-lady-of-the-tower",
    "name": "Dame de la Tour",
    "game": "sovereign-tower",
    "role": "Gardienne de la Tour",
    "description": "Une figure de pierre drapée, liée à l’architecture et à l’agrandissement de la Tour.",
    "tags": [
      "Cour",
      "Pierre",
      "Drapés"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Vue en jeu · capture officielle",
        "image": "/characters/sovereign-tower/st-shot-14.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1826992588595855",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "st-sovereign",
    "name": "Le Souverain",
    "game": "sovereign-tower",
    "role": "Personnage incarné",
    "description": "Le masque royal et la couronne du personnage que vous incarnez. Vue issue de la présentation officielle.",
    "tags": [
      "Cour",
      "Masque",
      "Couronne"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Vue en jeu · capture officielle",
        "image": "/characters/sovereign-tower/st-shot-19.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1821922921813159",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "st-demon",
    "name": "Le Démon",
    "game": "sovereign-tower",
    "role": "Gardien des retours dans le temps",
    "description": "Une créature rouge dans les flammes, au centre du pouvoir de réécrire les événements.",
    "tags": [
      "Créature",
      "Rouge",
      "Flammes"
    ],
    "variants": [
      {
        "id": "official",
        "label": "Vue en jeu · capture officielle",
        "image": "/characters/sovereign-tower/st-shot-22.webp",
        "sourceUrl": "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1821922921813159",
        "credit": "Gobert · WILD WITS · Curve Games",
        "spoiler": false,
        "sourceType": "official"
      }
    ]
  },
  {
    "id": "st-ari",
    "name": "Ari",
    "game": "sovereign-tower",
    "role": "Chevalier",
    "description": "Une armure claire gravée, enveloppée de plumes.",
    "tags": [
      "Clair",
      "Plumes",
      "Archive communautaire"
    ],
    "variants": [
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-ari-smiling.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-ari",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-arron",
    "name": "Arron",
    "game": "sovereign-tower",
    "role": "Chevalier",
    "description": "Une petite silhouette en armure, dans une palette d’or et de rouge.",
    "tags": [
      "Or",
      "Rouge",
      "Archive communautaire"
    ],
    "variants": [
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-arron-smile.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-arron",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-childeric",
    "name": "Childeric",
    "game": "sovereign-tower",
    "role": "Chevalier",
    "description": "Une armure toute en rondeurs, cercles et plaques superposées.",
    "tags": [
      "Armure lourde",
      "Cercles",
      "Archive communautaire"
    ],
    "variants": [
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-childeric-eye-right.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-childeric",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-daguez",
    "name": "Daguez",
    "game": "sovereign-tower",
    "role": "Chevalier",
    "description": "Une cape rustique et une fourche composent une silhouette inhabituelle.",
    "tags": [
      "Cape",
      "Rustique",
      "Archive communautaire"
    ],
    "variants": [
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-daguez-worried.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-daguez",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-edith",
    "name": "Edith",
    "game": "sovereign-tower",
    "role": "Chevalière",
    "description": "Une épée rayonnante et une armure aux reflets mauves.",
    "tags": [
      "Violet",
      "Épée",
      "Archive communautaire"
    ],
    "variants": [
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-edith-smiling.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-edith",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-epicrate",
    "name": "Epicrate",
    "game": "sovereign-tower",
    "role": "Chevalier",
    "description": "Des drapés vert sombre, une tête bandée et des ornements serpentins.",
    "tags": [
      "Vert",
      "Drapés",
      "Archive communautaire"
    ],
    "variants": [
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-epicrate-smiling.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-epicrate",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-gothild",
    "name": "Gothild",
    "game": "sovereign-tower",
    "role": "Chevalière",
    "description": "Une armure monumentale dont les flèches rappellent une cathédrale.",
    "tags": [
      "Architecture",
      "Armure ornée",
      "Archive communautaire"
    ],
    "variants": [
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-gothild-stoical.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-gothild",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-ligia",
    "name": "Ligia",
    "game": "sovereign-tower",
    "role": "Chevalière",
    "description": "Une armure fine associée à des manches et drapés roses.",
    "tags": [
      "Rose",
      "Drapés",
      "Archive communautaire"
    ],
    "variants": [
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-ligia-flirty.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-ligia",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-oliver",
    "name": "Oliver",
    "game": "sovereign-tower",
    "role": "Chevalier",
    "description": "Une cape bleue étoilée et des détails qui évoquent la magie.",
    "tags": [
      "Bleu",
      "Magie",
      "Archive communautaire"
    ],
    "variants": [
      {
        "id": "community",
        "label": "Tenue de mage · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-oliver-mage-stoical.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-oliver",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community",
        "spoiler": true
      }
    ]
  },
  {
    "id": "st-wolf",
    "name": "Le Loup",
    "game": "sovereign-tower",
    "role": "Compagnon de la Table ronde",
    "description": "Un loup au pelage clair, à comparer aussi parmi les créatures.",
    "tags": [
      "Créature",
      "Fourrure",
      "Archive communautaire"
    ],
    "variants": [
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-wolf-happy.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-the-wolf",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-victoria",
    "name": "Victoria",
    "game": "sovereign-tower",
    "role": "Chevalière",
    "description": "Une chevelure rouge flamboyante et une épée à la longue silhouette.",
    "tags": [
      "Rouge",
      "Épée",
      "Archive communautaire"
    ],
    "variants": [
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-victoria-smiling.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-victoria",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  },
  {
    "id": "st-zolta",
    "name": "Zolta",
    "game": "sovereign-tower",
    "role": "Chevalière",
    "description": "Une armure dorée, de la fourrure et une cape bleue brodée.",
    "tags": [
      "Or",
      "Bleu",
      "Archive communautaire"
    ],
    "variants": [
      {
        "id": "community",
        "label": "Portrait en jeu · archive communautaire",
        "image": "/characters/sovereign-tower/st-db-zolta-smiling.webp",
        "sourceUrl": "https://sovereigntowerdb.com/knights/#knight-zolta",
        "credit": "Gobert · WILD WITS · archive SovereignTowerDB",
        "sourceType": "community"
      }
    ]
  }
]
