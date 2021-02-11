import Player from "./player.js";

export default class GameScene extends Phaser.Scene {
	preload() {
		this.load.image("tileset-sand", "assets/sprites/tileset/sand.png");
		this.load.image("player", "assets/sprites/skins/basic-light.png");
		this.load.image("target", "assets/sprites/crosshair.png");
		this.load.tilemapTiledJSON("map", "assets/tilemap/level.json");
	}

	create() {
		// Tileset
		const map = this.make.tilemap({ key: "map" });
		const tileset = map.addTilesetImage("tiles", "tileset-sand");
		const floor = map.createLayer("Floor", tileset, 0, 0);
		const walls = map
			.createLayer("Walls", tileset, 0, 0)
			.setCollisionByProperty({ collision: true });

		this.raycaster.mapGameObjects(walls, false, {
			collisionTiles: [2, 5, 6, 7, 10, 12, 15, 16, 17]
		});

		// Player
		this.player = new Player(this, 400, 300);
		this.physics.add.collider(this.player.sprite, walls);
		this.cameras.main.startFollow(this.player.sprite, true, 0.09, 0.09);
	}

	update() {
		this.player.update();
	}
}
