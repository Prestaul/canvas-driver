import { $v2 } from './HyPE.js';

const LINE_WIDTH = 2;
const GAP_WIDTH = 2;
const LINE_OFFSET = (LINE_WIDTH + GAP_WIDTH) / 2;
const ANG_90 = Math.PI / 2;
const ANG_180 = Math.PI;
const ANG_270 = 3 * Math.PI / 2;
const ANG_360 = 2 * Math.PI;

function MapRenderer({ canvas, fillColor, lineColor, cellWidth, map }) {
	const cellHalfWidth = cellWidth / 2;
	const R1 = cellHalfWidth + LINE_OFFSET;
	const R2 = cellHalfWidth - LINE_OFFSET;

	const ctx = canvas.getContext('2d');

	const renderCell = {
		t() {
			ctx.beginPath();
			ctx.moveTo(-cellHalfWidth, -LINE_OFFSET);
			ctx.lineTo(cellHalfWidth, -LINE_OFFSET);
			ctx.lineTo(cellHalfWidth, -cellHalfWidth);
			ctx.lineTo(-cellHalfWidth, -cellHalfWidth);
			ctx.closePath();
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(-cellHalfWidth, -LINE_OFFSET);
			ctx.lineTo(cellHalfWidth, -LINE_OFFSET);
			ctx.moveTo(-cellHalfWidth, LINE_OFFSET);
			ctx.lineTo(cellHalfWidth, LINE_OFFSET);
			ctx.stroke();
		},
		r() {
			ctx.rotate(ANG_90);
			renderCell.t(ctx);
		},
		b() {
			ctx.rotate(ANG_180);
			renderCell.t(ctx);
		},
		l() {
			ctx.rotate(ANG_270);
			renderCell.t(ctx);
		},
		br() {
			ctx.translate(-cellHalfWidth, -cellHalfWidth);

			ctx.beginPath();
			ctx.moveTo(R1, 0);
			ctx.arc(0, 0, R1, 0, ANG_90, false);
			ctx.lineTo(0, cellWidth);
			ctx.lineTo(cellWidth, cellWidth);
			ctx.lineTo(cellWidth, 0);
			ctx.closePath();
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(R1, 0);
			ctx.arc(0, 0, R1, 0, ANG_90, false);
			ctx.moveTo(R2, 0);
			ctx.arc(0, 0, R2, 0, ANG_90, false);
			ctx.stroke();
		},
		bl() {
			ctx.rotate(ANG_90);
			renderCell.br(ctx);
		},
		tl() {
			ctx.rotate(ANG_180);
			renderCell.br(ctx);
		},
		tr() {
			ctx.rotate(ANG_270);
			renderCell.br(ctx);
		},
		otl() {
			ctx.translate(-cellHalfWidth, -cellHalfWidth);

			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(R2, 0);
			ctx.arc(0, 0, R2, 0, ANG_90, false);
			ctx.closePath();
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(R1, 0);
			ctx.arc(0, 0, R1, 0, ANG_90, false);
			ctx.moveTo(R2, 0);
			ctx.arc(0, 0, R2, 0, ANG_90, false);
			ctx.stroke();
		},
		otr() {
			ctx.rotate(ANG_90);
			renderCell.otl(ctx);
		},
		obr() {
			ctx.rotate(ANG_180);
			renderCell.otl(ctx);
		},
		obl() {
			ctx.rotate(ANG_270);
			renderCell.otl(ctx);
		},
		f() {
			ctx.fillRect(-cellHalfWidth, -cellHalfWidth, cellWidth, cellWidth);
		}
	};

	function mapOffset(vCenter) {
		const vOffset = vCenter.clone().translate(-canvas.width / 2, -canvas.height / 2);
		vOffset.x = Math.max(0, Math.min(vOffset.x, map[0].length * cellWidth - canvas.width));
		vOffset.y = Math.max(0, Math.min(vOffset.y, map.length * cellWidth - canvas.height));
		return vOffset;
	}

	function render(vTopLeft) {
		// ctx.clearRect(0, 0, canvas.width, canvas.height);
		const firstRow = Math.floor(vTopLeft.y / cellWidth);
		const firstCol = Math.floor(vTopLeft.x / cellWidth);
		const lastRow = firstRow + Math.ceil(canvas.height / cellWidth);
		const lastCol = firstCol + Math.ceil(canvas.width / cellWidth);

		ctx.save();

		ctx.fillStyle = fillColor;
		ctx.strokeStyle = lineColor;
		ctx.lineWidth = LINE_WIDTH;

		ctx.translate(-vTopLeft.x, -vTopLeft.y);
		ctx.translate(cellHalfWidth, cellHalfWidth);

		for(let r = firstRow; r <= lastRow && r < map.length; r++) {
			const row = map[r];
			for(let c = firstCol; c <= lastCol && c < row.length; c++) {
				if(row[c]) {
					ctx.save();
					ctx.translate(c * cellWidth, r * cellWidth);
					renderCell[row[c]](ctx);
					ctx.restore();
				}
			}
		}

		ctx.restore();

		return this;
	}

	render.getOffset = mapOffset;

	return render;
}

export default MapRenderer;
