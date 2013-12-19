(function() {
	/* global $:false */
	'use strict';
	$(document).ready(function() {
		var element = $('#input-screen'),

			toggleScaling = function() {
				var paperStack = element.find('#paper-stack');

				if (window.innerWidth <= 1276 && paperStack.hasClass('input__paper-stack--scaling')) {
					paperStack.removeClass('input__paper-stack--scaling');
					paperStack.toggleClass('input__paper-stack--static');

				} else if (window.innerWidth > 1276 && !paperStack.hasClass('input__paper-stack--scaling')) {
					paperStack.removeClass('input__paper-stack--static');
					paperStack.toggleClass('input__paper-stack--scaling');
				}
			},

			input = element.find('.prompt__input'),
			inputOn = function() {
				if (input.hasClass('prompt__input--inactive')) {
					input.removeClass('prompt__input--inactive');
					input.toggleClass('prompt__input--active');
				}
			},

			inputOff = function() {
				if (input.val() === 'Type your answer here...' && input.hasClass('prompt__input--active')){
					input.removeClass('prompt__input--active');
					input.toggleClass('prompt__input--inactive');
				}
			},

			updateInput = function() {
				inputOn();

				if (input.val() === 'Type your answer here...') {
					input.val('');
				}
			};


		input.focus(updateInput);
		input.blur(inputOff);

		$(window).resize(toggleScaling);

		inputOn();
		inputOff();
		toggleScaling();
	});
}());