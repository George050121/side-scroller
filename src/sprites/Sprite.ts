/**
 * A Sprite is a character in a game.  It can have mulitple animations and each animation
 * can have multiple images displayed for a varying amount of time.  In addition, a Sprite can have different
 * state properties which can be set/changed/deleted.  These state properties can be used to change the Sprites
 * behavior and abilities.
 */

export class Sprite {
    protected position: p5.Vector;
    protected velocity: p5.Vector;
    protected animations: AnimPair;
    protected currAnimName: string;
    protected currAnimation: Animation;

    constructor() {
        this.animations = {};
        this.addAnimation("default");
        this.position = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.currAnimName = "default";
        this.currAnimation = this.animations["default"];
    }

    collideVertical() {
        this.velocity.y = 0;
    }

    collideHorizontal() {
        this.velocity.x = -this.velocity.x;
    }

    isFlying() {
        return false;
    }

    clone() {
        const s = new (this.constructor as any)();
        s.position = this.position.copy();
        s.velocity = this.velocity.copy();
        s.animations = {}; //throw away the animations from the new constructor call
        //and copy over the animations from this
        for (const key in this.animations) {
            if (Object.prototype.hasOwnProperty.call(this.animations, key)) {
                const element = this.animations[key];
                s.animations[key] = element.clone();
            }
        }
        s.currAnimName = this.currAnimName;
        s.currAnimation = s.animations[s.currAnimName];
        return s;
    }

    getPosition() {
        return this.position;
    }

    getVelocity() {
        return this.velocity;
    }

    addVelocity(x: number, y: number) {
        this.velocity.add(x, y);
    }

    setVelocity(x: number, y: number) {
        if (x > 0) {
            this.setAnimation("right");
        } else if (x < 0) {
            this.setAnimation("left");
        }
        this.velocity.set(x, y);
    }

    setPosition(x: number, y: number) {
        this.position.set(x, y);
    }

    addAnimations(anims: { string: p5.Image }, width: number, duration: number, reverse = false) {
        for (const name in anims) {
            if (Object.prototype.hasOwnProperty.call(anims, name)) {
                const img = anims[name];
                this.animations[name] = new Animation();
                for (
                    let i = reverse ? img.width - width : 0;
                    reverse ? i >= 0 : i < img.width;
                    reverse ? (i -= width) : (i += width)
                ) {
                    const frame = img.get(i, 0, width, img.height);
                    this.addFrame(name, frame, duration);
                }
            }
        }
    }

    addAnimation(name: string) {
        this.animations[name] = new Animation();
        //this.currAnimName=name;
        //this.currAnimation=this.animations[name];
    }

    setAnimation(name: string) {
        this.currAnimName = name;
        this.currAnimation = this.animations[name];
        //this.start();
    }

    addFrame(name: string, img: p5.Image, duration: number) {
        this.animations[name].totalDuration += duration;
        this.animations[name].frames.push(new AnimFrame(img, this.animations[name].totalDuration));
    }

    start() {
        this.currAnimation.animTime = 0;
        this.currAnimation.currFrameIndex = 0;
    }

    update(elapsedTime: number) {
        //update the animation
        if (this.currAnimation.frames.length > 1) {
            this.currAnimation.animTime += elapsedTime;
            if (this.currAnimation.animTime >= this.currAnimation.totalDuration) {
                this.currAnimation.animTime %= this.currAnimation.totalDuration;
                this.currAnimation.currFrameIndex = 0;
            }
            while (
                this.currAnimation.animTime >
                this.currAnimation.frames[this.currAnimation.currFrameIndex].endTime
            ) {
                this.currAnimation.currFrameIndex++;
            }
        }
    }

    getImage(): p5.Image {
        if (this.currAnimation.frames.length > 0) {
            return this.currAnimation.frames[this.currAnimation.currFrameIndex].image;
        }
        return null;
    }
}

interface AnimPair {
    [name: string]: Animation;
}

class Animation {
    frames: AnimFrame[];
    currFrameIndex: number;
    animTime: number;
    totalDuration: number;

    constructor() {
        this.frames = [];
        this.currFrameIndex = 0;
        this.animTime = 0;
        this.totalDuration = 0;
    }

    clone(): Animation {
        // The cloned Animation is a pointer to this Animation, except
        // currFrameIndex and animTime so the cloned Animation can be at
        // a different point in the animation cycle.
        const a = new Animation();
        a.frames = this.frames;
        a.totalDuration = this.totalDuration;
        return a;
    }
}

class AnimFrame {
    image: p5.Image;
    endTime: number;

    constructor(img: p5.Image, endTime: number) {
        this.image = img;
        this.endTime = endTime;
    }
}
