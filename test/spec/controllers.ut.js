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
//        expect(scope.model.annotations instanceof Array).toBeTruthy();
        expect(scope.model.prompts[0].query).toEqual('Name a vegetable.');
        expect(scope.model.prompts[0].sizeLimit).toEqual(32);
        expect(scope.model.prompts[0].response).toBeNull();
        expect(scope.model.prompts[2].query).toEqual('Name a color.');
        expect(scope.model.prompts[2].sizeLimit).toEqual(32);
        expect(scope.model.prompts[2].response).toBeNull();
        expect(scope.model.prompts[4].query).toEqual('A country in Europe.');
        expect(scope.model.prompts[4].sizeLimit).toEqual(25);
        expect(scope.model.prompts[4].response).toBeNull();
    });

    it('can interploate a template string from array',function(){
        var responses=['Carrot','Chocolate','Red','Penguin','Fance','Call Me Maby','Dr. Ruth'];
        var exp = controller.interpolate('What a ${4} really a ${5}. Screw his ${1}!'); 
        expect(exp).toEqual('What a Penguin really a France.  Screw his Carrot!');
    });


});

})();
