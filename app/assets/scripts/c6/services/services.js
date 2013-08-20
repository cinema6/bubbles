(function(){
'use strict';

function TalkieModel(annotations, extension) {
	var options = annotations.options;
	this.options = {
		effect: options.effect,
		level: options.level,
		vid: options.vid + '.' + extension,
		voice: options.voice
	};
    this.annotations = [];

    annotations.notes.forEach(function(annotation) {
        var note = {
	        ts: annotation.ts,
	        template: annotation.template,
	        text: null
        };
	    this.annotations.push(note);
    }, this);
}

function BubblesModel(annotations) {
    var localException = function(msg) {
        return {
          'name'     : 'AnnotationsModel',
          'message'  : (msg !== undefined) ? msg : 'Unspecified error.',
          'toString' : function() { return this.name + ': ' + this.message; }
        };
      };
    this.annotations     = [];
    this.sfx             = (annotations.options) ? annotations.options.sfx : null;
    for (var i = 0; i < annotations.notes.length; i++) {
        var a = annotations.notes[i],
            n = {   type : a.type, ts : a.ts, duration : a.duration, template : a.template,
                    cls : a.cls, text : null, index : i, tail: a.tail, sfx : a.sfx
            };
        if (annotations.options){
            if (!n.type) {
                n.type = annotations.options.type;
            }
            if (!n.duration) {
                n.duration = annotations.options.duration;
            }
            if (!n.sfx) {
                n.sfx = annotations.options.defaultSfx;
            }
            if (!n.cls) {
                var eCls = annotations.options.cls;
                if (eCls instanceof Array) {
                    var lenCls = eCls.length;
                    n.cls = [];
                    for (var j = 0; j < lenCls; j++) {
                        n.cls.push(eCls[j]);
                    }
                }
            }
        }

        if (n.cls instanceof Array) {
            for (var k = 0; k < n.cls.length; k++) {
                n.cls[k] = n.cls[k].replace('${index}',n.index);
            }
        }

        if (!n.type){ throw localException('Missing Property (type): ' + JSON.stringify(a));}
        if (!n.ts)  { throw localException('Missing Property (ts): ' + JSON.stringify(a));}
        if (!n.duration) { throw localException('Missing Property (duration): ' +
                JSON.stringify(a));}
        if (!n.template){ throw localException('Missing Property (template): ' +
            JSON.stringify(a));}

        this.annotations.push(n);
    }
}

angular.module('c6.svc',[])
.service('C6VideoControlsService', ['$timeout', function($timeout) {
	this.bind = function(video, delegate, controller) {
		var wasPlaying; // Used for seeking

		// Set up video events
		video
			.on('play', function() {
				controller.play();
			})
			.on('pause', function() {
				controller.pause();
			})
			.on('timeupdate', function(event, video) {
				var percent = (video.player.currentTime / video.player.duration) * 100;

				controller.progress(percent);
			})
			.on('progress', function(event, video) {
				controller.buffer(video.bufferedPercent() * 100);
			})
			.on('volumechange', function(event, video) {
				controller.muteChange(video.player.muted);
				controller.volumeChange(video.player.volume * 100);
			});

		// Set up delegate methods
		delegate.play = function() {
			video.player.play();
		};
		delegate.pause = function() {
			video.player.pause();
		};
		delegate.seekStart = function() {
			if (!video.player.paused) {
				wasPlaying = true;
				video.player.pause();
			}
		};
		delegate.seek = function(percent) {
			video.player.currentTime = (percent * video.player.duration) / 100;
		};
		delegate.seekStop = function() {
			if (wasPlaying && video.player.paused) {
        $timeout(function() { video.player.play(); }, 200);
			}
			wasPlaying = undefined;
		};
		delegate.volumeSeek = function(percent) {
			video.player.volume = percent / 100;
		};
		delegate.mute = function() {
			video.player.muted = true;
		};
		delegate.unmute = function() {
			video.player.muted = false;
		};
	};
}])

.service('C6ResponseCachingService', ['$window', function($window) {
	if (!$window.localStorage) {
		$window.localStorage = {};
	}

	var data = JSON.parse($window.localStorage.responseCache || '{}'),
		writeToStorage = function() {
			$window.localStorage.responseCache = JSON.stringify(data);
		};

	this.sameResponses = function(a, b) {
		return JSON.stringify(a) === JSON.stringify(b);
	};

	this.setResponses = function(responses, category, id) {
		data[category + '/' + id] = responses;
		writeToStorage();
	};

	this.getResponses = function(category, id) {
		return data[category + '/' + id] || null;
	};
}])

.service('C6AnnotationsService', ['$routeParams', '$rootScope', 'c6videoService', '$http', '$q', '$log', 'environment', function($routeParams, $rootScope, vidSvc, $http, $q, $log, env) {
	var genVidUrlCache = {};

	this.getAnnotationsModelByType = function(type, annotations) {
		var toReturn,
			Klass;

		if (type === 'bubble') {
			Klass = BubblesModel;
		} else if (type === 'talkie') {
			Klass = TalkieModel;
		}

		annotations.forEach(function(annoConfig) {
			if (annoConfig.options.type === type) {
				toReturn = new Klass(annoConfig, vidSvc.extensionForFormat(vidSvc.bestFormat()));
			}
		});
		return toReturn;
	};

    this.interpolate = function(tmpl,data) {
        var patt  = /\${(\d+)}/,
            dataLen,
            match;

        if (!data) {
            return tmpl;
        }

        if ((data instanceof Array) === false) {
            throw new TypeError('Data parameter must be an array.');
        }

        dataLen = data.length;
//        $log.info('Template:' + tmpl);
        while((match = patt.exec(tmpl)) !== null) {
//            $log.info('Match: ' + JSON.stringify(match));
            var idx = (match[1] - 1);
            if (idx < 0) {
                throw new RangeError('Template parameters should start at ${1}');
            }
            if (idx >= dataLen) {
                throw new RangeError('Invalid template parameter (too high): ' + match[0]);
            }
            tmpl = tmpl.replace(match[0],data[idx]);
        }
        return tmpl;
    };

	this.interpolateAnnotations = function(annoModel, responses) {
        var annoLength = annoModel.annotations.length;
        $log.info('Interpolate ' + annoLength + ' annotations with ' + responses.length + ' responses.');
//       for (var x = 0; x < data.length; x++) {
//            $log.info('DATA[' + x + ']: [' + data[x] + ']');
//        }
        for (var i = 0; i < annoLength; i++) {
            var a = annoModel.annotations[i];
            a.text = this.interpolate(a.template,responses);
            $log.info('Annotation [' + i + ']: ' + a.text);
        }

        return annoModel;
	};

	this.fetchText2SpeechVideoUrl = function(model) {
		var requestBodyObject = {
			video: model.options.vid,
			tts: {
				voice: model.options.voice,
				effect: model.options.effect,
				level: model.options.level
			},
			script: []
		},
			url = $q.defer(),
			alreadyHaveUrl = function() {
				var cache = genVidUrlCache,
					cachedModel = cache[model.options.vid] && cache[model.options.vid].model;

				return ((cachedModel ? true : false) && (function() {
					var newModelAnnotations = model.annotations;

					return cachedModel.annotations.every(function(annotation, index) {
						return annotation.text === newModelAnnotations[index].text;
					});
				})());
			};

		model.annotations.forEach(function(annotation) {
			var line = {
				ts: annotation.ts,
				line: annotation.text
			};

			requestBodyObject.script.push(line);
		});

		if (alreadyHaveUrl()) {
			$log.log('Already have a URL for these responses: ' + genVidUrlCache[model.options.vid].url);
			url.resolve(genVidUrlCache[model.options.vid].url);
		} else {
			$log.log('No URL for these responses. Going to the server!');
			$http.post('http://' + (env.release ? 'dub' : 'alpha') + '.cinema6.net/dub/create', requestBodyObject).then(function(response) {
				var urlFromServer = response.data.output;

				genVidUrlCache[model.options.vid] = { model: model, url: urlFromServer };
				url.resolve(urlFromServer);
			}, function(error) {
				$log.error(error);
			});
		}

		return url.promise;
	};
}])

.service('C6ResizeService', ['$window', '$log', function($window, $log) {
	var resizeFunctions = [];

	this.registerDirective = function(code) {
		if (resizeFunctions.indexOf(code) === -1) {
			resizeFunctions.push(code);
			$log.log('Registered new resizer. Current total is ' + resizeFunctions.length);
			code($window.innerWidth, $window.innerHeight);
		}
	};

	this.unregisterDirective = function(code) {
		var codesIndex = resizeFunctions.indexOf(code);

		resizeFunctions.splice(codesIndex, 1);
		$log.log('Unregistered new resizer. Current total is ' + resizeFunctions.length);
	};

	angular.element($window).bind('resize', function() {
		resizeFunctions.forEach(function(code) {
			code($window.innerWidth, $window.innerHeight);
		});
	});
}])

.factory('C6AudioContext', ['$window', function($window) {
	return $window.AudioContext || $window.webkitAudioContext;
}])

.service('C6SfxService', ['C6AudioContext', '$http', '$q', '$rootScope', '$window', '$log', function(C6AudioContext, $http, $q, $rootScope, $window, $log) {
	function C6Sfx(config) {
		var buffer,
			players = [];

		var createPlayerInstance = function() {
			$log.log('creating instance');
			var instance = new Audio(config.src + '.' + self.extensionForFormat(self.bestFormat()));
			players.push(instance);
			return instance;
		};

		this.name = config.name;
		this.src = config.src;
		this.isLoaded = false;

		this.load = function() {
			if (context) {
				this.load = function() {
					var me = this,
						waitForIt = $q.defer();

					$http({
						method: 'GET',
						url: this.src + '.' + self.extensionForFormat(self.bestFormat()),
						responseType: 'arraybuffer'
					}).then(function(response) {
						context.decodeAudioData(response.data, function(buff) {
							buffer = buff;
							$rootScope.$apply(function() {
								waitForIt.resolve(me);
								self.isLoaded = true;
							});
						});
					});

					return waitForIt.promise;
				};
				this.load();
			} else {
				this.load = function() {
					players = [];

					for (var i = 0; i < 3; i++) {
						createPlayerInstance();
					}
				};
				this.load();
			}
		};

		this.play = function() {
			if (context) {
				this.play = function() {
					var source = context.createBufferSource();
					source.buffer = buffer;

					source.connect(context.destination);

					return source.start? source.start(0) : source.noteOn(0);
				};
				this.play();
			} else {
				this.play = function() {
					players.some(function(player, index) {
						if (player.paused || player.ended) {
							player.currentTime = 0;
							player.play();
							return true;
						} else if (index === players.length - 1) {
							createPlayerInstance().play();
						}
					});
				};
				this.play();
			}
		};

		if ((!context && self.isMobileSafari) || !$window.Audio) {
			var dummyFunction = function() {};

			for (var key in this) {
				if (this.hasOwnProperty(key)) {
					if (typeof this[key] === 'function') {
						this[key] = dummyFunction;
					}
				}
			}
		}
	}

	var self = this,
		sounds = [],
		context = C6AudioContext? new C6AudioContext() : null;

	this.loadSounds = function(soundConfigs) {
		soundConfigs.forEach(function(config) {
			var sfx = new C6Sfx(config);
			sounds.push(sfx);
			sfx.load();
		});
	};

	this.getSoundByName = function(name) {
		var toReturn;
		sounds.forEach(function(sound) {
			if (sound.name === name) {
				toReturn = sound;
			}
		});
		return toReturn;
	};

	this.playSound = function(name) {
		this.getSoundByName(name).play();
	};

	this.playSoundOnEvent = function(sound, event) {
		$rootScope.$on(event, function() {
			self.playSound(sound);
		});
	};

	this.bestFormat = function(formats) {
		var goodFormats = [],
		greatFormats = [],
		audio = new Audio();
		formats = formats? formats : this.validFormats;

		if (Object.prototype.toString.call(formats) !== '[object Array]') {
			throw new TypeError('You must pass in an array of format strings.');
		}

		formats.forEach(function(format) {
			var decision = audio.canPlayType(format);

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

		audio = null;
	};

	this.validFormats = ['audio/mp3', 'audio/ogg'];

	this.extensionForFormat = function(format) {
		return format.split('/').pop();
	};

	this.formatForExtension = function(extension) {
		return 'audio/' + extension;
	};

	this.isMobileSafari = $window.navigator.userAgent.match(/(iPod|iPhone|iPad)/);

	// Web Audio API is too buggy on Mobile Safari :-( Disable It... Edit: Nope. We're going for it!

	/*if (this.isMobileSafari) {
		(function() {
			var property;

			for (property in this) {
				if (this.hasOwnProperty(property)) {
					if (typeof this[property] === 'function') {
						this[property] = angular.noop;
					}
				}
			}
		}).call(this);
	}*/
}])
.factory('c6VideoListingService',['$log','$q','$http','appBaseUrl',function($log,$q,$http,baseUrl){
    $log.log('Creating c6VideoListingService');
    var service = {};

	service.getRandomCategoryFrom = function(categories) {
		categories = categories || service.getCategories();
		return categories[Math.floor(Math.random() * categories.length)];
	};

	service.getRandomQuoteForCategory = function(category) {
		var data = {
			action: [
				'Badger on cocaine',
				'Good comeback David Cross',
				'Bruce Lee destroys Elmo!'
			],
			fantasy: [
				'Get over here you tiny crap',
				'Hope this puppy can swim',
				'You sail, I\'m not doing crap on this trip'
			],
			romance: [
				'Damn she knows I just made a sneeze.',
				'umm WTF was that? She must punch carrots.'
			]
		};

		var quotes = data[category];

		return quotes[Math.floor(Math.random() * quotes.length)];
	};

	service.getRandomExperienceIdFromCategory = function(category) {
		var experience = $q.defer();

		$http.get(baseUrl + '/experiences/experiences.json').then(function(response) {
			var experiences = response.data[category];

			experience.resolve(experiences[Math.floor(Math.random() * experiences.length)]);
		});

		return experience.promise;
	};

    service.getCategories = function() {
		var categories = $q.defer();

		$http.get(baseUrl + '/experiences/experiences.json').then(function(response) {
			var experiences = response.data;

			categories.resolve(Object.keys(experiences));
		});

		return categories.promise;
    };

    service.getExperienceByCategory = function(category) {
		var experience = $q.defer();

		service.getRandomExperienceIdFromCategory(category).then(function(experienceId) {
			experience.resolve(service.getExperience(category, experienceId));
		});

		return experience.promise;
	};

	service.getExperience = function(category, id) {
		var experience = $q.defer();

		$http.get(baseUrl + '/experiences/' + category + '/' + id + '.json').then(function(data) {
			experience.resolve(data.data);
		}, function(err) {
			experience.reject(err);
		});

		return experience.promise;
	};

    return service;
}]);

})();
