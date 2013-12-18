(function() {
	/* global $:false */
	'use strict';

	var toggleScaling = function () {
		var paperStack = $('#paper-stack');

		if (window.innerWidth <= 1276 && paperStack.hasClass('input__paper-stack--scaling')) {
			paperStack.removeClass('input__paper-stack--scaling');
			paperStack.toggleClass('input__paper-stack--static');

		} else if (window.innerWidth > 1276 && !paperStack.hasClass('input__paper-stack--scaling')) {
			paperStack.removeClass('input__paper-stack--static');
			paperStack.toggleClass('input__paper-stack--scaling');
		}
	};

		window.onload = function() {
			toggleScaling();
		};

		window.onresize = function() {
			toggleScaling();
		};
}());