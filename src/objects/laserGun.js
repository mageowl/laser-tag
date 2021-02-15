import GameScene from "../scenes/game.js";

export class LaserGun {
	/**
	 * @param {Object} config Properties.
	 * @param {GameScene} scene Scene to attach to.
	 * @memberof LaserGun
	 */
	constructor(config, scene) {
		this.scene = scene;
		this.config = config;

		this.loaded = true;
		this.ray = scene.raycaster.createRay();
		this.graphics = scene.add.graphics().fillStyle(0xff0000);
	}

	shoot(position) {
		this.ray.setOrigin(position);
	}
}
