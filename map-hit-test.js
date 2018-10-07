import { $v2 } from './HyPE.js';

const LINE_WIDTH = 2;
const GAP_WIDTH = 2;
const LINE_OFFSET = (LINE_WIDTH + GAP_WIDTH) / 2;

function MapConstraint({ cellWidth, map }) {
	const cellHalfWidth = cellWidth / 2;
	const R1 = cellHalfWidth + LINE_OFFSET;
	const R2 = cellHalfWidth - LINE_OFFSET;

	const cellHitTest = {
		t({pos, r = 0}) {
			const y = (pos.y % cellWidth) - r;
			return y < R1;
		},
		b({pos, r = 0}) {
			const y = (pos.y % cellWidth) + r;
			return y > R2;
		},
		l({pos, r = 0}) {
			const x = (pos.x % cellWidth) - r;
			return x < R1;
		},
		r({pos, r = 0}) {
			const x = (pos.x % cellWidth) + r;
			return x > R2;
		},
		br({pos, r = 0}, offset) {
			offset = offset || $v2(pos.x % cellWidth, pos.y % cellWidth);
			const overlap = offset.length() + r - R2;
			return overlap > 0;
		},
		bl(p) {
			const offset = $v2(p.pos.x % cellWidth - cellWidth, p.pos.y % cellWidth);
			return cellHitTest.br(p, offset);
		},
		tl(p) {
			const offset = $v2(p.pos.x % cellWidth - cellWidth, p.pos.y % cellWidth - cellWidth);
			return cellHitTest.br(p, offset);
		},
		tr(p) {
			const offset = $v2(p.pos.x % cellWidth, p.pos.y % cellWidth - cellWidth);
			return cellHitTest.br(p, offset);
		},
		otl({pos, r = 0}, offset) {
			offset = offset || $v2(pos.x % cellWidth, pos.y % cellWidth);
			const overlap = R1 + r - offset.length();
			return overlap > 0;
		},
		otr(p) {
			const offset = $v2(p.pos.x % cellWidth - cellWidth, p.pos.y % cellWidth);
			return cellHitTest.otl(p, offset);
		},
		obr(p) {
			const offset = $v2(p.pos.x % cellWidth - cellWidth, p.pos.y % cellWidth - cellWidth);
			return cellHitTest.otl(p, offset);
		},
		obl(p) {
			const offset = $v2(p.pos.x % cellWidth, p.pos.y % cellWidth - cellWidth);
			return cellHitTest.otl(p, offset);
		},
		f() {
			return true;
		}
	};

	function mapHitTest(p) {
		const idxRow = Math.floor(p.pos.y / cellWidth);
		const idxCol = Math.floor(p.pos.x / cellWidth);

		const row = map[idxRow];
		const cell = row && row[idxCol];
		const hitTest = cell && cellHitTest[cell];

		return hitTest ? hitTest(p) : false;
	}

	return mapHitTest;
}

export default MapConstraint;
