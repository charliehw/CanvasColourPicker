/*

	Utility functions and modules for Canvas Colour Picker

	Licensed under the MIT license.
	http://www.opensource.org/licenses/mit-license.php

*/

var ccp = ccp || {};
ccp.utils = {};

// Interface for binding and unbinding event handlers
ccp.utils.Handler = (function () {

	var n = 1,
        listeners = {};

	return {
		bind: function (element, event, handler) {
			var events = event.split(' '),
				ids = [],
				i, l;
			for (i = 0, l = events.length; i < l; i++) {
				element.addEventListener(events[i], handler);
				listeners[n] = {
					element: element,
					event: events[i],
					handler: handler
				};
				ids.push(n++);
			}
            return ids;
		},

		unbind: function () {
			var ids, j = 0, i = 0, k, l, h;
			for (k = arguments.length; j < k; j++) {
				ids = arguments[j];
				for (l = ids.length; i < l; i++) {
					if (ids[i] in listeners) {
						h = listeners[ids[i]];
						h.element.removeEventListener(h.event, h.handler);
					}
				}
			}
		}
	};

}());

// Utility function for basic object extending
ccp.utils.extend = function (target, other) {
	target = target || {};
	other = other || {};
	for (var name in other) {
		if (other.hasOwnProperty(name)) {
			target[name] = other[name];
		}
	}
	return target;
};

ccp.utils.offset = function (elem) {
	var offset = {
		left: elem.offsetLeft,
		top: elem.offsetTop
	};
	do {
		elem = elem.offsetParent;
		offset.left += elem.offsetLeft;
		offset.top += elem.offsetTop;
	} while (elem.offsetParent);
	return offset;
};

ccp.utils.toggleClass = function (element, c) {
	var classes = element.className.split(' ');
	if (classes.indexOf(c) > -1) {
		// remove from array
		classes.splice(classes.indexOf(c), 1);
	} else {
		classes.push(c);
	}
	element.className = classes.join(' ');
};
/*

	Canvas colour picker

	Licensed under the MIT license.
	http://www.opensource.org/licenses/mit-license.php

*/

ccp.Canvas = function (selector) {

	if (selector) {
		this.elem = document.querySelector(selector);
	} else {
		this.elem = document.createElement('canvas');
		this.elem.id = 'canvas-colour-picker';
		this.elem.width = 350;
		this.elem.height = 300;
		document.body.appendChild(this.elem);
	}
	this.context = this.elem.getContext('2d');
	this.height = this.elem.height;
	this.width = this.elem.width;

};
/*

	Canvas colour picker

	Licensed under the MIT license.
	http://www.opensource.org/licenses/mit-license.php

*/

ccp.ColourPicker = function (opts) {

	this.canvas = new ccp.Canvas(opts.canvas);
	this.colour = new ccp.Colour();
	this.onchange = opts.onchange;
	this.spectrum = new ccp.Spectrum(this);
	this.gradient = new ccp.Gradient(this);
	this.bind();

};

ccp.ColourPicker.prototype = {

	constructor: ccp.ColourPicker,

	getColour: function () {
		return this.colour;
	},

	updateGradient: function (c) {
		this.gradient.setBaseColour();
		this.setColour(c.data);
	},

	setColour: function (d) {
		this.colour.setData(d);
		if (typeof this.onchange === 'function') {
			this.onchange(this.getColour());
		}
	},

	render: function () {
		this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.spectrum.render();
		this.gradient.render();
	},

	bind: function () {
		var that = this,
			moveId;

		ccp.utils.Handler.bind(this.canvas.elem, 'mousedown', function (e) {
			that.update(this, e);
			
			moveId = ccp.utils.Handler.bind(that.canvas.elem, 'mousemove', function (e) {
				that.update(this, e);
			});
		});

		ccp.utils.Handler.bind(this.canvas.elem, 'mouseup mouseout', function () {
			ccp.utils.Handler.unbind(moveId || []);
		});
	},

	update: function (canvas, e) {
		var offset = ccp.utils.offset(canvas),
			p = {x: e.pageX - offset.left, y: e.pageY - offset.top};

		if (p.x < this.canvas.height) {
			this.gradient.update.call(this.gradient, p);
		} else if (p.x > this.canvas.height + 10) {
			this.spectrum.update.call(this.spectrum, p);
		}
	}

};
/*

	Canvas colour picker

	Licensed under the MIT license.
	http://www.opensource.org/licenses/mit-license.php

*/

ccp.Colour = function (d) {

	if (d) {
		this.setData(d);
	}

};

ccp.Colour.prototype = {

	constructor: ccp.Colour,

	setData: function (d) {
		this.data = d;
	},

	rgbToCMYK: function (r, g, b) {
		var c, m, y, k, min;

		if (r === 0 && g === 0 && b === 0) {
			return [0, 0, 0, 1];
		}

		c = 1 - (r / 255);
		m = 1 - (g / 255);
		y = 1 - (b / 255);
		k = min = Math.min(c, Math.min(m, y));
		c = (c - min) / (1 - min);
		m = (m - min) / (1 - min);
		y = (y - min) / (1 - min);

		return [(Math.round(c * 100) / 100), (Math.round(m * 100) / 100), (Math.round(y * 100) / 100), (Math.round(k * 100) / 100)];
	},

	getRGB: function (data) {
		if (!this.data) {
			return null;
		} else if (!data) {
			return 'rgb(' + this.data[0] + ',' + this.data[1] + ',' + this.data[2] + ')';
		} else {
			return {
				r: this.data[0],
				g: this.data[1],
				b: this.data[2]
			};
		}
	},

	getCMYK: function (data) {
		var cmyk = [];
		if (!this.data) {
			return null;
		} else {
			cmyk = this.rgbToCMYK(this.data[0], this.data[1], this.data[2]);
			if (!data) {
				return 'cmyk(' + cmyk[0] + ',' + cmyk[1] + ',' + cmyk[2] + ',' + cmyk[3] + ')';
			} else {
				return cmyk;
			}
		}
	},

	getHex: function (data) {
		var hex = [],
			part,
			i;
		for (i = 0; i < 3; i++) {
			part = this.data[i].toString(16);
			hex.push(part.length === 1 ? '0' + part : part);
		}
		if (data) {
			return hex;
		} else {
			return '#' + hex.join('');
		}
	}

};
/*

	Canvas colour picker

	Licensed under the MIT license.
	http://www.opensource.org/licenses/mit-license.php

*/

ccp.Gradient = function (cp) {

	this.colourPicker = cp;
	this.pointer = new ccp.Pointer(this);
	this.setBaseColour();
	this.render();
	this.colourPicker.setColour(this.sampleColour());

};

ccp.Gradient.prototype = {

	constructor: ccp.Gradient,

	// Draw the gradients
	render: function () {
		var gradient,
			ctx = this.colourPicker.canvas.context;

		// Solid base colour
		ctx.fillStyle = this.baseColour;
		ctx.fillRect(0, 0, this.colourPicker.canvas.height, this.colourPicker.canvas.height);

		// Vertical transparent to black
		gradient = ctx.createLinearGradient(0, 0, 0, this.colourPicker.canvas.height);
		gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
		gradient.addColorStop(1,   'rgba(0, 0, 0, 1)');

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, this.colourPicker.canvas.height, this.colourPicker.canvas.height);

		// Horizontal grey to transparent
		gradient = ctx.createLinearGradient(0, 0, this.colourPicker.canvas.height, 0);
		gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
		gradient.addColorStop(1,   'rgba(0, 0, 0, 0)');

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, this.colourPicker.canvas.height, this.colourPicker.canvas.height);

		// Radial white to transparent
		gradient = ctx.createRadialGradient(0, 0, 5, 0, 0, this.colourPicker.canvas.height);
		gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
		gradient.addColorStop(1,   'rgba(255, 255, 255, 0)');

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, this.colourPicker.canvas.height, this.colourPicker.canvas.height);

		this.pointer.render();
	},

	sampleColour: function (q) {
		var p = q || this.pointer.position;
		return this.colourPicker.canvas.context.getImageData(p.x, p.y, 1, 1).data;
	},

	setBaseColour: function () {
		var c = new ccp.Colour(this.colourPicker.spectrum.sampleColour());
		this.baseColour = c.getRGB();
	},

	update: function (p) {
		this.pointer.update(p);
		this.colourPicker.render();
		this.colourPicker.setColour(this.sampleColour(p));
	}

};
/*

	Canvas colour picker

	Licensed under the MIT license.
	http://www.opensource.org/licenses/mit-license.php

*/

ccp.Spectrum = function (cp) {

	this.colourPicker = cp;
	this.pointer = new ccp.Pointer(this);
	this.render();

};

ccp.Spectrum.prototype = {

	constructor: ccp.Spectrum,

	render: function () {
		var gradient = this.colourPicker.canvas.context.createLinearGradient(0, 0, 0, this.colourPicker.canvas.height);
		gradient.addColorStop(0,    'rgb(255,   0,   0)');
		gradient.addColorStop(0.15, 'rgb(255,   0, 255)');
		gradient.addColorStop(0.33, 'rgb(0,     0, 255)');
		gradient.addColorStop(0.49, 'rgb(0,   255, 255)');
		gradient.addColorStop(0.67, 'rgb(0,   255,   0)');
		gradient.addColorStop(0.84, 'rgb(255, 255,   0)');
		gradient.addColorStop(1,    'rgb(255,   0,   0)');

		this.colourPicker.canvas.context.fillStyle = gradient;
		this.colourPicker.canvas.context.fillRect(this.colourPicker.canvas.height + 10, 0, (this.colourPicker.canvas.width - this.colourPicker.canvas.height - 15), this.colourPicker.canvas.height);
		this.pointer.render();
	},

	sampleColour: function (q) {
		var p = q || this.pointer.position;
		return this.colourPicker.canvas.context.getImageData(this.colourPicker.canvas.height + 10, p.y, 1, 1).data;
	},

	update: function (p) {
		var d = this.sampleColour(p),
			c = new ccp.Colour(d);
		this.pointer.update({x: 0, y: p.y});
		this.colourPicker.updateGradient(c);
		this.colourPicker.render();
	}

};
/*

	Canvas colour picker

	Licensed under the MIT license.
	http://www.opensource.org/licenses/mit-license.php

*/

ccp.Pointer = function (parent) {

	this.colourPicker = parent.colourPicker;
	this.canvas = this.colourPicker.canvas;
	this.getDefaultPosition();
	this.type = (parent.constructor === ccp.Spectrum ? 'arrow' : 'radial');

};

ccp.Pointer.prototype = {

	constructor: ccp.Pointer,

	render: function () {
		if (this.type === 'arrow') {
			this.renderArrow();
		} else {
			this.renderRadial();
		}
	},

	renderArrow: function () {
		var ctx = this.canvas.context;
		ctx.beginPath();
		ctx.moveTo(this.canvas.width - 5, this.position.y);
		ctx.lineTo(this.canvas.width, this.position.y - 3);
		ctx.lineTo(this.canvas.width, this.position.y + 3);
		ctx.lineTo(this.canvas.width - 5, this.position.y);
		ctx.closePath();

		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fill();
	},

	renderRadial: function () {
		var ctx = this.canvas.context;
		ctx.lineWidth = 1;

		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, 4, 0, 2 * Math.PI, false);
		ctx.closePath();
	
		ctx.strokeStyle = 'black';
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, 3, 0, 2 * Math.PI, false);
		ctx.closePath();

		ctx.strokeStyle = 'white';
		ctx.stroke();
	},

	getDefaultPosition: function () {
		if (this.type === 'arrow') {
			this.position = {x: 0, y: 0};
		} else {
			this.position = {x: 0, y: 0};
		}
	},

	update: function (p) {
		this.position = p;
	}

};