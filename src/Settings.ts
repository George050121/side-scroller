export class Settings {
    public playMusic: boolean;
    public playEvents: boolean;

    music: p5.SoundFile;

    menu: p5.Element;
    full: p5.Element;

    constructor() {
        this.playMusic = false;
        this.playEvents = true;
        this.menu = createDiv();
        this.menu.style("background-color", "rgba(8,6,24,0.92)");
        this.menu.style("border", "2px solid rgba(0,229,255,0.6)");
        this.menu.position(30, 60);
        this.menu.style("color", "white");
        this.menu.style("font-family", "Arial, sans-serif");
        this.menu.style("padding", "20px");
        this.menu.style("box-sizing", "border-box");

        const heading = createElement("h2", "How to Play");
        heading.style("margin", "0 0 12px");
        this.menu.child(heading);

        const controls = createP(
            "Left / Right arrow keys: Move<br>" +
                "Space: Jump<br>" +
                "M: Open or close this menu<br>" +
                "Escape: Toggle fullscreen<br>" +
                "Glowing white orb: temporary invincibility - crash into enemies to defeat them"
        );
        controls.style("font-size", "20px");
        controls.style("line-height", "1.7");
        controls.style("margin", "0 0 24px");
        this.menu.child(controls);
        const music = createCheckbox("Play Music", this.playMusic);
        music.changed(this.togglePlayMusic.bind(this));
        this.menu.child(music);
        const events = createCheckbox("Play Event Sounds", true);
        events.changed(this.toogleEventSounds.bind(this));
        this.menu.child(events);
        this.full = createCheckbox("Full Screen", false);
        this.full.changed(this.toggleFullScreen.bind(this));
        this.menu.child(this.full);
        this.menu.hide();
    }

    showMenu() {
        const scaleFactor = min(width / 800, height / 600);
        this.menu.size(800 * scaleFactor - 60, 600 * scaleFactor - 90);
        this.menu.show();
    }

    hideMenu() {
        this.menu.hide();
    }

    toggleFullScreen() {
        fullscreen(!fullscreen());
    }

    togglePlayMusic() {
        this.playMusic = !this.playMusic;
        if (this.playMusic) {
            this.music.setLoop(true);
            this.music.playMode("restart");
            this.music.play();
        } else {
            this.music.stop();
        }
    }

    setMusic(m: p5.SoundFile) {
        this.music = m;
    }

    toogleEventSounds() {
        this.playEvents = !this.playEvents;
    }
}
