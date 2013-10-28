(function(){
'use strict';
describe('Controllers', function() {
	var __C6_APP_BASE_URL__ = 'assets';

	var $rootScope,
		appCtrl,
		$location,
		vsvc;
	
	beforeEach(function() {
		module('ui.state');
		module('c6.ui');
		module('c6.svc');
		module(function($provide){
			$provide.constant('appBaseUrl', __C6_APP_BASE_URL__);
			$provide.constant('environment', {
				browser: {
					isMobile: false
				}
			});
			var $locationMock = {
				_path: null,
				path: function(path) {
					if (path) { this._path = path; }
						return this._path;
				}
			}
			$provide.value('$location', $locationMock);
			$provide.value('$stateParams', {
				category: 'action',
				expid: 'brucelee'
			});
			$provide.value('$state', {
				transitionTo: function(state, params) {
					switch(state) {
						case 'experience.categories':
							$locationMock.path('/categories/');
							break;
						case 'experience.input':
							$locationMock.path('/categories/action');
							break;
						case 'experience.video':
							$locationMock.path('/categories/action/video');
							break;
						case 'experience.end':
							$locationMock.path('/categories/action/end');
							break;
					}
				},
				is: function(state) {
					switch(state) {
						case 'experience.categories':
							return $locationMock.path() === '/categories/';
							break;
						case 'experience.input':
							return $locationMock.path() === '/categories/action';
							break;
						case 'experience.video':
							return $locationMock.path() === '/categories/action/video';
							break;
						case 'experience.end':
							return $locationMock.path() === '/categories/action/end';
							break;
					}
				}
			});
			$provide.value('c6VideoService', {
				bestFormat: function() {
					return 'video/mp4';
				},
				extensionForFormat: function() {
					return 'mp4';
				}
			});
			$provide.factory('c6VideoListingService', function($q) {
				return {
					getCategories: function() {
				        return {
				        	'categories' : [
				        		'Action',
								'Romance',
								'SciFi-Fantasy',
							]
						};
					},
					getExperience: function(category, id) {
						if (category === 'action' && id === 'brucelee') {
							var experience = $q.defer();
							
							experience.resolve({
								'id'			 : 'action',
								'title'		 : 'Battle for Revenge (MOCK)',
								'views'		 : 1000,
								'src'		 : 'media/action/bruce_lee',
								'css'		 : 'styles/bubbles_action.css',
								'anim'		 : 'action',
								'defSizeLimit': 18,
								'prompts'	 : [
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
										'type'	   : 'bubble',
										'duration'  : 4,
										'cls'	 : ['lee-${index}']
									},
									'notes'	 : [
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
							});
							
							return experience.promise;
						}
					},
					getExperienceByCategory: function(category) {
						return this.getExperience('action', 'brucelee');
					}
				}
			});
		});
		module('c6.ctrl');
	});
	
	beforeEach(inject(function ($controller, _$rootScope_, _$location_, c6VideoListingService) {
		$rootScope = _$rootScope_;
		$location = _$location_;
		vsvc = c6VideoListingService;
		appCtrl = $controller('C6AppCtrl', {
			$scope: _$rootScope_,
            c6Sfx: {
                loadSounds: angular.noop
            }
		});
	}));
	
	describe('Controller: C6AppCtrl', function() {
		it('Should start with no experience.', function() {
			expect($rootScope.appCtrl.experience).toBe(null);
			expect($rootScope.appCtrl.expData).toBe(null);
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
			expect(scope.appCtrl.expData).toBe(null);
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
			
			appCtrl.expData = vsvc.getExperienceByCategory('action');
			$rootScope.$digest();
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
		it('Should set the promptModel property.', function() {
			expect(typeof scope.inputCtrl.promptModel).toBe('object');
		});
		it('Should change the currentResponse when you go from question to question.', function() {			
			appCtrl.promptModel.responses = [
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
			expect($location._path).toBe('/categories/action/video');
		});
	});
	
	describe('Controller: C6VideoCtrl', function() {
		var controller,
			scope;
		
		beforeEach(inject(function($controller) {
			scope = $rootScope.$new();
			controller = $controller('C6VideoCtrl', {
				$scope: scope
			});
		}));
		
		it('Should set the currentRoute to experience.', function() {
			expect($rootScope.currentRoute).toBe('experience');
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
	
	describe('Controller: C6ExperienceCtrl', function() {
		var controller,
			scope,
			video,
			$state;
		
		beforeEach(inject(function($controller, _$state_) {
			scope = $rootScope.$new();
			$state = _$state_;
			video = {
				player: {
					pause: jasmine.createSpy()
				},
				on: function() {}
			};
			controller = $controller('C6ExperienceCtrl', {
				$scope: scope,
                c6Sfx: {
                    loadSounds: angular.noop,
                    playSound: angular.noop
                }
			});
			scope.$broadcast('c6video-ready', video);
			scope.$digest();
		}));
		
		it('Should set up the model with annotations if there are responses when the experience starts.', function() {
			appCtrl.expData = vsvc.getExperienceByCategory('action');
			$rootScope.$digest();
			appCtrl.promptModel.responses = ['hello', 'cow', 'superman', 'knees', 'mushrooms', 'oven', 'elmo', 'darth vader', 'oprah', 'butterfinger'];
			$state.transitionTo('experience.video');
			$rootScope.$digest();
			
			var annotations = scope.annoCtrl.annotationsModel.annotations;
			expect(annotations[0].text).toBe('hello');
			expect(annotations[1].text).toBe('My dramatic entrance');
			expect(annotations[2].text).toBe('Must look tough');
			expect(annotations[3].text).toBe('Crazy cow stare');
			expect(annotations[4].text).toBe('cow superman');
			expect(annotations[5].text).toBe('Or I\'ll pound your knees into mushrooms');
			expect(annotations[6].text).toBe('Say something clever to make them leave...');
			expect(annotations[7].text).toBe('mushrooms!!!');
			expect(annotations[8].text).toBe('Did I leave the oven on???');
			expect(annotations[9].text).toBe('Handcuffs of Drunken elmo!!');
			expect(annotations[10].text).toBe('Bruce Lee drunker than elmo!');
			expect(annotations[11].text).toBe('I\'m darth vader!');
			expect(annotations[12].text).toBe('No, you\'re a dumb Ewok');
			expect(annotations[13].text).toBe('Shut up stupid!');
			expect(annotations[14].text).toBe('Good comeback oprah');
			expect(annotations[15].text).toBe('butterfinger');
			expect(annotations[16].text).toBe('That made no sense');
			expect(annotations[17].text).toBe('oven?');
			expect(annotations[18].text).toBe('cow superman!');
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
			appCtrl.expData = vsvc.getExperienceByCategory('action');
			$rootScope.$digest();
			appCtrl.promptModel.responses = ['hello', 'cow', 'superman', 'knees', 'mushrooms', 'oven', 'elmo', 'darth vader', 'oprah', 'butterfinger'];
			$state.transitionTo('experience.video');
			$rootScope.$digest();
			
			var annotations = scope.annoCtrl.annotationsModel.annotations;
			expect(active.length).toBe(0);
			
			controller.setActiveAnnotations(event, video);
			expect(active.length).toBe(0);
			
			video.player.currentTime = 7.25;
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
			expect(active).toContain(annotations[2]);
			expect(active).toContain(annotations[3]);
			
			video.player.currentTime = 22;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[3]);
			expect(active).toContain(annotations[4]);
			
			video.player.currentTime = 35;
			controller.setActiveAnnotations(event, video);
			expect(active.length).toBe(0);
			
			video.player.currentTime = 41;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[5]);
			
			video.player.currentTime = 45;
			controller.setActiveAnnotations(event, video);
			expect(active.length).toBe(0);
			
			video.player.currentTime = 52;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[6]);
			
			video.player.currentTime = 59.9999;
			controller.setActiveAnnotations(event, video);
			expect(active.length).toBe(0);
			
			video.player.currentTime = 61.487;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[7]);
			
			video.player.currentTime = 119.5;
			controller.setActiveAnnotations(event, video);
			expect(active).toContain(annotations[12]);
			expect(active).not.toContain(annotations[13]);
			
			video.player.currentTime = 120.01;
			controller.setActiveAnnotations(event, video);
			expect(active).not.toContain(annotations[12]);
			expect(active).toContain(annotations[13]);
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
			appCtrl.expData = vsvc.getExperienceByCategory('action');
			$rootScope.$digest();
			appCtrl.promptModel.responses = ['hello', 'cow', 'superman', 'knees', 'mushrooms', 'oven', 'elmo', 'darth vader', 'oprah', 'butterfinger'];
			$state.transitionTo('experience.video');
			$rootScope.$digest();
			
			var annotations = scope.annoCtrl.annotationsModel.annotations;
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
			
			video.player.currentTime = 7.25;
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
			expect(isActive(annotations[1])).toBe(false);
			expect(isActive(annotations[2])).toBe(true);
			expect(isActive(annotations[3])).toBe(true);
			expect(isActive(annotations[0])).toBe(false);
			
			video.player.currentTime = 22;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[2])).toBe(false);
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
			expect(isActive(annotations[5])).toBe(true);
			
			video.player.currentTime = 45;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[5])).toBe(false);
			
			video.player.currentTime = 52.5;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[6])).toBe(true);
			
			video.player.currentTime = 60;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[6])).toBe(false);
						
			video.player.currentTime = 119.5;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[12])).toBe(true);
			expect(isActive(annotations[13])).toBe(false);
			
			video.player.currentTime = 120.01;
			controller.setActiveAnnotations(event, video);
			expect(isActive(annotations[12])).toBe(false);
			expect(isActive(annotations[13])).toBe(true);
		});
	});
});
})();
