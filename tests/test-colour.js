module('ccp.Colour Tests');

test('Test RGB value retrieval', function () {
	var colour = new ccp.Colour([22, 133, 244]);

	deepEqual(colour.getRGB(true), {r: 22, g: 133, b: 244}, 'Data returned from RGB should match the colour data.');
	equal(colour.getRGB(), 'rgb(22,133,244)', 'Text version of RGB should be appropriately formatted.');
});

test('Test Hex value retrieval', function () {
	var colour = new ccp.Colour([0, 0, 0]);
	equal(colour.getHex(), '#000000', 'Text version of Hex should be #000000 for black.');

	colour.setData([255,255,255]);
	equal(colour.getHex(), '#ffffff', 'Text version of Hex should be #ffffff for white.');
});