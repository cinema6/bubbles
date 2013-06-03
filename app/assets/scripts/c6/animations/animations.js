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
				} else {
					done();
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
				} else if ($rootScope.currentRoute === 'experience') {
					// ANIMATE OUT OF VIDEO HERE (Don't forget to move done() to the right place!)
					done(); // <- THIS ONE!
				} else {
					done();
				}
			}
		}
	}])
	.animation('experience-partial-leave', ['$rootScope', function($rootScope) {
		return {
			start: function($oldView, done) {
				if ($rootScope.currentRoute === 'end') {
					// ANIMATE END IN HERE! (Don't forget to move done() to the right place!)
					done(); // <- THIS ONE!
				} else {
					done();
				}
			}
		}
	}])
	
	.animation('video-show', function() {
		return {
			start: function($playerDiv, done) {
				// ANIMATE VIDEO PLAYER IN HERE! (Don't forget to move done() to the right place!)
				done(); // <- THIS ONE!
			}
		}
	})
	
	.animation('video-hide', function() {
		return {
			start: function($playerDiv, done) {
				// ANIMATE VIDEO PLAYER OUT HERE! (Don't forget to move done() to the right place!)
				done(); // <- THIS ONE!
			}
		}
	})

})();
