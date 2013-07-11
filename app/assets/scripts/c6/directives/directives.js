(function(){
/*global TimelineMax:false */
'use strict';
angular.module('c6.dir.screenJack',['c6.svc'])
.directive('c6ProgressPen', ['appBaseUrl', function(base) {
	return {
		restrict: 'E',
		templateUrl: base + '/views/progress_pen.html',
		replace: true,
		scope: {},
		link: function(scope, element) {
	        var loadingCycle        = element.find('#loading-cycle'),
	            dot1                = element.find('#dot-1'),
	            dot2                = element.find('#dot-2'),
	            dot3                = element.find('#dot-3'),
	            loadingAnimation    = new TimelineMax({paused: true, repeat: -1, yoyo:true}),
	            loadingText         = new TimelineMax({paused: true, repeat: -1, yoyo:false});

            loadingAnimation.to(loadingCycle, 0.2, {top: '+=2px', left: '+=14px', rotation: '+=8deg'})
                .to(loadingCycle, 0.2, {top: '+=4px', left: '-=12px', rotation: '-=8deg'})
                .to(loadingCycle, 0.2, {top: '+=2px', left: '+=16px', rotation: '+=10deg'})
                .to(loadingCycle, 0.1, {top: '+=4px', left: '-=12px', rotation: '-=8deg'});

            loadingText.to(dot1, 0.4, {opacity: 1})
                .to(dot2, 0.4, {opacity: 1})
                .to(dot3, 0.4, {opacity: 1})
                .to([dot1, dot2, dot3], 1, {opacity: 0});

            // this event can be modified, but function needs to remain the same
            loadingAnimation.seek(0);
            loadingAnimation.play();
            loadingText.seek(0);
            loadingText.play();
		}
	};
}])
.directive('c6Bar', ['appBaseUrl', function(base) {
	return {
		restrict: 'E',
		templateUrl: base + '/views/c6bar.html',
		replace: true,
		scope: {}
	};
}])
.directive('c6Resize', ['C6ResizeService', function(service) {
	return function(scope, element, attrs) {
		var configObject = scope.$eval(attrs.c6Resize) || {width: null, height: null, font: null},
			excludeArray = scope.$eval(attrs.c6Exclude) || [];

		var excludingAttribute = function(attribute) {
			return excludeArray.indexOf(attribute) !== -1;
		};

		var myFunction = function(winWidth, winHeight) {
			// set variable dimensions for element
			var baseWidth = configObject.width || 1280,
				baseHeight = configObject.height || 684,
				fontSize = configObject.font || 28,

				//find scale factor
				scaleHeight = winHeight / baseHeight,
				scaleWidth = winWidth / baseWidth,
				scaleFactor = Math.min(scaleHeight, scaleWidth);

			element.css({
				height: excludingAttribute('height')? element.css('height') : baseHeight * scaleFactor,
				width: excludingAttribute('width')? element.css('width') : baseWidth * scaleFactor,
				'font-size': excludingAttribute('font-size')? element.css('font-size') : fontSize * scaleFactor,
				'margin-top': excludingAttribute('margin-top')? element.css('margin-top') : ((baseHeight * scaleFactor) / -2),
				'margin-left': excludingAttribute('margin-left')? element.css('margin-left') : ((baseWidth * scaleFactor) / -2)
			});
		};

		service.registerDirective(myFunction);

		scope.$on('$destroy', function() {
			service.unregisterDirective(myFunction);
		});
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

.directive('c6IosKeyboard', ['$window', '$timeout', '$log', function($window, $timeout, $log) {
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
					$log.log('iPad keyboard is up!');
					$window.scrollTo(0, 0);
					element.addClass('c6-ios-keyboard-up');
				});

				scope.$on('c6-ios-keyboard-down', function() {
					$log.log('iPad keyboard is down!');
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

.directive('c6On', ['$parse', '$log', function($parse, $log) {
	return {
		scope: true,
		link: function(scope, element, attrs) {
			scope.$this = element;

			var config = scope.$eval(attrs.c6On),
				event;
			for (event in config) {
				scope.$on(event, function() {
					$log.log('c6-on responding to ' + event);
					scope.$eval(config[event]);
				});
			}
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
