import { describe, it, expect, beforeEach } from "vitest";
import { Player } from "../src/sprites/Player";

describe("Player", () => {
    let player: Player;

    beforeEach(() => {
        player = new Player();
    });

    it("constructor sets MAX_SPEED=0.5, JUMP_SPEED=0.95, onGround=false", () => {
        expect(player.MAX_SPEED).toBe(0.5);
        expect(player.JUMP_SPEED).toBe(0.95);
        expect(player.onGround).toBe(false);
    });

    it("jump(false) when not on ground → no change to velocity or onGround", () => {
        player.jump(false);
        expect(player.getVelocity().y).toBe(0);
        expect(player.onGround).toBe(false);
    });

    it("jump(false) when onGround → sets vy=-0.95, onGround=false", () => {
        player.onGround = true;
        player.jump(false);
        expect(player.getVelocity().y).toBe(-0.95);
        expect(player.onGround).toBe(false);
    });

    it("jump(true) regardless of onGround → sets vy=-0.95", () => {
        player.jump(true);
        expect(player.getVelocity().y).toBe(-0.95);
        expect(player.onGround).toBe(false);
    });

    it("jump() does not change velocity.x (x=0 in setVelocity call)", () => {
        player.onGround = true;
        player.jump(false);
        expect(player.getVelocity().x).toBe(0);
    });

    it("collideVertical() with vy > 0 → onGround=true, vy=0", () => {
        player.addVelocity(0, 0.3);
        player.collideVertical();
        expect(player.onGround).toBe(true);
        expect(player.getVelocity().y).toBe(0);
    });

    it("collideVertical() with vy = 0 → onGround stays false, vy=0", () => {
        player.collideVertical();
        expect(player.onGround).toBe(false);
        expect(player.getVelocity().y).toBe(0);
    });

    it("collideVertical() with vy < 0 → onGround stays false, vy=0", () => {
        player.jump(true); // sets vy = -0.95
        player.collideVertical();
        expect(player.onGround).toBe(false);
        expect(player.getVelocity().y).toBe(0);
    });

    it("collideHorizontal() → vx=0 (no bounce, unlike base Sprite)", () => {
        player.addVelocity(0.3, 0);
        player.collideHorizontal();
        expect(player.getVelocity().x).toBe(0);
    });

    it("addVelocity() clamps vx above MAX_SPEED to 0.5", () => {
        player.addVelocity(1, 0);
        expect(player.getVelocity().x).toBe(0.5);
    });

    it("addVelocity() clamps vx at or below -MAX_SPEED to -0.5", () => {
        player.addVelocity(-1, 0);
        expect(player.getVelocity().x).toBe(-0.5);
    });

    it("addVelocity() clamps vx exactly at -MAX_SPEED (inclusive)", () => {
        player.addVelocity(-0.5, 0);
        expect(player.getVelocity().x).toBe(-0.5);
    });

    it("addVelocity() does NOT clamp vx exactly at +MAX_SPEED (exclusive)", () => {
        player.addVelocity(0.5, 0);
        expect(player.getVelocity().x).toBe(0.5); // 0.5 is not > 0.5
    });

    it("addVelocity() clamps vy above MAX_SPEED to 0.5", () => {
        player.addVelocity(0, 1);
        expect(player.getVelocity().y).toBe(0.5);
    });

    it("addVelocity() clamps vy below -MAX_SPEED to -0.5", () => {
        player.addVelocity(0, -1);
        expect(player.getVelocity().y).toBe(-0.5);
    });

    it("addVelocity() passes through values within range", () => {
        player.addVelocity(0, 0.3);
        expect(player.getVelocity().y).toBeCloseTo(0.3);
    });

    describe("invincibility power-up", () => {
        it("starts not invincible", () => {
            expect(player.isInvincible()).toBe(false);
        });

        it("activateInvincibility() makes isInvincible() true", () => {
            player.activateInvincibility(5000);
            expect(player.isInvincible()).toBe(true);
        });

        it("update(deltaTime) counts the timer down", () => {
            player.activateInvincibility(1000);
            player.update(400);
            expect(player.invincibleTime).toBe(600);
            expect(player.isInvincible()).toBe(true);
        });

        it("expires once the timer reaches zero, never going negative", () => {
            player.activateInvincibility(500);
            player.update(800); // overshoots the remaining duration
            expect(player.invincibleTime).toBe(0);
            expect(player.isInvincible()).toBe(false);
        });

        it("update(deltaTime) is a no-op on the timer when not invincible", () => {
            player.update(1000);
            expect(player.invincibleTime).toBe(0);
            expect(player.isInvincible()).toBe(false);
        });

        it("re-activating while already invincible resets the full duration", () => {
            player.activateInvincibility(1000);
            player.update(900);
            player.activateInvincibility(5000);
            expect(player.invincibleTime).toBe(5000);
        });
    });
});
