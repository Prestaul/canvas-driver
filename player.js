import { Particle } from './HyPE.js';
import Bullet from './bullet.js';

const TWO_PI = Math.PI * 2;
const BULLET_RATE = 100;

const Player = Particle.extend(function({ x, y, r, invmass, vx, vy, movement, targeting, hitTestMap }) {
	this.r = r;
	this.movement = movement;
	this.targeting = targeting;
	this.hitTestMap = hitTestMap;
	this.angle = 0;
	this.bullets = [];
	this.lastBulletTime = Date.now();
	return this._parent(x, y, invmass, vx, vy);
}, {
	tick(time) {
		const {bullets, lastBulletTime, movement, pos, r, targeting, hitTestMap} = this;

		const m = movement.getValue();
		pos.translate(m.x, m.y);

		if(targeting.isPressed) {
			this.angle = targeting.getValue().angle();
		} else {
			this.angle = movement.getValue().angle();
		}

		if(targeting.isPressed && (time - lastBulletTime) > BULLET_RATE) {
			this.lastBulletTime = time;
			const velocity = targeting.getValue();
			const vPos = velocity.clone().setLength(r).translate(pos.x, pos.y);
			bullets.push(new Bullet({
				x: vPos.x,
				y: vPos.y,
				velocity
			}));
		}

		bullets.forEach(bullet => bullet.tick());
		this.bullets = bullets.filter(bullet => !hitTestMap(bullet));

		return this;
	},
	render(ctx, vOffset) {
		const {pos, r, bullets} = this;

		bullets.forEach(bullet => bullet.render(ctx, vOffset));

		ctx.save();

		ctx.strokeStyle = '#A00';
		ctx.fillStyle = '#300';
		ctx.lineWidth = 2;

		ctx.translate(pos.x - vOffset.x, pos.y - vOffset.y);

		ctx.rotate(this.angle);

		ctx.beginPath();
		ctx.moveTo(r, 0);
		ctx.arc(0, 0, r, 0, TWO_PI, false);

		ctx.fill();

		ctx.moveTo(0.2 * r, 0.3 * r);
		ctx.lineTo(1.2 * r, 0.3 * r);
		ctx.moveTo(0.2 * r, -0.3 * r);
		ctx.lineTo(1.2 * r, -0.3 * r);
		ctx.stroke();

		ctx.restore();

		return this;
	}
});

export default Player;
