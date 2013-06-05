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
			$(".shareMenu").height(54 * scaleFactor).width(1026 * scaleFactor).css("margin-left", ((1026 * scaleFactor) / -2)); 

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
}])

.directive('c6Share', ['$window', '$document', '$location', function($window, $document, $location) {
	return function(scope, element, attrs) {		
		element.click(function() {
			var config = {
				url: encodeURIComponent(attrs.shareUrl? attrs.shareUrl : $location.absUrl()),
				title: encodeURIComponent(attrs.shareTitle? attrs.shareTitle : $document.attr('title')),
				description: attrs.shareDescription? encodeURIComponent(attrs.shareDescription) : null,
				image: attrs.shareImage? encodeURIComponent(attrs.shareImage) : null
			};
			
			if (attrs.c6Share === 'facebook') {
				var url = 'http://www.facebook.com/sharer.php?s=100&p[title]='+ config.title
					+ '&p[summary]=' + config.description
					+ '&p[url]=' + config.url
					+ '&p[images][0]=' + config.image
					+ '&';
				
				$window.open(url, 'sharer', 'toolbar=0, status=0, width=548, height=325');
			} else if (attrs.c6Share === 'twitter') {
				var data = config.description? ('text=' + config.description + encodeURIComponent(': ') + config.url) : ('url=' + config.url);
				var url = 'https://twitter.com/share?' + data;
				
				$window.open(url, 'sharer', 'toolbar=0, status=0, width=550, height=450');
			}
		});
	}
}]);
})();
