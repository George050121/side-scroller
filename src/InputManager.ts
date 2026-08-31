import { GameAction } from "./GameAction";

export class InputManager {
    actions: { [key: string]: GameAction };

    constructor() {
        this.actions = {};
    }

    setGameAction(action: GameAction, keyCode: number) {
        this.actions[keyCode] = action;
    }

    clearGameAction(keyCode: number) {
        this.actions[keyCode] = null;
    }

    reset() {
        for (const keyCode in this.actions) {
            if (Object.prototype.hasOwnProperty.call(this.actions, keyCode)) {
                this.actions[keyCode].reset();
            }
        }
    }

    checkInput() {
        for (const keyCode in this.actions) {
            if (Object.prototype.hasOwnProperty.call(this.actions, keyCode)) {
                if (keyIsDown(Number(keyCode))) {
                    this.actions[keyCode].press();
                } else {
                    this.actions[keyCode].release();
                }
            }
        }
    }
}
