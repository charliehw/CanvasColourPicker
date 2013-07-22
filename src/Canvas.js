/*

	Canvas colour picker

	Licensed under the MIT license.
	http://www.opensource.org/licenses/mit-license.php

*/

'use strict';

ccp.Canvas = function (selector) {

	this.elem = document.querySelector(selector);
	this.context = this.elem.getContext('2d');
	this.height = this.elem.height;
	this.width = this.elem.width;

};