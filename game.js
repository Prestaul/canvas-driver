import { $v2 } from './HyPE.js';
import Player from './player.js';
import MapConstraint from './map-constraint.js';
import MapRenderer from './map-renderer.js';
import renderGrid from './render-grid.js';
import Joystick from './joystick.js';
import keyboardState from './keyboard-state.js';

function Game({bottomMapData, topMapData, elMap, elPlayers, elJoystickShoot, elJoystickMove}) {
	const ctxMap = elMap.getContext('2d');
	const ctxPlayers = elPlayers.getContext('2d');
	const SPEED = 8;
	let running = false;

	const joystickShoot = Joystick({
		el: elJoystickShoot,
		r: 50,
		maxValue: 1
	});

	const joystickMove = Joystick({
		el: elJoystickMove,
		r: 50,
		maxValue: SPEED
	});

	const constrainMap = MapConstraint({
		cellWidth: 100,
		map: topMapData
	});

	const renderTopMap = MapRenderer({
		canvas: elMap,
		fillColor: '#000042',
		lineColor: '#113EDD',
		cellWidth: 100,
		map: topMapData
	});

	const renderBottomMap = MapRenderer({
		canvas: elMap,
		fillColor: '#000022',
		lineColor: '#000077',
		cellWidth: 200,
		map: bottomMapData
	});

	const player = new Player({
		x: 200,
		y: 200,
		r: 25,
		movement: joystickMove,
		targeting: joystickShoot
	});

	function render() {
		ctxMap.clearRect(0, 0, elMap.width, elMap.height);
		ctxPlayers.clearRect(0, 0, elPlayers.width, elPlayers.height);

		const vOffset = renderTopMap.getOffset(player.pos);

		renderGrid(elMap, 50, '#005');
		renderBottomMap(vOffset);
		renderTopMap(vOffset);

		player.render(ctxPlayers, vOffset);
	}

	function tick() {
		if(keyboardState.left) {
			player.pos.x -= SPEED;
		} else if (keyboardState.right) {
			player.pos.x += SPEED;
		}

		if(keyboardState.up) {
			player.pos.y -= SPEED;
		} else if (keyboardState.down) {
			player.pos.y += SPEED;
		}

		player.move();

		constrainMap(player);

		render();

		if(running) requestAnimationFrame(tick);
	}

	return {
		get isRunning() {
			return running;
		},
		start() {
			if(running) return;

			running = true;
			tick();

			return this;
		},
		stop() {
			running = false;

			return this;
		},
		toggle() {
			running = !running;

			if(running) tick();

			return this;
		},
		resize(width, height) {
			elMap.width = elPlayers.width = width;
			elMap.height = elPlayers.height = height;
			render();

			return this;
		}
	};
}

export default Game;
