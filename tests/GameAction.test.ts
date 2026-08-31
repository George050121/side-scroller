import { describe, it, expect, beforeEach } from "vitest";
import { GameAction } from "../src/GameAction";

describe("GameAction", () => {
    let action: GameAction;

    beforeEach(() => {
        action = new GameAction();
    });

    it("starts in RELEASED state (not pressed)", () => {
        expect(action.isPressed()).toBe(false);
        expect(action.isBeginPress()).toBe(false);
        expect(action.isEndPress()).toBe(false);
    });

    it("first press() → BEGIN_PRESS", () => {
        action.press();
        expect(action.isBeginPress()).toBe(true);
        expect(action.isPressed()).toBe(true);
    });

    it("second press() → PRESSED", () => {
        action.press();
        action.press();
        expect(action.isBeginPress()).toBe(false);
        expect(action.isPressed()).toBe(true);
        expect(action.isEndPress()).toBe(false);
    });

    it("additional press() calls stay in PRESSED", () => {
        action.press();
        action.press();
        action.press();
        expect(action.isBeginPress()).toBe(false);
        expect(action.isPressed()).toBe(true);
        expect(action.isEndPress()).toBe(false);
    });

    it("release() during BEGIN_PRESS → END_PRESS", () => {
        action.press();
        action.release();
        expect(action.isEndPress()).toBe(true);
        expect(action.isPressed()).toBe(true);
    });

    it("release() during PRESSED → END_PRESS", () => {
        action.press();
        action.press();
        action.release();
        expect(action.isEndPress()).toBe(true);
        expect(action.isPressed()).toBe(true);
    });

    it("second release() during END_PRESS → RELEASED", () => {
        action.press();
        action.release();
        action.release();
        expect(action.isPressed()).toBe(false);
        expect(action.isEndPress()).toBe(false);
    });

    it("press() during END_PRESS → BEGIN_PRESS", () => {
        action.press();
        action.release();
        action.press();
        expect(action.isBeginPress()).toBe(true);
    });

    it("release() from RELEASED is a no-op", () => {
        action.release();
        expect(action.isPressed()).toBe(false);
        expect(action.state).toBe(0); // RELEASED
    });

    it("reset() from any state → RELEASED", () => {
        action.press();
        action.press();
        action.reset();
        expect(action.isPressed()).toBe(false);
        expect(action.state).toBe(0);
    });

    it("isPressed() is true in BEGIN_PRESS, PRESSED, and END_PRESS", () => {
        action.press();
        expect(action.isPressed()).toBe(true); // BEGIN_PRESS

        action.press();
        expect(action.isPressed()).toBe(true); // PRESSED

        action.release();
        expect(action.isPressed()).toBe(true); // END_PRESS
    });

    it("isPressed() is false in RELEASED", () => {
        expect(action.isPressed()).toBe(false);

        action.press();
        action.release();
        action.release();
        expect(action.isPressed()).toBe(false);
    });

    it("full lifecycle: 3 frames pressed, 2 frames released", () => {
        // Frame 1: press
        action.press();
        expect(action.isBeginPress()).toBe(true);

        // Frame 2: press
        action.press();
        expect(action.isPressed()).toBe(true);
        expect(action.isBeginPress()).toBe(false);

        // Frame 3: press
        action.press();
        expect(action.isPressed()).toBe(true);

        // Frame 4: release
        action.release();
        expect(action.isEndPress()).toBe(true);

        // Frame 5: release
        action.release();
        expect(action.isPressed()).toBe(false);
        expect(action.isEndPress()).toBe(false);
    });
});
