(function() {
	/*global TimelineLite:false, $:false, Power3:false, Power4:false, Back:false, Elastic:false */
	'use strict';

	angular.module('c6.anim', [])

//								//
//		STANDARD ANIMATIONS		//
//								//
.animation('experience-enter', [function () {
	return {
		setup: function (partial) {
			partial.hide();
			partial.find('.transition__panels-top').css({'top': '-50%'});
			partial.find('.transition__panels-bottom').css({'bottom': '-50%'});
		},
		start: function (partial, done) {
			var panelTop = partial.find('.transition__panels-top'),
				panelBottom = partial.find('.transition__panels-bottom'),
				panelsOpen = new TimelineLite({paused: true});

			panelsOpen.delay(0.5)
				.call(function() { partial.show(); })
				.to([panelTop, panelBottom], 0, {display: 'block'})
				.to(panelTop, 0.5, {top: '-100%'}, '+=.5')
				.to(panelBottom, 0.5, {bottom: '-100%'}, '-=0.5')
				.call(done, null, null, '+=.3')
				.to([panelTop, panelBottom], 0, {display: 'none'});

			panelsOpen.play();
		}
	};
}])

.animation('experience-leave', [function () {
	return {
		setup: function (partial) {
			partial.find('.transition__panels-top').css({top:'-100%'}).show();
			partial.find('.transition__panels-bottom').css({bottom:'-100%'}).show();
		},
		start: function (partial, done) {
			var panelTop = partial.find('.transition__panels-top'),
				panelBottom = partial.find('.transition__panels-bottom'),
				panelsClose = new TimelineLite({paused: true});

			panelsClose.to(panelTop, 0.5, {top: '-50%'})
				.to(panelBottom, 0.5, {bottom: '-50%'}, '-=0.5')
				.call(done, null, null, '+=0.3')
				.to([panelTop, panelBottom], 0, {display: 'none'});

			panelsClose.play();
		}
	};
}])


//								//
//		PARTIALS ANIMATIONS		//
//								//

//Categories Animations
 .animation('categories-partial-enter', [function () {
		return {
			setup: function() {
				$('.inputScreen').css({
					'-webkit-transform': 'rotate(-30deg)',
						'-moz-transform': 'rotate(-30deg)',
						'-ms-transform': 'rotate(-30deg)',
						'-o-transform': 'rotate(-30deg)',
					'opacity': '0',
					'left': '400px',
					'top' : '-1800px'
				});

				$('.endScreen').css({
					'-webkit-transform': 'rotate(30deg)',
						'-moz-transform': 'rotate(30deg)',
						'-ms-transform': 'rotate(30deg)',
						'-o-transform': 'rotate(30deg)',
					'opacity': '0',
					'left': '-2400px',
					'top' : '-200px'
				});

				$('.startScreen').css({
					'-webkit-transform': 'rotate(0deg)',
						'-moz-transform': 'rotate(0deg)',
						'-ms-transform': 'rotate(0deg)',
						'-o-transform': 'rotate(0deg)',
						'transform': 'rotate(0deg)',
					'bottom': '0px',
					'left':'0px'
				});
			}
		};
	}])
	.animation('categories-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($oldView, done) {
				var startInput,
					startEnd,
					startScreen = $('.startScreen'),
					inputScreen = $('.inputScreen'),
					endScreen	= $('.endScreen');

				if($rootScope.currentRoute === 'input') {
					$log.log('Animating from "categories" to "input"');
					startInput = new TimelineLite({paused: true});

					// ANIMATION TIMELINE //
					startInput.to(startScreen, 2, {
						rotation: '45deg',
						ease: Power3.easeIn,
						alpha: 0,
						left: '-500px',
						bottom: '-1500px'
					})
						.to(inputScreen, 2, {
						rotation: '0deg',
						ease: Power4.easeOut,
						opacity: 1,
						left: '0px',
						top: '0px'
					}, '-=0.5')
					.eventCallback('onComplete', done);

					startInput.play();
					startInput.seek(0);

				} else if ($rootScope.currentRoute === 'end') {
					$log.log('Animating from "categories" to "end"');
					startEnd	= new TimelineLite({paused: true});
					startScreen	= $('.startScreen');
					endScreen	= $('.endScreen');

					// ANIMATION TIMELINE //
					startEnd.to(startScreen, 2, {
						rotation: '-20deg',
						ease: Power3.easeIn,
						alpha: 0,
						left: '1800px',
						bottom: '400px'
					})
						.to(endScreen, 2, {
						rotation: '0deg',
						ease: Power4.easeOut,
						opacity: 1,
						left: '0px',
						top: '0px'
					}, '-=0.5')
					.eventCallback('onComplete', done);

					startEnd.play();
					startEnd.seek(0);

				} else {
					done();
				}
			}
		};
	 }])

	//Input Animations (into Categories else Experience)
	.animation('input-partial-enter', [function () {
		return {
			setup: function() {
				$('.startScreen').css({
					'-webkit-transform': 'rotate(45deg)',
						'-moz-transform': 'rotate(45deg)',
						'-ms-transform': 'rotate(45deg)',
						'-o-transform': 'rotate(45deg)',
						'transform': 'rotate(45deg)',
					'opacity' : '1',
					'left' : '-500px',
					'bottom' : '-1500px'
				});

				$('.transition_blackFade').css({
					'opacity': '0'
				});

				$('.experience__logo').css({
					'opacity': '0'
				});
			}
		};
	}])

	 .animation('input-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($oldView, done) {
				var inputScreen = $('.inputScreen'),
					startScreen	= $('.startScreen'),
					transition = $('.transition_blackFade'),
					logo		= $('.experience__logo'),
					inputExp, inputStart;

				if ($rootScope.currentRoute === 'categories') {
					$log.log('Animating from "input" to "categories"');
					inputStart = new TimelineLite({paused: true});

					// ANIMATION TIMELINE //
					inputStart.to(inputScreen, 2, {
						rotation: '-30deg',
						ease: Power3.easeIn,
						opacity: 0,
						left: '-400px',
						top: '-1800px'
					})
					.to(startScreen, 2, {
						rotation: '0deg',
						ease: Power3.easeOut,
						opacity: 1,
						left: '0px',
						bottom: '0px'
					}, '-=0.5')
					.eventCallback('onComplete', done);

					inputStart.play();

				} else if ($rootScope.currentRoute === 'experience') {
					$log.log('Animating from "input" to "experience"');
					inputExp = new TimelineLite({paused: true});
					inputScreen = $('.inputScreen');
					transition = $('.transition_blackFade');
					logo = $('.experience__logo');

					// ANIMATION TIMELINE
					inputExp.to(inputScreen, 2, {opacity: 0})
					.to(transition, 2, {opacity: 1}, '-=1')
					.to(logo, 2, {opacity: 1}, '-=1')
					.to(inputScreen, 0.1, {display: 'none'})
					.eventCallback('onComplete', done);

					inputExp.play();
					inputExp.seek(0);

				} else {
					done();
				}
			}
		};
	}])

	//Experience Animations (into End Screen)
	.animation('experience-partial-enter', [function () {
	return {
		setup: function() {
			var videoPlayer = document.getElementById('player');
				videoPlayer.style.display = 'block';
				videoPlayer.style.opacity = '0';

				$('.endScreen').css({
				'-webkit-transform': 'rotate(0deg)',
					'-moz-transform': 'rotate(0deg)',
					'-ms-transform': 'rotate(0deg)',
					'-o-transform': 'rotate(0deg)',
					'transform': 'rotate(0deg)',
				'opacity': '0'
				});

				$('.transition_blackFade').css({
					'opacity': '1'
				});

				$('.inputScreen').css({
					'opacity': '0'
				});
			}
		};
	}])
	.animation('experience-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($playerDiv, done) {
				var expInput, expEnd,
					inputScreen = $('.inputScreen'),
					endScreen = $('.endScreen'),
					transition= $('.transition_blackFade'),
					logo	= $('.experience__logo'),
					videoControls = $('.c6Controls__group');
					//videoPlayer = document.getElementById('player');

				if ($rootScope.currentRoute === 'end') {
					$log.log('Animating from "experience" to "end"');
					expEnd = new TimelineLite({paused: true});

					// ANIMATION TIMELINE //
					expEnd.to(transition, 3, {opacity: 0})
						.to(logo, 1, {opacity: 0}, '-=2.5')
						.call(function(){ videoControls.addClass('offscreen');}, null, null, '-=3')
						.to(endScreen, 2, {opacity: 1}, '-=2.5')
						.eventCallback('onComplete', done);

					expEnd.play();
					expEnd.seek(0);

				} else if ($rootScope.currentRoute === 'input') {
					$log.log('Animating from "experience" to "input"');
					expInput = new TimelineLite({paused: true});
					inputScreen = $('.inputScreen');
					transition= $('.transition_blackFade');
					logo	= $('.experience__logo');
					videoControls = $('.c6Controls__group');

					// ANIMATION TIMELINE
					expInput.to(logo, 1, {opacity: 0})
						.call(function(){ videoControls.removeClass('offscreen');}, null, null, '-=0.5')
						.to(transition, 2, {opacity: 0}, '-=1')
						.to(inputScreen, 2, {opacity: 1}, '-=1.5')
						.to(inputScreen, 0.1, {display: 'block'})
						.eventCallback('onComplete', done);

					expInput.play();
					expInput.seek(0);

				} else {
					done();
				}
			}
		};
	}])

	//End Animation (into Video else Categories)
	.animation('end-partial-enter', [function () {
	return {
		setup: function($startScreen) {
			$startScreen.css({
				'-webkit-transform': 'rotate(-20deg)',
						'-moz-transform': 'rotate(-20deg)',
						'-ms-transform': 'rotate(-20deg)',

						'-o-transform': 'rotate(-20deg)',
						'transform': 'rotate(-20deg)',
					'opacity' : '1',
					'left' : '1800px',
					'bottom' : '400px'
				});
			$('.transition_blackFade').css({
					'opacity': '0'
				});

			$('.experience__logo').css({
					'opacity': '0'
				});
			}
		};
	}])
	.animation('end-partial-leave', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($oldView, done) {
			var transition	= $('.transition_blackFade'),
				endScreen	= $('.endScreen'),
				logo		= $('.experience__logo'),
				startScreen	= $('.startScreen'),
				endVid, endStart;

			if ($rootScope.currentRoute === 'experience') {
				$log.log('Animating from "end" to "experience"');
				endVid	= new TimelineLite({paused: true});

				endVid.to(endScreen, 2, {opacity: 0})
					.to(transition, 2, {opacity: 1}, '-=0.5')
					.to(logo, 2, {opacity: 1}, '-=2')
					.eventCallback('onComplete', done);

				endVid.play();
				endVid.seek(0);

			} else if ($rootScope.currentRoute === 'categories') {
				$log.log('Animating from "end" to "categories"');
				endScreen	= $('.endScreen');
				startScreen	= $('.startScreen');
				endStart	= new TimelineLite({paused: true});

				//ANIMATION TIMELINE
				endStart.to(endScreen, 2, {
					rotation: '30deg',
					ease: Power3.easeIn,
					opacity: 0,
					left: '-2400px',
					top: '-200px'
			})
			.to(startScreen, 2, {
						rotation: '0deg',
						ease: Power3.easeOut,
						opacity: 1,
						left: '0px',
						bottom: '0px'
					}, '-=0.5')
			 .eventCallback('onComplete', done);

			 endStart.play();
			 endStart.seek(0);
			} else {
				done();
			}
		}};
	}])

//								// 
//		VIDEO PLAYER Animations //
//								//

	//c6Controls ------------------//
	/*.animation('c6Controls-show', [function() {
		return {
			setup: function(controls$) {
				controls$.css('opacity', 0);
			},
			start: function(controls$, done) {
				TweenLite.to(controls$, 0.5, {
					opacity: 1,
					onComplete: done
				});
			}
		};
	}])
	.animation('c6Controls-hide', [function() {
		return {
			setup: function(controls$) {
				controls$.css('opacity', 1);
			},
			start: function(controls$, done) {
				TweenLite.to(controls$, 0.5, {
					opacity: 0,
					onComplete: function() {
						done();
						controls$.css('opacity', 1);
					}
				});
			}
		};
	}])*/

	//video player ----------------//
	.animation('video-show', ['$rootScope', '$log', function($rootScope, $log) {
		return {
            setup: function(element) {
                element.css({opacity: 0, visibility: 'hidden'});
            },
			start: function(element, done) {
				$log.log('Fade in Video Experience');
				var videoPlayer		= document.getElementById('player'),
					loadingCycle	= document.getElementById('loading-group'),
					vidIn			= new TimelineLite({paused: true});

				//ANIMATION TIMELINE
				vidIn.set(element, {autoAlpha: 1})
                    .from(videoPlayer, 2, {opacity: 0}, '+=2');
				if (loadingCycle) {
					vidIn.to(loadingCycle, 1, {opacity: 1}, '-=2');
				}
				vidIn.eventCallback('onComplete', done);

				vidIn.play();
				setTimeout(function() {
					$rootScope.$broadcast('finishedAnimatingVideoShow');
				}, 1850);
				vidIn.seek(0);
			}
		};
	}])

	.animation('video-hide', ['$rootScope', '$log', function($rootScope, $log) {
		return {
			start: function($playerDiv, done) {
				$log.log('Fade Out Video Experience');
				var videoPlayer = document.getElementById('player'),
				vidOut		= new TimelineLite({paused: true});

				videoPlayer.pause();

				vidOut.to(videoPlayer, 1.5, {opacity: 0}, '-=2')
				.eventCallback('onComplete', done);

				vidOut.play();
				vidOut.seek(0);
			}
		};
	}])

	//action bubbles ----------------//
	.animation('action-annotation-show', [function() {
		return {
			setup: function(annotation) {
					annotation.css({
					'opacity': '1'
				});
			},
			start: function(annotation, done) {
				var actionShow	= new TimelineLite();
				actionShow.from(annotation, 0.3, {
					alpha:0,
					scale:2,
					ease:Back.easeOut
				})
				.eventCallback('onComplete', done);
			}
		};
	}])

	.animation('action-annotation-hide', [function() {
		return {
			start: function(annotation, done) {
				var actionHide= new TimelineLite();

				actionHide.to(annotation, 0.25, {alpha: 0})
				.eventCallback('onComplete', done);
			}
		};
	}])

	//fantasy bubbles ----------------//
	.animation('fantasy-annotation-show', [function() {
		return {
			setup: function(annotation) {
					annotation.css({
					'opacity': '1'
				});
			},
			start: function(annotation, done) {
				var fantasyShow = new TimelineLite();

				fantasyShow.from(annotation, 0.3, {
					alpha:0,
					top: '-=30px',
					ease:Back.easeOut
				})
				.eventCallback('onComplete', done);

			}
		};
	}])

	.animation('fantasy-annotation-hide', [function() {
		return {
			start: function(annotation, done) {
				var fantasyHide= new TimelineLite();

				fantasyHide.to(annotation, 0.3, {alpha: 0})
				.eventCallback('onComplete', done);
			}
		};
	}])

	//romance bubbles ----------------//
	.animation('romance-annotation-show', [function() {
		return {
			setup: function(annotation) {
					annotation.css({
					'opacity': '1'
				});
			},
			start: function(annotation, done) {
				var romanceShow= new TimelineLite();

				romanceShow.from(annotation, 0.3, {
					alpha:0,
					scale:2,
					ease:Back.easeOut
				})
				.eventCallback('onComplete', done);
			}
		};
	}])

	.animation('romance-annotation-hide', [function() {
		return {
			start: function(annotation, done) {
				var romanceHide= new TimelineLite();

				romanceHide.to(annotation, 0.3, {alpha: 0})
				.eventCallback('onComplete', done);
			}
		};
	}])

//								// 
// 		INPUT FORM ANIMATIONS	//
//								//

 // input screen ----------------//

	// start button //
	 .animation('start-button-enter', [function() {
		return {
			setup: function($startButton) {
				$startButton.css({
					'-ms-transform': 'rotateX(90deg) scale(1.1)',
						'-moz-transform': 'rotateX(90deg) scale(1.1)',
						'-o-transform': 'rotateX(90deg) scale(1.1)',
						'-webkit-transform': 'rotateX(90deg) scale(1.1)',
						'transform': 'rotateX(90deg) scale(1.1)',
					'-ms-transform-origin': '50% 0%',
						'-moz-transform-origin': '50% 0%',
						'-o-transform-origin': '50% 0%',
						'-webkit-transform-origin': '50% 0%',
						'transform-origin': '50% 0%'
				});
			},
			start: function($startButton, done) {
				var startShow = new TimelineLite();

				startShow.to($startButton, 2, {
					rotationX: '0deg',
					scale: '1',
					ease: Elastic.easeOut
				})
				.eventCallback('onComplete', done);
			}
		};
	}])

	.animation('start-button-leave', [function() {
		return {
			start: function($startButton, done) {
				var startHide = new TimelineLite();

				startHide.to($startButton, 1, {
					rotationX: '90deg',
					scale: '1.1',
					ease: Power4.easeIn
				})
				.eventCallback('onComplete', done);
			}
		};
	}])

	// next button //
	.animation('response-next-leave', [function() {
		return {
			setup: function(response) {
				response.find('.question__input').prop('disabled', true);
			},
			start: function(response, done) {
				var nextLeave= new TimelineLite();
					//input	= response.find('.question__input');

				nextLeave.to(response, 0.5, {
					rotationX: '90deg',
					scale: '1.1',
					ease: Power4.easeIn
				})
				.eventCallback('onComplete', done);
			}
		};
	}])
	.animation('response-next-enter', ['$window', function($window) {
		return {
			setup: function(response) {
				if (!$window.navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
				var input = response.find('.question__input');
					input.prop('disabled', true);

					setTimeout(function() {
						input.prop('disabled', false);
						input.focus();
					}, 1250);
				}
			},
			start: function(response, done) {
				var nextEnter= new TimelineLite();

				nextEnter.from(response, 1.5, {
					rotationX: '90deg',
					scale: '1.1',
					ease: Power4.easeOut
				}, '+=1')
				.eventCallback('onComplete', done);
			}
		};
	}])

	// prev button //
	.animation('response-previous-leave', [function() {
		return {
			setup: function(response) {
				response.find('.question__input').prop('disabled', true);
			},
			start: function(response, done) {
				var prevLeave= new TimelineLite();

				prevLeave.to(response, 0.5, {
					rotationX: '90deg',
					scale: '1.1',
					ease: Power4.easeIn
				})
				.eventCallback('onComplete', done);
			}
		};
	}])

	.animation('response-previous-enter', ['$window', function($window) {
		return {
			setup: function(response) {
				if (!$window.navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
				var input = response.find('.question__input');
					input.prop('disabled', true);

					setTimeout(function() {
						input.prop('disabled', false);
						input.focus();
					}, 1250);
				}
			},
			start: function(response, done) {
				var prevEnter= new TimelineLite();

				prevEnter.from(response, 1.5, {
					rotationX: '90deg',
					scale: '1.1',
					ease: Power4.easeOut
				}, '+=1')
				.eventCallback('onComplete', done);
			}
		};
	}])

	// prompt/question // 
	 .animation('prompt-leave', [function() {
		return {
			setup: function(prompt) {
				prompt.css({
					'-ms-transform-origin': '50% 0%',
						'-moz-transform-origin': '50% 0%',
						'-o-transform-origin': '50% 0%',
						'-webkit-transform-origin': '50% 0%',
						'transform-origin': '50% 0%'
				});
			},
			start: function(prompt, done) {
				var promptLeave= new TimelineLite();

				promptLeave.to(prompt, 0.5, {
					rotationX: '90deg',
					scale: '1.1',
					ease: Power4.easeIn
				})
				.eventCallback('onComplete', done);
			}
		};
	}])

	 .animation('prompt-enter', [function() {
		return {
			setup: function(prompt) {
				prompt.hide();
				prompt.css({
					'-ms-transform-origin': '50% 0%',
						'-moz-transform-origin': '50% 0%',
						'-o-transform-origin': '50% 0%',
						'-webkit-transform-origin': '50% 0%',
						'transform-origin': '50% 0%'
				});
			},
			start: function(prompt, done) {
				var promptEnter= new TimelineLite();

				prompt.show();

				promptEnter.from(prompt, 1.5, {
					rotationX: '90deg',
					scale: '1.1',
					ease: Power4.easeOut
				}, '+=1')
				.eventCallback('onComplete', done);
			}
		};
	}])

	// ipad only ----------------//
	.animation('valid-hide', [function() {
		return {
			start: function(element, done) {
				element.fadeOut(500, done);
			}
		};
	}])

	.animation('valid-show', [function() {
		return {
			setup: function(element) {
				element.hide();
			},
			start: function(element, done) {
				element.fadeIn(1000, done);
			}
		};
	}]);
})();
