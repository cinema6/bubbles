(function() {
	angular.module('c6.anim', [])

//								  // 
//        PARTIALS ANIMATIONS     //
//								  //
	
    //Categories Animations (into Input)
	 .animation('categories-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
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
				        "opacity": "1",
				        "left": "0px"
				      });
				      $log.log("* Input Styles Reset *");
				    }

					// ANIMATION TIMELINE //
					tl_startInput.to(startScreen, 2, {
        				transformOrigin: "0% 0%", 
				        rotation: "90deg", 
				        ease: Power3.easeIn, 
				        alpha: 0,
				        left: "-=1000px"
				    })
				    .from(inputScreen, 2, {   
				        rotation: "-90deg", 
				        ease: Power4.easeOut, 
				        alpha: 0,
				        left: "1000px"
				    }, "-=0.5")
					.eventCallback('onComplete', done);
					
					//inputReset();
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
			setup: function($oldView) {
					$(".inputScreen").css({
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
				        "display": "block",
				        "opacity": "1",
				        "left": "0px"
				      });
				},
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
						opacity: 0,
						left: "+=1000px"
					})
					.from(startScreen, 2, {
						transformOrigin: "0% 0%",
						rotation: "90deg",
						ease: Power3.easeOut,
						opacity: 0,
						left: "-=1000px"
					}, "-=0.5")
					.eventCallback('onComplete', done);
					
					tl_inputStart.play();

				} else if ($rootScope.currentRoute === 'experience') {
					$log.log('Animating from "input" to "experience"');
					var	tl_inputExp     = new TimelineLite({paused: true}),
						inputScreen     = $(".inputScreen"),
						transition      = $(".transition_blackFade");						

					// reset styles
				    function fadeReset() {
				    	transition.css({
				        "opacity": "0"
				      });
				    	console.log("* Fade Styles Reset *");
				    }	

					// ANIMATION TIMELINE
					tl_inputExp.to(inputScreen, 2, {opacity: 0})
             			.to(transition, 2, {opacity: 1}, "-=1")
             			.to(inputScreen, 0.1, {display: "none"})
             			.eventCallback('onComplete', done);

             		fadeReset();
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
             		.to(transition, 2, {opacity: 1}, "-=0.5")
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
			        alpha: 0,
			        left: "1000px"
			     })
			     .from(startScreen, 2, {
			        rotation: "90deg",
			        ease: Power3.easeOut,
			        alpha: 0,
			        left: "-=1000px"
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
//     VIDEO PLAYER ANIMATIONS    //
//								  //

	.animation('video-show', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			setup: function() {

			},
			start: function($playerDiv, done) {
				$log.log('Fade in Video Experience');
				var videoPlayer	= document.getElementById("player"), 
				tl_vidIn 		= new TimelineLite({paused: true});

				//ANIMATION TIMELINE
				tl_vidIn.from(videoPlayer, 2, {opacity: 0}, "+=2")
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
				.to(videoPlayer, 0.1, {display: "none"})
				.eventCallback('onComplete', done);

				tl_vidOut.play();
				tl_vidOut.seek(0);
			}
		}
	}])
	
//								  // 
//     INPUT FORM ANIMATIONS      //
//								  //
	
	//input screen
	.animation('start-button-enter', [function() {
		return {
			setup: function($startButton) {
				$startButton.hide();
			},
			start: function($startButton, done) {
				$startButton.fadeIn(done);
			}
		}
	}])
	
	.animation('start-button-leave', [function() {
		return {
			start: function($startButton, done) {
				$startButton.fadeOut(done);
			}
		}
	}])

	.animation('response-next-leave', [function() {
		return {
			setup: function(input) {
				input.prop('disabled', true);
			},
			start: function(input, done) {
				console.log('New Question Leave');
				var tl_nextLeave  = new TimelineLite;

				tl_nextLeave.to(input, 1, {
					"left": "-=150px", 
					alpha: 0, 
					ease: Power4.easeIn, 
				})
				.eventCallback('onComplete', done);
			}
		}
	}])
	
	.animation('response-next-enter', ['$window', function($window) {
		return {
			setup: function(input) {
				if (!$window.navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {	
					input.prop('disabled', true);

					setTimeout(function() {
						input.prop('disabled', false);
						input.focus();
					}, 1250)
				}
			},
			start: function(input, done) {
				console.log('New Question Enter');
				var tl_nextEnter  = new TimelineLite;

				tl_nextEnter.from(input, 1, {
					"left": "+=150px", 
					alpha: 0, 
					ease: Elastic.easeOut
				}, "+=1")
				.eventCallback('onComplete', done);
			}
		}
	}])
	
	.animation('response-previous-leave', [function() {
		return {
			setup: function(input) {
				input.prop('disabled', true);
			},
			start: function(input, done) {
				console.log('Prev Question Leave');
				var tl_prevLeave  = new TimelineLite;

				tl_prevLeave.to(input, 1, {
					"left": "+=150px", 
					alpha: 0, 
					ease: Power4.easeIn
				})
				.eventCallback('onComplete', done);
			}
		}
	}])
	
	.animation('response-previous-enter', ['$window', function($window) {
		return {
			setup: function(input) {
				if (!$window.navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {	
					input.prop('disabled', true);

					setTimeout(function() {
						input.prop('disabled', false);
						input.focus();
					}, 1250)
				}
			},
			start: function(input, done) {
				console.log('Previous Question Enter');
				var tl_prevEnter  = new TimelineLite;

				tl_prevEnter.from(input, 1, {
					"left": "-=150px", 
					alpha: 0, 
					ease: Elastic.easeOut
				}, "+=1")
				.eventCallback('onComplete', done);
			}
		}
	}])

	//action bubbles
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
	
	.animation('valid-hide', [function() {
		return {
			start: function(element, done) {
				element.fadeOut(2000, done);
			}
		}
	}])
	
	.animation('prompt-enter', [function() {
		return {
			setup: function(prompt) {
				prompt.hide();
			},
			start: function(prompt, done) {
				prompt.fadeIn(done);
			}
		}
	}])
	
	.animation('prompt-leave', [function() {
		return {
			start: function(prompt, done) {
				prompt.fadeOut(done);
			}
		}
	}])
	
	.animation('valid-validated', [function() {
		return {
			start: function(element, done) {
				element.fadeIn(1000, function() {
					element.fadeOut(1000, done);
				})
			}
		}
	}]);
 })();
