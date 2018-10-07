Function.prototype.extend = function(Constructor, prototype) {
	if(typeof Constructor === 'object' && prototype === undefined) {
		prototype = Constructor;
		Constructor = function Constructor() {
			return this._parent.apply(this, arguments);
		};
	}
	var Parent = this,
		p = Constructor.prototype = new Parent();

	Constructor._parent = p._parent = function() {
		if(Parent._parent) this._parent = Parent._parent;
		Parent.apply(this, arguments);
		delete this._parent;
	};

	for(var prop in prototype)
		p[prop] = prototype[prop];

	return Constructor;
};


/**
 * HyPE (The HyPE Physics Engine)
 * High Plains Technologies Physics Engine (Don't worry, there is a y in technology...  and physics...)
 */

const HyPE = {
	PRECISION: 1e-6,
	INTERVAL: 1
};

/**
 * Shortcut to create a 2D vector
 */
export function $v2(x, y) {
	return new HyPE.Vector2(x || 0, y || 0);
}

/**
 * Shortcut to create a 3D vector
 */
export function $v3(x, y, z) {
	return new HyPE.Vector3(x || 0, y || 0, z || 0);
}


/**
 * Class: Vector2
 */
HyPE.Vector2 = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
};
HyPE.Vector2.prototype = {
	/**
	 * Clone this vector
	 */
	clone: function() {
		return new HyPE.Vector2(this.x, this.y);
	},

	/**
	 * The toString method
	 */
	toString: function() {
		return '[' + this.x.toFixed(3) + ', ' + this.y.toFixed(3) + '] (' + this.length().toFixed(3) + ')';
	},

	/**
	 * The length of the vector squared
	 */
	length_sq: function() {
		return this.dot(this);
	},

	/**
	 * The length of the vector
	 */
	length: function() {
		return this.modulus();
	},

	/**
	 * The angle of the vector
	 */
	angle: function() {
		return Math.atan2(this.y, this.x);
	},

	/**
	 * Add vectors and return the resulting vector
	 */
	add: function(v2) {
		return new HyPE.Vector2(this.x + v2.x, this.y + v2.y);
	},

	/**
	 * Subtract vectors and return the resulting vector
	 */
	sub: function(v2) {
		return new HyPE.Vector2(this.x - v2.x, this.y - v2.y);
	},

	/**
	 * Translate this vector
	 */
	translate: function(x, y) {
		this.x += x;
		this.y += y;
		return this;
	},

	/**
	 * Scale the vector by sum factor
	 */
	scale: function(k) {
		this.x *= k;
		this.y *= k;
		return this;
	},

	/**
	 * Set the length but maintain the direction
	 */
	setLength: function(length) {
		return this.scale(length / this.length());
	},

	/**
	 * Test for equality
	 */
	equals: function(v2) {
		return Math.abs(this.x - v2.x) <= HyPE.PRECISION
			&& Math.abs(this.y - v2.y) <= HyPE.PRECISION;
	},

	/**
	 * Return the distance from another vector
	 */
	distanceFrom: function(v2) {
		return this.sub(v2).length();
	},

	/**
	 * Return the angle from another vector
	 */
	angleFrom: function(v2) {
		return v2.sub(this).angle();
		// var m1 = this.modulus(),
		// 	m2 = v2.modulus();
		// if(m1 === 0 || m2 === 0) return null;
		// var theta = this.dot(v2) / (m1 * m2);
		// theta = Math.min(theta, 1);
		// theta = Math.max(theta, -1);
		// return Math.acos(theta);
	},

	/**
	 * The modulus (length) of the vector
	 */
	modulus: function() {
		return Math.sqrt(this.dot(this));
	},

	/**
	 * The dot product of the vectors
	 */
	dot: function(v2) {
		return this.x * v2.x + this.y * v2.y;
	}
};


/**
 * Class: Vector3
 */
HyPE.Vector3 = function(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
};
HyPE.Vector3.prototype = {
	/**
	 * Clone this vector
	 */
	clone: function() {
		return new HyPE.Vector3(this.x, this.y, this.z);
	},

	/**
	 * The toString method
	 */
	toString: function() {
		return '[' + this.x + ', ' + this.y + ', ' + this.z + '] (' + this.length() + ')';
	},

	/**
	 * The length of the vector squared
	 */
	length_sq: function() {
		return this.dot(this);
	},

	/**
	 * The length of the vector
	 */
	length: function() {
		return this.modulus();
	},

	/**
	 * Add vectors and return the resulting vector
	 */
	add: function(v2) {
		return new HyPE.Vector3(this.x + v2.x, this.y + v2.y, this.z + v2.z);
	},

	/**
	 * Subtract vectors and return the resulting vector
	 */
	sub: function(v2) {
		return new HyPE.Vector3(this.x - v2.x, this.y - v2.y, this.z - v2.z);
	},

	/**
	 * Translate this vector using another vector
	 */
	translate: function(x, y, z) {
		this.x += x;
		this.y += y;
		this.z += z;
		return this;
	},

	/**
	 * Scale the vector by sum factor
	 */
	scale: function(k) {
		this.x *= k;
		this.y *= k;
		this.z *= k;
		return this;
	},

	/**
	 * Set the length but maintain the direction
	 */
	setLength: function(length) {
		return this.scale(length / this.length());
	},

	/**
	 * Test for equality
	 */
	equals: function(v2) {
		return Math.abs(this.x - v2.x) <= HyPE.PRECISION
			&& Math.abs(this.y - v2.y) <= HyPE.PRECISION
			&& Math.abs(this.z - v2.z) <= HyPE.PRECISION;
	},

	/**
	 * Return the distance from another vector
	 */
	distanceFrom: function(v2) {
		return this.sub(v2).length();
	},

	/**
	 * Return the angle from another vector
	 */
	angleFrom: function(v2) {
		var m1 = this.modulus(),
			m2 = v2.modulus();
		if(m1 === 0 || m2 === 0) return null;
		var theta = this.dot(v2) / (m1 * m2);
		theta = Math.min(theta, 1);
		theta = Math.max(theta, -1);
		return Math.acos(theta);
	},

	/**
	 * The modulus (length) of the vector
	 */
	modulus: function() {
		return Math.sqrt(this.dot(this));
	},

	/**
	 * The dot product of the vectors
	 */
	dot: function(v2) {
		return this.x * v2.x + this.y * v2.y + this.z * v2.z;
	},

	/**
	 * The cross product of the vectors
	 */
	cross: function(v2) {
		return new HyPE.Vector3(
			(this.y * v2.z) - (this.z * v2.y),
			(this.z * v2.x) - (this.x * v2.z),
			(this.x * v2.y) - (this.y * v2.x)
		);
	}
};


/**
 * Class: Segment
 */
HyPE.Segment = function(v1, v2) {
	this.v1 = v1;
	this.v2 = v2;
};
HyPE.Segment.prototype = {
	intersection: function(seg2) {
		var u1 = this.v2.sub(this.v1),
			u2 = seg2.v2.sub(seg2.v1),
			w  = this.v1.sub(seg2.v1),

			i1 = ((u2.y * w.x) - (u2.x * w.y)) / ((u1.y * u2.x) - (u1.x * u2.y)),
			i2 = ((u1.x * w.y) - (u1.y * w.x)) / ((u1.x * u2.y) - (u1.y * u2.x));

		if(i1 < 0 || i1 > 1 || i2 < 0 || i2 > 1 || isNaN(i1 + i2)) return false;

		return this.v1.add(u1.scale(i1));
	},
	intersects: function(seg2) {
		return !!this.intersection(seg2);
	},
	closestPoint: function(v) {
		var u = this.v2.sub(this.v1),
			w = v.sub(this.v1),
			c1, c2;

		c1 = u.dot(w)
		if(c1 <= 0) return this.v1.clone();

		c2 = u.dot(u);
		if(c2 <= c1) return this.v2.clone();

		return this.v1.add(u.scale(c1 / c2));
	},
	closestPointOnLine: function(v) {
		var u = this.v2.sub(this.v1),
			w = v.sub(this.v1),
			c1 = u.dot(w),
			c2 = u.dot(u);

		return this.v1.add(u.scale(c1 / c2));
	}
};


/**
 * Class: Particle
 */
export const Particle = HyPE.Particle = function(x, y, invmass, vx, vy) {
	x = x || 0;
	y = y || 0;
	this.pos = new HyPE.Vector2(x, y);
	this.posPrev = new HyPE.Vector2(x - (vx || 0), y - (vy || 0));
	this.invmass = invmass == undefined ? 1 : invmass;
	this.a = new HyPE.Vector2();
};
HyPE.Particle.prototype = {
	clone: function() {
		return new HyPE.Particle(this.pos.x, this.pos.y, this.invmass, this.pos.x - this.posPrev.x, this.pos.y - this.posPrev.y);
	},

	/**
	 * Get the current velocity of the particle
	 */
	velocity: function() {
		return this.pos.sub(this.posPrev);
	},

	/**
	 * Perform the Verlet integration (move the particle)
	 */
	verlet: function() {
		var tmp = this.pos.clone();
		this.a.scale(HyPE.INTERVAL * HyPE.INTERVAL);  // a * dt^2
		// this.posPrev.scale(1 - DRAG); // drag
		// this.pos.scale(2 - DRAG).translate(-this.posPrev.x, -this.posPrev.y).translate(this.a.x, this.a.y);
		this.pos.scale(2).translate(-this.posPrev.x, -this.posPrev.y).translate(this.a.x, this.a.y);
		this.posPrev = tmp;
		return this;
	}
};


/**
 * Abstract Class: TwoParticleConstraint
 */
HyPE.TwoParticleConstraint = function(p1, p2, length) {
	this.p1 = p1;
	this.p2 = p2;
	this.length = (length !== undefined)
		? length
		: (p1 && p2)
			? this.p2.pos.distanceFrom(this.p1.pos)
			: 0;
};
HyPE.TwoParticleConstraint.prototype = {
	satisfy: function() { return this; }
};


/**
 * Namespace: Constraint
 */
HyPE.Constraint = {};


/**
 * Class: Stick (inherits from TwoParticleConstraint)
 */
HyPE.Constraint.Stick = HyPE.TwoParticleConstraint.extend({
	isNoOp: function(dL) {
		// Exit early if at rest
		return dL == this.length;
	},
	adjustDelta: function(delta) { return this; },
	satisfy: function() {
		// If they both have infinite masses then we can do nothing
		if(this.p1.invmass == 0 && this.p2.invmass == 0) return this;

		// Compute a delta vector
		var delta = this.p2.pos.sub(this.p1.pos),
			dL = delta.length();

		// See if there is reason to continue
		if(this.isNoOp(dL)) return this;

		// Calculate adjustment factors
		var f = (dL - this.length) / (dL * (this.p1.invmass + this.p2.invmass)),
			f1 = f * this.p1.invmass,
			f2 = f * this.p2.invmass;

		// Adjust the delta if needed
		this.adjustDelta(delta);

		// Move the particles back to the proper distance
		this.p1.pos.translate(f1 * delta.x, f1 * delta.y);
		this.p2.pos.translate(-f2 * delta.x, -f2 * delta.y);
		return this;
	}
});


/**
 * Class: Cable (inherits from Stick Constraint)
 */
HyPE.Constraint.Cable = HyPE.Constraint.Stick.extend({
	isNoOp: function(dL) {
		// Do nothing if they are too close
		return dL <= this.length;
	}
});


/**
 * Class: Ball (inherits from Stick Constraint)
 */
HyPE.Constraint.Ball = HyPE.Constraint.Stick.extend({
	isNoOp: function(dL) {
		// Do nothing if they are too far apart
		return dL >= this.length;
	}
});


/**
 * Class: Spring (inherits from Stick Constraint)
 */
HyPE.Constraint.Spring = HyPE.Constraint.Stick.extend(function(p1, p2, strength, length) {
	this.strength = strength || 1;
	return this._parent(p1, p2, length);
}, {
	adjustDelta: function(delta) {
		delta.scale(this.strength);
		return this;
	}
});


/**
 * Class: Elastic (inherits from Spring Constraint)
 */
HyPE.Constraint.Elastic = HyPE.Constraint.Spring.extend({
	isNoOp: function(dL) {
		// Do nothing if too close
		return dL <= this.length;
	}
});


/**
 * Class: Bubble (inherits from Spring Constraint)
 */
HyPE.Constraint.Bubble = HyPE.Constraint.Spring.extend({
	isNoOp: function(dL) {
		// Do nothing if too far apart
		return dL >= this.length;
	}
});


/**
 * Class: Wall
 */
HyPE.Constraint.Wall = function(v1, v2, particles) {
	this.s = new HyPE.Segment(v1, v2);
	this.particles = [].concat(particles);
};
HyPE.Constraint.Wall.prototype = {
	satisfyParticle: function(p) {
		// if the segment from p.posPrev to p.pos crosses this wall then move p.pos
		var vi = this.s.intersection(new HyPE.Segment(p.posPrev, p.pos));
		if(vi) {
			p.pos = vi = this.s.closestPointOnLine(p.pos)
		};

		// if(p.radius) {
		// 	var toSegment = p.pos.sub(vi || this.s.closestPoint(p.pos)),
		// 		distance = toSegment.length();
		// 	if(distance < p.radius) {
		// 		if(distance <= HyPE.PRECISION) {
		// 			toSegment = p.posPrev.sub(this.s.closestPointOnLine(p.posPrev));
		// 		}
		// 		toSegment.setLength(p.radius - distance);
		// 		p.pos.translate(toSegment.x, toSegment.y);
		// 	}
		// }

		return this;
	},
	satisfy: function() {
		var p = this.particles,
			i = p.length;
		while(i--) this.satisfyParticle(p[i]);
		return this;
	}
};


/**
 * Class: Scene
 */
HyPE.Scene = function(relaxations, gravity) {
	this.relaxations = relaxations || 1;
	this.gravity = gravity || HyPE.Vector2(0, 0);
	this.particles = [];
	this.namedParticles = {};
	this.constraints = [];
};
HyPE.Scene.prototype = {
	getParticle: function(name) {
		return this[typeof name === 'string' ? 'namedParticles' : 'particles'][name];
	},
	addParticle: function(name, p) {
		this.particles.push(p);
		if(name) this.namedParticles[name] = p;
		return this;
	},
	addConstraint: function(c) {
		this.constraints.push(c);
		return this;
	},
	newParticle: function(name /*, Particle constructor args */) {
		var p = new HyPE.Particle(),
			haveName = typeof name === 'string',
			args = Array.prototype.slice.call(arguments, haveName ? 1 : 0);
		HyPE.Particle.apply(p, args);
		return this.addParticle(haveName && name, p);
	},
	newConstraint: function(type /*, Constraint constructor args */) {
		var c = new HyPE.Constraint[type](),
			args = Array.prototype.slice.call(arguments, 1);
		HyPE.Constraint[type].apply(c, args);
		return this.addConstraint(c);
	},
	verlet: function() {
		var p = this.particles,
			i = p.length;
		while(i--) {
			p[i].verlet();
			p[i].a.x = this.gravity.x;
			p[i].a.y = this.gravity.y;
		}
		return this;
	},
	satisfy: function() {
		var c = this.constraints,
			i = c.length;
		while(i--) c[i].satisfy();
		return this;
	},
	tick: function() {
		this.verlet();
		var r = this.relaxations;
		while(r--) this.satisfy();
		return this;
	}
};


window.requestAnimationFrame = window.requestAnimationFrame
							|| window.webkitRequestAnimationFrame
							|| window.msRequestAnimationFrame
							|| window.mozRequestAnimationFrame
							|| window.oRequestAnimationFrame
							|| function(callback) { return window.setTimeout(callback, 10); };
window.cancelRequestAnimationFrame = window.cancelRequestAnimationFrame
								  || window.webkitCancelRequestAnimationFrame
								  || window.msCancelRequestAnimationFrame
								  || window.mozCancelRequestAnimationFrame
								  || window.oCancelRequestAnimationFrame
								  || function(handle) { window.clearTimeout(handle); };
HyPE.requestAnimationFrame = function(callback) {
	return window.requestAnimationFrame(callback);
};
HyPE.cancelRequestAnimationFrame = function(callback) {
	return window.cancelRequestAnimationFrame(callback);
};

export default HyPE;
