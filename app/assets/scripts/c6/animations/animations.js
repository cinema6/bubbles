(function() {
	angular.module('c6.anim', [])
	
	.animation('categories-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($oldView, done) {
				if($rootScope.currentRoute === 'experience') {
					$log.log('Animating from "categories" to "experience"');
					var tl_startInput   = new TimelineLite({paused: true}),
						startScreen     = $(".startScreen"),
						inputScreen     = $(".inputScreen");
		
					// ANIMATIONS //
					tl_startInput.to(startScreen, 2, {onComplete: console.log("Start leaves"), 
						transformOrigin: "0% 0%", 
						rotation: "90deg", 
						ease: Power3.easeIn, 
						alpha: 0})
					.from(inputScreen, 2, {onComplete: console.log("Input comes in"), 
						transformOrigin: "100% 0%", 
						rotation: "-90deg", 
						ease: Power3.easeOut, 
						alpha: 0,}, "-=0.5")
					.eventCallback('onComplete', done);
					
					tl_startInput.play();
				}
			}
		}
	}])
	
	.animation('experience-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($oldView, done) {
				if ($rootScope.currentRoute === 'categories') {
					$log.log('Animating from "experience" to "categories"');
					var tl_startInput   = new TimelineLite({paused: true}),
						startScreen     = $(".startScreen"),
						inputScreen     = $(".inputScreen");
		
					// ANIMATIONS //
					tl_startInput.to(startScreen, 2, {onComplete: console.log("Start leaves"), 
						transformOrigin: "0% 0%", 
						rotation: "90deg", 
						ease: Power3.easeIn, 
						alpha: 0})
					.from(inputScreen, 2, {onComplete: console.log("Input comes in"), 
						transformOrigin: "100% 0%", 
						rotation: "-90deg", 
						ease: Power3.easeOut, 
						alpha: 0,}, "-=0.5")
					.eventCallback('onComplete', done);
					
					tl_startInput.play();
				}
			}
		}
	}]);
})();
