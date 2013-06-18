(function(){
'use strict';
describe('Controllers', function() {
	var __C6_APP_BASE_URL__ = 'assets';
	
	var $rootScope,
		appCtrl,
		$location,
		vsvc;
	
	beforeEach(function() {
	    module(function($provide){
	        $provide.constant('appBaseUrl', __C6_APP_BASE_URL__);
	        $provide.value('$location', {
	        	_path: null,
		        path: function(path) {
		        	if (path) { this._path = path; }
			        return this._path;
		        }
	        });
	        $provide.value('$routeParams', {
		        category: 'action'
	        });
	    });
	    module('c6.svc');
	    module('c6.ctrl');
	});
	
	beforeEach(inject(function ($controller, _$rootScope_, _$location_, c6VideoListingService) {
	    $rootScope = _$rootScope_;
	    $location = _$location_;
	    vsvc = c6VideoListingService;
	    appCtrl = $controller('C6AppCtrl', {
	        $scope: _$rootScope_
	    });
	}));
	
	describe('Controller: C6AppCtrl', function() {
		it('Should start with no experience.', function() {
			expect($rootScope.appCtrl.experience).toBe(null);
		});
		it('Should start out of the experience.', function() {
			expect($rootScope.appCtrl.inExperience).toBe(false);
		});
		it('Should set inExperience based on the URL.', function() {
			$location._path = '/entry/action';
			$rootScope.$broadcast('$routeChangeSuccess');
			expect($rootScope.appCtrl.inExperience).toBe(false);
			
			appCtrl.inExperience = true;
			$location._path = '/entry/action/experience';
			$rootScope.$broadcast('$routeChangeSuccess');
			expect($rootScope.appCtrl.inExperience).toBe(true);
			
			$location._path = '/entry/action/end';
			$rootScope.$broadcast('$routeChangeSuccess');
			expect($rootScope.appCtrl.inExperience).toBe(false);
		});
	});
	
	describe('Controller: C6CategoryListCtrl', function() {
		var controller,
			scope;
		
		beforeEach(inject(function($controller) {
			scope = $rootScope.$new();
			controller = $controller('C6CategoryListCtrl', {
				$scope: scope
			});
		}));
		
		it('Should set the currentRoute to categories.', function() {
			expect($rootScope.currentRoute).toBe('categories');
		});
		it('Should clear the experience.', function() {
			expect(scope.appCtrl.experience).toBe(null);
		});
		it('Should add the service\'s categories to the scope.', function() {
			expect(typeof scope.catCtrl.categories === 'object').toBe(true);
		});
	});
	
	describe('Controller: C6InputCtrl', function() {
		var controller,
			scope;
		
		beforeEach(inject(function($controller) {
			scope = $rootScope.$new();
			controller = $controller('C6InputCtrl', {
				$scope: scope
			});
		}));
		
		it('Should set the currentRoute to input.', function() {
			expect($rootScope.currentRoute).toBe('input');
		});
		it('Should figure out the direction the prompts are moving in.', function() {
			expect(scope.inputCtrl.currentDirection).toBe(null);
			scope.$digest();
			
			controller.nextQuestion();
			scope.$digest();
			expect(scope.inputCtrl.currentDirection).toBe('next');
			
			controller.nextQuestion();
			scope.$digest();
			expect(scope.inputCtrl.currentDirection).toBe('next');
			
			controller.prevQuestion();
			scope.$digest();
			expect(scope.inputCtrl.currentDirection).toBe('previous');
			
			controller.nextQuestion();
			scope.$digest();
			expect(scope.inputCtrl.currentDirection).toBe('next');
			
			controller.prevQuestion();
			scope.$digest();
			expect(scope.inputCtrl.currentDirection).toBe('previous');
			
			controller.prevQuestion();
			scope.$digest();
			expect(scope.inputCtrl.currentDirection).toBe('previous');
		});
		it('Should first try to set the experience from the appCtrl.', function() {
			appCtrl.experience = 'foo';
			
			expect(scope.appCtrl.experience).toBe('foo');
		});
		it('Should then try to set the experience from the routeParams.', function() {
			expect(typeof scope.appCtrl.experience).toBe('object');
		});
		it('Should set the promptModel property.', function() {
			expect(typeof scope.inputCtrl.promptModel).toBe('object');
		});
		it('Should get the responses from the appCtrl if they exist.', function() {
			appCtrl.experience.responses = 'foo';
			inject(function($controller) {
				controller = $controller('C6InputCtrl', {
					$scope: scope
				});
			});
			expect(scope.inputCtrl.promptModel.responses).toBe('foo');
		});
		it('Should change the currentResponse when you go from question to question.', function() {
			controller.promptModel.responses = [
				'Hello',
				'My',
				'Name',
				'Is',
				'Josh',
				'I',
				'Write',
				'Code',
				'For',
				'Cinema6'
			];
			expect(scope.inputCtrl.currentResponse()).toBe('Hello');
			
			controller.nextQuestion();
			expect(scope.inputCtrl.currentResponse()).toBe('My');
			
			controller.nextQuestion();
			expect(scope.inputCtrl.currentResponse()).toBe('Name');
			
			controller.prevQuestion();
			expect(scope.inputCtrl.currentResponse()).toBe('My');
			
			controller.nextQuestion();
			controller.nextQuestion();
			controller.nextQuestion();
			expect(scope.inputCtrl.currentResponse()).toBe('Josh');
			
			controller.prevQuestion();
			expect(scope.inputCtrl.currentResponse()).toBe('Is');
		});
		it('Should change the currentPromptIndex when you go from question to question.', function() {
			expect(scope.inputCtrl.currentPromptIndex()).toBe(0);
			
			controller.nextQuestion();
			expect(scope.inputCtrl.currentPromptIndex()).toBe(1);
			
			controller.nextQuestion();
			expect(scope.inputCtrl.currentPromptIndex()).toBe(2);
			
			controller.prevQuestion();
			expect(scope.inputCtrl.currentPromptIndex()).toBe(1);
			
			controller.nextQuestion();
			controller.nextQuestion();
			controller.nextQuestion();
			expect(scope.inputCtrl.currentPromptIndex()).toBe(4);
			
			controller.prevQuestion();
			expect(scope.inputCtrl.currentPromptIndex()).toBe(3);
		});
		it('Should get the totalPrompts in the promptModel.', function() {
			expect(scope.inputCtrl.totalPrompts()).toBe(10);
		});
		it('Should get the next question.', function() {
			var prompts = controller.promptModel.prompts;
			
			expect(scope.inputCtrl.currentPrompt).toBe(prompts[0]);
			
			controller.nextQuestion();
			expect(scope.inputCtrl.currentPrompt).toBe(prompts[1]);
			
			controller.nextQuestion();
			expect(scope.inputCtrl.currentPrompt).toBe(prompts[2]);
			
			controller.nextQuestion();
			expect(scope.inputCtrl.currentPrompt).toBe(prompts[3]);
			
			controller.nextQuestion();
			expect(scope.inputCtrl.currentPrompt).toBe(prompts[4]);
		});
		it('Should get the previous question.', function() {
			var prompts = controller.promptModel.prompts;
			controller.currentPrompt = prompts[9];
			
			expect(scope.inputCtrl.currentPrompt).toBe(prompts[9]);
			
			controller.prevQuestion();
			expect(scope.inputCtrl.currentPrompt).toBe(prompts[8]);
			
			controller.prevQuestion();
			expect(scope.inputCtrl.currentPrompt).toBe(prompts[7]);
			
			controller.prevQuestion();
			expect(scope.inputCtrl.currentPrompt).toBe(prompts[6]);
			
			controller.prevQuestion();
			expect(scope.inputCtrl.currentPrompt).toBe(prompts[5]);
		});
		it('Should only let you go back if you\'re not on the first question.', function() {
			var prompts = controller.promptModel.prompts;
			expect(scope.inputCtrl.canGoBack()).toBeFalsy();
			
			controller.currentPrompt = prompts[5];
			expect(scope.inputCtrl.canGoBack()).toBeTruthy();
			
			controller.currentPrompt = prompts[3];
			expect(scope.inputCtrl.canGoBack()).toBeTruthy();
			
			controller.currentPrompt = prompts[0];
			expect(scope.inputCtrl.canGoBack()).toBeFalsy();
		});
		it('Should figure out you\'re done when you are on the last prompt.', function() {
			var prompts = controller.promptModel.prompts;
			expect(scope.inputCtrl.isDone()).toBe(false);
			
			controller.currentPrompt = prompts[5];
			expect(scope.inputCtrl.isDone()).toBe(false);
			
			controller.currentPrompt = prompts[9];
			expect(scope.inputCtrl.isDone()).toBe(true);
		});
		it('Should only let you go forward if you have given a response and are not on the last question.', function() {
			var responses = controller.promptModel.responses;
			var prompts = controller.promptModel.prompts;
			
			expect(scope.inputCtrl.canGoForward()).toBeFalsy();
			
			responses[0] = 'Hello';
			expect(scope.inputCtrl.canGoForward()).toBeTruthy();
			responses[0] = '';
			expect(scope.inputCtrl.canGoForward()).toBeFalsy();
			
			controller.currentPrompt = prompts[4];
			expect(scope.inputCtrl.canGoForward()).toBeFalsy();
			responses[0] = 'Hello';
			expect(scope.inputCtrl.canGoForward()).toBeFalsy();
			responses[4] = 'My Friend';
			expect(scope.inputCtrl.canGoForward()).toBeTruthy();
			
			controller.currentPrompt = prompts[9];
			expect(scope.inputCtrl.canGoForward()).toBeFalsy();
			responses[9] = 'The will not matter.';
			expect(scope.inputCtrl.canGoForward()).toBeFalsy();
		});
		it('Should broadcast an event, give the responses to the AppController and change the route when the experience starts.', function() {
			var handler = jasmine.createSpy(),
				responses = controller.promptModel.responses;
			scope.$on('experienceStart', handler);
			
			expect(handler).not.toHaveBeenCalled();
			
			scope.inputCtrl.startExperience();
			scope.$digest();
			
			expect(handler).toHaveBeenCalled();
			expect(scope.appCtrl.experience.responses).toBe(responses);
			expect($location._path).toBe('/entry/action/experience');
		});
	});
	
	describe('Controller: C6ExperienceCtrl', function() {
		var controller,
			scope;
		
		beforeEach(inject(function($controller) {
			scope = $rootScope.$new();
			controller = $controller('C6ExperienceCtrl', {
				$scope: scope
			});
		}));
		
		it('Should first try to set the experience from the appCtrl.', function() {
			appCtrl.experience = 'foo';
			
			expect(scope.appCtrl.experience).toBe('foo');
		});
		it('Should then try to set the experience from the routeParams.', function() {
			expect(typeof scope.appCtrl.experience).toBe('object');
		});
		it('Should start the experience.', function() {
			expect(scope.appCtrl.inExperience).toBe(true);
		});
	});
	
	describe('Controller: C6EndCtrl', function() {
		var controller,
			scope;
		
		beforeEach(inject(function($controller) {
			scope = $rootScope.$new();
			controller = $controller('C6EndCtrl', {
				$scope: scope
			});
		}));
		
		it('Should set the currentRoute to end.', function() {
			expect($rootScope.currentRoute).toBe('end');
		});
	});
	
	describe('Controller: C6AnnotationsCtrl', function() {
		var controller,
			scope,
			video;
		
		beforeEach(inject(function($controller) {
			scope = $rootScope.$new();
			video = {
				player: {
					pause: jasmine.createSpy()
				}
			};
			controller = $controller('C6AnnotationsCtrl', {
				$scope: scope
			});
			scope.$broadcast('c6video-ready', video);
			scope.$digest();
		}));
		
		it('Should attach the video player to the scope.', function() {
			expect(scope.video).toBe(video);
		});
		it('Should create an AnnotationsModel when the App experience is set.', function() {
			expect(scope.annoCtrl.model).toBe(null);
			scope.appCtrl.experience = vsvc.getExperienceByCategory('action');
			
			expect(typeof scope.annoCtrl.model).toBe('object');
		});
		it('Should pause the video when you leave the experience.', function() {
			scope.appCtrl.inExperience = false;
			expect(video.player.pause).toHaveBeenCalled();
		});
		it('Should set the currentRoute to experience and set up the model with annotations if there are responses when the experience starts.', function() {
			scope.appCtrl.experience = vsvc.getExperienceByCategory('action');
			scope.appCtrl.inExperience = true;
			scope.$digest();
			
			expect($rootScope.currentRoute).toBe('experience');
			scope.annoCtrl.model.annotations.forEach(function(annotation) {
				expect(annotation.text).toBe(null);
			});
			
			scope.appCtrl.inExperience = false;
			scope.$digest();
			scope.appCtrl.experience.responses = ['hello', 'cow', 'superman', 'knees', 'apples', 'oink', 'zeus', 'darth vader', 'uhh', 'butterfinger'];
			scope.appCtrl.inExperience = true;
			scope.$digest();
			
			var annotations = scope.annoCtrl.model.annotations;
			expect(annotations[0].text).toBe('hello');
			expect(annotations[1].text).toBe('My dramatic entrance');
			expect(annotations[2].text).toBe('Must look tough');
			expect(annotations[3].text).toBe('Crazy cow stare');
			expect(annotations[4].text).toBe('cow superman');
			expect(annotations[5].text).toBe('Get Out');
			expect(annotations[6].text).toBe('Or I will crush your knees into apples');
			expect(annotations[7].text).toBe('knees!!!');
			expect(annotations[8].text).toBe('apples!!!');
			expect(annotations[9].text).toBe('oink!!!');
			expect(annotations[10].text).toBe('oink???');
			expect(annotations[11].text).toBe('No, handcuffs of zeus!');
			expect(annotations[12].text).toBe('Bruce Lee > zeus!');
			expect(annotations[13].text).toBe('I\'m darth vader!');
			expect(annotations[14].text).toBe('No, you\'re a dumb Ewok');
			expect(annotations[15].text).toBe('Shut up stupid!');
			expect(annotations[16].text).toBe('Good comeback uhh');
			expect(annotations[17].text).toBe('butterfinger');
			expect(annotations[18].text).toBe('That made no sense');
			expect(annotations[19].text).toBe('oink?');
			expect(annotations[20].text).toBe('cow superman!');
		});
		it('Should figure out what annotations should be on-screen.', function() {
			// Setup some actual annotations.
			var active = controller.activeAnnotations,
				video = {
					player: {
						currentTime: 0
					}
				},
				event = null;
			scope.appCtrl.experience = vsvc.getExperienceByCategory('action');
			scope.appCtrl.experience.responses = ['hello', 'cow', 'superman', 'knees', 'apples', 'oink', 'zeus', 'darth vader', 'uhh', 'butterfinger'];
			scope.appCtrl.inExperience = true;
			scope.$digest();
			
			var annotations = scope.annoCtrl.model.annotations;
			expect(active.length).toBe(0);
			
			controller.setActiveAnnotations(event, video);
			expect(active.length).toBe(0);
			
			video.player.currentTime = 7;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[0]);
			
			video.player.currentTime = 8;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[0]);
			
			video.player.currentTime = 16;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[1]);
			
			video.player.currentTime = 18;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[1]);
			expect(active).toContain(annotations[2]);
			
			video.player.currentTime = 20;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[1]);
			expect(active).toContain(annotations[2]);
			expect(active).toContain(annotations[3]);
			
			video.player.currentTime = 22;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[2]);
			expect(active).toContain(annotations[3]);
			expect(active).toContain(annotations[4]);
			
			video.player.currentTime = 35;
			controller.setActiveAnnotations(event, video);
			expect(active.length).toBe(0);
			
			video.player.currentTime = 41;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[6]);
			
			video.player.currentTime = 45;
			controller.setActiveAnnotations(event, video);
			expect(active.length).toBe(0);
			
			video.player.currentTime = 53;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[7]);
			
			video.player.currentTime = 60;
			controller.setActiveAnnotations(event, video);
			expect(active.length).toBe(0);
			
			video.player.currentTime = 63.487;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[8]);
			
			video.player.currentTime = 119.5;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[14]);
			expect(active).not.toContain(annotations[15]);
			
			video.player.currentTime = 120.01;
			controller.setActiveAnnotations(event, video);
			expect(active).not.toContain(annotations[14]);
			expect(active).toContain(annotations[15]);
		});
		it('Should tell if an annotation is active, passing in that annotation', function() {
			var active = controller.activeAnnotations,
				video = {
					player: {
						currentTime: 0
					}
				},
				event = null,
				isActive = scope.annoCtrl.annotationIsActive;
			scope.appCtrl.experience = vsvc.getExperienceByCategory('action');
			scope.appCtrl.experience.responses = ['hello', 'cow', 'superman', 'knees', 'apples', 'oink', 'zeus', 'darth vader', 'uhh', 'butterfinger'];
			scope.appCtrl.inExperience = true;
			scope.$digest();
			
			var annotations = scope.annoCtrl.model.annotations;
			expect(isActive(annotations[0])).toBe(false);
			expect(isActive(annotations[3])).toBe(false);
			expect(isActive(annotations[7])).toBe(false);
			expect(isActive(annotations[11])).toBe(false);
			expect(isActive(annotations[17])).toBe(false);
			
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[0])).toBe(false);
			expect(isActive(annotations[3])).toBe(false);
			expect(isActive(annotations[7])).toBe(false);
			expect(isActive(annotations[11])).toBe(false);
			expect(isActive(annotations[17])).toBe(false);
			
			video.player.currentTime = 7;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[0])).toBe(true);
			expect(isActive(annotations[3])).toBe(false);
			
			video.player.currentTime = 8;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[0])).toBe(true);
			
			video.player.currentTime = 16;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[1])).toBe(true);
			
			video.player.currentTime = 18;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[1])).toBe(true);
			expect(isActive(annotations[2])).toBe(true);
			expect(isActive(annotations[3])).toBe(false);
			
			video.player.currentTime = 20;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[1])).toBe(true);
			expect(isActive(annotations[2])).toBe(true);
			expect(isActive(annotations[3])).toBe(true);
			expect(isActive(annotations[0])).toBe(false);
			
			video.player.currentTime = 22;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[2])).toBe(true);
			expect(isActive(annotations[3])).toBe(true);
			expect(isActive(annotations[4])).toBe(true);
			expect(isActive(annotations[1])).toBe(false);
			
			video.player.currentTime = 35;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[2])).toBe(false);
			expect(isActive(annotations[3])).toBe(false);
			expect(isActive(annotations[4])).toBe(false);
			expect(isActive(annotations[1])).toBe(false);
			
			video.player.currentTime = 41;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[6])).toBe(true);
			
			video.player.currentTime = 45;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[6])).toBe(false);
			
			video.player.currentTime = 53;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[7])).toBe(true);
			
			video.player.currentTime = 60;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[7])).toBe(false);
			
			video.player.currentTime = 63.487;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[8])).toBe(true);
			
			video.player.currentTime = 119.5;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[14])).toBe(true);
			expect(isActive(annotations[15])).toBe(false);
			
			video.player.currentTime = 120.01;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[14])).toBe(false);
			expect(isActive(annotations[15])).toBe(true);
		});
	});
});
})();
