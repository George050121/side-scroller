import { describe, it, expect } from "vitest";
import { CreatureState, Grub } from "../src/sprites/Creature";

// Standalone replica of GameMap.isCollision for testing without instantiating GameMap
function isCollision(s1: any, s2: any): boolean {
    if (s1 === s2) return false;
    if (typeof s1.getState === "function" && s1.getState() !== CreatureState.NORMAL) return false;
    if (typeof s2.getState === "function" && s2.getState() !== CreatureState.NORMAL) return false;
    const pos1 = s1.getPosition().copy();
    const pos2 = s2.getPosition().copy();
    pos1.x = Math.round(pos1.x);
    pos1.y = Math.round(pos1.y);
    pos2.x = Math.round(pos2.x);
    pos2.y = Math.round(pos2.y);
    const i1 = s1.getImage();
    const i2 = s2.getImage();
    return (
        pos1.x < pos2.x + i2.width &&
        pos2.x < pos1.x + i1.width &&
        pos1.y < pos2.y + i2.height &&
        pos2.y < pos1.y + i1.height
    );
}

function makeSprite(x: number, y: number, w: number, h: number) {
    return {
        getPosition: () => ({ x, y, copy: () => ({ x, y }) }),
        getImage: () => ({ width: w, height: h }),
    };
}

function makeCreature(
    x: number,
    y: number,
    w: number,
    h: number,
    state: CreatureState = CreatureState.NORMAL
) {
    const grub = new Grub();
    grub.setPosition(x, y);
    // Override getImage to return a mock image
    (grub as any).getImage = () => ({ width: w, height: h });
    if (state !== CreatureState.NORMAL) {
        grub.setState(state);
    }
    return grub;
}

describe("GameMap.isCollision (AABB logic)", () => {
    it("same sprite reference → false", () => {
        const s = makeSprite(0, 0, 32, 32);
        expect(isCollision(s, s)).toBe(false);
    });

    it("full overlap → true", () => {
        const s1 = makeSprite(0, 0, 32, 32);
        const s2 = makeSprite(0, 0, 32, 32);
        expect(isCollision(s1, s2)).toBe(true);
    });

    it("partial overlap on right edge → true", () => {
        const s1 = makeSprite(0, 0, 32, 32);
        const s2 = makeSprite(16, 0, 32, 32);
        expect(isCollision(s1, s2)).toBe(true);
    });

    it("partial overlap on bottom edge → true", () => {
        const s1 = makeSprite(0, 0, 32, 32);
        const s2 = makeSprite(0, 16, 32, 32);
        expect(isCollision(s1, s2)).toBe(true);
    });

    it("adjacent touching on x axis (not overlapping) → false", () => {
        const s1 = makeSprite(0, 0, 32, 32);
        const s2 = makeSprite(32, 0, 32, 32); // s2.x == s1.x + s1.width
        expect(isCollision(s1, s2)).toBe(false);
    });

    it("adjacent touching on y axis (not overlapping) → false", () => {
        const s1 = makeSprite(0, 0, 32, 32);
        const s2 = makeSprite(0, 32, 32, 32);
        expect(isCollision(s1, s2)).toBe(false);
    });

    it("separated on x axis → false", () => {
        const s1 = makeSprite(0, 0, 32, 32);
        const s2 = makeSprite(100, 0, 32, 32);
        expect(isCollision(s1, s2)).toBe(false);
    });

    it("separated on y axis → false", () => {
        const s1 = makeSprite(0, 0, 32, 32);
        const s2 = makeSprite(0, 100, 32, 32);
        expect(isCollision(s1, s2)).toBe(false);
    });

    it("x overlaps but y does not → false", () => {
        const s1 = makeSprite(0, 0, 32, 32);
        const s2 = makeSprite(10, 100, 32, 32);
        expect(isCollision(s1, s2)).toBe(false);
    });

    it("Creature in DYING state → false even when overlapping", () => {
        const s1 = makeSprite(0, 0, 32, 32);
        const dying = makeCreature(0, 0, 32, 32, CreatureState.DYING);
        expect(isCollision(s1, dying)).toBe(false);
        expect(isCollision(dying, s1)).toBe(false);
    });

    it("Creature in DEAD state → false even when overlapping", () => {
        const s1 = makeSprite(0, 0, 32, 32);
        const dead = makeCreature(0, 0, 32, 32, CreatureState.DEAD);
        expect(isCollision(s1, dead)).toBe(false);
    });

    it("both Creatures NORMAL and overlapping → true", () => {
        const c1 = makeCreature(0, 0, 32, 32);
        const c2 = makeCreature(10, 10, 32, 32);
        expect(isCollision(c1, c2)).toBe(true);
    });

    it("fractional positions are rounded before comparison", () => {
        // At x=31.7, Math.round → 32, which is exactly at the boundary (not overlapping with 0-32)
        const s1 = makeSprite(0, 0, 32, 32);
        const s2 = makeSprite(31.7, 0, 32, 32); // rounds to 32, touching but not overlapping
        expect(isCollision(s1, s2)).toBe(false);
    });

    it("fractional position rounds into overlap", () => {
        // At x=31.4, Math.round → 31, which is inside (0 to 32)
        const s1 = makeSprite(0, 0, 32, 32);
        const s2 = makeSprite(31.4, 0, 32, 32); // rounds to 31, overlapping
        expect(isCollision(s1, s2)).toBe(true);
    });
});
