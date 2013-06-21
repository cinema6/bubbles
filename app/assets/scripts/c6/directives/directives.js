/* global $ */
(function(){

'use strict';
angular.module('c6.dir.screenJack',['c6.svc'])
.directive('c6Resize', ['$window', function($window) {
	return function($scope, $element) {
		$($window).resize(function() {
			// set variable dimensions for viewport
			var baseW = 1280,
				baseH = 684,
				mainFont = 28,
				annotationFont = 32,

				//find current dimensions of window
				winH = $window.innerHeight,
				winW = $window.innerWidth,

				//find scale factor
				scaleH = winH / baseH,
				scaleW = winW / baseW,
				scaleFactor = Math.min(scaleH, scaleW);

			//apply new dimensions to viewport
			$element.find('.viewport').height(baseH * scaleFactor)
				.width(baseW * scaleFactor)
				.css('font-size', (mainFont * scaleFactor))
				.css('margin-top', ((baseH * scaleFactor) / -2))
				.css('margin-left', ((baseW * scaleFactor) / -2));

			//feed screen divs window dimensions
			$element.height(winH).width(winW);
			$('.shareMenu').height(54 * scaleFactor).width(1026 * scaleFactor).css('margin-left', ((1026 * scaleFactor) / -2));

			//apply to bubble font sizes
			$('.annotations').height(524 * scaleFactor)
				.width(1180 * scaleFactor)
				.css('font-size', (annotationFont * scaleFactor))
				.css('margin-top', ((524 * scaleFactor) / -2))
				.css('margin-left', ((1180 * scaleFactor) / -2));
		});

		//Resize content immediately when page is loded
		$($window).resize();
	};
}])

.directive('c6Sfx', ['C6SfxService', function(sfxSvc) {
	return function(scope, element, attrs) {
		var config = scope.$eval(attrs.c6Sfx),
			event,
			soundName,
			playSound = function() {
				sfxSvc.playSound(soundName);
			};

		for (event in config) {
			if (config.hasOwnProperty(event)) {
				soundName = config[event];
				element.bind(event, playSound);
			}
		}
	};
}])

.directive('c6IosKeyboard', ['$window', '$timeout', function($window, $timeout) {
	return function(scope, element, attrs) {
		if ($window.navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
			if (attrs.c6IosKeyboard === 'input') {
				element.bind('click', function() {
					scope.$emit('c6-ios-keyboard-up');
				});
				element.bind('blur', function() {
					$timeout(function() {
						if (!element.is(':focus')) {
							scope.$emit('c6-ios-keyboard-down');
						} else {
							$window.scrollTo(0, 0);
						}
					}, 50);
				});
			} else if (attrs.c6IosKeyboard === 'target') {
				scope.$on('c6-ios-keyboard-up', function() {
					$window.scrollTo(0, 0);
					element.addClass('c6-ios-keyboard-up');
				});

				scope.$on('c6-ios-keyboard-down', function() {
					element.removeClass('c6-ios-keyboard-up');
				});
			}
		}
	};
}])

.directive('c6AnimateOnEvent', ['$animator', function($animator) {
	return function(scope, element, attrs) {
		var animator = $animator(scope, attrs);

		scope.$on(attrs.c6AnimateOnEvent, function() {
			animator.animate(attrs.c6AnimateOnEvent, element);
		});
	};
}])

.directive('c6On', ['$log', function($log) {
	return {
		scope: true,
		link: function($scope, $element, $attrs) {
			$scope.$this = $element;

			var events = [],
				expressions = [];

			for (var i = 0, string = $attrs.c6On, length = string.length, onEvent = true, onExpression = false, curEvent = '', curExpression = ''; i < length; i++) {
				var curChar = string.charAt(i);

				if (onEvent) {
					if (curChar !== ':') {
						curEvent += curChar;
					} else {
						onEvent = false;
						events.push(curEvent);
						curEvent = '';
					}
				} else if (onExpression) {
					if (curChar !== '}') {
						curExpression += curChar;
					} else {
						onExpression = false;
						expressions.push(curExpression);
						curExpression = '';
					}
				} else {
					if (curChar === '{') {
						onExpression = true;
					} else if ([' ', ',', '{'].indexOf(curChar) === -1) {
						curEvent += curChar;
						onEvent = true;
					}
				}
			}

			events.forEach(function(event, i) {
				$scope.$on(event, function() {
					$log.log('c6-on responding to ' + event);
					$scope.$eval(expressions[i]);
				});
			});
		}
	};
}])

.directive('c6Autofocus', [function() {
	return function(scope, element) {
		element.focus();
	};
}])

.directive('c6Share', ['$window', '$document', '$location', function($window, $document, $location) {
	return function(scope, element, attrs) {
		element.click(function() {
			var config = {
				url: encodeURIComponent(attrs.shareUrl? attrs.shareUrl : $location.absUrl()),
				title: encodeURIComponent(attrs.shareTitle? attrs.shareTitle : $document.attr('title')),
				description: attrs.shareDescription? encodeURIComponent(attrs.shareDescription) : null,
				image: attrs.shareImage? encodeURIComponent(attrs.shareImage) : null
			},
				url;

			if (attrs.c6Share === 'facebook') {
				url = 'http://www.facebook.com/sharer.php?s=100&p[title]='+ config.title +
					'&p[summary]=' + config.description +
					'&p[url]=' + config.url +
					'&p[images][0]=' + config.image +
					'&';

				$window.open(url, 'sharer', 'toolbar=0, status=0, width=548, height=325');
			} else if (attrs.c6Share === 'twitter') {
				var data = config.description? ('text=' + config.description + encodeURIComponent(': ') + config.url) : ('url=' + config.url);
				url = 'https://twitter.com/share?' + data;

				$window.open(url, 'sharer', 'toolbar=0, status=0, width=550, height=450');
			}
		});
	};
}]);
})();
