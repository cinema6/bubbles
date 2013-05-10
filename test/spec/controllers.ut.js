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
            module('c6.ctl');
        }
    );

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope       = $rootScope.$new();
        controller  = $controller('c6CategoryListCtrl', {
            $log : {
                log     : console.log,
                info    : console.log,
                warn    : console.error,
                error   : console.error
            },
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

describe('Controller: c6FillInEntryCtrl', function () {
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
            module('c6.ctl');
        }
    );

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope       = $rootScope.$new();
        controller  = $controller('c6FillInEntryCtrl', {
            $log : {
                log     : console.log,
                info    : console.log,
                warn    : console.error,
                error   : console.error
            },
            $scope: scope,
            $routeParams : { category : 'politics' }
        });
    }));

    it('instantiates',function(){
        expect(scope.ctrl).toBeDefined();
        expect(scope.model).toBeDefined();
        expect(scope.model.currentCategory).toBe('politics');
        expect(scope.model.id).toBe('1');
        expect(scope.model.title).toBe('Something Special');
        expect(scope.model.defSizeLimit).toBe(32);
        expect(scope.model.prompts instanceof Array).toBeTruthy();
        expect(scope.model.annotations instanceof Array).toBeTruthy();
        expect(scope.model.prompts[0].query).toEqual('Name a vegetable.');
        expect(scope.model.prompts[0].sizeLimit).toEqual(32);
        expect(scope.model.responses[0]).toBeNull();
        expect(scope.model.prompts[2].query).toEqual('Name a color.');
        expect(scope.model.prompts[2].sizeLimit).toEqual(32);
        expect(scope.model.responses[2]).toBeNull();
        expect(scope.model.prompts[4].query).toEqual('A country in Europe.');
        expect(scope.model.prompts[4].sizeLimit).toEqual(25);
        expect(scope.model.responses[2]).toBeNull();
    });

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
        scope.model.responses=['Carrot','Chocolate','Red','Penguin','France','Call Me Maby','Dr. Ruth'];
        controller.interpolateTemplates();
        expect(scope.model.annotations[0].text).toEqual('This one is a real Carrot!');
        expect(scope.model.annotations[1].text).toEqual('He really likes Chocolate and Red.');
        expect(scope.model.annotations[2].text).toEqual('What a Penguin really a France. Screw his Carrot!');
        expect(scope.model.annotations[3].text).toEqual('I need a Call Me Maby and Dr. Ruth.');
    });
});

})();
