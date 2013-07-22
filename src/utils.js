/*

	Utility functions and modules for Canvas Colour Picker
	Author: charliehw

	Licensed under the MIT license.
	http://www.opensource.org/licenses/mit-license.php

*/

'use strict';
var ccp = ccp || {};
ccp.utils = {};

// Interface for binding and unbinding event handlers
ccp.utils.Handler = (function () {

	var n = 1,
        listeners = {};

	return {
		bind: function (element, event, handler) {
			var events = event.split(' '),
				ids = [],
				i, l;
			for (i = 0, l = events.length; i < l; i++) {
				element.addEventListener(events[i], handler);
	            listeners[n] = {
	            	element: element,
	            	event: events[i],
	            	handler: handler
	            };
	            ids.push(n++);
			}
            return ids;
		},

		unbind: function () {
			var ids;
			for (var j = 0, k = arguments.length; j < k; j++) {
				ids = arguments[j];
				for (var i = 0, l = ids.length; i < l; i++) {
					if (ids[i] in listeners) {
		                var h = listeners[ids[i]];
		                h.element.removeEventListener(h.event, h.handler);
		            }
		        }
			}
		}
	}

}());

// Utility function for basic object extending
ccp.utils.extend = function (target, other) {
	target = target || {};
	other = other || {};
	for (name in other) {
		target[name] = other[name];
	}
	return target;
};

ccp.utils.offset = function (elem) {
	var offset = {
		left: elem.offsetLeft,
		top: elem.offsetTop
	};
	while (elem = elem.offsetParent) {
		offset.left += elem.offsetLeft;
		offset.top += elem.offsetTop;
	}
	return offset;
};

ccp.utils.toggleClass = function (element, c) {
	var classes = element.className.split(' ');
	if (classes.indexOf(c) > -1) {
		// remove from array
		classes.splice(classes.indexOf(c), 1);
	} else {
		classes.push(c);
	}
	element.className = classes.join(' ');
};