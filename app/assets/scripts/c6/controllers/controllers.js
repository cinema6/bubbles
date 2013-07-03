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
				sizeLimit : this.defSizeLimit,
			});
		}
		else {
			throw localException('Unknown question type: ' + typeof q);
		}
		this.responses.push(null);
	}
}

angular.module('c6.ctrl',['c6.svc'])
.controller('C6AppCtrl', ['$log', '$scope', '$location', '$stateParams', 'c6VideoListingService', 'appBaseUrl', 'C6SfxService', '$state', 'C6AnnotationsService', function($log, $scope, $location, $stateParams, vsvc, appBase, sfxSvc, $state, annSvc) {
	$log.log('Creating C6AppCtrl');
	var self = this;

	sfxSvc.loadSounds([
		{ name: 'type', src: appBase + '/media/tw_strike' },
		{ name: 'bell', src: appBase + '/media/tw_bell' },
		{ name: 'pop', src: appBase + '/media/pop_1' },
		{ name: 'yank', src: appBase + '/media/tw_yank' }
	]);
	sfxSvc.playSoundOnEvent('pop', 'annotationActivated');

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

	$scope.appCtrl = this;
	$scope.$state = $state;
	$scope.$stateParams = $stateParams;

	$scope.$watch('appCtrl.currentCategory()', function(category) {
		if ((self.experience? self.experience.id : null) !== vsvc.getExperienceByCategory(category).id) {
			self.experience = category? vsvc.getExperienceByCategory(category) : null;
		}
	});

	$scope.$watch('appCtrl.experience', function(experience) {
		self.promptModel = experience? new PromptModel(experience) : null;
		self.annotationsModel = experience? annSvc.getAnnotationsModelByType('bubble', $scope.appCtrl.experience.annotations) : null;
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

.controller('C6AnnotationsCtrl',['$log', '$scope', '$rootScope', '$location', '$stateParams', 'C6AnnotationsService', '$state', function($log, $scope, $rootScope, $location, $stateParams, annSvc, $state){
	$log.log('Creating C6AnnotationsCtrl');
	var self = this,
		video;

	$scope.$on('c6video-ready', function(event, player) {
		video = player;

		player.on('canplaythrough', function() {
			 self.videoCanPlay = true;
		});
	});

	$scope.$watch('$state.is("experience.video")', function(yes) {
		if (yes) {
			var bubbleModel = $scope.appCtrl.annotationsModel,
				txt2SpchModel = annSvc.getAnnotationsModelByType('talkie', $scope.appCtrl.experience.annotations);

			if (bubbleModel) {
				self.annotationsModel = annSvc.interpolateAnnotations(bubbleModel, $scope.appCtrl.promptModel.responses);
			}
			if (txt2SpchModel) {
				self.videoCanPlay = false;
				txt2SpchModel = annSvc.interpolateAnnotations(txt2SpchModel, $scope.appCtrl.promptModel.responses);
				$scope.appCtrl.experience.src = null;
				annSvc.fetchText2SpeechVideoUrl(txt2SpchModel).then(function(url) {
					$scope.appCtrl.experience.src = url;
					video.on('canplaythrough', function() {
						video.player.play();
					});
				});
			}
		}
	});

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
					$scope.$emit('annotationActivated');
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

	this.goToEnd = function() {
		$state.transitionTo('experience.end', { category: $stateParams.category });
	};

	this.annotationIsActive = function(annotation) {
		 return self.activeAnnotations.indexOf(annotation) !== -1;
	};

	$scope.annoCtrl = this;
}])

.controller('C6CategoryListCtrl',['$log','$scope', '$rootScope',
										'c6VideoListingService', '$state', function($log,$scope,$rootScope,vsvc,$state){
	$log.log('Creating cCategoryListCtrl');
	$rootScope.currentRoute = 'categories';

	this.categories = vsvc.getCategories();

	this.loadCategory = function(category) {
		category = angular.lowercase(category);

		$scope.appCtrl.experience = vsvc.getExperienceByCategory(category);
		$state.transitionTo('experience.input', { category: category });
	};

	$scope.catCtrl = this;
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
		$state.transitionTo('experience.video', { category: $stateParams.category });
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

.controller('C6EndCtrl', ['$log', '$scope', '$rootScope', function($log, $scope, $rootScope) {
	$log.log('Creating C6EndCtrl');
	$rootScope.currentRoute = 'end';

	this.lastAnnotation = null;

	$scope.$watch('appCtrl.annotationsModel', function(annotationsModel) {
		if (annotationsModel) {
			$scope.endCtrl.lastAnnotation = annotationsModel.annotations[annotationsModel.annotations.length - 1];
		}
	});

	$scope.endCtrl = this;
}]);
})();
