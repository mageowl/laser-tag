import GameScene from "./scenes/gameScene.js";

/** @type {Phaser.Core.Config} */
const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 500,
	physics: {
		default: "arcade"
	},
	scene: new GameScene(),
	plugins: {
		scene: [
			{
				key: "PhaserRaycaster",
				plugin: PhaserRaycaster,
				mapping: "raycasterPlugin"
			}
		]
	}
};

const game = new Phaser.Game(config);

game.canvas.addEventListener("mousedown", (e) => {
	game.input.mouse.requestPointerLock();
});
