import CONFIG from "../config"
import Nakama from "../nakama"

export default class InGame extends Phaser.Scene {
    constructor() {
        super("in-game");
        this.INDEX_TO_POS;
        this.headerText;
        this.gameStarted = false;
        this.turn = false;
        this.phaser = this
        this.playerPos;
    }

    //ep4
    updateBoard(board) {
        board.forEach((element, index) => {
            let newImage = this.INDEX_TO_POS[index]

            if (element === 1) {
                this.phaser.add.image(newImage.x, newImage.y, "X");
            } else if (element === 2) {
                this.phaser.add.image(newImage.x, newImage.y, "O");
            }
        })
    }

    updatePlayerTurn() {
        this.playerTurn = !this.playerTurn

        if (this.playerTurn) {
            this.headerText.setText("Your turn!")
        } else {
            this.headerText.setText("Opponents turn!")
        }
    }

    setPlayerTurn(data) {
        let userId = localStorage.getItem("user_id");
        if (data.marks[userId] === 1) {
            this.playerTurn = true;
            this.playerPos = 1;
            this.headerText.setText("Your turn!")
        } else {
            this.playerPos = 2;
            this.headerText.setText("Opponents turn!")
        }
    }

    opponentLeft() {
        this.headerText.setText("Opponent has left")
        this.playAIBtn.setVisible(true);
        this.playAIBtnText.setVisible(true);
    }

    endGame(data) {
        this.updateBoard(data.board)

        if (data.winner === this.playerPos) {
            this.headerText.setText("Winner!")
        } else if(data.winner === undefined) {
            this.headerText.setText("Tie!")
        } else {
            this.headerText.setText("You loose :(")
        }
    }

    //ep4
    nakamaListener() {
        Nakama.socket.onmatchdata = (result) => {
            const json_string = new TextDecoder().decode(result.data)
            const json = json_string ? JSON.parse(json_string): ""

            switch (result.op_code) {
                case 1:
                    this.gameStarted = true
                    this.setPlayerTurn(json)
                    break;
                case 2:
                    console.log(result.data)
                    this.updateBoard(json.board)
                    this.updatePlayerTurn()
                    break;
                case 3:
                    this.endGame(json)
                    break;
                case 6:
                    this.opponentLeft()
            }
        };
    }

    preload() {
        this.load.image("X", "assets/X.png");
        this.load.image("O", "assets/O.png");
    }

    create() {
        this.headerText = this.add
            .text(CONFIG.WIDTH / 2, 125, "Waiting for game to start", {
                fontFamily: "Arial",
                fontSize: "36px",
            })
            .setOrigin(0.5);

        const gridWidth = 300;
        const gridCellWidth = gridWidth / 3;

        const grid = this.add.grid(
            CONFIG.WIDTH / 2,
            CONFIG.HEIGHT / 2,
            gridWidth,
            gridWidth,
            gridCellWidth,
            gridCellWidth,
            0xffffff,
            0,
            0xffca27
        );

        const gridCenterX = grid.getCenter().x;
        const gridCenterY = grid.getCenter().y;

        const topY = gridCenterY - gridCellWidth;
        const bottomY = gridCenterY + gridCellWidth;

        const gridLeft = gridCenterX - gridCellWidth
        const gridRight = gridCenterX + gridCellWidth

        this.INDEX_TO_POS = {
            0: { 'x': gridLeft, 'y': topY },
            1: { 'x': gridCenterX, 'y': topY },
            2: { 'x': gridRight, 'y': topY },

            3: { 'x': gridLeft, 'y': gridCenterY },
            4: { 'x': gridCenterX, 'y': gridCenterY },
            5: { 'x': gridRight, 'y': gridCenterY },

            6: { 'x': gridLeft, 'y': bottomY },
            7: { 'x': gridCenterX, 'y': bottomY },
            8: { 'x': gridRight, 'y': bottomY }
        }

        this.nakamaListener()

        this.add
            .rectangle(
                gridCenterX - gridCellWidth,
                topY,
                gridCellWidth,
                gridCellWidth
            )
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", async () => {
                await Nakama.makeMove(0)
            });

        this.add
            .rectangle(gridCenterX, topY, gridCellWidth, gridCellWidth)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                Nakama.makeMove(1)
            });

        this.add
            .rectangle(
                gridCenterX + gridCellWidth,
                topY,
                gridCellWidth,
                gridCellWidth
            )
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                Nakama.makeMove(2)
            });

        this.add
            .rectangle(
                gridCenterX - gridCellWidth,
                gridCenterY,
                gridCellWidth,
                gridCellWidth
            )
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                Nakama.makeMove(3)
            });

        this.add
            .rectangle(gridCenterX, gridCenterY, gridCellWidth, gridCellWidth)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                Nakama.makeMove(4)
            });

        this.add
            .rectangle(
                gridCenterX + gridCellWidth,
                gridCenterY,
                gridCellWidth,
                gridCellWidth
            )
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                Nakama.makeMove(5)
            });

        this.add
            .rectangle(
                gridCenterX - gridCellWidth,
                bottomY,
                gridCellWidth,
                gridCellWidth
            )
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                Nakama.makeMove(6)
            });

        this.add
            .rectangle(gridCenterX, bottomY, gridCellWidth, gridCellWidth)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                Nakama.makeMove(7)
            });

        this.add
            .rectangle(
                gridCenterX + gridCellWidth,
                bottomY,
                gridCellWidth,
                gridCellWidth
            )
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                Nakama.makeMove(8)
            });

        this.playAIBtn = this.add
            .rectangle(CONFIG.WIDTH / 2, 680, 270, 70, 0xffca27)
            .setVisible(false)
            .setInteractive({ useHandCursor: true });

        this.playAIBtnText = this.add
            .text(CONFIG.WIDTH / 2, 680, "Continue with AI", {
                fontFamily: "Arial",
                fontSize: "36px",
            })
            .setVisible(false)
            .setOrigin(0.5);

        this.playAIBtn.on("pointerdown", async () => {
            await Nakama.inviteAI()
            this.playAIBtn.setVisible(false);
            this.playAIBtnText.setVisible(false);
        });

        this.playAIBtn.on("pointerover", () => {
            this.playAIBtn.setScale(1.1);
            this.playAIBtnText.setScale(1.1);
        });

        this.playAIBtn.on("pointerout", () => {
            this.playAIBtn.setScale(1);
            this.playAIBtnText.setScale(1);
        });
    }
}