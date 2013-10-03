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