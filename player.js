import { Particle } from './HyPE.js';

const TWO_PI = Math.PI * 2;

const Player = Particle.extend(function({ x, y, r, invmass, vx, vy, movement, targeting }) {
	this.r = r;
	this.movement = movement;
	this.targeting = targeting;
	this.angle = 0;
	return this._parent(x, y, invmass, vx, vy);
}, {
	tick() {
		const m = this.movement.getValue();
		this.pos.translate(m.x, m.y);

		if(this.targeting.isPressed) this.angle = this.targeting.getValue().angle();

		return this;
	},
	render(ctx, vOffset) {
		const {pos, r} = this;

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
