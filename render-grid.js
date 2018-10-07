export default function renderGrid(canvas, cellWidth, color) {
	const ctx = canvas.getContext('2d');

	ctx.save();
	ctx.strokeStyle = color;
	ctx.lineWidth = 2;

	ctx.beginPath();

	let x = cellWidth;
	let y = canvas.height;
	while(x < canvas.width) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, y);
		x += cellWidth;
	}

	x = canvas.width;
	y = cellWidth;
	while(y < canvas.height) {
		ctx.moveTo(0, y);
		ctx.lineTo(x, y);
		y += cellWidth;
	}

	ctx.stroke();
	ctx.restore();
}
