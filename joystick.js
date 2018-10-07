import { $v2 } from './HyPE.js';

function Joystick({ el, r, maxValue, isVariable = true }) {
	let vPosition = null;
	let vStart = null;

	el.addEventListener('touchstart', ({ touches }) => {
		if(touches && touches.length) {
			vStart = $v2(touches[0].pageX, touches[0].pageY);
		}
	}, false);

	el.addEventListener('touchmove', ({ touches }) => {
		if(touches && touches.length) {
			vPosition = $v2(touches[0].pageX, touches[0].pageY)
				.sub(vStart);
		}
	}, false);

	el.addEventListener('touchend', ({ touches }) => {
		vPosition = null;
	}, false);

	return {
		getValue() {
			if(!vPosition) return $v2();

			const v =  vPosition.clone();

			if(isVariable) {
				v.scale(maxValue / r);

				if(v.length() > maxValue) v.setLength(maxValue);
			} else {
				if(v.x || v.y) v.setLength(maxValue);
			}

			return v;
		}
	};
}

export default Joystick;
