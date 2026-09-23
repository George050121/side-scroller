# Side-Scroller

A neon-circuit platformer written in TypeScript on top of [p5.js](https://p5js.org). Run, jump, stomp enemies, grab an invincibility orb, and chase a high score across three levels.

Built by Yanhao Ding and Jingxue Jie for CS 639 (AI-assisted software development) at UW-Madison, starting from a course-provided starter game.

## Controls

| Key | Action |
| --- | --- |
| Left / Right arrow | Move |
| Space | Jump |
| M | Open or close the menu (controls, music and sound toggles) |
| Escape | Toggle fullscreen |

## What we added to the starter

- **Parallax fix** — `computeParallaxX` ignored its inputs, so every background layer scrolled at the same speed as the tiles. Layers now scroll in proportion to their width: farther layers move slower.
- **Invincibility power-up** — a glowing orb that lets the player destroy enemies on contact for 5 seconds (Yanhao).
- **Scoring system** — points for stars, music notes, and defeated enemies, shown in an on-screen HUD (Jingxue).
- **New look and sound** — every image and audio file was replaced with procedurally generated neon-circuit art and synthesized music and effects, and a third level was added.
- **In-game instructions** — the menu lists every control (Jingxue).
- **Unit tests** — 80 Vitest tests covering the parallax fix, both features, collision logic, input handling, and the creature/player state machines.

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run start
```

`npm run start` compiles the TypeScript in watch mode and serves the game with live reload.

Other scripts:

```bash
npm test              # run the unit tests
npm run lint          # ESLint
npm run format:check  # Prettier
```

## How it is organized

| Path | Role |
| --- | --- |
| `src/Main.ts` | p5 entry point: `preload`, `setup`, `draw`, key handlers |
| `src/GameManager.ts` | Loading, menu, and running state machine; turns input into player actions |
| `src/GameMap.ts` | Level parsing, physics, collision, camera, parallax, scoring |
| `src/ResourceManager.ts` | Loads assets and builds sprite prototypes from JSON definitions |
| `src/InputManager.ts`, `src/GameAction.ts` | Keyboard mapping and press/release state |
| `src/Settings.ts` | The menu overlay |
| `src/sprites/` | `Sprite` → `Creature` → `Player`, `Grub`, `Fly`; `PowerUp` and its subclasses |
| `assets/` | Images, sounds, level maps (`assets/maps/`), and sprite definitions (`assets/resources/`) |
| `tests/` | Vitest unit tests |

Levels are plain text files: letters `A`-`Z` are tiles, digits and symbols are the player, enemies, and pickups, and `@parallax-layer` / `@music` lines set the background and soundtrack. The symbol table is in `assets/resources/resources.json`.

## Credits

Game engine and starter code provided by the CS 639 course staff. Gameplay changes, art, audio, levels, and tests by the authors above. The repository history includes `ai_log/`, the record of the Claude Code sessions used during development.
