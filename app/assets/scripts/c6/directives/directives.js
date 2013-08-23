(function(){
/*global TimelineMax:false */
'use strict';
angular.module('c6.dir.screenJack',['c6.svc'])
.directive('c6MouseActivity', ['$timeout', function($timeout) {
	return function(scope, element) {
		var timeout,
			moving = false,
			stopMoving = function() {
				moving = false;
				scope.$emit('c6MouseActivityStop');
			};

		element.bind('mousemove', function() {
			if (!moving) {
				scope.$apply(scope.$emit('c6MouseActivityStart'));
				moving = true;
			}
			if (timeout) { $timeout.cancel(timeout); }
			timeout = $timeout(stopMoving, 250);
		});
	};
}])

.directive('c6ProgressBar', ['appBaseUrl', function(base) {
	return {
		restrict: 'E',
		templateUrl: base + '/views/progress_bar.html',
		replace: true,
		scope: {
			loading: '&'
		},
		link: function(scope, element) {
			var text1 = element.find('#text1'),
				text2 = element.find('#text2'),
				text3 = element.find('#text3'),
				text4 = element.find('#text4'),
				text5 = element.find('#text5'),
				text6 = element.find('#text6'),
				text7 = element.find('#text7'),
				text8 = element.find('#text8'),
				progressBar = element.find('#loading-bar'),
				loadingText = new TimelineMax({paused: true, repeat: -1, yoyo:false}),
				loadingBar = new TimelineMax({paused: true}),
				hasStartedLoading = false,
				loadingTimeout,
				pauseLoad = function() {
					loadingBar.pause();
				};

			loadingText.from(text1, 0.5, {'left': '+=500px', autoAlpha: 0, display: 'none'})
				.to(text1, 0.5, {'left': '-=500px', autoAlpha: 0, display: 'none'}, '+=1.5')
				.from(text2, 0.5, {'left': '+=500px', autoAlpha: 0, display: 'none'})
				.to(text2, 0.5, {'left': '-=500px', autoAlpha: 0, display: 'none'}, '+=1.5')
				.from(text3, 0.5, {'left': '+=500px', autoAlpha: 0, display: 'none'})
				.to(text3, 0.5, {'left': '-=500px', autoAlpha: 0, display: 'none'}, '+=1.5')
				.from(text4, 0.5, {'left': '+=500px', autoAlpha: 0, display: 'none'})
				.to(text4, 0.5, {'left': '-=500px', autoAlpha: 0, display: 'none'}, '+=1.5')
				.from(text5, 0.5, {'left': '+=500px', autoAlpha: 0, display: 'none'})
				.to(text5, 0.5, {'left': '-=500px', autoAlpha: 0, display: 'none'}, '+=1.5')
				.from(text6, 0.5, {'left': '+=500px', autoAlpha: 0, display: 'none'})
				.to(text6, 0.5, {'left': '-=500px', autoAlpha: 0, display: 'none'}, '+=1.5')
				.from(text7, 0.5, {'left': '+=500px', autoAlpha: 0, display: 'none'})
				.to(text7, 0.5, {'left': '-=500px', autoAlpha: 0, display: 'none'}, '+=1.5')
				.from(text8, 0.5, {'left': '+=500px', autoAlpha: 0, display: 'none'})
				.to(text8, 0.5, {'left': '-=500px', autoAlpha: 0, display: 'none'}, '+=1.5');

			loadingBar.to(progressBar, 10, {width: '80%', ease: 'linear', onComplete: pauseLoad})
				.to(progressBar, 0.5, {width: '100%', ease: 'linear'}, 'complete');

			element.hide();

			scope.$watch('loading()', function(loading) {
				if (loading) {
					hasStartedLoading = true;

					loadingTimeout = setTimeout(function() {
						element.fadeIn();

						loadingText.play();

						loadingBar.seek(0);
						loadingBar.play();

					}, 2500);
				} else {
					if (hasStartedLoading) {
						clearTimeout(loadingTimeout);

						loadingBar.play('complete');

						setTimeout(function() {
							element.fadeOut();
						}, 500);
					}
				}
			});
		}
	};
}])
.directive('c6ProgressNumber', ['appBaseUrl', function(base) {
	return {
		restrict: 'E',
		template: '<img id="blank" ng-src="' + base + '/img/progress_empty{{number()}}.png"><img id="fill" ng-src="' + base + '/img/progress_full{{number()}}.png">',
		scope: {
			filled: '&',
			number: '&'
		},
		link: function(scope, element) {
			var fill = element.find('img#fill'),
				blank = element.find('img#blank');

			if (scope.filled()) {
				fill.show();
			} else {
				blank.show();
			}

			scope.$watch('filled()', function(filled) {
				if (filled) {
					var showCheck = new TimelineMax({paused: false});

					showCheck.to(blank, 0.1, {scale: 0, display: 'none'})
						.to(fill, 0.2, {scale: 1, display: 'inline'});
				} else {
					var hideCheck = new TimelineMax({paused: false});

					hideCheck.to(fill, 0.2, {scale: 0, display: 'none'})
						.to(blank, 0.1, {scale: 1, display: 'inline'});
				}
			});
		}
	};
}])
.directive('c6ReplaceKeypress', [function() {
	return function(scope, element, attrs) {
		var config = scope.$eval(attrs.c6ReplaceKeypress);
		if (config) {
			element.bind('keypress', function(event) {
				event.stopPropagation();
				event.preventDefault();
				var expression = config[event.keyCode];

				if (expression) {
					scope.$eval(expression);
				}
			});
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

.directive('c6SfxOn', ['c6Sfx', function(sfxSvc) {
	return function(scope, element, attrs) {
		var config = scope.$eval(attrs.c6SfxOn),
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
				var orientationHandler = function () {
					$window.scrollTo(0, 0);
					$log.log('Orientation triggered scroll up');
				};
				scope.$on('c6-ios-keyboard-up', function() {
					$log.log('iPad keyboard is up!');
					$window.scrollTo(0, 0);
					element.addClass('c6-ios-keyboard-up');
					angular.element($window).bind('orientationchange', orientationHandler);
				});

				scope.$on('c6-ios-keyboard-down', function() {
					$log.log('iPad keyboard is down!');
					element.removeClass('c6-ios-keyboard-up');
					angular.element($window).unbind('orientationchange', orientationHandler);
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
				event,
				handleEvent = function(e) {
					$log.log('c6-on responding to ' + e.name);
					scope.$eval(config[e.name]);
				};
			for (event in config) {
				scope.$on(event, handleEvent);
			}
		}
	};
}])

.directive('c6Autofocus', ['$log', function($log) {
	return function(scope, element, attrs) {
		var event = attrs.c6Autofocus;

		if (!event) {
			$log.log('Focusing on initialization');
			element.focus();
		} else {
			scope.$on(event, function() {
				$log.log('Focusing in response to event: ' + event);
				element.focus();
			});
		}
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
