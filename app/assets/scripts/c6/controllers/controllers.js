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

.controller('C6AppCtrl', ['$log', '$scope', '$location', '$routeParams', 'c6VideoListingService', 'appBaseUrl', 'C6SfxService', function($log, $scope, $location, $routeParams, vsvc, appBase, sfxSvc) {
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
	this.inExperience = false;
	this.experience = null;
	this.promptModel = null;
	this.goToRoute = function(route) {
		$location.path(route);
	};
	this.currentCategory = function() {
		return $routeParams.category;
	};

	$scope.appCtrl = this;

	$scope.$watch('appCtrl.currentCategory()', function(category) {
		if ((self.experience? self.experience.id : null) !== vsvc.getExperienceByCategory(category).id) {
			self.experience = category? vsvc.getExperienceByCategory(category) : null;
		}
	});

	$scope.$watch('appCtrl.experience', function(experience) {
		self.promptModel = experience? new PromptModel(experience) : null;
	});
}])

.controller('C6AnnotationsCtrl',['$log', '$scope', '$rootScope', '$location', '$routeParams', 'C6AnnotationsService', function($log, $scope, $rootScope, $location, $routeParams, annSvc){
	$log.log('Creating C6AnnotationsCtrl');
	var self = this,
		video;

	$scope.$on('c6video-ready', function(event, player) {
		video = player;

		player.on('canplaythrough', function() {
			 self.videoCanPlay = true;
		});
	});

	$scope.$watch('appCtrl.inExperience', function(yes) {
		if (yes) {
			var bubbleModel = annSvc.getAnnotationsModelByType('bubble', $scope.appCtrl.experience.annotations),
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

	this.annotationsModel = null;

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
		$location.path('/entry/' + $routeParams.category + '/end');
	};

	this.annotationIsActive = function(annotation) {
		 return self.activeAnnotations.indexOf(annotation) !== -1 && $scope.appCtrl.inExperience;
	};

	$scope.annoCtrl = this;
}])

.controller('C6CategoryListCtrl',['$log','$scope', '$rootScope',
										'c6VideoListingService', function($log,$scope,$rootScope,vsvc){
	$log.log('Creating cCategoryListCtrl');
	$rootScope.currentRoute = 'categories';

	this.categories = vsvc.getCategories();

	this.loadCategory = function(category) {
		category = angular.lowercase(category);

		$scope.appCtrl.experience = vsvc.getExperienceByCategory(category);
		$scope.appCtrl.goToRoute('/entry/' + category);
	};

	$scope.catCtrl = this;
}])

.controller('C6InputCtrl', ['$log', '$scope', '$rootScope', '$routeParams', function($log, $scope, $rootScope, $routeParams) {
	var self = this;
	$log.log('Creating C6InputCtrl: ' + $routeParams.category);
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
		 $scope.appCtrl.goToRoute('/entry/' + $routeParams.category + '/experience');
	};

	$scope.inputCtrl = this;

	$scope.$watch('appCtrl.promptModel', function(promptModel) {
		self.promptModel = promptModel;
		self.currentPrompt = promptModel.prompts[0];
	});
}])

.controller('C6ExperienceCtrl', ['$log', '$scope', '$rootScope', function($log, $scope, $rootScope) {
	$log.log('Creating C6ExperienceCtrl');
	$rootScope.currentRoute = 'experience';

	$scope.appCtrl.inExperience = true;

	$scope.$on('$destroy', function() {
		$scope.appCtrl.inExperience = false;
	});
}])

.controller('C6EndCtrl', ['$log', '$scope', '$rootScope', function($log, $scope, $rootScope) {
	$log.log('Creating C6EndCtrl');
	$rootScope.currentRoute = 'end';

	$scope.endCtrl = this;
}]);
})();
