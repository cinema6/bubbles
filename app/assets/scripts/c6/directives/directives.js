/* global $ */
(function(){

'use strict';
angular.module('c6.dir.screenJack',[])
.directive('c6Resize', ['$window', function($window) {
	return function($scope, $element, $attrs) {
		$($window).resize(function() {
			// set variable dimensions for viewport
			var baseW = 1280,
				baseH = 684,
				fontSize = 28,
			
				//find current dimensions of window
				winH = $window.innerHeight,
				winW = $window.innerWidth,
			
				//find scale factor
				scaleH = winH / baseH,
				scaleW = winW / baseW,
				scaleFactor = Math.min(scaleH, scaleW);
			
			//apply new dimensions to viewport
			$element.find(".viewport").height(baseH * scaleFactor)
				.width(baseW * scaleFactor)
				.css("font-size", (fontSize * scaleFactor))
				.css("margin-top", ((baseH * scaleFactor) / -2))
				.css("margin-left", ((baseW * scaleFactor) / -2));
			
			//feed screen divs window dimensions
			$element.height(winH).width(winW);
		});
		
		//Resize content immediately when page is loded
		$($window).resize();
	}
}])

.directive('c6On', [function() {
	return function($scope, $element, $attrs) {
		$scope.$on($attrs.c6On, function() {
			$element[$attrs.do]();
		});
	}
}]);
})();
