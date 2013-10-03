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