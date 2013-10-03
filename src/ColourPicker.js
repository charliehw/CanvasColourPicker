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