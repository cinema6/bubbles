(function(){
'use strict';

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
		expect(typeof scope.categories === 'object').toBe(true);
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
});

/*describe('Controller: C6CategoryListCtrl', function () {
    var controller,
        scope;

    // load the controller's module

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope       = $rootScope.$new();
        controller  = $controller('C6CategoryListCtrl', {
            $scope: scope
        });
    }));

    it('Adds a categories array to the scope.',function(){
        expect(scope.categories).toBeDefined();
        expect(scope.categories instanceof Array).toBeTruthy();
        expect(scope.categories[0]).toBe('Action');
        expect(scope.categories[1]).toBe('Politics');
        expect(scope.categories[2]).toBe('Romance');
        expect(scope.categories[3]).toBe('SciFi-Fantasy');
        expect(scope.categories[4]).toBe('Sports');
    });

});

describe('Controller: c6ExperienceCtrl', function () {
    var controller,
        scope;

    // load the controller's module
    beforeEach(
        function(){
            module(function($provide){
                $provide.constant('appBaseUrl', __C6_APP_BASE_URL__);
            });
            module('c6.svc');
            module('c6.ctrl');
        }
    );

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope       = $rootScope.$new();
        controller  = $controller('c6ExperienceCtrl', {
            $scope: scope,
            $routeParams : { category : 'politics' }
        });
    }));

    it('Instantiates and adds important stuff to the scope.',function(){
        expect(scope.expCtrl).toBeDefined();
        expect(scope.expCtrl.model).toBeDefined();
        expect(scope.expCtrl.model.category).toBe('politics');
        expect(scope.expCtrl.model.id).toEqual('1');
        expect(scope.expCtrl.model.title).toEqual('Something Special');
        expect(scope._experience).toBeDefined();
    });

});

describe('Controller: c6PromptCtrl', function () {
    var controller,
        scope;

    // Mock the video service
    //angular.module('c6.svc',[]);

    // load the controller's module
    beforeEach(
        function(){
            module(function($provide){
                $provide.constant('appBaseUrl', __C6_APP_BASE_URL__);
            });
            module('c6.svc');
            module('c6.ctrl');
        }
    );

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope       = $rootScope.$new();
        // load the experience controller to short cut
        // getting the _experience into the scope
        $controller('c6ExperienceCtrl', {
            $scope: scope,
            $routeParams : { category : 'politics' }
        });
        controller  = $controller('c6PromptCtrl', {
            $scope: scope
        });
    }));
    it('instantiates',function(){
        expect(scope._experience).toBeDefined();
        expect(scope.promptCtrl).toBeDefined();
        expect(scope.promptCtrl.model).toBeDefined();
        expect(scope.promptCtrl.model.defSizeLimit).toBe(32);
        expect(scope.promptCtrl.model.prompts instanceof Array).toBeTruthy();
        expect(scope.promptCtrl.model.prompts[0].query).toEqual('strong smell');
        expect(scope.promptCtrl.model.prompts[0].sizeLimit).toEqual(32);
        expect(scope.promptCtrl.model.responses[0]).toBeNull();
        expect(scope.promptCtrl.model.prompts[2].query).toEqual('exuberant expression');
        expect(scope.promptCtrl.model.prompts[2].sizeLimit).toEqual(32);
        expect(scope.promptCtrl.model.responses[2]).toBeNull();
        expect(scope.promptCtrl.model.prompts[4].query).toEqual('animal');
        expect(scope.promptCtrl.model.prompts[4].sizeLimit).toEqual(25);
        expect(scope.promptCtrl.model.responses[4]).toBeNull();
    });
});
describe('Controller: c6AnnotationsCtrl', function () {
    var controller,
        scope;

    // Mock the video service
    //angular.module('c6.svc',[]);

    // load the controller's module
    beforeEach(
        function(){
            module(function($provide){
                $provide.constant('appBaseUrl', __C6_APP_BASE_URL__);
            });
            module('c6.svc');
            module('c6.ctrl');
        }
    );

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope       = $rootScope.$new();
        // load the experience controller to short cut
        // getting the _experience into the scope
        $controller('c6ExperienceCtrl', {
            $scope: scope,
            $routeParams : { category : 'politics' }
        });
        controller  = $controller('c6AnnotationsCtrl', {
            $scope: scope
        });
    }));

    it('can properly instantiate the annotations', function(){
        expect(controller.model.annotations.length).toBe(9);
        expect(controller.model.annotations[0].type).toBe('bubble');
        expect(controller.model.annotations[0].cls[0]).toBe('notebook-0');
        expect(controller.model.annotations[1].type).toBe('bubble');
        expect(controller.model.annotations[1].cls[0]).toBe('notebook-1');

    });
    it('can interploate a template string from array',function(){
        var responses=['Carrot','Chocolate','Red','Penguin','France','Call Me Maby','Dr. Ruth'];
        var exp = controller.interpolate('Eat a ${1}. What a ${4} really a ${5}. Screw his ${1}!',responses); 
        expect(exp).toEqual('Eat a Carrot. What a Penguin really a France. Screw his Carrot!');
    });

    it('can interploate a template string from array with two params',function(){
        var responses=['Carrot','Chocolate','Red','Penguin','France','Call Me Maby','Dr. Ruth'];
        var exp = controller.interpolate('What a ${4} really a ${5}.',responses); 
        expect(exp).toEqual('What a Penguin really a France.');
    });

    it('does nothing if interpolate is called with out a data array',function(){
        var exp = controller.interpolate('What a ${4} really a ${5}. Screw his ${1}!'); 
        expect(exp).toEqual('What a ${4} really a ${5}. Screw his ${1}!');
        
    });
    
    it('throws an exception if interpolate receives something not an array as data',function(){
        expect(function(){
            controller.interpolate('What a ${4} really a ${5}. Screw his ${1}!',1); 
        }).toThrow('Data parameter must be an array.');
    });

    it('throws an exception if interpolate has too little data',function(){
        expect(function(){
            controller.interpolate('What a ${4} really a ${5}. Screw his ${1}!',['apple']); 
        }).toThrow('Invalid template parameter (too high): ${4}');
    });

    it('throws an exception if interpolate has a bad template var number',function(){
        expect(function(){
            var responses=['Carrot','Chocolate','Red','Penguin','France','Call Me Maby','Dr. Ruth'];
            controller.interpolate('What a ${0} really a ${5}. Screw his ${1}!',responses); 
        }).toThrow('Template parameters should start at ${1}');
    });

    it('interpolates all of the models annotations with responses',function(){
        var responses=[ 'rotten eggs','farted','shock','penguin',
                        'snake','bagel','Dr. Ruth', 'drop kick', 'peas'];
        controller.interpolateTemplates(responses);
        expect(scope.annoCtrl.model.annotations[0].text).toEqual(
                'Weird, smells like rotten eggs!');
        expect(scope.annoCtrl.model.annotations[1].text).toEqual(
                'Damn she knows I just farted.');
        expect(scope.annoCtrl.model.annotations[2].text).toEqual(
                'Rain Diversion shock!');
        expect(scope.annoCtrl.model.annotations[3].text).toEqual(
                'Casual laugh, think about a mutant penguin snake.');
        expect(scope.annoCtrl.model.annotations[4].text).toEqual(
                'penguin snake!!');
        expect(scope.annoCtrl.model.annotations[5].text).toEqual(
                'Must counter or he\'ll think I\'m boring like bagel.');
        expect(scope.annoCtrl.model.annotations[6].text).toEqual(
                'Commence over-acting.  Channel Dr. Ruth.');
        expect(scope.annoCtrl.model.annotations[7].text).toEqual(
                'umm WTF was that? She must drop kick peas.');
        expect(scope.annoCtrl.model.annotations[8].text).toEqual(
                'I love peas.');
    });
});*/
})();
