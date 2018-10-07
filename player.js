import { Particle } from './HyPE.js';

const TWO_PI = Math.PI * 2;

const Player = Particle.extend(function({ x, y, r, invmass, vx, vy }) {
	this.r = r;
	return this._parent(x, y, invmass, vx, vy);
}, {
	move(velocity) {
		this.pos.translate(velocity.x, velocity.y);

		return this;
	},
	render(ctx, vOffset) {
		const {pos, r} = this;

		ctx.save();

		ctx.strokeStyle = '#A00';
		ctx.fillStyle = '#300';
		ctx.lineWidth = 2;

		ctx.translate(pos.x - vOffset.x, pos.y - vOffset.y);

		ctx.beginPath();
		ctx.moveTo(r, 0);
		ctx.arc(0, 0, r, 0, TWO_PI, false);

		ctx.fill();
		ctx.stroke();

		ctx.restore();

		return this;
	}
});

export default Player;
