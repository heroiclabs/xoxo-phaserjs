import CONFIG from "../config"

export default class Matchmaking extends Phaser.Scene {
    constructor() {
        super("matchmaking");
    }

    preload() {
        this.load.spritesheet("spinner", "assets/loader-spritesheet.png", {
            frameWidth: 200,
            frameHeight: 200,
            endFrame: 40,
        });
    }

    create() {
        this.add
            .text(CONFIG.WIDTH / 2, 125, "Searching for an opponent...", {
                fontFamily: "Arial",
                fontSize: "24px",
            })
            .setOrigin(0.5);

        this.anims.create({
            key: "spinnerAnimation",
            frames: this.anims.generateFrameNumbers("spinner"),
            frameRate: 30,
            repeat: Phaser.FOREVER,
        });

        this.add
            .sprite(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, "spinner")
            .play("spinnerAnimation")
            .setScale(0.5);
    }
}