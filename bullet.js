import { Particle } from './HyPE.js';

const TWO_PI = Math.PI * 2;
const RADIUS = 3;

const Bullet = Particle.extend(function({ x, y, velocity, invmass, vx, vy }) {
	this.velocity = velocity;
	return this._parent(x, y, invmass, vx, vy);
}, {
	tick() {
		this.pos.translate(this.velocity.x, this.velocity.y);

		return this;
	},
	render(ctx, vOffset) {
		const {pos} = this;

		ctx.save();

		ctx.strokeStyle = '#A00';
		ctx.fillStyle = '#300';
		ctx.lineWidth = 2;

		ctx.translate(pos.x - vOffset.x, pos.y - vOffset.y);

		ctx.beginPath();
		ctx.moveTo(RADIUS, 0);
		ctx.arc(0, 0, RADIUS, 0, TWO_PI, false);

		ctx.fill();
		ctx.stroke();

		ctx.restore();

		return this;
	}
});

export default Bullet;
