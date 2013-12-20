(function() {
    /*global TimelineLite:false, Back:false, Power2:false */
    'use strict';
    angular.module('c6.anim', ['c6.ui'])

/*  ==========================================================================
    input state animations
    ========================================================================== */
    /* --- to video --- */
        .animation('experience.input=>experience.video-leave', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'input-leave',
                setup: function(element) {
                    $log.log('In input-leave setup');

                    element.css({opacity: 1, visibility: 'visible'});

                    var timeline = new TimelineLite({paused:true});
                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In input-leave start');
                    var interfaceElements = [
                            element.find('#paper-stack'),
                            element.find('#paper-form'),
                            element.find('#close-btn'),
                            element.find('#sj-logo'),
                            element.find('#paperball')
                        ];

                    timeline.to(interfaceElements, 0.5, {autoAlpha: 0})
                        .to(element, 1, {autoAlpha: 0, ease: Power2.easeIn}, '-0.5')
                        .eventCallback('onComplete', function() {
                            $log.info('input-leave done');
                            done();
                        });

                    timeline.play();
                    timeline.seek(0);
                },
                cancel: function(element, done, timeline) {
                    $log.log('In input-leave cancel');
                    timeline.kill();
                    timeline.clear();
                    done();
                }
            });
        }])
        
    /* --- to end --- */
        .animation('experience.input=>experience.end-leave', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'input-leave',
                setup: function(element) {
                    $log.log('In input-leave setup');

                    element.css({opacity: 1, visibility: 'visible'});

                    var timeline = new TimelineLite({paused:true});
                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In input-leave start');
                    var interfaceElements = [
                            element.find('#paper-stack'),
                            element.find('#paper-form'),
                        ];

                    timeline.to(interfaceElements, 0.5, {autoAlpha: 0})
                        .set(element, {autoAlpha: 0, ease: Power2.easeIn})
                        .eventCallback('onComplete', function() {
                            $log.info('input-leave done');
                            done();
                        });

                    timeline.play();
                    timeline.seek(0);
                },
                cancel: function(element, done, timeline) {
                    $log.log('In input-leave cancel');
                    timeline.kill();
                    timeline.clear();
                    done();
                }
            });
        }])

    /* --- from video --- */
        .animation('experience.video=>experience.input-enter', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'input-enter',
                setup: function(element) {
                    $log.log('In input-enter setup');

                    element.css({opacity: 0, visibility: 'hidden'});

                    var timeline = new TimelineLite({paused:true});
                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In input-enter start');
                    var interfaceElements = [
                            element.find('#paper-stack'),
                            element.find('#paper-form'),
                            element.find('#close-btn'),
                            element.find('#sj-logo'),
                            element.find('#paperball')
                        ];
                        
                    timeline.to(element, 1, {autoAlpha: 1, ease: Power2.easeIn}, '+=0.5')
                        .from(interfaceElements, 0.5, {autoAlpha: 0}, '-=0.25')
                        .eventCallback('onComplete', function() {
                            $log.info('input-enter done');
                            done();
                        });

                    timeline.play();
                    timeline.seek(0);
                },
                cancel: function(element, done, timeline) {
                    $log.log('In input-enter cancel');
                    timeline.kill();
                    timeline.clear();
                    done();
                }
            });
        }])

    /* --- from end --- */
        .animation('experience.end=>experience.input-enter', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'input-enter',
                setup: function(element) {
                    $log.log('In Input-enter setup');
                    var timeline = new TimelineLite({paused:true});

                    element.css({opacity: 0, visibility: 'hidden'});

                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In input-enter start');
                    var interfaceElements = [
                            element.find('#paper-stack'),
                            element.find('#paper-form'),
                        ];

                    timeline.set(element, {autoAlpha: 1}, '+=0.25')
                        .from(interfaceElements, 0.5, {autoAlpha: 0})
                        .eventCallback('onComplete', function() {
                            $log.info('input-leave done');
                            done();
                        });

                    timeline.play();
                    timeline.seek(0);
                },
                cancel: function(element, done, timeline) {
                    $log.log('In input-enter cancel');
                    timeline.kill();
                    timeline.clear();
                    done();
                }
            });
        }])

    // start button //
/*        .animation('start-button-enter', [function() {
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

                    startShow.to($startButton, 2, {rotationX: '0deg', scale: '1', ease: Elastic.easeOut })
                    .eventCallback('onComplete', done);
                }
            };
        }])

        .animation('start-button-leave', [function() {
            return {
                start: function($startButton, done) {
                    var startHide = new TimelineLite();

                    startHide.to($startButton, 1, {rotationX: '90deg', scale: '1.1', ease: Power4.easeIn })
                    .eventCallback('onComplete', done);
                }
            };
        }])
*/
    // next button //
/*        .animation('response-next-leave', [function() {
            return {
                setup: function(response) {
                    response.find('.question__input').prop('disabled', true);
                },
                start: function(response, done) {
                    var nextLeave= new TimelineLite();

                    nextLeave.to(response, 0.5, {rotationX: '90deg',scale: '1.1', ease: Power4.easeIn})
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

                    nextEnter.from(response, 1.5, {rotationX: '90deg', scale: '1.1', ease: Power4.easeOut}, '+=1')
                    .eventCallback('onComplete', done);
                }
            };
        }])
*/
    // prev button //
/*        .animation('response-previous-leave', [function() {
            return {
                setup: function(response) {
                    response.find('.question__input').prop('disabled', true);
                },
                start: function(response, done) {
                    var prevLeave= new TimelineLite();

                    prevLeave.to(response, 0.5, {rotationX: '90deg', scale: '1.1', ease: Power4.easeIn})
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

                    prevEnter.from(response, 1.5, {rotationX: '90deg', scale: '1.1', ease: Power4.easeOut}, '+=1')
                    .eventCallback('onComplete', done);
                }
            };
        }])
*/
    // prompt/question // 
/*      .animation('prompt-leave', [function() {
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

                    promptLeave.to(prompt, 0.5, { rotationX: '90deg', scale: '1.1', ease: Power4.easeIn})
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

                    promptEnter.from(prompt, 1.5, { rotationX: '90deg', scale: '1.1', ease: Power4.easeOut }, '+=1')
                    .eventCallback('onComplete', done);
                }
            };
        }])
*/
/*  ==========================================================================
    video state animations
    ========================================================================== */

    /* --- show ---  */
        .animation('video-show', ['$log', '$rootScope', 'c6AniCache', function($log, $rootScope, c6AniCache) {
            return c6AniCache({
                id: 'video-show',
                setup: function(element) {
                    $log.log('In video-show setup');

                    element.css({opacity: 0, visibility: 'hidden'});

                    var timeline = new TimelineLite({paused:true});
                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In video-show start');
                    var player$ = element.find('#player').css({opacity: 0, visibility: 'hidden'});

                    timeline.to(element, 1, {autoAlpha:1}, '+=0.5')
                        .to(player$, 1, {autoAlpha: 1}, '-=0.25')
                        .eventCallback('onComplete', function() {
                            $log.info('video-show done');
                            $rootScope.$broadcast('finishedAnimatingVideoShow');
                            done();
                        });

                    timeline.play();
                    timeline.seek(0);
                },
                cancel: function(element, done, timeline) {
                    $log.log('In video-show cancel');
                    timeline.kill();
                    timeline.clear();
                    done();
                }
            });
        }])

    /* --- hide ---  */
        .animation('video-hide', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'video-hide',
                setup: function(element) {
                    $log.log('In video-hide setup');

                    element.css({opacity: 1, visibility: 'visible'});

                    var timeline = new TimelineLite({paused:true});
                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In video-hide start');
                    var player$ = element.find('#player').css({opacity: 1, visibility: 'visible'});

                    timeline.to(player$, 1, {autoAlpha: 0})
                        .to(element, 0.5, {autoAlpha:0})
                        .eventCallback('onComplete', function() {
                            $log.info('video-hide done');
                            done();
                        });

                    timeline.play();
                    timeline.seek(0);
                },
                cancel: function(element, done, timeline) {
                    $log.log('In video-hide cancel');
                    timeline.kill();
                    timeline.clear();
                    done();
                }
            });
        }])

    /* --- action bubbles ---  */
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

    /* --- fantasy bubbles ---  */
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

    /* --- romance bubbles ---  */
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

/*  ==========================================================================
    end state animations
    ========================================================================== */
    /* --- to video --- */
        .animation('experience.end=>experience.video-leave', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'end-leave',
                setup: function(element) {
                    $log.log('In end-leave setup');

                    element.css({opacity: 1, visibility: 'visible'});

                    var timeline = new TimelineLite({paused:true});
                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In end-leave start');
                    var interfaceElements = [
                        element.find('#photos'),
                        element.find('#close-btn'),
                        element.find('#sj-logo'),
                        element.find('#paperball')
                    ];

                    timeline.to(interfaceElements, 0.5, {autoAlpha: 0})
                        .to(element, 1, {autoAlpha: 0, ease: Power2.easeIn}, '-0.25')
                        .eventCallback('onComplete', function() {
                            $log.info('end-leave done');
                            done();
                        });

                    timeline.play();
                    timeline.seek(0);
                },
                cancel: function(element, done, timeline) {
                    $log.log('In end-leave cancel');
                    timeline.kill();
                    timeline.clear();
                    done();
                }
            });
        }])

    /* --- to input --- */
        .animation('experience.end=>experience.input-leave', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'end-leave',
                setup: function(element) {
                    $log.log('In end-leave setup');

                    element.css({opacity: 1, visibility: 'visible'});

                    var timeline = new TimelineLite({paused:true});
                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In end-leave start');
                    var interfaceElements = element.find('#photos');

                    timeline.to(interfaceElements, 0.25, {autoAlpha: 0})
                        .set(element, {autoAlpha: 0})
                        .eventCallback('onComplete', function() {
                            $log.info('end-leave done');
                            done();
                        });

                    timeline.play();
                    timeline.seek(0);
                },
                cancel: function(element, done, timeline) {
                    $log.log('In end-leave cancel');
                    timeline.kill();
                    timeline.clear();
                    done();
                }
            });
        }])

    /* --- from video --- */
        .animation('experience.video=>experience.end-enter', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'end-enter',
                setup: function(element) {
                    $log.log('In end-enter setup');
                    var timeline = new TimelineLite({paused:true});

                    element.css({opacity: 0, visibility: 'hidden'});

                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In end-enter start');

                    timeline.to(element, 2, {autoAlpha: 1}, '+=0.5')
                        .eventCallback('onComplete', function() {
                            $log.info('end-enter done');
                            done();
                        });

                    timeline.play();
                    timeline.seek(0);
                },
                cancel: function(element, done, timeline) {
                    $log.log('In end-enter cancel');
                    timeline.kill();
                    timeline.clear();
                    done();
                }
            });
        }])

    /* --- from input --- */
        .animation('experience.input=>experience.end-enter', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'end-enter',
                setup: function(element) {
                    $log.log('In end-enter setup');
                    var timeline = new TimelineLite({paused:true});

                    element.css({opacity: 0, visibility: 'hidden'});

                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In end-enter start');
                    var interfaceElements = [
                            element.find('#photos'),
                        ];

                    timeline.set(element, {autoAlpha: 1}, '+=0.5')
                        .from(interfaceElements, 0.5, {autoAlpha: 0})
                        .eventCallback('onComplete', function() {
                            $log.info('end-enter done');
                            done();
                        });

                    timeline.play();
                    timeline.seek(0);
                },
                cancel: function(element, done, timeline) {
                    $log.log('In end-enter cancel');
                    timeline.kill();
                    timeline.clear();
                    done();
                }
            });
        }]);
})();
