CanvasColourPicker
==================

Colour picker using HTML5 canvas written in JavaScript.

[Demo](http://www.charliehw.com/projects/colourpicker)

##Usage

Include the main script file in your HTML:

    <script src="canvas-colour-picker.min.js" />

Include a canvas element somewhere on the page:

    <canvas id="colour-picker" width="350" height="300"></canvas>

Initialise the colour picker and set an onchange event handler:

	window.onload = function () {
		var colourPicker = new ccp.ColourPicker({
			canvas: '#colour-picker',
			onchange: function (colour) {
				console.log(colour.getHex());
				console.log(colour.getRGB());
				console.log(colour.getCMYK());
			}
		});
	}

The onchange handler gets passed a colour object with access to Hexadecimal, RGB and CMYK values. By default, these methods will return the values as an appropriately formatted string. Passing in true will cause them to return the value as an array.

##Todo

- JS tests
- Set the picker to a particular colour value
