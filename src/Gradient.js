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