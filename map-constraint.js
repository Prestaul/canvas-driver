import { $v2 } from './HyPE.js';

const LINE_WIDTH = 2;
const GAP_WIDTH = 2;
const LINE_OFFSET = (LINE_WIDTH + GAP_WIDTH) / 2;

function MapConstraint({ cellWidth, map }) {
	const cellHalfWidth = cellWidth / 2;
	const R1 = cellHalfWidth + LINE_OFFSET;
	const R2 = cellHalfWidth - LINE_OFFSET;

	const constrainCell = {
		t({pos, r = 0}) {
			const y = (pos.y % cellWidth) - r;
			if(y < R1) pos.y += R1 - y;
		},
		b({pos, r = 0}) {
			const y = (pos.y % cellWidth) + r;
			if(y > R2) pos.y -= y - R2;
		},
		l({pos, r = 0}) {
			const x = (pos.x % cellWidth) - r;
			if(x < R1) pos.x += R1 - x;
		},
		r({pos, r = 0}) {
			const x = (pos.x % cellWidth) + r;
			if(x > R2) pos.x -= x - R2;
		},
		br({pos, r = 0}, offset) {
			offset = offset || $v2(pos.x % cellWidth, pos.y % cellWidth);
			const overlap = offset.length() + r - R2;
			if(overlap > 0) {
				offset.setLength(-overlap);
				pos.translate(offset.x, offset.y);
			}
		},
		bl(p) {
			const offset = $v2(p.pos.x % cellWidth - cellWidth, p.pos.y % cellWidth);
			constrainCell.br(p, offset);
		},
		tl(p) {
			const offset = $v2(p.pos.x % cellWidth - cellWidth, p.pos.y % cellWidth - cellWidth);
			constrainCell.br(p, offset);
		},
		tr(p) {
			const offset = $v2(p.pos.x % cellWidth, p.pos.y % cellWidth - cellWidth);
			constrainCell.br(p, offset);
		},
		otl({pos, r = 0}, offset) {
			offset = offset || $v2(pos.x % cellWidth, pos.y % cellWidth);
			const overlap = R1 + r - offset.length();
			if(overlap > 0) {
				offset.setLength(overlap);
				pos.translate(offset.x, offset.y);
			}
		},
		otr(p) {
			const offset = $v2(p.pos.x % cellWidth - cellWidth, p.pos.y % cellWidth);
			constrainCell.otl(p, offset);
		},
		obr(p) {
			const offset = $v2(p.pos.x % cellWidth - cellWidth, p.pos.y % cellWidth - cellWidth);
			constrainCell.otl(p, offset);
		},
		obl(p) {
			const offset = $v2(p.pos.x % cellWidth, p.pos.y % cellWidth - cellWidth);
			constrainCell.otl(p, offset);
		},
		f() {}
	};

	function constrain(p) {
		const idxRow = Math.floor(p.pos.y / cellWidth);
		const idxCol = Math.floor(p.pos.x / cellWidth);

		const row = map[idxRow];
		const cell = row && row[idxCol];
		const constraint = cell && constrainCell[cell];

		if(constraint) constraint(p);

		return this;
	}

	return constrain;
}

export default MapConstraint;
