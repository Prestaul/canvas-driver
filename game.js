import { $v2 } from './HyPE.js';
import Player from './player.js';
import MapConstraint from './map-constraint.js';
import MapHitTest from './map-hit-test.js';
import MapRenderer from './map-renderer.js';
import renderGrid from './render-grid.js';
import Joystick from './joystick.js';
import keyboardState from './keyboard-state.js';

function Game({bottomMapData, topMapData, elMap, elPlayers, elJoystickShoot, elJoystickMove}) {
	const ctxMap = elMap.getContext('2d');
	const ctxPlayers = elPlayers.getContext('2d');
	const SHIP_SPEED = 5;
	const BULLET_SPEED = 8;
	let running = false;

	const joystickShoot = Joystick({
		el: elJoystickShoot,
		r: 50,
		maxValue: BULLET_SPEED,
		isVariable: false
	});

	const joystickMove = Joystick({
		el: elJoystickMove,
		r: 50,
		maxValue: SHIP_SPEED
	});

	const constrainMap = MapConstraint({
		cellWidth: 100,
		map: topMapData
	});

	const hitTestMap = MapHitTest({
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
		targeting: joystickShoot,
		hitTestMap
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
		const time = Date.now();

		if(keyboardState.left) {
			player.pos.x -= SHIP_SPEED;
		} else if (keyboardState.right) {
			player.pos.x += SHIP_SPEED;
		}

		if(keyboardState.up) {
			player.pos.y -= SHIP_SPEED;
		} else if (keyboardState.down) {
			player.pos.y += SHIP_SPEED;
		}

		player.tick(time);

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
