import CONFIG from "../config"
import Nakama from "../nakama"

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super("main-menu");
    }

    create() {
        Nakama.authenticate()

        this.add
            .text(CONFIG.WIDTH / 2, 75, "Welcome to", {
                fontFamily: "Arial",
                fontSize: "24px",
            })
            .setOrigin(0.5);

        this.add
            .text(CONFIG.WIDTH / 2, 123, "XOXO", {
                fontFamily: "Arial",
                fontSize: "72px",
            })
            .setOrigin(0.5);

        this.add.grid(
            CONFIG.WIDTH / 2,
            CONFIG.HEIGHT / 2,
            300,
            300,
            100,
            100,
            0xffffff,
            0,
            0xffca27
        );

        const playBtn = this.add
            .rectangle(CONFIG.WIDTH / 2, 600, 225, 70, 0xffca27)
            .setInteractive({ useHandCursor: true });

        const playBtnText = this.add
            .text(CONFIG.WIDTH / 2, 600, "Find match", {
                fontFamily: "Arial",
                fontSize: "36px",
            })
            .setOrigin(0.5);

        playBtn.on("pointerdown", () => {
            Nakama.findMatch()
            this.scene.start("in-game");
        });

        playBtn.on("pointerover", () => {
            playBtn.setScale(1.1);
            playBtnText.setScale(1.1);
        });

        playBtn.on("pointerout", () => {
            playBtn.setScale(1);
            playBtnText.setScale(1);
        });

        const playAIBtn = this.add
            .rectangle(CONFIG.WIDTH / 2, 680, 225, 70, 0xffca27)
            .setInteractive({ useHandCursor: true });

        const playAIBtnText = this.add
            .text(CONFIG.WIDTH / 2, 680, "Play with AI", {
                fontFamily: "Arial",
                fontSize: "36px",
            })
            .setOrigin(0.5);

        playAIBtn.on("pointerdown", () => {
            Nakama.findMatch(true);
            this.scene.start("in-game", true);
        });

        playAIBtn.on("pointerover", () => {
            playAIBtn.setScale(1.1);
            playAIBtnText.setScale(1.1);
        });

        playAIBtn.on("pointerout", () => {
            playAIBtn.setScale(1);
            playAIBtnText.setScale(1);
        });

    }
}