(function() {
	angular.module('c6.anim', [])
	
	.animation('categories-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($oldView, done) {
				if($rootScope.currentRoute === 'input') {
					$log.log('Animating from "categories" to "input"');
					var tl_startInput   = new TimelineLite({paused: true}),
						startScreen     = $(".startScreen"),
						inputScreen     = $(".inputScreen");
		
					// ANIMATION TIMELINE //
					tl_startInput.to(startScreen, 2, { 
						transformOrigin: "0% 0%", 
						rotation: "90deg", 
						ease: Power3.easeIn, 
						alpha: 0})
					.from(inputScreen, 2, {
						transformOrigin: "100% 0%", 
						rotation: "-90deg", 
						ease: Power3.easeOut, 
						alpha: 0}, "-=0.5")
					.eventCallback('onComplete', done);
					
					tl_startInput.play();
				}
			}
		}
	}])
	
	.animation('input-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($oldView, done) {
				if ($rootScope.currentRoute === 'categories') {
					$log.log('Animating from "input" to "categories"');
					var tl_inputStart   = new TimelineLite({paused: true}),
						startScreen     = $(".startScreen"),
						inputScreen     = $(".inputScreen");
		
					// ANIMATION TIMELINE //
					tl_inputStart.to(inputScreen, 2, {
						transformOrigin: "100% 0%", 
						rotation: "-90deg", 
						ease: Power3.easeIn, 
						alpha: 0
					})
					.from(startScreen, 2, {
						transformOrigin: "0% 0%",
						rotation: "90deg",
						ease: Power3.easeOut,
						alpha: 0
					}, "-=0.5")
					
					tl_inputStart.play();
				}
			}
		}
	}]);


})();
