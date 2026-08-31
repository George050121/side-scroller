const RELEASED = 0;
const BEGIN_PRESS = 1;
const PRESSED = 2;
const END_PRESS = 3;

export class GameAction {
    state: number;

    constructor() {
        this.state = RELEASED;
    }
    reset() {
        this.state = RELEASED;
    }

    release() {
        if (this.state == BEGIN_PRESS || this.state == PRESSED) this.state = END_PRESS;
        else if (this.state == END_PRESS) this.state = RELEASED;
    }

    press() {
        if (this.state == RELEASED) this.state = BEGIN_PRESS;
        else if (this.state == BEGIN_PRESS) this.state = PRESSED;
        else if (this.state == END_PRESS) this.state = BEGIN_PRESS;
    }

    isBeginPress(): boolean {
        return this.state == BEGIN_PRESS;
    }

    isPressed(): boolean {
        return this.state == PRESSED || this.state == END_PRESS || this.state == BEGIN_PRESS;
    }

    isEndPress(): boolean {
        return this.state == END_PRESS;
    }
}
