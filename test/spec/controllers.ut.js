(function(){
'use strict';

describe('Controller: C6CardSelectCtrl', function () {
    var __C6_APP_BASE_URL__ = 'assets';
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
            $scope: scope
        });
    }));

    it('instantiates',function(){
        //expect(scope.ctrl).toBeDefined();
        //expect(controller.model).toBeDefined();
    });


});

})();
