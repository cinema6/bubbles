(function(){
'use strict';

function PromptModel(experience) {
	var localException = function(msg) {
		return {
			'name'	 : 'PromptModel',
			'message'	 : (msg !== undefined) ? msg : 'Unspecified error.',
			'toString' : function() { return this.name + ': ' + this.message; }
		};
	};
	this.defSizeLimit	 = (experience.defSizeLimit) ? experience.defSizeLimit : 30;
	this.prompts		 = [];
	this.responses		 = [];
	for (var i = 0; i < experience.prompts.length; i++) {
		var q = experience.prompts[i];
		if (q instanceof Object) {
			if (!q.query) {
				throw localException('question object must have a query!');
			}
			this.prompts.push({
				query : q.query,
				sizeLimit : (q.sizeLimit) ? q.sizeLimit : this.defSizeLimit
			});
		}
		else if ((typeof q === 'string') || (q instanceof String)){
			this.prompts.push({
				query : q,
				sizeLimit : this.defSizeLimit
			});
		}
		else {
			throw localException('Unknown question type: ' + typeof q);
		}
		this.responses.push(null);
	}
}

angular.module('c6.ctrl',['c6.svc'])
.controller('C6AppCtrl', ['$log', '$scope', '$location', '$stateParams', '$timeout', 'c6VideoListingService', 'appBaseUrl', 'c6Sfx', '$state', 'C6AnnotationsService', 'C6ResponseCachingService', 'C6UrlShareService', function($log, $scope, $location, $stateParams, $timeout, vsvc, appBase, sfxSvc, $state, annSvc, respSvc, shareSvc) {
	$log.log('Creating C6AppCtrl');
	var self = this,
		hideC6ControlsTimeout;

	sfxSvc.loadSounds([
		{ name: 'type', src: appBase + '/media/tw_strike' },
		{ name: 'bell', src: appBase + '/media/tw_bell' },
		{ name: 'pop', src: appBase + '/media/pop_1' },
		{ name: 'yank', src: appBase + '/media/tw_yank' }
	]);

	this.sfxSvc = sfxSvc;
	this.experience = null;
	this.experienceAnimation = null;
	$scope.$on('$viewContentLoaded', function() {
		$scope.appCtrl.experienceAnimation = 'experience';
	});
	this.promptModel = null;
	this.annotationsModel = null;
	this.goToRoute = function(route) {
		$location.path(route);
	};
	this.currentCategory = function() {
		return $stateParams.category;
	};

	this.askForVideoLoad = function() {
		$scope.$broadcast('videoShouldLoad');
	};

    this.loadSfx = function() {
        $log.log('Experience (' + this.experience.id + ') has some sounds.');
        var sfxToLoad;
        angular.forEach(self.annotationsModel.sfx,function(sfxSrc,sfxName){
            sfxSrc  = appBase + '/' + sfxSrc;
            if (!sfxSvc.getSoundByName(sfxName)){
                $log.info('Will load sfx name=' + sfxName + ', src=' + sfxSrc);
                if (!sfxToLoad){
                    sfxToLoad = [];
                }
                sfxToLoad.push( { name: sfxName, src: sfxSrc });
            } else {
                $log.info('Already loaded sfx name=' + sfxName);
            }
        });

        if (sfxToLoad){
            $log.info('loading sounds');
            sfxSvc.loadSounds(sfxToLoad);
        }
    };

	this.userIsUsingC6Chrome = false;
	this.showC6Chrome = false;

	$scope.$on('c6MouseActivityStart', function() {
		if (hideC6ControlsTimeout) { $timeout.cancel(hideC6ControlsTimeout); }
		self.showC6Chrome = true;
	});

	$scope.$on('c6MouseActivityStop', function() {
		hideC6ControlsTimeout = $timeout(function() {
			if (!self.userIsUsingC6Chrome) {
				self.showC6Chrome = false;
			}
		}, 3000);
	});

	$scope.appCtrl = this;
	$scope.$state = $state;
	$scope.$stateParams = $stateParams;

	$scope.$watch('$stateParams', function(params) {

        if (!params.category || !params.expid) {
			    self.experience = null;
                $state.transitionTo('landing');
			    return false;
	    }
	    (function() {
		    vsvc.getExperience(params.category, params.expid).then(function(experience) {
			    if ((self.experience && self.experience.id) !== experience.id) {
				    self.experience = experience;
			    }
		    });
	    })();
	}, true);

	$scope.$watch('appCtrl.experience', function(experience) {
        if (!$state.is('shared')) {
            shareSvc.sharedId = null;
            shareSvc.sharedUrl = null;
            if (experience && experience.src) {
			    experience.src = appBase + '/' + experience.src;
		    }
		    self.promptModel = experience? new PromptModel(experience) : null;
		    self.annotationsModel = experience? annSvc.getAnnotationsModelByType('bubble', experience.annotations) : null;

            if (self.annotationsModel && self.annotationsModel.sfx){
                self.loadSfx();
            }
        }
	});

	$scope.$watch('appCtrl.promptModel', function(promptModel) {
		var cachedResponses = respSvc.getResponses($stateParams.category, $stateParams.expid);
		if (promptModel && cachedResponses) {
			promptModel.responses = cachedResponses;
		}
	});
}])

.controller('C6SharedVidCtrl', ['$scope', '$log', '$state', '$location', '$q', 'C6UrlShareService', function($scope, $log, $state, $location, $q, shareSvc) {
    
    shareSvc.sharedId = $location.search()['id'];
    shareSvc.sharedUrl = $location.absUrl();
    $log.log('Creating C6SharedVidCtrl: sharedId = ' + shareSvc.sharedId);

    shareSvc.getScript(shareSvc.sharedId).then(function(sharedScript) {
        //TODO: check validity of script?
        $scope.appCtrl.annotationsModel = sharedScript.bubbleModel;
        $scope.appCtrl.experience = sharedScript;

        if ($scope.appCtrl.annotationsModel && $scope.appCtrl.annotationsModel.sfx) {
            $scope.appCtrl.loadSfx();
        }

        var ttsModel = $scope.appCtrl.experience.ttsModel;
        if (ttsModel) {
            $log.log('verifying video');
            return shareSvc.verifyVideo($scope.appCtrl.experience);
        } else {
            return $q.when($scope.appCtrl.experience.src);
        }

    }).then(function(url) {
        $log.log('Video verified');
        $scope.appCtrl.experience.src = url;
    }).then(function() {
        $state.transitionTo('experience.video',
                            { category: $scope.appCtrl.experience.category,
                              expid: $scope.appCtrl.experience.id });
    }, function(error) {
        //TODO: display error on page - 'Sorry, we couldn't load that video'
        $log.log('Error getting shared video: ' + error);
        shareSvc.sharedId = null;
        $state.transitionTo('landing');
    });

}])

.controller('C6LandingCtrl', ['$scope', '$log', 'c6VideoListingService', function($scope, $log, vsvc) {
	var randomCategory = vsvc.getRandomCategoryFrom(['action', 'romance', 'fantasy']),
		randomQuote = vsvc.getRandomQuoteForCategory(randomCategory);

	$log.log('Creating C6LandingCtrl');

	this.pullQuote = {
		category: randomCategory,
		quote: randomQuote
	};

	$scope.landingCtrl = this;
}])

.controller('C6AnnotationsCtrl',['$log', '$scope', '$rootScope', '$location', '$stateParams', 'C6AnnotationsService', '$state', '$timeout', 'environment', 'C6ResponseCachingService','c6Sfx', 'C6VideoControlsService', function($log, $scope, $rootScope, $location, $stateParams, annSvc, $state, $timeout, env, respSvc, sfxSvc, vidCtrlsSvc){
	$log.log('Creating C6AnnotationsCtrl');
	var self = this,
		readyEvent = env.browser.isMobile? 'loadstart' : 'canplaythrough',
		oldResponses,
		video;

	$scope.$on('c6video-ready', function(event, player) {
		video = player;

		var undoWatch = $scope.$watch('annoCtrl.c6ControlsController.ready', function(ready) {
			if (ready) {
				vidCtrlsSvc.bind(player, self.c6ControlsDelegate, self.c6ControlsController);
				undoWatch();
			}
		});

		player.on([readyEvent, 'play'], function(event, video) {
			self.videoCanPlay = true;
			$timeout(function() {
				if ($state.is('experience.video') && video.player.paused) { video.player.play(); }
			}, 200, false);
		});
	});

	$scope.$on('c6video-regenerated', function(event, video) {
		video.player.load();
	});

	$scope.$on('videoShouldLoad', function() {
		if (!video.bufferedPercent()) {
			$log.log('Video not buffered! Attempting to load!');
			video.player.load();
		}
	});

	$scope.$on('finishedAnimatingVideoShow', function() {
		if (self.videoCanPlay && video.player.paused) {
			if (video.hasPlayed()) {
				video.player.currentTime = 0;
			}
			$log.log('Playing the video!');
			video.player.play();
		}
	});

	$scope.$watch('$state.is("experience.video") && appCtrl.promptModel', function(yes) {
		if (yes) {
			var bubbleModel = $scope.appCtrl.annotationsModel,
				txt2SpchModel = annSvc.getAnnotationsModelByType('talkie',
                                    $scope.appCtrl.experience.annotations),
				responses = $scope.appCtrl.promptModel.responses;

			if (bubbleModel) {
				self.annotationsModel = annSvc.interpolateAnnotations(bubbleModel, responses);
                $scope.appCtrl.experience.bubbleModel = self.annotationsModel;
			} else {
				self.annotationsModel = null;
			}
			if (txt2SpchModel) {
				txt2SpchModel = annSvc.interpolateAnnotations(txt2SpchModel, responses);
                $scope.appCtrl.experience.ttsModel = txt2SpchModel;

				if (!angular.equals(responses, oldResponses) || env.browser.isMobile) {
					respSvc.setResponses(responses, $stateParams.category, $stateParams.expid);
					self.videoCanPlay = false;
					$scope.appCtrl.experience.src = null;
				}
				oldResponses = angular.copy(responses);

				annSvc.fetchText2SpeechVideoUrl(txt2SpchModel).then(function(url) {
					$scope.appCtrl.experience.src = url;
				});
			}
		}
	});

	// For c6Controls
	this.c6ControlsDelegate = {};
	this.c6ControlsController = {};

	this.videoCanPlay = false;

	this.annotationsModel = $scope.appCtrl.annotationsModel;

	this.activeAnnotations = [];

	this.setActiveAnnotations = function(event, video) {
		var annotations = self.annotationsModel? self.annotationsModel.annotations : [],
			activeAnnotations = self.activeAnnotations,
			time = video.player.currentTime,
			ts,
			duration,
			inActiveArray;
		annotations.forEach(function(annotation) {
			ts = annotation.ts;
			duration = annotation.duration;
			inActiveArray = activeAnnotations.indexOf(annotation) !== -1;

			if ((time >= ts) && (time <= (ts + duration))) {
				if (!inActiveArray) {
					self.activeAnnotations.push(annotation);
                    if (annotation.sfx) {
                        sfxSvc.playSound(annotation.sfx);
                    } else {
                        sfxSvc.playSound('pop');
                    }
					$log.log('Activated annotation: ' + annotation.text);
				}
			} else {
				if (inActiveArray) {
					self.activeAnnotations.splice(activeAnnotations.indexOf(annotation), 1);
					$log.log('Deactivated annotation: ' + annotation.text);
				}
			}
		});
	};

	this.goToEnd = function(player) {
		player.fullscreen(false);
		$state.transitionTo('experience.end', $stateParams);
	};

	this.annotationIsActive = function(annotation) {
		 return self.activeAnnotations.indexOf(annotation) !== -1;
	};

	$scope.annoCtrl = this;
}])

.controller('C6CategoryListCtrl',['$log','$scope', '$rootScope',
								  'c6VideoListingService', '$state',
                                  function($log,$scope,$rootScope,vsvc,$state){
	$log.log('Creating cCategoryListCtrl');
	$rootScope.currentRoute = 'categories';

	this.categories = vsvc.getCategories();

	this.loadCategory = function(category) {
		category = angular.lowercase(category);

		vsvc.getExperienceByCategory(category).then(function(exp) {
			$state.transitionTo('experience.input', { category: category, expid: exp.id });
		});
	};

	$scope.catCtrl = this;
}])

.controller('C6RandomCategoryCtrl', ['$state', '$stateParams', 'c6VideoListingService', '$log', function($state, $stateParams, vsvc, $log) {
	var category = $stateParams.category;
	$log.log('Choosing a random experience in the ' + category + ' category.');

	vsvc.getRandomExperienceIdFromCategory(category).then(function(experienceId) {
		$state.transitionTo('experience.input', { category: $stateParams.category, expid: experienceId });
	});
}])

.controller('C6InputCtrl', ['$log', '$scope', '$rootScope', '$stateParams', '$state', function($log, $scope, $rootScope, $stateParams, $state) {
	var self = this;
	$log.log('Creating C6InputCtrl: ' + $stateParams.category);
	$rootScope.currentRoute = 'input';

	$scope.$watch('inputCtrl.currentPromptIndex()', function(newValue, oldValue) {
		$scope.$broadcast('newPrompt');
		if (newValue > oldValue) {
			$scope.inputCtrl.currentDirection = 'next';
		} else if (newValue < oldValue) {
			$scope.inputCtrl.currentDirection = 'previous';
		}
	});

	this.promptModel = $scope.appCtrl.promptModel;

	this.currentPrompt = this.promptModel? this.promptModel.prompts[0] : null;
	this.currentResponse = function() {
		 return this.promptModel? this.promptModel.responses[this.currentPromptIndex()] : null;
	};
	this.currentResponseIsValid = function() {
		 return (this.currentResponse() && this.promptModel.validations[this.currentPromptIndex()])? true : false;
	};
	this.currentPromptIndex = function() {
		 return this.promptModel? this.promptModel.prompts.indexOf(this.currentPrompt) : null;
	};
	this.totalPrompts = function() {
		 return this.promptModel? this.promptModel.prompts.length : null;
	};
	this.currentDirection = null;
	this.nextQuestion = function() {
		this.currentPrompt = this.promptModel.prompts[this.currentPromptIndex() + 1];
	};
	this.prevQuestion = function() {
		 this.currentPrompt = this.promptModel.prompts[this.currentPromptIndex() - 1];
	};
	this.canGoBack = function() {
		 return this.currentPromptIndex();
	};
	this.isDone = function() {
		 return (this.currentPromptIndex() === this.totalPrompts() - 1);
	};
	this.canGoForward = function() {
		 return (!this.isDone() && this.currentResponse());
	};

	this.startExperience = function() {
		$scope.$broadcast('experienceStart');
		$state.transitionTo('experience.video', $stateParams);
	};

	$scope.inputCtrl = this;

	$scope.$watch('appCtrl.promptModel', function(promptModel) {
		self.promptModel = promptModel;
		self.currentPrompt = promptModel? promptModel.prompts[0] : null;
	});
}])

.controller('C6VideoCtrl', ['$log', '$scope', '$rootScope', function($log, $scope, $rootScope) {
	$log.log('Creating C6ExperienceCtrl');
	$rootScope.currentRoute = 'experience';
}])

.controller('C6EndCtrl', ['$log', '$scope', '$rootScope', 'C6AnnotationsService', 'C6UrlShareService', function($log, $scope, $rootScope, annSvc, shareSvc) {
	$log.log('Creating C6EndCtrl');
	$rootScope.currentRoute = 'end';

	this.lastAnnotation = null;
    
    this.share = function() {
        shareSvc.share($scope.appCtrl.experience);
    };

	$scope.$watch('appCtrl.annotationsModel', function(annotationsModel) {
		if (annotationsModel) {
			var lastAnnotation = annotationsModel.annotations[annotationsModel.annotations.length - 1];

			if (!lastAnnotation.text) { lastAnnotation.text = annSvc.interpolate(lastAnnotation.template, $scope.appCtrl.promptModel.responses); }

			$scope.endCtrl.lastAnnotation = lastAnnotation;
		}
	});

	$scope.endCtrl = this;
}]);
})();
