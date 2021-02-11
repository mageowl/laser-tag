export default class Player {
	constructor(scene, x, y) {
		this.scene = scene;

		this.sprite = scene.physics.add.sprite(x, y, "player", 4).setSize(30, 30);
		this.cursor = scene.physics.add
			.sprite(x, y, "target")
			.setDisplaySize(10, 10)
			.setCollideWorldBounds(true)
			.setScrollFactor(0);

		// Shadows
		this.shadowGraphics = scene.add.graphics({
			fillStyle: { color: 0xffffff, alpha: 0.3 }
		});
		this.viewRay = scene.raycaster
			.createRay({ origin: { x, y } })
			.setRayRange(1000);

		this.movementKeys = scene.input.keyboard.addKeys({
			up: "W",
			left: "A",
			down: "S",
			right: "D"
		});

		scene.input.on("pointermove", this.handlePointerMove, this);
	}

	update() {
		this.sprite.rotation = Phaser.Math.Angle.Between(
			this.sprite.x,
			this.sprite.y,
			this.cursor.x + this.scene.cameras.main.scrollX,
			this.cursor.y + this.scene.cameras.main.scrollY
		);

		this.sprite.setVelocity(
			(-this.movementKeys.left.isDown + this.movementKeys.right.isDown) * 300,
			(-this.movementKeys.up.isDown + this.movementKeys.down.isDown) * 300
		);

		this.viewRay.setOrigin(this.sprite.x, this.sprite.y);
		const intersections = this.viewRay.castCircle();
		if (intersections.length) this.drawShadows(intersections);
	}

	handlePointerMove(data) {
		if (this.scene.input.mouse.locked) {
			this.cursor.x += data.movementX;
			this.cursor.y += data.movementY;
		}
	}

	drawShadows(intersections) {
		//clear ray visualisation
		this.shadowGraphics.clear();

		//clear field of view mask
		this.shadowGraphics.clear();
		//draw fov mask
		this.shadowGraphics.fillPoints(intersections);
	}
}
