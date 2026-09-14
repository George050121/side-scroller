import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GameMap, SCORE_VALUES } from "../src/GameMap";
import { Creature, CreatureState } from "../src/sprites/Creature";
import { Player } from "../src/sprites/Player";
import { Heart, Music, Star } from "../src/sprites/PowerUp";

describe("GameMap scoring system", () => {
    let map: GameMap;
    let initializeSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        initializeSpy = vi.spyOn(GameMap.prototype, "initialize").mockImplementation(() => {});

        map = new GameMap(
            0,
            {} as any,
            {
                playEvents: false,
            } as any
        );

        map.sprites = [];
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("starts a new game with a score of zero", () => {
        expect(map.getScore()).toBe(0);
    });

    it("awards points and removes a collected star", () => {
        const star = Object.create(Star.prototype) as Star;
        map.sprites.push(star);

        map.acquirePowerUp(star);

        expect(map.getScore()).toBe(SCORE_VALUES.STAR);
        expect(map.sprites).not.toContain(star);
    });

    it("awards points for a collected music note", () => {
        const music = Object.create(Music.prototype) as Music;
        map.sprites.push(music);

        map.acquirePowerUp(music);

        expect(map.getScore()).toBe(SCORE_VALUES.MUSIC);
    });

    it("does not award points twice for the same power-up", () => {
        const star = Object.create(Star.prototype) as Star;
        map.sprites.push(star);

        map.acquirePowerUp(star);
        map.acquirePowerUp(star);

        expect(map.getScore()).toBe(SCORE_VALUES.STAR);
    });

    it("awards points when the player defeats an enemy", () => {
        let enemyState = CreatureState.NORMAL;

        const enemy = Object.create(Creature.prototype) as Creature;

        enemy.getState = () => enemyState;

        enemy.setState = (state: CreatureState) => {
            enemyState = state;
        };

        enemy.getPosition = () =>
            ({
                x: 100,
                y: 100,
            }) as any;

        const player = Object.create(Player.prototype) as Player;

        player.getState = () => CreatureState.NORMAL;

        player.getPosition = () =>
            ({
                x: 90,
                y: 90,
            }) as any;

        player.getImage = () =>
            ({
                height: 32,
            }) as any;

        player.setPosition = vi.fn();
        player.jump = vi.fn();

        vi.spyOn(map, "getSpriteCollision").mockReturnValue(enemy);

        map.checkPlayerCollision(player, true);

        expect(map.getScore()).toBe(SCORE_VALUES.ENEMY);
        expect(enemyState).toBe(CreatureState.DYING);
    });

    it("keeps the score when a heart advances to the next level", () => {
        const heart = Object.create(Heart.prototype) as Heart;
        map.sprites.push(heart);
        map.addScore(300);

        map.acquirePowerUp(heart);

        expect(map.level).toBe(1);
        expect(map.getScore()).toBe(300);
        expect(initializeSpy).toHaveBeenCalledTimes(2);
    });

    it("resets the score when a dead player restarts the game", () => {
        const player = Object.create(Player.prototype) as Player;
        player.getState = () => CreatureState.DEAD;

        map.player = player;
        map.addScore(450);

        map.update();

        expect(map.getScore()).toBe(0);
        expect(initializeSpy).toHaveBeenCalledTimes(2);
    });

    it("draws the current score in the HUD", () => {
        const textMock = vi.fn();

        vi.stubGlobal("push", vi.fn());
        vi.stubGlobal("pop", vi.fn());
        vi.stubGlobal("textAlign", vi.fn());
        vi.stubGlobal("textSize", vi.fn());
        vi.stubGlobal("noStroke", vi.fn());
        vi.stubGlobal("stroke", vi.fn());
        vi.stubGlobal("strokeWeight", vi.fn());
        vi.stubGlobal("fill", vi.fn());
        vi.stubGlobal("rect", vi.fn());
        vi.stubGlobal("text", textMock);
        vi.stubGlobal("LEFT", "left");
        vi.stubGlobal("TOP", "top");

        map.addScore(250);
        map.drawScore();

        expect(textMock).toHaveBeenCalledWith("Score: 250", 20, 18);
    });
});
