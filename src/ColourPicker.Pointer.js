/*

	Canvas colour picker

	Licensed under the MIT license.
	http://www.opensource.org/licenses/mit-license.php

*/

'use strict';

ccp.ColourPicker.Pointer = function (parent) {

	this.colourPicker = parent.colourPicker;
	this.canvas = this.colourPicker.canvas;
	this.getDefaultPosition();
	this.type = (parent.constructor === ccp.ColourPicker.Spectrum ? 'arrow' : 'radial');

};

ccp.ColourPicker.Pointer.prototype = {

	constructor: ccp.ColourPicker.Pointer,

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