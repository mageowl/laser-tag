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

		this.joinPublicBtn = this.add
			.text(center, 200, "Join Public Game")
			.setFontFamily("Jura")
			.setFontSize(24)
			.setColor("#f0f0f0")
			.setShadow(0, 3, "#f00")
			.setOrigin(0.5, 0)
			.setVisible(false);

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

		if (
			pointInRect(
				new Phaser.Math.Vector2(
					this.input.mousePointer.worldX,
					this.input.mousePointer.worldY
				),
				this.joinPublicBtn
					.getBounds()
					.setPosition(
						this.joinPublicBtn.x - this.joinPublicBtn.getBounds().width / 2,
						this.joinPublicBtn.y
					)
			)
		) {
			this.joinPublicBtn.setShadowOffset(0, 5);
			this.joinPublicBtn.y = 198;
		} else {
			this.joinPublicBtn.setShadowOffset(0, 3);
			this.joinPublicBtn.y = 200;
		}
	}
}
