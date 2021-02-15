import Player from "../player.js";

export default class GameScene extends Phaser.Scene {
	preload() {
		this.load.image("tileset-sand", "assets/sprites/tileset/sand.png");
		this.load.image("player", "assets/sprites/skins/basic-light.png");
		this.load.image("target", "assets/sprites/crosshair.png");
		this.load.tilemapTiledJSON("map", "assets/tilemap/level.json");
	}

	create() {
		// Raycasting
		this.raycaster = this.raycasterPlugin.createRaycaster({
			boundingBox: new Phaser.Geom.Rectangle(0, 0, 7500, 7500)
		});

		// World bounds
		this.physics.world.setBounds(0, 0, 7500, 7500);

		// Tileset
		const map = this.make.tilemap({ key: "map" });
		const tileset = map.addTilesetImage("tiles", "tileset-sand");
		const floor = map.createLayer("Floor", tileset, 0, 0);
		const walls = map
			.createLayer("Walls", tileset, 0, 0)
			.setCollisionByProperty({ collision: true })
			.setDepth(2);

		this.raycaster.mapGameObjects(walls, false, {
			collisionTiles: [1, 2, 3, 4, 7, 8, 9, 10, 13, 14, 15, 16, 19, 20, 21, 22]
		});

		// Player
		this.player = new Player(this, 400, 300);
		this.physics.add.collider(this.player.sprite, walls);
		this.cameras.main
			.setBounds(0, 0, 7500, 7500)
			.startFollow(this.player.sprite, true, 0.09, 0.09);
	}

	update() {
		this.player.update();
	}
}
