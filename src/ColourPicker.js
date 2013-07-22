/*!

	Canvas colour picker

	Licensed under the MIT license.
	http://www.opensource.org/licenses/mit-license.php

*/

'use strict';

var ccp = ccp || {};

ccp.ColourPicker = function (opts) {

	this.canvas = new ccp.Canvas(opts.canvas);
	this.colour = new ccp.ColourPicker.Colour();
	this.spectrum = new this.constructor.Spectrum(this);
	this.gradient = new this.constructor.Gradient(this);
	this.onchange = opts.onchange;
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

	dataToRGB: function (d) {
		return 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')';
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
		} else {
			this.spectrum.update.call(this.spectrum, p);
		}
	}

};

ccp.ColourPicker.Colour = function (d) {

	if (d) {
		this.setData(d);
	}

};

ccp.ColourPicker.Colour.prototype = {

	constructor: ccp.ColourPicker.Colour,

	setData: function (d) {
		this.data = d;
	},

	getRGB: function (text) {
		if (!this.data) {
			return null
		} else if (text) {
			return 'rgb(' + this.data[0] + ',' + this.data[1] + ',' + this.data[2] + ')';
		} else {
			return {
				r: this.data[0],
				g: this.data[1],
				b: this.data[2]
			}
		}
	},

	getHex: function () {
		var hex = '#',
			part,
			i;
		for (i = 0; i < 3; i++) {
			part = this.data[i].toString(16)
			hex += part.length === 1 ? '0' + part : part;
		}
		return hex;
	}

};



