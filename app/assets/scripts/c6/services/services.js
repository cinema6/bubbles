(function(){

'use strict';

angular.module('c6.svc',[])
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
}])

.factory('c6VideoListingService',['$log','appBaseUrl',function($log,baseUrl){
    $log.log('Creating c6VideoListingService');
    var service          = {};

    service.getCategories = function() {
        return { 'categories' : [
                        'Action',
                        'Romance',
                        'SciFi-Fantasy',
                    ]
        };
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
                    'Salutation',
                    'Animal',
                    'Superhero',
                    'Body Part (plural)',
                    'Plural noun',
                    'Household appliance',
                    'Sesame Street character',
                    'Character from Star Wars',
                    'TV personality',
                    'Type of candy'
                    ],
                'annotations' : {
                    'options' : {
                        'type'      : 'bubble',
                        'duration'  : 4,
                        'cls'     : ['lee-${index}']
                        },
                     'notes'  : [
                        { 'ts': 7.25,'template':'${1}', 'duration':1.25 },
                        { 'ts': 16,'template':'My dramatic entrance' },
                        { 'ts': 18,'template':'Must look tough' },
                        { 'ts': 20,'template':'Crazy ${2} stare', 'duration': 2 },
                        { 'ts': 22,'template':'${2} ${3}' },
                        { 'ts': 39,'template':'Get Out' },
                        { 'ts': 41,'template':'Or I will crush your ${4} into ${5}', 'duration':2 },
                        { 'ts': 50,'template':'What can I say to make them leave?', 'duration':2.5 },
                        { 'ts': 60,'template':'${5}!!!', 'duration':2 },
                        { 'ts': 86,'template':'Did I leave the ${6} on???', 'duration':2 },
                        { 'ts': 95,'template':'Handcuffs of Drunken ${7}!!' },
                        { 'ts':100,'template':'Bruce Lee > ${7}!', 'duration':2 },
                        { 'ts':116, 'template':'I\'m ${8}!', 'duration': 2 },
                        { 'ts':118,'template':'No, you\'re a dumb Ewok', 'duration': 2 },
                        { 'ts':120,'template':'Shut up stupid!', 'duration':2 },
                        { 'ts':123,'template':'Good comeback ${9}', 'duration':2 },
                        { 'ts':125,'template':'${10}', 'duration':2 },
                        { 'ts':127.5,'template':'That made no sense', 'duration':1.5 },
                        { 'ts':129.5,'template':'${6}?', 'duration':1.5 },
                        { 'ts':131.5,'template':'${2} ${3}!', 'duration':1.5 }
                    ]
                }
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
                    'romantic pet nickname',
                    'fruit',
                    'body part',
                    'verb',
                    'plural noun',
                    'synonym for feces',
                    'vegetable',
                    'place',
                    'baby animal'
                    ],
                'annotations' : {
                    'options' : {
                        'type'      : 'bubble',
                        'duration'  : 4,
                        'cls'     : ['lotr-${index}']
                        },
                     'notes'  : [
                        { 'ts':  3,'template':'I\'ll always remember' },
                        { 'ts':  5,'template':'The times we milked the ${1} together', 'duration' : 2 },
                        { 'ts': 10.5,'template':'${2}', 'duration' : 2 },
                        { 'ts': 11,'template':'${3} ${4}', 'duration' : 2},
                        { 'ts': 24.5,'template':'Wonder if he knows I milked the ${1} with everyone', 'duration' : 3 },
                        { 'ts': 29,'template':'Yes, I know..', 'duration' : 3 },
                        { 'ts': 32,'template':'but I don\'t care', 'duration' : 3 },
                        { 'ts': 35,'template':'Because I ${5} ${6} with Gandalf' },
                        { 'ts': 41,'template':'${2}', 'duration' : 3 },
                        { 'ts': 49,'template':'Your ${7} smells like rotten ${8}', 'duration' : 5.5 },
                        { 'ts': 58,'template':'I\'m ready to go to ${9}!' },
                        { 'ts': 63,'template':'Get over here you tiny ${7}', 'duration' : 2 },
                        { 'ts': 68,'template':'I hope they have ${6} in ${9}', 'duration' : 2 },
                        { 'ts': 75,'template':'You sail, I\'m not doing ${7} on this trip', 'duration' : 3},
                        { 'ts': 78,'template':'Hope this ${10} can swim', 'duration' : 2 },
                        { 'ts': 82,'template':'${2}', 'duration' : 4 },
                        { 'ts': 83,'template':'${2}', 'duration' : 3 },
                        { 'ts': 84,'template':'${8} ${7}', 'duration' : 2 },
                        { 'ts': 95,'template':'I just took a ${7} in my pants', 'duration' : 5 }
                    ]
                }
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
                    { query : 'exuberant expression' },
                    'animal',
                    { query : 'animal', sizeLimit : 18},
                    'type of bread',
                    'famous A-list celebrity',
                    'Fight move',
                    'plural vegetable'
                ],
                'annotations' :  {
                    'options' : {
                        'type'       : 'bubble',
                        'duration'   : 4,
                        'cls'        : ['notebook-${index}']
                    },
                    'notes' : [
                       { 'ts':11,'template':'Weird, smells like ${1}!' },
                       { 'ts':16,'template':'Damn she knows I just ${2}.', 'duration' : 3 },
                       { 'ts':19,'template':'Rain Diversion ${3}!', 'duration' : 2 },
                       { 'ts':27,'template':'Casual laugh, think about a mutant ${4} ${5}.', 'duration' : 3 },
                       { 'ts':34,'template':'${4} ${5}!!', 'duration' : 2.5 },
                       { 'ts':38,'template':'Must counter or he\'ll think I\'m boring like ${6}.' },
                       { 'ts':43,'template':'Commence over-acting.  Channel ${7}.' },
                       { 'ts':55,'template':'umm WTF was that? She must ${8} ${9}.', 'duration' : 2.5 },
                       { 'ts':58,'template':'I love ${9}.', 'duration': 2 }
                    ]
                }
            };
    };


    return service;
}]);

})();
