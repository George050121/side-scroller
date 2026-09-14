import { describe, it, expect, beforeEach } from "vitest";
import { GameMap } from "../src/GameMap";
import { Player } from "../src/sprites/Player";
import { Grub, CreatureState } from "../src/sprites/Creature";
import { Invincibility } from "../src/sprites/PowerUp";

function makeImage(w: number, h: number) {
    return { width: w, height: h } as unknown as p5.Image;
}

// GameMap's constructor drives a real ResourceManager (async image/sound loading via
// p5 loaders), which isn't available in this unit-test environment. Since the behavior
// under test (checkPlayerCollision / acquirePowerUp) only touches sprites, settings,
// player, and the sound effects, we build a bare instance via the prototype and stub
// just those fields, the same way tests/GameMap.score.test.ts does for Creature/Player.
function makeBareGameMap(): GameMap {
    const map = Object.create(GameMap.prototype) as GameMap;
    map.settings = { playEvents: false } as any;
    map.boop = { play: () => {} } as any;
    map.prize = { play: () => {} } as any;
    map.sprites = [];
    return map;
}

function makeGrubAt(x: number, y: number): Grub {
    const grub = new Grub();
    grub.setPosition(x, y);
    (grub as any).getImage = () => makeImage(32, 32);
    return grub;
}

describe("GameMap invincibility power-up", () => {
    let map: GameMap;
    let player: Player;

    beforeEach(() => {
        map = makeBareGameMap();
        player = new Player();
        player.setPosition(0, 0);
        (player as any).getImage = () => makeImage(32, 32);
        map.player = player;
    });

    it("acquirePowerUp(Invincibility) activates the player and removes the pickup from play", () => {
        const pickup = new Invincibility();
        pickup.setPosition(0, 0);
        map.sprites.push(pickup);

        map.acquirePowerUp(pickup);

        expect(player.isInvincible()).toBe(true);
        expect(map.sprites).not.toContain(pickup);
    });

    it("without invincibility, a non-stomp enemy touch still kills the player (regression)", () => {
        const grub = makeGrubAt(0, 0);
        map.sprites.push(grub);

        map.checkPlayerCollision(player, false); // false = side/underneath contact, not a stomp

        expect(player.getState()).toBe(CreatureState.DYING);
        expect(grub.getState()).toBe(CreatureState.NORMAL);
    });

    it("while invincible, a non-stomp enemy touch kills the enemy instead of the player", () => {
        player.activateInvincibility(5000);
        const grub = makeGrubAt(0, 0);
        map.sprites.push(grub);

        map.checkPlayerCollision(player, false);

        expect(grub.getState()).toBe(CreatureState.DYING);
        expect(player.getState()).toBe(CreatureState.NORMAL);
    });

    it("stomping (canKill=true) still bounces the player, invincible or not", () => {
        player.activateInvincibility(5000);
        const grub = makeGrubAt(0, 0);
        map.sprites.push(grub);

        map.checkPlayerCollision(player, true);

        expect(grub.getState()).toBe(CreatureState.DYING);
        // p.jump(true) was called as part of the stomp bounce, forcing onGround back to false
        expect(player.onGround).toBe(false);
        expect(player.getVelocity().y).toBe(-player.JUMP_SPEED);
    });

    it("invincibility expiring mid-level stops protecting the player", () => {
        player.activateInvincibility(100);
        player.update(200); // expires the timer
        expect(player.isInvincible()).toBe(false);

        const grub = makeGrubAt(0, 0);
        map.sprites.push(grub);
        map.checkPlayerCollision(player, false);

        expect(player.getState()).toBe(CreatureState.DYING);
    });
});
