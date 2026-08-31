# Project 1: Side-Scroller — Instructions

## Overview

This is a team-based project (teams of 2 students). Your team will use AI tools to understand, modify, and extend an existing TypeScript side-scrolling game, practicing professional software development workflows: version control, CI/CD pipelines, and AI-assisted development.

Over the project you will diagnose and fix a real bug, each add a feature of your own design, write tests for everything you change, and give the game a cohesive new look and sound.

How your work is graded is defined in [rubric.md](rubric.md). Read it alongside this document: the tasks below say *what to do*; the rubric says *how it's assessed*.

**Don't stop at the minimum.** R5 and R7 explicitly reward features that are genuinely creative and well-integrated, and art/audio with a real, cohesive identity — not just every checkbox ticked. Treat T5 (your feature) and T7 (your assets) as a chance to build something you're actually proud of, not just something that satisfies the rubric. A team that pushes past "technically complete" ends up with a game worth showing off — see [Playing Your Game Online](#playing-your-game-online-gitlab-pages) below.

## Getting Started

1. `npm install`, then `npm run start` — play the game for a few minutes before reading any code.
2. **Heads-up: the CI pipeline is red on arrival — intentionally.** The starter contains a planted bug (T4), and the failing tests and lint errors point straight at it. See T2 for what this means for your merge order.
3. **Before you touch anything else, create a branch off of `main` and check it out** (e.g. `git checkout -b chore/verify-ai-logging`). `main` is protected — nobody can push to it directly, only merge into it via an approved MR (T1) — so working directly on `main` will get any push rejected. This matters immediately: T0 below starts a Claude Code session, and the session-logging hook automatically commits *and pushes* when it finishes. If you're still on `main` at that point, that automatic push will fail.

## Playing Your Game Online (GitLab Pages)

Every time `main` gets a new commit (i.e., every time an MR merges), the pipeline's `pages` job
builds the game and deploys it to **GitLab Pages** — a live, playable link to your team's current
`main` branch, no local setup required.

- **Finding your link:** in your project on GitLab, go to **Deploy > Pages** in the left sidebar.
  Once the first pipeline on `main` has finished, the live URL is listed there. (It only appears
  after the *first* successful `main` pipeline — if it's not there yet, check the pipeline for
  `main` under **Build > Pipelines**.)
- **It's shareable even though your repo is private:** your team's repository itself stays
  private (only your team and course staff can see the code), but the Pages link is viewable by
  *anyone* you send it to — no GitLab account or login required.
- **It updates on every merge to `main`**, not on every commit or every branch. If you just
  merged an MR, give the `pages` job a minute or two to finish before refreshing.
- Use it to sanity-check your work the same way a grader or your TA will see it.
- **Show it off.** Once your game reflects the work you're proud of — your features (T5), your
  cohesive art/audio (T7) — send the link to friends, family, or put it in your portfolio. A
  live, playable link people can click and immediately play is worth more than a screenshot.
- **Keep it appropriate.** This link needs no GitLab login — anyone you send it to, or anyone who
  stumbles onto it, can play it immediately, under your team's name. Keep everything you add —
  art, audio, map text, anything player-facing — appropriate for a public, professional audience.
  Don't use the game as a venue for content that wouldn't belong in something you'd put your name
  on.

## Tasks

### T0 — Verify AI Session Logging

Before starting any development work, every team member must verify that Claude Code session logging is working in this repository:

0. Make sure you're on your own branch off of `main`, not `main` itself (see Getting Started step 3) — the logging hook's automatic push will fail on protected `main`.
1. Open a Claude Code session in the project directory.
2. Have a brief interaction (e.g., ask it to explain a file or how a system works).
3. Confirm a new log file was created and committed in `ai_log/` — the logging hook does this automatically.
4. Push your branch and confirm the log file appears on the remote.

Complete this before any other task. Your AI usage throughout the project is part of your grade, and unlogged sessions cannot be credited.

### T1 — Team Git Workflow

**Goal:** all work is tracked in Git using professional team practice, for the entire project.

| Requirement | Description |
|----------|-------------|
| Branching | Each independent feature or fix branches off of `main` and lives on its own branch — never work directly on `main`. Branch names are descriptive (e.g., `fix/player-jump-speed`, `feature/score-display`). |
| Commits | Commits are atomic (one logical change per commit) with clear, descriptive messages in a consistent format (e.g., imperative mood: "Fix player collision with ceiling"). |
| Merges | Branches are merged back to `main` via merge requests — never direct pushes. |
| No force pushes | History on `main` is never rewritten. |

### T2 — Keep the CI Pipeline Green

**Goal:** every merge request passes the CI/CD pipeline before merging. Do not bypass or modify the pipeline to make it pass artificially.

The pipeline (defined in `.gitlab-ci.yml`) runs on every merge request:

| Check | Command | Requirement |
|-------|---------|-------------|
| Code formatting | `npm run format:check` | Code conforms to the project style. Run `npm run format` locally to auto-fix. |
| Linting | `npm run lint` | No ESLint errors. |
| Unit tests | `npm run test` | All tests pass — existing ones and yours. |

The pipeline also has a separate `pages` job that runs only on `main` (not on MRs) and deploys your live, playable build — see [Playing Your Game Online](#playing-your-game-online-gitlab-pages) above.

**The pipeline starts red.** The planted bug (T4) currently fails three tests and produces three lint errors. No MR can go green until the bug fix is merged — so plan your work order accordingly: **land T4 first**, then everything else merges against a green baseline. This mirrors real jobs, where you sometimes inherit a broken build.

**Merge request approval:** every MR must be reviewed and approved by a teammate who did **not** author the code. Authors may not approve their own MR.

### T3 — Understand the Codebase with AI

**Goal:** use AI tools to explore and understand the codebase before changing it.

The codebase is non-trivial: a state machine (`GameManager.ts`), an asset pipeline (`ResourceManager.ts`), physics and collision (`GameMap.ts`), an input system (`InputManager.ts`/`GameAction.ts`), and a sprite hierarchy (`Sprite`, `Creature`, `Player`, `Grub`, `Fly`, `PowerUp`).

Use AI to:

- Understand how the major systems connect and interact
- Trace how a feature works end-to-end (e.g., how player input becomes movement)
- Identify where a bug or change needs to be made *before* touching anything
- Ask clarifying questions about unfamiliar patterns (TypeScript, p5.js, deltaTime physics)

Your understanding is evidenced through your individual markdown document (T8) and your session logs.

### T4 — Fix the Parallax Bug

**Goal:** the parallax background scrolling system is broken. Identify the root cause and fix it so background layers scroll correctly relative to the camera and player movement.

Correct behavior: the parallax layer farthest back is the smallest image and scrolls the *slowest* as the player moves; the layer closest to the tiles is the largest image and scrolls the *fastest*.

Use AI to help locate the relevant code, understand how the system is *supposed* to work, and reason through the fix. Fix the root cause — don't work around it. The failing tests in `tests/GameMap.parallax.test.ts` define correct behavior and must pass with your fix, unmodified.

### T5 — Implement New Features

**Goal:** each team member adds a meaningful new feature to the game. Examples (not limits): a new enemy type, a scoring system, a new power-up, a pause menu, a lives/health system.

- A genuine addition — not just tweaking a constant.
- Integrates with the existing architecture (correct use of `GameManager`, `GameMap`, the sprite hierarchy, etc.).
- Works correctly in the running game.

### T6 — Unit Testing

**Goal:** the starter ships with some unit tests; you add tests covering your own changes.

- New tests cover the T4 fix and each T5 feature.
- Tests are meaningful — they test behavior, not just that code runs.
- Existing tests are not deleted or weakened.

### T7 — Replace or Create Assets

**Goal:** give the game its own cohesive look and sound.

| Asset Type | Requirement |
|------------|-------------|
| Graphics | Replace all images (sprite frames, tiles, backgrounds). Wire them through `assets/assets.json` and `assets/resources/resources.json` as needed. |
| Audio | Replace all sound and music files, referenced in `assets/assets.json`. |
| Text / Map | Create or significantly modify the two existing map files and add at least one more map in `assets/maps/`. |

All assets must function in the running game (no broken references). Graphics, sounds, and music must share a cohesive style — they should feel like they belong in the same game.

### T8 — Individual Markdown Document

**Goal:** each team member creates a personal `docs/<your-login>.md` with the following sections, each with substantive explanations (not one-liners):

**Repo and Codebase Organization** — describe in your own words how the repository is organized, how the major source files relate, and how data flows through the system during a typical game frame.

**AI Tools Used** — every AI tool you used. For each: a reference to the session log, what you asked and how you used the output, and an honest assessment of where it helped and where it fell short.

> **Session log note:** Claude Code sessions are logged automatically to `ai_log/`. For other AI tools (ChatGPT, Gemini, Copilot, etc.), export your conversation to a file in `docs/` (e.g., `docs/<your-login>-chatgpt-session.md`) and reference it here.

**Best Practices Learned** — what you learned about professional software development from this project: version control, CI/CD, code organization, testing, working in an unfamiliar codebase, or effective AI use.

### T9 — Player Instructions Modal

**Goal:** the game currently drops a new player straight into the level with no explanation of the controls. Add player-facing instructions to the existing settings/menu modal (`Settings.ts`, toggled with the `m` key) — this is a team-wide requirement, separate from each member's individual T5 feature.

- Add text to that modal explaining, in plain language, every key needed to play the base game: the left/right movement keys, the jump key, the key that opens/closes the menu (`m`), and the fullscreen toggle key (`Escape`).
- If your team's T5 features add new key bindings (e.g. a pause key, an ability key), update this text to document those too — it should stay accurate to the controls that actually exist in your shipped game.
- It must be readable in the running game (open the menu and check), not just present in the source.

### T10 — TA Code Review

After the deadline, your team will attend a code review with a TA.

1. Every team member attends and participates.
2. Be prepared to walk through **any** part of your team's submission — explain what it does, why it was designed that way, and how you verified it works. You are expected to demonstrate knowledge of the work you submitted, whether you typed it or an AI did.
3. Review your grade report before the meeting. If the automated grading contains any errors, **this is where you raise and address them** — bring the specific rubric item, what the report says, and the evidence it got wrong.

## Submission

By the deadline, all of the following must be true:

- [ ] All work is merged to `main` via approved merge requests.
- [ ] Each member's `docs/<your-login>.md` is present on `main`.
- [ ] Claude Code session logs are in `ai_log/`; logs from any other AI tools are in `docs/` and referenced from your individual document.
- [ ] No force-pushes to `main` after the deadline.
- [ ] Your team has scheduled its TA code review (T10).
