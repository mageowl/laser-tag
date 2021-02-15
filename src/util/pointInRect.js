/**
 * Check if point is in rect.
 *
 * @export
 * @param {Phaser.Math.Vector2} point Point to check.
 * @param {Phaser.Geom.Rectangle} rect Rect to check.
 */
export default function pointInRect(point, rect) {
	return (
		point.x > rect.x &&
		point.x < rect.x + rect.width &&
		point.y > rect.y &&
		point.y < rect.y + rect.height
	);
}
