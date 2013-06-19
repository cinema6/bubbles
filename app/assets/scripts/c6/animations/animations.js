(function() {
	/*global $:false, jQuery:false */
	'use strict';
	
	angular.module('c6.anim', [])

//								  // 
//        PARTIALS ANIMATIONS     //
//								  //
	
    //Categories Animations
     .animation('categories-partial-enter', [function () {
		return {
			setup: function() { 
				$(".inputScreen").css({
				    "-webkit-transform": "rotate(-30deg)", 
				    	"-moz-transform": "rotate(-30deg)", 
			        	"-ms-transform": "rotate(-30deg)", 
			        	"-o-transform": "rotate(-30deg)", 
			        "opacity": "0",
			        "left": "400px",
			        "top" : "-1800px"
			      }); 
				
				$(".endScreen").css({
				    "-webkit-transform": "rotate(30deg)", 
				    	"-moz-transform": "rotate(30deg)", 
			        	"-ms-transform": "rotate(30deg)", 
			        	"-o-transform": "rotate(30deg)", 
			        "opacity": "0",
			        "left": "-2400px",
			        "top" : "-200px"
			      }); 

				$(".startScreen").css({
					"-webkit-transform": "rotate(0deg)", 
				  		"-moz-transform": "rotate(0deg)", 
				    	"-ms-transform": "rotate(0deg)", 
			        	"-o-transform": "rotate(0deg)", 
			        	"transform": "rotate(0deg)", 
					"bottom": "0px",
					"left":"0px"
				  });
				}
			}
		}])
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
				        rotation: "45deg", 
				        ease: Power3.easeIn, 
				        alpha: 0,
				        left: "-500px",
				        bottom: "-1500px"
				    })
				    .to(inputScreen, 2, {   
				        rotation: "0deg", 
				        ease: Power4.easeOut, 
				        opacity: 1,
				        left: "0px",
				        top: "0px"
				    }, "-=0.5")
					.eventCallback('onComplete', done);
					
					tl_startInput.play();
					tl_startInput.seek(0);

				} else if ($rootScope.currentRoute === 'end') { 
					$log.log('Animating from "categories" to "end"');
					var tl_startEnd	= new TimelineLite({paused: true}),
						startScreen	= $(".startScreen"),
						endScreen	= $(".endScreen");

					// ANIMATION TIMELINE //
					tl_startEnd.to(startScreen, 2, {
				        rotation: "-20deg", 
				        ease: Power3.easeIn, 
				        alpha: 0,
				        left: "1800px",
				        bottom: "400px"
				    })
				    .to(endScreen, 2, {   
				        rotation: "0deg", 
				        ease: Power4.easeOut, 
				        opacity: 1,
				        left: "0px",
				        top: "0px"
				    }, "-=0.5")
					.eventCallback('onComplete', done);
					
					tl_startEnd.play();
					tl_startEnd.seek(0);

				} else {
					done();
				}
			}
		}
	 }])

    //Input Animations (into Categories else Experience)
     .animation('input-partial-enter', [function () {
     	return {
     		setup: function() {
     			$(".startScreen").css({
     				"-webkit-transform": "rotate(45deg)", 
				  		"-moz-transform": "rotate(45deg)", 
				    	"-ms-transform": "rotate(45deg)", 
			        	"-o-transform": "rotate(45deg)", 
			        	"transform": "rotate(45deg)", 
			        "opacity" : "1",
			        "left" : "-500px",
			        "bottom" : "-1500px"
     			});

     			$(".transition_blackFade").css({
     				"opacity": "0"
     			});

     			$(".experience__logo").css({
				    "opacity": "0"
				});
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
						rotation: "-30deg", 
						ease: Power3.easeIn, 
						opacity: 0,
						left: "-400px",
						top: "-1800px"
					})
					.to(startScreen, 2, {
						rotation: "0deg",
						ease: Power3.easeOut,
						opacity: 1,
						left: "0px",
						bottom: "0px"
					}, "-=0.5")
					.eventCallback('onComplete', done);
					
					tl_inputStart.play();

				} else if ($rootScope.currentRoute === 'experience') {
					$log.log('Animating from "input" to "experience"');
					var	tl_inputExp     = new TimelineLite({paused: true}),
						inputScreen     = $(".inputScreen"),
						transition      = $(".transition_blackFade"),
						logo			= $(".experience__logo");						

					// ANIMATION TIMELINE
					tl_inputExp.to(inputScreen, 2, {opacity: 0})
             			.to(transition, 2, {opacity: 1}, "-=1")
             			.to(logo, 2, {opacity: 1}, "-=1")
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
	 .animation('experience-partial-enter', [function () {
     	return {
     		setup: function() {
	 			var videoPlayer = document.getElementById("player");
	 				videoPlayer.style.display === "block";
					videoPlayer.style.opacity === "0";

				$(".endScreen").css({
				    "-webkit-transform": "rotate(0deg)", 
				    	"-moz-transform": "rotate(0deg)", 
			        	"-ms-transform": "rotate(0deg)", 
			        	"-o-transform": "rotate(0deg)", 
			        	"transform": "rotate(0deg)",
			        "opacity": "0"
	 			});

	 			$(".transition_blackFade").css({
				    "opacity": "1"
				});

				$(".inputScreen").css({
					"opacity": "0"
				})
	 		}
	 	}
	 }])
	 .animation('experience-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($playerDiv, done) {
				if ($rootScope.currentRoute === 'end') {
					$log.log('Animating from "experience" to "end"');
					var tl_expEnd   = new TimelineLite({paused: true}),
						endScreen   = $(".endScreen"),
						transition  = $(".transition_blackFade"),
						logo 		= $(".experience__logo"),
						videoPlayer = document.getElementById("player");

					// ANIMATION TIMELINE //
					tl_expEnd.to(transition, 3, {opacity: 0})
						.to(logo, 2, {opacity: 0}, "-=3")
						.to(endScreen, 2, {opacity: 1}, "-=2.5")   
					 	.eventCallback('onComplete', done);

					tl_expEnd.play();
					tl_expEnd.seek(0);

				} else if ($rootScope.currentRoute === 'input') {
					$log.log('Animating from "experience" to "input"');
					var	tl_expInput     = new TimelineLite({paused: true}),
						inputScreen     = $(".inputScreen"),
						transition      = $(".transition_blackFade"),
						logo			= $(".experience__logo");						

					// ANIMATION TIMELINE
					tl_expInput.to(logo, 2, {opacity: 0})
						.to(transition, 2, {opacity: 0}, "-=1")
						.to(inputScreen, 2, {opacity: 1}, "-=1.5")
						.to(inputScreen, 0.1, {display: "block"})
             			.eventCallback('onComplete', done);

             		tl_expInput.play();
        			tl_expInput.seek(0);

				} else {
					done();
				}
			}
		}
	 }])
	
	//End Animation (into Video else Categories)
	 .animation('end-partial-enter', [function () {
     	return {
     		setup: function($startScreen) {
     			$startScreen.css({
     				"-webkit-transform": "rotate(-20deg)", 
				  		"-moz-transform": "rotate(-20deg)", 
				    	"-ms-transform": "rotate(-20deg)", 
			        	"-o-transform": "rotate(-20deg)", 
			        	"transform": "rotate(-20deg)", 
			        "opacity" : "1",
			        "left" : "1800px",
			        "bottom" : "400px"
     			});
     		}
     	}
     }])
	 .animation('end-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($oldView, done) {
			if ($rootScope.currentRoute === 'experience') {
				$log.log('Animating from "end" to "experience"');
					transition 	= $(".transition_blackFade"),
					endScreen	= $(".endScreen"),
					logo		= $(".experience__logo"),
					tl_endVid	= new TimelineLite({paused: true});

				tl_endVid.to(endScreen, 2, {opacity: 0})
             		.to(transition, 2, {opacity: 1}, "-=0.5")
             		.to(logo, 2, {opacity: 1}, "-=2")
           			.eventCallback('onComplete', done);

		        tl_endVid.play(); 
		        tl_endVid.seek(0);

			} else if ($rootScope.currentRoute === 'categories') {
				$log.log('Animating from "end" to "categories"');
				var endScreen 	= $(".endScreen"),
					startScreen	= $(".startScreen"),
					tl_endStart	= new TimelineLite({paused: true});	

				//ANIMATION TIMELINE
				tl_endStart.to(endScreen, 2, { 
			        rotation: "30deg", 
					ease: Power3.easeIn, 
					opacity: 0,
					left: "-2400px",
					top: "-200px"
			     })
			    .to(startScreen, 2, {
						rotation: "0deg",
						ease: Power3.easeOut,
						opacity: 1,
						left: "0px",
						bottom: "0px",
					}, "-=0.5")
			     .eventCallback('onComplete', done);

			     tl_endStart.play();
			     tl_endStart.seek(0);
			} else {
				done();
			}
		}}
	 }])

//								  // 
//     VIDEO PLAYER ANIMATIONS    //
//								  //
	
	//video player ----------------//
	.animation('video-show', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			setup: function() {
				
			},
			start: function($playerDiv, done) {
				$log.log('Fade in Video Experience');
				var videoPlayer	= document.getElementById("player"), 
				tl_vidIn 		= new TimelineLite({paused: true});

				//ANIMATION TIMELINE
				tl_vidIn.to(videoPlayer, 2, {opacity: 1}, "+=2")
				.eventCallback('onComplete', done);
				
				tl_vidIn.play();
				setTimeout(function() {
       				videoPlayer.play()
       			}, 1850);
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
				.eventCallback('onComplete', done);

				tl_vidOut.play();
				tl_vidOut.seek(0);
			}
		}
	}])

	//action bubbles ----------------//
	.animation('action-annotation-show', [function() {
		return {
			setup: function(annotation) {
					annotation.css({
					"opacity": "1"
				});
			},
			start: function(annotation, done) {
				console.log('animate in action bubble');
				var tl_actionShow  	= new TimelineLite,
					aText			= $(".a-text");

				tl_actionShow.from(annotation, 0.3, {
					alpha:0, 
					scale:2, 
					ease:Back.easeOut
				})
				.eventCallback('onComplete', done);
			
			}
		}
	}])
	
	.animation('action-annotation-hide', [function() {
		return {
			start: function(annotation, done) {
				console.log('animate out action bubble');
				var tl_actionHide  = new TimelineLite;

				tl_actionHide.to(annotation, 0.5, {alpha: 0})
				.eventCallback('onComplete', done);
			}
		}
	}])
	
	//fantasy bubbles ----------------//
	.animation('fantasy-annotation-show', [function() {
		return {
			setup: function(annotation) {
					annotation.css({
					"opacity": "1"
				});
			},
			start: function(annotation, done) {
				console.log('animate in fantasy bubble');
				var tl_fantasyShow  = new TimelineLite,
					aText			= $(".a-text");

				tl_fantasyShow.from(annotation, 0.3, {
					alpha:0, 
					scale:2, 
					ease:Back.easeOut
				})
				.eventCallback('onComplete', done);
			
			}
		}
	}])
	
	.animation('fantasy-annotation-hide', [function() {
		return {
			start: function(annotation, done) {
				console.log('animate out fantasy bubble');
				var tl_fantasyHide  = new TimelineLite;

				tl_fantasyHide.to(annotation, 0.5, {alpha: 0})
				.eventCallback('onComplete', done);
			}
		}
	}])

	//romance bubbles ----------------//
	.animation('romance-annotation-show', [function() {
		return {
			setup: function(annotation) {
					annotation.css({
					"opacity": "1"
				});
			},
			start: function(annotation, done) {
				console.log('animate in romance bubble');
				var tl_romanceShow  = new TimelineLite,
					aText			= $(".a-text");

				tl_romanceShow.from(annotation, 0.3, {
					alpha:0, 
					scale:2, 
					ease:Back.easeOut
				})
				.eventCallback('onComplete', done);
			
			}
		}
	}])
	
	.animation('romance-annotation-hide', [function() {
		return {
			start: function(annotation, done) {
				console.log('animate out romance bubble');
				var tl_romanceHide  = new TimelineLite;

				tl_romanceHide.to(annotation, 0.5, {alpha: 0})
				.eventCallback('onComplete', done);
			}
		}
	}])

//								  // 
//     INPUT FORM ANIMATIONS      //
//								  //
	
 // input screen ----------------//

	//   start button   //
	 .animation('start-button-enter', [function() {
		return {
			setup: function($startButton) {
				$startButton.css({
					"-ms-transform": "rotateX(90deg) scale(1.1)",
						"-moz-transform": "rotateX(90deg) scale(1.1)",
						"-o-transform": "rotateX(90deg) scale(1.1)",
						"-webkit-transform": "rotateX(90deg) scale(1.1)",
						"transform": "rotateX(90deg) scale(1.1)",
					"-ms-transform-origin": "50% 0%",
						"-moz-transform-origin": "50% 0%",
						"-o-transform-origin": "50% 0%",
						"-webkit-transform-origin": "50% 0%",
						"transform-origin": "50% 0%"
				});
			},
			start: function($startButton, done) {
				var tl_startShow = new TimelineLite;

				tl_startShow.to($startButton, 2, {
					rotationX: "0deg",
					scale: "1",
					ease: Elastic.easeOut
				})
			}
		}
	 }])
	
	 .animation('start-button-leave', [function() {
		return {
			start: function($startButton, done) {
				var tl_startHide = new TimelineLite;

				tl_startHide.to($startButton, 1, {
					rotationX: "90deg",
					scale: "1.1",
					ease: Power4.easeIn
				})
			}
		}
	 }])

	//   next button   //
	 .animation('response-next-leave', [function() {
		return {
			setup: function(response) {
				response.find(".question__input").prop('disabled', true);
			},
			start: function(response, done) {
				var tl_nextLeave  = new TimelineLite,
					input 		  = response.find(".question__input");

				tl_nextLeave.to(response, 0.5, {
					rotationX: "90deg",
					scale: "1.1",
					ease: Power4.easeIn
				})
				.eventCallback('onComplete', done);
			}
		}
	 }])
	 .animation('response-next-enter', ['$window', function($window) {
		return {
			setup: function(response) {
				if (!$window.navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {	
				var input = response.find(".question__input");
					input.prop('disabled', true);

					setTimeout(function() {
						input.prop('disabled', false);
						input.focus();
					}, 1250)
				}
			},
			start: function(response, done) {
				var tl_nextEnter  = new TimelineLite;

				tl_nextEnter.from(response, 1.5, {
					rotationX: "90deg",
					scale: "1.1",
					ease: Power4.easeOut
				}, "+=1")
				.eventCallback('onComplete', done);
			}
		}
	 }]) 
	 
	//   prev button   //
	 .animation('response-previous-leave', [function() {
		return {
			setup: function(response) {
				response.find(".question__input").prop('disabled', true);
			},
			start: function(response, done) {
				var tl_prevLeave  = new TimelineLite;

				tl_prevLeave.to(response, 0.5, {
					rotationX: "90deg",
					scale: "1.1",
					ease: Power4.easeIn
				})
				.eventCallback('onComplete', done);
			}
		}
	 }])
	
	 .animation('response-previous-enter', ['$window', function($window) {
		return {
			setup: function(response) {
				if (!$window.navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {	
				var input = response.find(".question__input");
					input.prop('disabled', true);

					setTimeout(function() {
						input.prop('disabled', false);
						input.focus();
					}, 1250)
				}
			},
			start: function(response, done) {
				var tl_prevEnter  = new TimelineLite;

				tl_prevEnter.from(response, 1.5, {
					rotationX: "90deg",
					scale: "1.1",
					ease: Power4.easeOut
				}, "+=1")
				.eventCallback('onComplete', done);
			}
		}
	 }])

	//   prompt/question   // 
	 .animation('prompt-leave', [function() {
		return {
			setup: function(prompt) {
				prompt.css({
					"-ms-transform-origin": "50% 0%",
						"-moz-transform-origin": "50% 0%",
						"-o-transform-origin": "50% 0%",
						"-webkit-transform-origin": "50% 0%",
						"transform-origin": "50% 0%"
				});
			},
			start: function(prompt, done) {
				var tl_promptLeave  = new TimelineLite;

				tl_promptLeave.to(prompt, 0.5, {
					rotationX: "90deg",
					scale: "1.1",
					ease: Power4.easeIn
				})
				.eventCallback('onComplete', done);
			}
		}
	 }])

	 .animation('prompt-enter', [function() {
		return {
			setup: function(prompt) {
				prompt.hide();
				prompt.css({
					"-ms-transform-origin": "50% 0%",
						"-moz-transform-origin": "50% 0%",
						"-o-transform-origin": "50% 0%",
						"-webkit-transform-origin": "50% 0%",
						"transform-origin": "50% 0%"
				});
			},
			start: function(prompt, done) {
				var tl_promptEnter  = new TimelineLite;

				prompt.show();

				tl_promptEnter.from(prompt, 1.5, {
					rotationX: "90deg",
					scale: "1.1",
					ease: Power4.easeOut
				}, "+=1")
				.eventCallback('onComplete', done);
			}
		}
	 }])

	// ipad only ----------------//
	 .animation('valid-leave', [function() {
		return {
			/*setup: function() {
				element.show();
			},*/
			start: function(element, done) {
				element.fadeOut(500, done);
			}
		}
	 }])
	
	 .animation('valid-enter', [function() {
		return {
			setup: function(element) {
				element.hide();
			},
			start: function(element, done) {
				element.fadeIn(1000, done);
			}
		}
	 }])
 })();