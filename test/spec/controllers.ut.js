(function(){
'use strict';

var __C6_APP_BASE_URL__ = 'assets';

describe('Controller: c6CategoryListCtrl', function () {
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
        controller  = $controller('c6CategoryListCtrl', {
            /*
            $log : {
                log     : console.log,
                info    : console.log,
                warn    : console.error,
                error   : console.error
            },*/
            $scope: scope
        });
    }));

    it('Adds a categories array to the scope.',function(){
        expect(scope.categories).toBeDefined();
        expect(scope.categories instanceof Array).toBeTruthy();
        expect(scope.categories[0]).toBe('Action');
        expect(scope.categories[1]).toBe('Politics');
        expect(scope.categories[2]).toBe('Romance');
        expect(scope.categories[3]).toBe('Sports');
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
            /*
            $log : {
                log     : console.log,
                info    : console.log,
                warn    : console.error,
                error   : console.error
            },
            */
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
            /*
            $log : {
                log     : console.log,
                info    : console.log,
                warn    : console.error,
                error   : console.error
            },
            */
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
            /*
            $log : {
                log     : console.log,
                info    : console.log,
                warn    : console.error,
                error   : console.error
            },
            */
            $scope: scope
        });
    }));

    it('can interploate a template string from array',function(){
        var responses=['Carrot','Chocolate','Red','Penguin','France','Call Me Maby','Dr. Ruth'];
        var exp = controller.interpolate('Eat a ${1}. What a ${4} really a ${5}. Screw his ${1}!',responses); 
        expect(exp).toEqual('Eat a Carrot. What a Penguin really a France. Screw his Carrot!');
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
});
})();
