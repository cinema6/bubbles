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
    
    annotations.notes.forEach(function(annotation, index) {
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
    for (var i = 0; i < annotations.notes.length; i++) {
        var a = annotations.notes[i],
            n = { type : a.type, ts : a.ts, duration : a.duration, template : a.template, cls : a.cls,
            text : null, index : i, tail: a.tail
            };
        if (annotations.options){
            if (!n.type) {
                n.type = annotations.options.type;
            }
            if (!n.duration) {
                n.duration = annotations.options.duration;
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
            for (var j = 0; j < n.cls.length; j++) {
                n.cls[j] = n.cls[j].replace('${index}',n.index);
            }
        }
        
        if (!n.type){ throw localException('Missing Property (type): ' + JSON.stringify(a));} 
        if (!n.ts)  { throw localException('Missing Property (ts): ' + JSON.stringify(a));} 
        if (!n.duration) { throw localException('Missing Property (duration): ' + 
                JSON.stringify(a));} 
        if (!n.template){ throw localException('Missing Property (template): ' 
                + JSON.stringify(a));} 

        this.annotations.push(n);
    }
}

angular.module('c6.svc',[])
.service('C6AnnotationsService', ['$routeParams', '$rootScope', 'c6videoService', '$http', '$q', '$log', function($routeParams, $rootScope, vidSvc, $http, $q, $log) {
    var interpolate = function(tmpl,data) {
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
	
	this.getAnnotationsModelByType = function(type, annotations) {
		var toReturn,
			klass;
			
		if (type === 'bubble') {
			klass = BubblesModel;
		} else if (type === 'talkie') {
			klass = TalkieModel;
		}
		
		annotations.forEach(function(annoConfig) {
			if (annoConfig.options.type === type) {
				toReturn = new klass(annoConfig, vidSvc.extensionForFormat(vidSvc.bestFormat()));
			}
		});
		return toReturn;
	};
	
	this.interpolateAnnotations = function(annoModel, responses) {
        var annoLength = annoModel.annotations.length;
        $log.info('Interpolate ' + annoLength + ' annotations with ' + responses.length + ' responses.');
//       for (var x = 0; x < data.length; x++) {
//            $log.info('DATA[' + x + ']: [' + data[x] + ']');
//        }
        for (var i = 0; i < annoLength; i++) {
            var a = annoModel.annotations[i];
            a.text = interpolate(a.template,responses);
            $log.info('Annotation [' + i + ']: ' + a.text);
        }
        
        return annoModel;
	}
	
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
			url = $q.defer();
		
		model.annotations.forEach(function(annotation) {
			var line = {
				ts: annotation.ts,
				line: annotation.text
			};
			
			requestBodyObject.script.push(line);
		});
		
		$http.post('http://localhost:9000/dub/create', requestBodyObject).then(function(response) {
			url.resolve(response.data.output);
		}, function(error) {
			$log.error(error);
		});
		
		return url.promise;
	};
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
	}

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
}])

.factory('c6VideoListingService',['$log','appBaseUrl',function($log,baseUrl){
    $log.log('Creating c6VideoListingService');
    var service          = {};

    service.getCategories = function() {
        return [
                        'Action',
                        'Romance',
                        'SciFi-Fantasy',
                        //'Horror'
                    ]
    };

    service.getExperienceByCategory = function(category) {
        if (category === 'action') {
            return {
                'id'          : '2',
                'title'       : 'Battle for Revenge',
                'views'       : 1000,
                'src'         : baseUrl + '/media/action/bruce_lee',
                'css'         : baseUrl + '/styles/bubbles_action.css',
                'anim'        : 'action',
                'defSizeLimit': 18,
                'prompts'     : [
                    { query : 'Salutation', sizeLimit : 15},
                    'Animal',
                    'Superhero',
                    { query : 'Body Part (plural)', sizeLimit : 10},
                    { query : 'Pizza topping', sizeLimit : 10},
                    'Household appliance',
                    'Sesame Street character',
                    'Star Wars villian',
                    'TV personality',
                    { query : 'Type of candy', sizeLimit : 12},
                    ],
                'annotations' : [{
                    'options' : {
                        'type'      : 'bubble',
                        'duration'  : 4,
                        'cls'     : ['lee-${index}']
                        },
                     'notes'  : [
                        { 'ts': 7.25,'template':'${1}',
                            'duration' : 1.25, tail: {type:'speech', pos: 'bottomLeft'} },
                        { 'ts': 16,'template':'My dramatic entrance',
                            'duration' : 2, tail: {type:'thought', pos: 'bottomLeft'} },
                        { 'ts': 18,'template':'Must look tough',
                            'duration' : 2, tail: {type:'thought', pos: 'bottomLeft'} },
                        { 'ts': 20,'template':'Crazy ${2} stare',
                            'duration': 2, tail: {type:'thought', pos: 'bottomLeft'} },
                        { 'ts': 22,'template':'${2} ${3}',
                            tail: {type:'thought', pos: 'bottomLeft'}},
/*                        { 'ts': 39,'template':'Get Out',
                            tail: {type:'thought', pos: 'bottomRight'} }, */
                        { 'ts': 40.5,'template':'Or I\'ll pound your ${4} into ${5}',
                            'duration':2.5, tail: {type:'thought', pos: 'bottomLeft'} },
                        { 'ts': 50,'template':'Say something clever to make them leave...',
                            'duration':2.5, tail: {type:'thought', pos: 'bottomLeft'} },
                        { 'ts': 60,'template':'${5}!!!',
                            'duration':2, tail: {type:'thought', pos: 'bottomLeft'} },
                        { 'ts': 86,'template':'Did I leave the ${6} on???',
                            'duration':2, tail: {type:'thought', pos: 'bottomRight'} },
                        { 'ts': 95,'template':'Handcuffs of Drunken ${7}!!',
                            tail: {type:'speech', pos: 'bottomRight'} },
                        { 'ts':99.5,'template':'Bruce Lee drunker than ${7}!',
                            'duration':2.5, tail: {type:'speech', pos: 'bottomLeft'} },
                        { 'ts':116, 'template':'I\'m ${8}!',
                            'duration': 2, tail: {type:'speech', pos: 'bottomLeft'} },
                        { 'ts':118,'template':'No, you\'re a dumb Ewok',
                            'duration': 2, tail: {type:'speech', pos: 'bottomRight'} },
                        { 'ts':120,'template':'Shut up stupid!',
                            'duration':2, tail: {type:'speech', pos: 'bottomLeft'} },
                        { 'ts':123,'template':'Good comeback ${9}',
                            'duration':2, tail: {type:'speech', pos: 'bottomRight'} },
                        { 'ts':125,'template':'${10}',
                            'duration':2, tail: {type:'speech', pos: 'bottomLeft'} },
                        { 'ts':127.5,'template':'That made no sense',
                            'duration':1.5, tail: {type:'speech', pos: 'bottomRight'} },
                        { 'ts':129.5,'template':'${6}?',
                            'duration':1.5, tail: {type:'speech', pos: 'bottomLeft'} },
                        { 'ts':131.5,'template':'${2} ${3}!',
                            'duration':1.5, tail: {type:'thought', pos: 'bottomRight'} }
                    ]
                }]
            };
        } else
        if (category === 'scifi-fantasy') {
            return {
                'id'         : '3',
                'title'      : 'Heartbreaking Romance',
                'views'      : 1000,
                'src'         : baseUrl + '/media/fantasy/lotr',
                'css'         : baseUrl + '/styles/bubbles_fantasy.css',
                'anim'        : 'fantasy',
                'defSizeLimit': 18,
                'prompts'     : [
                    'farm animal',
                    { query : 'romantic pet nickname', sizeLimit : 12},
                    'fruit',
                    'body part',
                    'verb',
                    'plural noun',
                    'synonym for feces',

                    'vegetable',
                    { query : 'place', sizeLimit : 14},
                    { query :'baby animal', sizeLimit : 14},
                    ],
                'annotations' : [{
                    'options' : {
                        'type'      : 'bubble',
                        'duration'  : 4,
                        'cls'     : ['lotr-${index}']
                        },
                     'notes'  : [
                        { 'ts':  3,'template':'I\'ll always remember', tail: {type:'speech', pos: 'bottomRight'} },
                        { 'ts':  5,'template':'The times we milked the ${1} together', 'duration' : 2, tail: {type:'speech', pos: 'topRight'} },
                        { 'ts': 10.5,'template':'${2}', 'duration' : 2, tail: {type:'speech', pos: 'topLeft'} },
                        { 'ts': 11,'template':'${3} ${4}', 'duration' : 2, tail: {type:'speech', pos: 'topRight'}},
                        { 'ts': 24.5,'template':'Wonder if he knows I milked the ${1} with everyone', 'duration' : 3, tail: {type:'speech', pos: 'topLeft'} },
                        { 'ts': 29,'template':'Yes, I know..', 'duration' : 3, tail: {type:'speech', pos: 'bottomLeft'} },
                        { 'ts': 32,'template':'but I don\'t care', 'duration' : 3, tail: {type:'speech', pos: 'topLeft'} },
                        { 'ts': 35,'template':'Because I ${5} ${6} with Gandalf', tail: {type:'speech', pos: 'topLeft'} },
                        { 'ts': 41,'template':'${2}', 'duration' : 3, tail: {type:'speech', pos: 'topRight'} },
                        { 'ts': 49,'template':'Your ${7} smells like rotten ${8}', 'duration' : 5.5, tail: {type:'speech', pos: 'topRight'} },
                        { 'ts': 58,'template':'I\'m ready to go to ${9}!', tail: {type:'speech', pos: 'topRight'} },
                        { 'ts': 63,'template':'Get over here you tiny ${7}', 'duration' : 2, tail: {type:'speech', pos: 'bottomRight'} },
                        { 'ts': 68,'template':'I hope they have ${6} in ${9}', 'duration' : 2, tail: {type:'thought', pos: 'bottomLeft'} },
                        { 'ts': 75,'template':'You sail, I\'m not doing ${7} on this trip', 'duration' : 3, tail: {type:'speech', pos: 'bottomRight'}},
                        { 'ts': 78,'template':'Hope this ${10} can swim', 'duration' : 2, tail: {type:'thought', pos: 'bottomLeft'} },
                        { 'ts': 82,'template':'${2}', 'duration' : 4, tail: {type:'thought', pos: 'topLeft'} },
                        { 'ts': 83,'template':'${2}', 'duration' : 3, tail: {type:'thought', pos: 'topLeft'} },
                        { 'ts': 84,'template':'${8} ${7}', 'duration' : 2, tail: {type:'thought', pos: 'topLeft'} },
                        { 'ts': 95,'template':'I just took a ${7} in my pants', 'duration' : 5, tail: {type:'speech', pos: 'topRight'} }
                    ]
                }]
            };
        } else
        if (category === 'horror') {
            return {
                'id'         : '4',
                'title'      : 'Scary Movie',
                'views'      : 1000,
                'src'         : null,
                'css'         : baseUrl + '/styles/bubbles_horror.css',
                'anim'        : 'horror',
                'defSizeLimit': 18,
                'prompts'     : [
                    'animal',
                    'color',
                    'type of drug',
                    'profession',
                    'school supply',
                    'verb',
                    'synonym for feces',
                    'mode of transportation',
                    'type of sports equipment',
                    'body part'
                    ],
                'annotations' : [{
                    'options' : {
                        'type'      : 'talkie',
                        'vid'       : 'scream',
                        'voice'     : 'Allison',
                        'effect'    : 'R',
                        'level'     : '3',
                        },
                     'notes'  : [
		                 { "ts" : "7.70", "template" : "Hi, is my ${1} OK?" },
		                 { "ts" : "11.83", "template" : "Its Mrs. Von ${2} Burger, are you alright?"  },
		                 { "ts" : "17.67", "template" : "Are you on ${3}?" },
		                 { "ts" : "20.00", "template" : "Popcorn ${3}?" },
		                 { "ts" : "21.92", "template" : "My ${1} better be OK!" },
		                 { "ts" : "25.92", "template" : "What?" },
		                 { "ts" : "28.75", "template" : "About ${3}?" },
		                 { "ts" : "30.75", "template" : "Did your ${4} give you the ${3}?"  },
		                 { "ts" : "35.08", "template" : "Well does this ${3} movie have a name?" },
		                 { "ts" : "46.38", "template" : "listen to me you little ${5}  ${3} head. You need to hang up now and start to ${6} your ${7} together. I\"m getting in my ${8} and coming home and I am going to get my ${9} and put it through your ${3} filled ${10}. You better not touch my ${1} or give it any of your damn ${3}. This is Mrs. Von ${2} Burger. Goodbye." }
                    ]
                }]
            };
        }
        return  {
                'id'          : '1',
                'title'       : 'Something Special',
                'views'       : 993,
                'src'         : baseUrl + '/media/romance/not_over',
                'css'         : baseUrl + '/styles/bubbles_romance.css',
                'anim'        : 'romance',
                'defSizeLimit': 18,
                'prompts'   : [
                    'strong smell',
                    'bodily function',
                    'exuberant expression',
                    'animal',
                    { query : 'animal', sizeLimit : 18},
                    'type of bread',
                    'famous A-list celebrity',
                    'Fight move',
                    'plural vegetable'
                ],
                'annotations' :  [{
                    'options' : {
                        'type'       : 'bubble',
                        'duration'   : 4,
                        'cls'        : ['notebook-${index}']
                    },
                    'notes' : [
                       { 'ts':11,'template':'Weird, smells like ${1}!', tail: {type:'speech', pos: 'bottomLeft'} },
                       { 'ts':16,'template':'Damn she knows I just ${2}.', 'duration' : 3, tail: {type:'thought', pos: 'bottomRight'} },
                       { 'ts':19,'template':'Rain Diversion ${3}!', 'duration' : 2, tail: {type:'thought', pos: 'topRight'} },
                       { 'ts':27,'template':'Casual laugh, think about a mutant ${4} ${5}.', 'duration' : 3, tail: {type:'thought', pos: 'topRight'} },
                       { 'ts':34,'template':'${4} ${5}!!', 'duration' : 2.5, tail: {type:'thought', pos: 'topRight'} },
                       { 'ts':38,'template':'Must counter or he\'ll think I\'m boring like ${6}.', tail: {type:'thought', pos: 'bottomLeft'} },
                       { 'ts':43,'template':'Commence over-acting.  Channel ${7}.', tail: {type:'thought', pos: 'topLeft'} },
                       { 'ts':55,'template':'umm WTF was that? She must ${8} ${9}.', 'duration' : 2.5, tail: {type:'thought', pos: 'topRight'} },
                       { 'ts':58,'template':'I love ${9}.', 'duration': 2, tail: {type:'speech', pos: 'bottomLeft'} }
                    ]
                }]
            };
    };


    return service;
}]);

})();
