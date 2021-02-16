import pointInRect from "../util/pointInRect.js";

export default class MainMenuScene extends Phaser.Scene {
	constructor() {
		super({ key: "mainMenu", active: true });
	}

	preload() {
		this.load.setBaseURL("assets");

		this.load.image("title", "sprites/gui/title.png");
		this.load.image("bg", "sprites/gui/title_background.png");
		this.load.image("cursor", "sprites/gui/cursor.png");
	}

	create() {
		const center = this.scale.width / 2;

		// Menu
		this.bg = this.add.image(0, 0, "bg").setOrigin(0, 0).setVisible(false);
		this.titleImage = this.add.sprite(center, 90, "title").setVisible(false);

		// Buttons
		this.btns = [];

		this.joinPublicBtn = this.add
			.text(center, 200, "Join Public Game")
			.setFontFamily("Jura")
			.setFontSize(24)
			.setColor("#f0f0f0")
			.setShadow(0, 3, "#000")
			.setOrigin(0.5, 0)
			.setVisible(false)
			.setInteractive();
		this.addButton(this.joinPublicBtn, "joinPublic");

		// Intro
		this.introText = this.add
			.text(center - 127.5, 64, "")
			.setFontSize(48)
			.setFontFamily("Jura");
		this.textCursor = this.add
			.sprite(center - 127.5, 64, "cursor")
			.setOrigin(0.5, 0);

		this.introTickEvent = this.time.addEvent({
			callback: this.introTick,
			callbackScope: this,
			delay: 100,
			loop: true
		});
		this.ticks = 0;

		this.flashGraphics = this.add.graphics().fillStyle(0xffffff, 1).setDepth(1);
	}

	introTick() {
		if (this.ticks <= 9) {
			this.textCursor.x += 26;
			const text = "LASER TAG";
			this.introText.text = text.slice(0, this.ticks + 1);
		} else if (this.ticks == 15) {
			this.flashGraphics.fillRect(0, 0, this.scale.width, this.scale.height);
		} else if (this.ticks < 15) {
			this.textCursor.setVisible(this.ticks % 2);
		} else if (this.ticks > 15) {
			this.flashGraphics.clear();
			this.introText.setVisible(false);
			this.textCursor.setVisible(false);
			this.titleImage.setVisible(true);
			this.bg.setVisible(true);
			this.joinPublicBtn.setVisible(true);

			this.introTickEvent.destroy();
		}

		this.ticks++;
	}

	update() {
		this.titleImage.y = 90 + Math.sin(this.time.now / 300) * 10;

		this.btns.forEach((btn) => {
			if (btn.state == "hover") {
				btn.obj.setShadowOffset(0, 5);
				btn.obj.y = 198;
				btn.obj.setBackgroundColor("#0000");
			} else if (btn.state == "active") {
				btn.obj.setBackgroundColor("#f00");
				btn.obj.setShadowOffset(0, 3);
				btn.obj.y = 200;

				switch (btn.id) {
					case "joinPublic":
						this.scene.start("game");
				}
			} else {
				btn.obj.setShadowOffset(0, 3);
				btn.obj.y = 200;
				btn.obj.setBackgroundColor("#0000");
			}
		});
	}

	/**
	 * Adds a button to the main menu.
	 *
	 * @param {Phaser.GameObjects.GameObject} obj
	 * @memberof MainMenuScene
	 */
	addButton(obj, id) {
		obj.input.cursor = "pointer";
		obj.on(
			"pointerover",
			() => (this.btns.find((btn) => btn.id == id).state = "hover")
		);
		obj.on(
			"pointerout",
			() => (this.btns.find((btn) => btn.id == id).state = "rest")
		);
		obj.on(
			"pointerdown",
			() => (this.btns.find((btn) => btn.id == id).state = "active")
		);
		obj.on(
			"pointerup",
			() => (this.btns.find((btn) => btn.id == id).state = "hover")
		);
		this.btns.push({ id, obj, state: "rest" });
	}
}
