import GameScene from "./scenes/game.js";
import MainMenuScene from "./scenes/menu.js";

/** @type {Phaser.Core.Config} */
const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 500,
	physics: {
		default: "arcade"
	},
	scene: [MainMenuScene, GameScene],
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
