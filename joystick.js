import { $v2 } from './HyPE.js';

function Joystick({ el, r, maxValue, isVariable = true }) {
	let vPosition = null;
	let vStart = null;

	el.addEventListener('touchstart', e => {
		const { targetTouches } = e;
		if(targetTouches && targetTouches.length) {
			e.preventDefault();
			vStart = $v2(targetTouches[0].pageX, targetTouches[0].pageY);
		}
	}, false);

	el.addEventListener('touchmove', e => {
		const { targetTouches } = e;
		if(targetTouches && targetTouches.length) {
			e.preventDefault();
			vPosition = $v2(targetTouches[0].pageX, targetTouches[0].pageY)
				.sub(vStart);
		}
	}, false);

	el.addEventListener('touchend', e => {
		const { targetTouches } = e;
		if(!targetTouches.length) {
			e.preventDefault();
			vPosition = null;
		}
	}, false);

	return {
		get isPressed() {
			return Boolean(vPosition && (vPosition.x || vPosition.y));
		},
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
