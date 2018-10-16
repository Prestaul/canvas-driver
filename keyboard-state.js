const keyboardState = {
	left: false,
	right: false,
	up: false,
	down: false
};

addEventListener('keydown', e => {
	if(e.repeat) return;

	if(e.key.startsWith('Arrow')) {
		e.preventDefault();
		keyboardState[e.key.substr(5).toLowerCase()] = true;
	}
});

addEventListener('keyup', e => {
	if(e.repeat) return;

	if(e.key.startsWith('Arrow')) {
		e.preventDefault();
		keyboardState[e.key.substr(5).toLowerCase()] = false;
	}
});

export default keyboardState;
