# T4 — Parallax Bug Fix Notes

## Root cause

`computeParallaxX()` in [src/GameMap.ts](src/GameMap.ts) is supposed to translate the
foreground camera offset (`offsetX`, driven by the player's position and the full
tile-map width) into a *scaled-down* source offset for each background layer, so
narrower/farther-back layers scroll less than the tile map and wider/closer layers
scroll almost as much as it.

The original implementation ignored all of that and just returned the foreground
offset unchanged:

```ts
export function computeParallaxX(offsetX, myW, mapWidth, bgWidth): number {
    return Math.trunc(offsetX);
}
```

Every background layer was drawn with the exact same source offset as the tile
map, regardless of its own width — so there was no parallax effect at all (every
layer scrolled 1:1 with the foreground), and layers narrower than the map got
sourced past their own right edge as the camera approached the end of the level.

## Fix

Scale `offsetX`'s range `[myW - mapWidth, 0]` proportionally onto each layer's own
range `[myW - bgWidth, 0]`:

```ts
export function computeParallaxX(offsetX, myW, mapWidth, bgWidth): number {
    return Math.trunc((offsetX * (myW - bgWidth)) / (myW - mapWidth));
}
```

At the left edge (`offsetX = 0`) every layer offset is `0`. At the right edge
(`offsetX = myW - mapWidth`) each layer is offset by exactly `myW - bgWidth` —
i.e. it has scrolled through its own extra width, never past it. A narrower
`bgWidth` (farther-back layer) travels a smaller total distance over the same
player traversal, so it visibly scrolls slower than a wider, closer layer — the
correct parallax effect.

This is a one-line change, localized entirely to `computeParallaxX`. No other
function was touched.

## Verification

- `npm run test` — 61/61 tests pass, including all 4 previously-failing cases in
  `tests/GameMap.parallax.test.ts` (left edge, mid-map, right edge, and the
  "backgrounds scroll slower than the map" property check). Test file itself was
  not modified.
- `npm run lint` — 0 errors (previously 3, all pointing at this function's unused
  parameters; now resolved since the parameters are actually used). 6 pre-existing
  `no-explicit-any` warnings remain, unrelated to this change.
- `npm run format:check` — passes, no changes needed.
- Manually verified in the browser (`npm run start`): the two background layers
  scroll at visibly different rates as the player moves across the level, with
  the farther layer (`bg1`) moving slower than the closer one (`bg2`).
