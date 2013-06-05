(function() {
	angular.module('c6.anim', [])

//								  // 
//        PARTIALS ANIMATIONS     //
//								  //
	
    //Categories Animations (into Input)
	 .animation('categories-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			setup: function() {
				
			},
			start: function($oldView, done) {
				if($rootScope.currentRoute === 'input') {
					$log.log('Animating from "categories" to "input"');
					var tl_startInput   = new TimelineLite({paused: true}),
						startScreen     = $(".startScreen"),
						inputScreen     = $(".inputScreen");
					
					// resets styles
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
						videoPlayer		= document.getElementById("player"),
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
					var	tl_inputExp     = new TimelineLite({paused: true}),
						inputScreen     = $(".inputScreen"),
						transition      = $(".transition_blackFade");						

					// ANIMATION TIMELINE
					tl_inputExp.to(inputScreen, 2, {opacity: 0})
             			.to(transition, 2, {opacity: 1}, "-=1")
             			.to(inputScreen, 0.1, {display: "none"})
             			.eventCallback('onComplete', done);

             		tl_inputExp.play();
        			tl_inputExp.seek(0);	

				} else {
					done();
				}
			}
		} 
	 }])

	//Experience Animations (into End Screen)
	 .animation('experience-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($playerDiv, done) {
				if($rootScope.currentRoute === 'end') {
					$log.log('Animating from "experience" to "end"');
					var tl_expEnd   = new TimelineLite({paused: true}),
						endScreen   = $(".endScreen"),
						transition  = $(".transition_blackFade"),
						videoPlayer = document.getElementById("player");
					
					// reset styles
					function vidReset() {
				      videoPlayer.style.display==="block";
				      videoPlayer.style.opacity==="0";
				      console.log("* Vid Styles Reset *");
				    }

				    function endReset() {
				      endScreen.css({
				        "-webkit-transform": "rotate(0deg)", 
				        "-moz-transform": "rotate(0deg)", 
				        "-ms-transform": "rotate(0deg)", 
				        "-o-transform": "rotate(0deg)", 
				        "transform": "rotate(0deg)", 
				        "-webkit-transform-origin" : "100% 0%",
				        "-moz-transform-origin" : "100% 0%",
				        "-ms-transform-origin" : "100% 0%",
				        "-o-transform-origin" : "100% 0%",
				        "transform-origin" : "100% 0%",
				        "opacity": "0"
				      });
				      console.log("* End Styles Reset *");      
				    }

				    function fadeReset() {
				    	transition.css({
				        "opacity": "1"
				      });
				    	console.log("* Fade Styles Reset *");
				    }

					// ANIMATION TIMELINE //
					tl_expEnd.to(transition, 3, {opacity: 0})
						.to(endScreen, 2, {opacity: 1}, "-=2.5")   
					 	.eventCallback('onComplete', done);
					
					fadeReset();
					vidReset();
          			endReset();
					tl_expEnd.play();
					tl_expEnd.seek(0);

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
					transition 	= $(".transition_blackFade"),
					endScreen	= $(".endScreen"),
					tl_endVid	= new TimelineLite({paused: true});

				tl_endVid.to(endScreen, 2, {opacity: 0})
             		.to(transition, 2, {opacity: 1}, "-=1")
           			.eventCallback('onComplete', done);

		        tl_endVid.play(); 
		        tl_endVid.seek(0);

			} else if ($rootScope.currentRoute === 'categories') {
				$log.log('Animating from "end" to "categories"');
				var endScreen 	= $(".endScreen"),
					startScreen	= $(".startScreen"),
					tl_endStart	= new TimelineLite({paused: true});	

				function startReset() {
					startScreen.css({
				        "-webkit-transform": "rotate(90deg)", 
				        "-moz-transform": "rotate(90deg)", 
				        "-ms-transform": "rotate(90deg)", 
				        "-o-transform": "rotate(90deg)", 
				        "transform": "rotate(90deg)", 
				        "-webkit-transform-origin" : "0% 0%",
				        "-moz-transform-origin" : "0% 0%",
				        "-ms-transform-origin" : "0% 0%",
				        "-o-transform-origin" : "0% 0%",
				        "transform-origin" : "0% 0%",
				        "opacity": "0",
				        "display": "block"
				      });
				}

				//ANIMATION TIMELINE
				tl_endStart.to(endScreen, 2, { 
			        transformOrigin: "100% 0%", 
			        rotation: "-90deg", 
			        ease: Power3.easeIn, 
			        alpha: 0
			     })
			     .to(startScreen, 2, {
			        rotation: "0deg",
			        ease: Power3.easeOut,
			        alpha: 1
			     }, "-=0.5")
			     .eventCallback('onComplete', done);

			     startReset();
			     tl_endStart.play();
			     tl_endStart.seek(0);
			} else {
				done();
			}
		}}
	 }])

//								  // 
//        VIDEO ANIMATIONS        //
//								  //

	.animation('video-show', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($playerDiv, done) {
				$log.log('Fade in Video Experience');
				var videoPlayer	= document.getElementById("player"), 
				tl_vidIn 		= new TimelineLite({paused: true});

				//ANIMATION TIMELINE
				tl_vidIn.to(videoPlayer, 2, {display: "block", opacity: 1}, "+=2")
				.eventCallback('onComplete', done);

				tl_vidIn.play();
				setTimeout(function() {
       				videoPlayer.play()
       			}, 1800);
       			tl_vidIn.seek(0);
			}	
		}
	}])

	.animation('video-hide', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($playerDiv, done) {
				$log.log('Fade Out Video Experience');
				var videoPlayer = document.getElementById("player"),
				tl_vidOut		= new TimelineLite({paused: true});

				tl_vidOut.to(videoPlayer, 1.5, {opacity: 0}, "-=2")
				.to(videoPlayer, 0.1, {display: "none"})
				.eventCallback('onComplete', done);

				tl_vidOut.play();
				tl_vidOut.seek(0);
			}
		}
	}])


})();
