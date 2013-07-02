'use strict';
/* TODO:
	1. Figure out a solution for the DIVX Web Player problem on Chrome.
	2. Optimize!
*/
angular.module('c6lib.video', [])

.service('c6videoService', ['$document', '$window', function($document, $window) {
	// Class method to figure out the best format to use given an array of formats
	// Optionally, provide no formats and use the default formats
	this.bestFormat = function(formats) {
		var goodFormats = [],
		greatFormats = [],
		video = $document[0].createElement('VIDEO');
		formats = formats? formats : this.validFormats;

		if (Object.prototype.toString.call(formats) !== '[object Array]') {
			throw new TypeError('You must pass in an array of format strings.');
		}

		formats.forEach(function(format) {
			var decision = video.canPlayType(format);

			if (decision === 'probably') {
				greatFormats.push(format);
			} else if (decision === 'maybe') {
				goodFormats.push(format);
			}
		});

		if (greatFormats.length) {
			return greatFormats[0];
		} else {
			return goodFormats[0];
		}

		video = null;
	};
	// Formats available. Adjust this if you want to support another format, or remove support for one
	this.validFormats = ['video/mp4', 'video/webm', 'video/ogg'];
	// Get the extension given a format.
	this.extensionForFormat = function(format) {
		return format.split('/').pop();
	};
	// Get the format given an extension
	this.formatForExtension = function(extension) {
		return 'video/' + extension;
	};
	// Figure out if we're running chrome.
	this.isChrome = $window.chrome? true : false;
	// Figure out if we're running Mobile Safari
	this.isIPhone = navigator.userAgent.match(/iPhone/)? true : false;

	this.totalTimeInRanges = function(tr) {
		var result = 0;
		for (var i =0; i < tr.length; i++) {
			result += (tr.end(i) - tr.start(i));
		}
		return result;
	};
}])

.controller('C6VideoController', ['$scope', '$element', '$attrs', '$document', '$timeout', 'c6videoService', function($scope, $element, $attrs, $document, $timeout, c6videoService) {
	var subscribedEvents = {};
	var handleEvent = function(event) {
		var eventName = event.type,
		subscription = subscribedEvents[eventName];

		subscription.handlers.forEach(function(handler) {
			$scope.$apply(handler(event, c6video));
		});
		if (subscription.emit) { $scope.$emit('c6video-' + event.type, c6video); }
	};

	var c6video = {
		// The ID of the player, typically defined by setting the id of the video tag in HTML
		id: $attrs.id,
		// The actual HTML5 video player
		player: $element[0],
		// Method to set up a way to respond to video events
		// (either by passing in a handler function, or emiting to the scope.
		on: function(events, handler, emit) {
			events = Object.prototype.toString.call(events) === '[object Array]'? events : [events];
			emit = typeof emit !== 'undefined'? emit : false;
			if (!handler) { emit = true ; }
			var video = this.player;

			events.forEach(function(event) {
				if (subscribedEvents[event]) {
					if (handler) { subscribedEvents[event].handlers.push(handler); }
				} else {
					subscribedEvents[event] = { handlers: handler? [handler] : [], emit: emit };
					video.addEventListener(event, handleEvent, false);
				}
			});

			return this;
		},
		// Method to remove all event handlers (and Angular broadcasting.)
		off: function(events) {
			events = Object.prototype.toString.call(events) === '[object Array]'? events : [events];
			var video = this.player;

			events.forEach(function(event) {
				video.removeEventListener(event, handleEvent, false);
				delete subscribedEvents[event];
			});

			return this;
		},
		// Method of setting the src. Accepts normal filename, filename without extension and JSON array of srcs and types.
		src: function(src) {
			var video = this.player,
			bestFormat = c6videoService.bestFormat();

			if (typeof src !== 'string') {
				video.src = null;
				return false;
			}

			if (c6videoService.isIPhone) {
				this.regenerate();
				video = this.player;
			}

			if (!(src.charAt(0) === '[' && src.charAt(src.length - 1) === ']')) {
				var extension = src.split('.').pop(),
				validFormats = c6videoService.validFormats;
				if (validFormats.indexOf(c6videoService.formatForExtension(extension)) === -1) {
					if (!bestFormat) { throw new Error('This player can\'t player any availabe valid formats.'); }
					video.src = src + '.' + c6videoService.extensionForFormat(bestFormat);
				} else {
					video.src = src;
				}
			} else {
				var files = JSON.parse(src),
				formats = [];

				files.forEach(function(file) {
					formats.push(file.type);
				});

				files.forEach(function(file) {
					if (file.type === bestFormat) { video.src = file.src; }
				});
			}
			video.load();
		},
		// Method to create a new, identical (except for currentTime) player and replace the old one
		regenerate: function() {
			var newVideo = document.createElement('VIDEO'),
			video = this.player;

			for (var i = 0, attrs = video.attributes.length, attribute; i < attrs; i++) {
				attribute = video.attributes[i];

				if (attribute.name !== 'currentTime') {
					newVideo[attribute.name] = attribute.value;
				}
			}

			video.parentNode.replaceChild(newVideo, video);
			this.player = newVideo;
		},
		// Method to determine what percent of the video is buffered
		bufferedPercent: function() {
			var video = this.player;
			if (video.duration) {
				var buffsecs = Math.ceil(c6videoService.totalTimeInRanges(video.buffered));
				var res = (Math.round(100 * (buffsecs / Math.ceil(video.duration))) / 100);
				return res;
			}
			return 0;
		},
		// Method to set the height and width of the video all at once
		size: function(width, height) {
			var video = this.player;

			video.width = width;
			video.height = height;
		},
		// Method to make the video fullscreen, or return from fullscreen (if possible.)
		fullscreen: function(bool) {
			if (bool) {
				var video = this.player;

				if (video.requestFullscreen) {
					video.requestFullscreen();
					return true;
				} else if (video.mozRequestFullScreen) {
					video.mozRequestFullScreen();
					return true;
				} else if (video.webkitRequestFullscreen) {
					video.webkitRequestFullscreen();
					return true;
				} else if (video.msRequestFullscreen) {
					video.msRequestFullscreen();
					return true;
				} else {
					return false;
				}
			} else {
				if ($document[0].exitFullscreen) {
					$document[0].exitFullscreen();
					return true;
				} else if ($document[0].mozExitFullscreen) {
					$document[0].mozExitFullscreen();
					return true;
				} else if ($document[0].webkitExitFullscreen) {
					$document[0].webkitExitFullscreen();
					return true;
				} else if ($document[0].msExitFullscreen) {
					$document[0].msExitFullscreen();
					return true;
				} else {
					return false;
				}
			}
		}
	};

	// Watch the c6-src attribute and set the src if it changes.
	$attrs.$observe('c6Src', function(src) {
		c6video.src(src);
	});

	// Respond to events specified from attributes
	$attrs.$observe('on', function(on) {
		if (on) {
			var pairs = on.split(',');

			pairs.forEach(function(pair) {
				var keyValue = pair.split(':'),
					key = keyValue[0].trim(),
					valuePaths = keyValue[1].trim().split('.'),
					targetFunction = $scope.$parent;

				valuePaths.forEach(function(path) {
					targetFunction = targetFunction[path];
				});

				c6video.on(key, function(event, player) {
					targetFunction(event, player);
				});
			});
		}
	});

	if ($attrs.id) {
		$attrs.$observe('id', function(id) {
			if (id) {
				// This event means an instance of C6Video has been created.
				c6video.id = id;
				$scope.$emit('c6video-ready', c6video);
			}
		});
	} else {
		$scope.$emit('c6video-ready', c6video);
	}

	// Emit an event if the player leaves the DOM
	$scope.$on('$destroy', function() {
		$scope.$emit('c6video-destroyed', $attrs.id);
	});

	// Use the chrome hack.
	if (c6videoService.isChrome) {
		c6video.on('canplay', function(event, player) {
			var video = player.player;

			video.muted = true;
			video.play();
			$timeout(function() {
				video.pause();
				video.currentTime = 0;
				video.muted = false;
			}, 50);
		});
	}
}])

.directive('c6video', [function () {
	return {
		controller: 'C6VideoController',
		scope: {
			c6Src: '@',
			on: '@',
			id: '@'
		}
	};
}]);