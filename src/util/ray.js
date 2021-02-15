export class Line {
	constructor(x1, y1, x2, y2) {
		this.p1 = new Phaser.Math.Vector2(x1, y1);
		this.p2 = new Phaser.Math.Vector2(x2, y2);
	}

	/**
	 * Draw line.
	 *
	 * @param {Phaser.GameObjects.Graphics} grapics
	 * @memberof Line
	 */
	draw(grapics) {
		grapics.strokeLineShape(
			new Phaser.Geom.Line(this.p1.x, this.p1.y, this.p2.x, this.p2.y)
		);
	}
}

export class Ray {
	constructor(px, py, dx, dy) {
		this.pos = new Phaser.Math.Vector2(px, py);
		this.dir = new Phaser.Math.Vector2(dx, dy);
	}

	/**
	 * Draw ray direction.
	 *
	 * @param {Phaser.GameObjects.Graphics} grapics
	 * @memberof Line
	 */
	draw(grapics) {
		grapics.strokeLineShape(
			new Phaser.Geom.Line(
				this.pos.x,
				this.pos.y,
				this.pos.x + this.dir.x * 10,
				this.pos.y + this.dir.y * 10
			)
		);
	}

	setPos(x, y) {
		this.pos.x = x;
		this.pos.y = y;
		return this;
	}

	lookAt(x, y) {
		this.dir.x = x - this.pos.x;
		this.dir.y = y - this.pos.y;
		this.dir.normalize();
		return this;
	}

	clone() {
		return new Ray(this.pos.x, this.pos.y, this.dir.x, this.dir.y);
	}

	rotate(angle) {
		this.dir.rotate(Phaser.Math.DegToRad(angle));
		return this;
	}

	cast(line) {
		const x1 = line.p1.x;
		const y1 = line.p1.y;
		const x2 = line.p2.x;
		const y2 = line.p2.y;

		const x3 = this.pos.x;
		const y3 = this.pos.y;
		const x4 = this.pos.x + this.dir.x;
		const y4 = this.pos.y + this.dir.y;

		const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		// Lines are parallel!
		if (den == 0) return;

		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

		// Check if they hit...
		if (t > 0 && t < 1 && u > 0) {
			return new Phaser.Math.Vector2(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
		} else return;
	}
}

export class ViewCaster {
	constructor(x, y) {
		this.pos = new Phaser.Math.Vector2(x, y);

		/** @type {Line[]} */
		this.lines = [];
	}

	track(line) {
		this.lines.push(line);
		return this;
	}

	trackRect(x1, y1, x2, y2) {
		this.lines.push(
			new Line(x1 - 1, y1, x2 + 1, y1),
			new Line(x1, y1 - 1, x1, y2 + 1),
			new Line(x1 - 1, y2, x2 + 1, y2),
			new Line(x2, y1 - 1, x2, y2 + 1)
		);
		return this;
	}

	setPos(x, y) {
		this.pos = new Phaser.Math.Vector2(x, y);
		return this;
	}

	getPoints() {
		let points = [...new Set(this.lines.flatMap((line) => [line.p1, line.p2]))];
		let intersections = [];

		for (const trackedPoint of points) {
			const centerRay = new Ray(this.pos.x, this.pos.y, 0, 0).lookAt(
				trackedPoint.x,
				trackedPoint.y
			);
			const rays = [
				centerRay,
				centerRay.clone().rotate(1),
				centerRay.clone().rotate(-1)
			];

			let record = Infinity;
			let closest = null;

			for (const line of this.lines) {
				for (const ray of rays) {
					const pt = centerRay.cast(line);
					if (pt) {
						const distance = Phaser.Math.Distance.BetweenPoints(this.pos, pt);
						if (distance < record) {
							closest = pt;
							record = distance;
						}
					}
				}
			}

			if (closest) {
				intersections.push({ pt: closest, ray: centerRay });
			}
		}

		return intersections
			.sort(
				({ ray: rayA }, { ray: rayB }) =>
					Phaser.Math.RadToDeg(rayA.dir.angle()) -
					Phaser.Math.RadToDeg(rayB.dir.angle())
			)
			.map(({ pt }) => pt);
	}
}
