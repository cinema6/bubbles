(function() {
	'use strict';
	describe('Directives', function() {
		var $compile,
			$rootScope;
		
		beforeEach(function() {
			module('c6.dir.screenJack');
			inject(function(_$compile_, _$rootScope_) {
				$compile = _$compile_;
				$rootScope = _$rootScope_;
			})
		});
		
		describe('Directive: c6On', function() {
			var $scope;
			
			beforeEach(function() {
				$scope = $rootScope.$new();
			});
			
			it('Should attach a reference to the element to the scope.', function() {
				var element = $compile('<button c6-on>Test</button>')($scope),
				scope = element.scope();
				
				expect(scope.$this).toBeDefined();
			});
			it('Should evalute expressions when an event is fired.', function() {
				var element = $compile('<button c6-on="myEvent: {testMe();}">Test</button>')($scope),
					spy = jasmine.createSpy(),
					scope = element.scope();
				scope.testMe = spy;
				
				expect(spy).not.toHaveBeenCalled();
				
				$scope.$broadcast('myEvent');
				expect(spy).toHaveBeenCalled();
			});
			it('Should evalute expressions when different events are fired.', function() {
				var element = $compile('<button c6-on="myEvent: {testMe();}, myOtherEvent: {testMeToo();}">Test</button>')($scope),
					spy = jasmine.createSpy(),
					otherSpy = jasmine.createSpy(),
					scope = element.scope();
				scope.testMe = spy;
				scope.testMeToo = otherSpy;
				
				expect(spy).not.toHaveBeenCalled();
				expect(otherSpy).not.toHaveBeenCalled();
				
				$scope.$broadcast('myEvent');
				expect(spy).toHaveBeenCalled();
				expect(otherSpy).not.toHaveBeenCalled();
				
				$scope.$broadcast('myOtherEvent');
				expect(spy).toHaveBeenCalled();
				expect(otherSpy).toHaveBeenCalled();
			});
		});
	});
})();