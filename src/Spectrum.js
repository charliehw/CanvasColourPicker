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