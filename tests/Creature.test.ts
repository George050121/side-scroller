import { describe, it, expect, beforeEach } from "vitest";
import { Creature, CreatureState, Grub, Fly } from "../src/sprites/Creature";

describe("Creature", () => {
    let creature: Creature;

    beforeEach(() => {
        creature = new Grub(); // use Grub since Creature is abstract-ish but instantiable
    });

    it("starts in NORMAL state with stateTime=0", () => {
        expect(creature.getState()).toBe(CreatureState.NORMAL);
        expect((creature as any).stateTime).toBe(0);
    });

    it("setState(DYING) → state=DYING, stateTime reset to 0, velocity zeroed", () => {
        creature.setState(CreatureState.DYING);
        expect(creature.getState()).toBe(CreatureState.DYING);
        expect((creature as any).stateTime).toBe(0);
        expect(creature.getVelocity().x).toBe(0);
        expect(creature.getVelocity().y).toBe(0);
    });

    it("setState(DYING) again (same state) → stateTime NOT reset", () => {
        creature.setState(CreatureState.DYING);
        creature.update(200); // advance stateTime
        const timeBefore = (creature as any).stateTime;
        creature.setState(CreatureState.DYING); // no-op
        expect((creature as any).stateTime).toBe(timeBefore);
    });

    it("setState(DEAD) → state=DEAD directly", () => {
        creature.setState(CreatureState.DEAD);
        expect(creature.getState()).toBe(CreatureState.DEAD);
    });

    it("update(500) when DYING → stays DYING (< 1000ms threshold)", () => {
        creature.setState(CreatureState.DYING);
        creature.update(500);
        expect(creature.getState()).toBe(CreatureState.DYING);
    });

    it("update(1000) when DYING → stays DYING (exactly at threshold, uses >, not >=)", () => {
        creature.setState(CreatureState.DYING);
        creature.update(1000);
        expect(creature.getState()).toBe(CreatureState.DYING);
    });

    it("update(1001) when DYING → transitions to DEAD", () => {
        creature.setState(CreatureState.DYING);
        creature.update(1001);
        expect(creature.getState()).toBe(CreatureState.DEAD);
    });

    it("multiple updates accumulating > DIE_TIME → transitions to DEAD", () => {
        creature.setState(CreatureState.DYING);
        creature.update(500);
        expect(creature.getState()).toBe(CreatureState.DYING);
        creature.update(600); // total 1100 > 1000
        expect(creature.getState()).toBe(CreatureState.DEAD);
    });

    it("update() when NORMAL → stays NORMAL regardless of time", () => {
        creature.update(5000);
        expect(creature.getState()).toBe(CreatureState.NORMAL);
    });
});

describe("Grub", () => {
    it("getMaxSpeed() returns 0.05", () => {
        const grub = new Grub();
        expect(grub.getMaxSpeed()).toBe(0.05);
    });
});

describe("Fly", () => {
    let fly: Fly;

    beforeEach(() => {
        fly = new Fly();
    });

    it("getMaxSpeed() returns 0.2", () => {
        expect(fly.getMaxSpeed()).toBe(0.2);
    });

    it("isFlying() returns true when NORMAL", () => {
        expect(fly.getState()).toBe(CreatureState.NORMAL);
        expect(fly.isFlying()).toBe(true);
    });

    it("isFlying() returns false when DYING", () => {
        fly.setState(CreatureState.DYING);
        expect(fly.isFlying()).toBe(false);
    });

    it("isFlying() returns false when DEAD", () => {
        fly.setState(CreatureState.DEAD);
        expect(fly.isFlying()).toBe(false);
    });
});
