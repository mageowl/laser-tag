import { LaserGun } from "./laserGun.js";

export default class Player {
	/**
	 * @param {Phaser.Scene} scene
	 * @param {number} x
	 * @param {number} y
	 * @memberof Player
	 */
	constructor(scene, x, y) {
		this.scene = scene;

		this.sprite = scene.physics.add
			.sprite(x, y, "player", 4)
			.setSize(30, 30)
			.setDepth(2)
			.setCollideWorldBounds(true);
		this.cursor = scene.add
			.sprite(x, y, "target")
			.setDisplaySize(10, 10)
			.setScrollFactor(0)
			.setDepth(3);

		// Shadows/Raycasting
		this.shadowMaskGraphics = scene.add.graphics({
			fillStyle: { color: 0xffffff, alpha: 0 }
		});

		this.shadowMask = new Phaser.Display.Masks.GeometryMask(
			scene,
			this.shadowMaskGraphics
		).setInvertAlpha(true);

		this.shadowGraphics = scene.add
			.graphics()
			.fillStyle(0x0, 0.6)
			.setMask(this.shadowMask)
			.fillRect(0, 0, 7500, 7500)
			.setDepth(1);

		this.shadowRay = scene.raycaster.createRay();

		// Lasers
		this.gun = new LaserGun(
			{
				reloadTime: 100
			},
			scene
		);

		// Input
		this.movementKeys = scene.input.keyboard.addKeys({
			up: "W",
			left: "A",
			down: "S",
			right: "D"
		});

		scene.input.on("pointermove", this.handlePointerMove, this);
	}

	update() {
		// Look at cursor
		this.sprite.rotation = Phaser.Math.Angle.Between(
			this.sprite.x,
			this.sprite.y,
			this.cursor.x + this.scene.cameras.main.scrollX,
			this.cursor.y + this.scene.cameras.main.scrollY
		);

		// Movement
		this.sprite.setVelocity(
			(-this.movementKeys.left.isDown + this.movementKeys.right.isDown) * 300,
			(-this.movementKeys.up.isDown + this.movementKeys.down.isDown) * 300
		);

		if (this.scene.input.mousePointer.isDown) {
		}

		// Cast shadows
		const intersections = this.shadowRay.castCircle();
		this.shadowRay.setOrigin(this.sprite.x, this.sprite.y);
		if (intersections.length) this.drawShadows(intersections);
	}

	handlePointerMove(data) {
		if (this.scene.input.mouse.locked) {
			this.cursor.x = Phaser.Math.Clamp(
				this.cursor.x + data.movementX,
				5,
				this.scene.cameras.main.width - 5
			);
			this.cursor.y = Phaser.Math.Clamp(
				this.cursor.y + data.movementY,
				5,
				this.scene.cameras.main.height - 5
			);
		}
	}

	drawShadows(intersections) {
		// draw fov mask
		this.shadowMaskGraphics.clear();
		this.shadowMaskGraphics.fillPoints(intersections);
	}
}
