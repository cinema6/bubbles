(function() {
	angular.module('c6.anim', [])
	
   //Categories Animations (into Input)
	.animation('categories-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($oldView, done) {
				if($rootScope.currentRoute === 'input') {
					$log.log('Animating from "categories" to "input"');
					var tl_startInput   = new TimelineLite({paused: true}),
						startScreen     = $(".startScreen"),
						inputScreen     = $(".inputScreen");
					
					// resets styles for replaying the experience
					function inputReset() {
				      inputScreen.css({
				        "-webkit-transform": "rotate(-90deg)", 
				        "-moz-transform": "rotate(-90deg)", 
				        "-ms-transform": "rotate(-90deg)", 
				        "-o-transform": "rotate(-90deg)", 
				        "transform": "rotate(-90deg)", 
				        "-webkit-transform-origin" : "100% 0%",
				        "-moz-transform-origin" : "100% 0%",
				        "-ms-transform-origin" : "100% 0%",
				        "-o-transform-origin" : "100% 0%",
				        "transform-origin" : "100% 0%",
				        "display": "block",
				        "opacity": "1"
				      });
				      $log.log("* Input Styles Reset *");
				    }

					// ANIMATION TIMELINE //
					tl_startInput.to(startScreen, 2, {
        				transformOrigin: "0% 0%", 
				        rotation: "90deg", 
				        ease: Power3.easeIn, 
				        alpha: 0})
				    .to(inputScreen, 2, {   
				        rotation: "0deg", 
				        ease: Power3.easeOut, 
				        alpha: 1}, "-=0.5")
					.eventCallback('onComplete', done);
					
					inputReset();
					tl_startInput.play();
					tl_startInput.seek(0);
				} else {
					done();
				}
			}
		}
	}])
	
   //Input Animations (into Categories else Experience)
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
					.eventCallback('onComplete', done);
					
					tl_inputStart.play();

				} else if ($rootScope.currentRoute === 'experience') {
					$log.log('Animating from "input" to "experience"');
					var	videoPlayer     = document.getElementById("player"),
						tl_inputExp     = new TimelineLite({paused: true}),
						inputScreen     = $(".inputScreen"),
						transition      = $(".transition_blackFade");						

					// ANIMATION TIMELINE
					tl_inputExp.to(inputScreen, 2, {opacity: 0})
             			.to(transition, 2, {opacity: 1}, "-=1")
             			.to(videoPlayer, 2, {display: "block", opacity: 1}, "-=1")
             			.to(inputScreen, 0.1, {display: "none"})
             			.eventCallback('onComplete', done);

             		tl_inputExp.play();
       				setTimeout('videoPlayer.play()', 2800);
        			tl_inputExp.seek(0);	

				} else {
					done();
				}
			}
		} 
	}])

	//Experience Animation (into End) --> do we need this???
	.animation('experience-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($oldView, done) {
				if ($rootScope.currentRoute === 'end') {
//					$log.log('Animating from "video" to "end"');
//					var	tl_vidEnd	= new TimelineLite({paused: true}),
//						videoPlayer	= document.getElementById("player"),
//						transition  = $(".transition_blackFade"),
//						endScreen	= $(".endScreen");

					// reset video styles for replaying the experience
//					function vidReset() {
//				      videoPlayer.style.display==="block";
//				      videoPlayer.style.opacity==="0";
//				      console.log("* Vid Styles Reset *");
//				    }

				    // reset end screen styles !!! STILL NEEDS CROSS BROWSER STYLES, NOT JUST CHROME
//				    function endReset() {
//				      endScreen.css({
//				        "-webkit-transform": "rotate(0)", 
//				        "-webkit-transform-origin" : "100% 0%",
//				        "display": "none",
//				        "opacity": "0"
//				      })
//				      console.log("* End Styles Reset *");      
//				    }

					// ANIMATION TIMELINE
//					tl_vidEnd.to(endScreen, 0.1, {display: "block", opacity: "0"})
//             			.to(videoPlayer, 1.5, {opacity: 0})
//             			.to(transition, 2, {opacity: 0}, "-=0.5")
//             			.to(videoPlayer, 0.1, {display: "none"})
//             			.to(endScreen, 2, {opacity: 1}, "-=2")             
//						.eventCallback('onComplete', done);

//						vidReset();
//          				endReset();
//						tl_vidEnd.play(); 
//          				tl_vidEnd.seek(0);
				} else {
					done();
				}
			}
		}
		}])
	
	//End Animation (into Video else Categories)
	.animation('end-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($oldView, done) {
			if ($rootScope.currentRoute === 'experience') {
				$log.log('Animating from "end" to "experience"');
				var endScreen	= $(".endScreen"),
					videoPlayer	= document.getElementById("player"),
					transition 	= $(".transition_blackFade"),
					tl_endVid	= new TimelineLite({paused: true});

				tl_endVid.to(endScreen, 2, {opacity: 0})
		            .to(videoPlayer, 0.1, {display: "block"})
		            .to(transition, 2, {opacity: 1}, "-=2")
		            .to(videoPlayer, 2, {opacity: 1}, "-=0.25")
		            .to(endScreen, 0.1, {display: "none"})
		            .eventCallback('onComplete', done);

		        tl_endVid.play();
		        setTimeout('videoPlayer.play()', 2800);   
		        tl_endVid.seek(0);

			} else if ($rootScope.currentRoute === 'categories') {
				$log.log('Animating from "end" to "categories"');
				var endScreen 	= $(".endScreen"),
					startScreen	= $(".startScreen"),
					tl_endStart	= new TimelineLite({paused: true});	

				//ANIMATION TIMELINE
				tl_endStart.to(endScreen, 2, { 
			        transformOrigin: "100% 0%", 
			        rotation: "-90deg", 
			        ease: Power3.easeIn, 
			        alpha: 0
			     })
			     .to(startScreen, 2, {
			        transformOrigin: "0% 0%",
			        rotation: "0deg",
			        ease: Power3.easeOut,
			        alpha: 1
			     }, "-=0.5")
			     .eventCallback('onComplete', done);

			     tl_endStart.play();
			     tl_endStart.seek(0);
			} else {
				done();
			}
		}}
	}])


})();
