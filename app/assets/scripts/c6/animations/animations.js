(function() {
    /*global TimelineLite:false, Power3:false, Power4:false, Back:false, Elastic:false */
    'use strict';
    angular.module('c6.anim', ['c6.ui'])

/*  ==========================================================================
    categories state animations
    ========================================================================== */

    /* --- to input --- */
        .animation('experience.categories=>experience.input-leave', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'categories-leave',
                setup: function(element) {
                    $log.log('In categories-leave setup');
                    var timeline = new TimelineLite({paused:true});

                    element.css({
                        '-webkit-transform': 'rotate(0deg)',
                        '-moz-transform': 'rotate(0deg)',
                        '-ms-transform': 'rotate(0deg)',
                        '-o-transform': 'rotate(0deg)',
                        'transform': 'rotate(0deg)',
                        bottom: 0, left: 0,
                        opacity: 1, visibility: 'visible'
                    });

                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In categories-leave start');

                    timeline.to(element, 2, {autoAlpha: 0, rotation: '45deg', left: '-500px', bottom: '-1500px', ease: Power3.easeIn})
                        .eventCallback('onComplete', function() {
                            $log.info('categories-leave done');
                            done();
                        });

                    timeline.play();
                    timeline.seek(0);
                },
                cancel: function(element, done, timeline) {
                    $log.log('In categories-leave cancel');
                    timeline.kill();
                    timeline.clear();
                    done();
                }
            });
        }])

    /* --- to end --- */
        .animation('experience.categories=>experience.end-leave', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'categories-leave',
                setup: function(element) {
                    $log.log('In categories-leave setup');

                    element.css({
                        '-webkit-transform': 'rotate(0deg)',
                        '-moz-transform': 'rotate(0deg)',
                        '-ms-transform': 'rotate(0deg)',
                        '-o-transform': 'rotate(0deg)',
                        'transform': 'rotate(0deg)',
                        bottom: 0, left: 0,
                        opacity: 1, visibility: 'visible'
                    });

                    var timeline = new TimelineLite({paused:true});
                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In categories-leave start');

                    timeline.to(element, 2, {rotation: '-20deg', autoAlpha: 0, left: '1800px', bottom: '400px', ease: Power3.easeIn})
                        .eventCallback('onComplete', function() {
                            $log.info('categories-leave done');
                            done();
                        });

                    timeline.play();
                    timeline.seek(0);
                },
                cancel: function(element, done, timeline) {
                    $log.log('In categories-leave cancel');
                    timeline.kill();
                    timeline.clear();
                    done();
                }
            });
        }])

    /* --- from input --- */
        .animation('experience.input=>experience.categories-enter', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'categories-enter',
                setup: function(element) {
                    $log.log('In categories-enter setup');
                    var timeline = new TimelineLite({paused:true});

                    element.css({
                        '-webkit-transform': 'rotate(45deg)',
                        '-moz-transform': 'rotate(45deg)',
                        '-ms-transform': 'rotate(45deg)',
                        '-o-transform': 'rotate(45deg)',
                        'transform': 'rotate(45deg)',
                        bottom: '-1500px', left: '-500px',
                        opacity: 0, visibility: 'hidden'
                    });

                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In categories-enter start');
                    timeline.to(element, 2, {rotation: '0deg', autoAlpha: 1, left: 0, bottom: 0, ease: Power3.easeOut}, '+=1.5')
                        .eventCallback('onComplete', function() {
                            $log.info('input-enter done');
                            done();
                        });

                    timeline.play();
                    timeline.seek(0);
                },
                cancel: function(element, done, timeline) {
                    $log.log('In categories-enter cancel');
                    timeline.kill();
                    timeline.clear();
                    done();
                }
            });
        }])

    /* --- from end --- */
        .animation('experience.end=>experience.categories-enter', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'categories-enter',
                setup: function(element) {
                    $log.log('In categories-enter setup');
                    var timeline = new TimelineLite({paused:true});

                    element.css({
                        '-webkit-transform': 'rotate(-20deg)',
                        '-moz-transform': 'rotate(-20deg)',
                        '-ms-transform': 'rotate(-20deg)',
                        '-o-transform': 'rotate(-20deg)',
                        'transform': 'rotate(-20deg)',
                        bottom: '400px', left: '1800px',
                        opacity: 0, visibility: 'hidden'
                    });

                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In categories-enter start');

                    timeline.to(element, 2, {autoAlpha: 1, rotation: '0deg', left: 0, bottom: 0, ease: Power3.easeOut}, '+=1.5')
                        .eventCallback('onComplete', function() {
                            $log.info('categories-enter done');
                            done();
                        });

                    timeline.play();
                    timeline.seek(0);
                },
                cancel: function(element, done, timeline) {
                    $log.log('In categories-enter cancel');
                    timeline.kill();
                    timeline.clear();
                    done();
                }
            });
        }])

/*  ==========================================================================
    input state animations
    ========================================================================== */

    /* --- to categories --- */
        .animation('experience.input=>experience.categories-leave', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'input-leave',
                setup: function(element) {
                    $log.log('In input-leave setup');
                    element.css({
                        '-webkit-transform': 'rotate(0deg)',
                        '-moz-transform': 'rotate(0deg)',
                        '-ms-transform': 'rotate(0deg)',
                        '-o-transform': 'rotate(0deg)',
                        opacity: 1, visibility: 'visible',
                        left: 0, top : 0
                    });
                    var timeline = new TimelineLite({paused:true});
                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In input-leave start');

                    timeline.to(element, 2, {autoAlpha: 0, rotation: '-30deg', left: '-400px', top: '-1800px', ease: Power3.easeIn})
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

                    timeline.to(element, 2, {autoAlpha: 0})
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

    /* --- from categories --- */
        .animation('experience.categories=>experience.input-enter', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'input-enter',
                setup: function(element) {
                    $log.log('In input-enter setup');
                    element.css({
                        '-webkit-transform': 'rotate(-30deg)',
                        '-moz-transform': 'rotate(-30deg)',
                        '-ms-transform': 'rotate(-30deg)',
                        '-o-transform': 'rotate(-30deg)',
                        opacity: 0, visibility: 'hidden',
                        left: '400px', top : '-1800px'
                    });

                    var timeline = new TimelineLite({paused:true});
                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In input-enter start');

                    timeline.to(element, 2, {rotation: '0deg', autoAlpha: 1, left: 0, top: 0, ease: Power4.easeOut}, '+=1.5')
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

                    timeline.to(element, 2, {autoAlpha: 1}, '+=1')
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

    // next button //
        .animation('response-next-leave', [function() {
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

    // prev button //
        .animation('response-previous-leave', [function() {
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
                    var //logo$ = element.find('#exp-logo'),
                        player$ = element.find('#player').css({opacity: 0, visibility: 'hidden'});

                    timeline.to(element, 1.5, {autoAlpha:1}, '+=0.5')
                        //.from(logo$, 1, {autoAlpha: 0}, '-=0.5')
                        .to(player$, 1, {autoAlpha: 1}, '-=0.5')
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
                        .to(element, 1, {autoAlpha:0})
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

                    timeline.to(element, 2, {autoAlpha: 0})
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

    /* --- to categories --- */
        .animation('experience.end=>experience.categories-leave', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'end-leave',
                setup: function(element) {
                    $log.log('In end-leave setup');

                    element.css({
                        '-webkit-transform': 'rotate(0deg)',
                        '-moz-transform': 'rotate(0deg)',
                        '-ms-transform': 'rotate(0deg)',
                        '-o-transform': 'rotate(0deg)',
                        opacity: 1, visibility: 'visible',
                        left: 0, top: 0
                    });

                    var timeline = new TimelineLite({paused:true});
                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In end-leave start');

                    timeline.to(element, 2, {autoAlpha: 0, rotation: '30deg', left: '-2400px', top: '-200px', ease: Power3.easeIn})
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

    /* --- from categories --- */
        .animation('experience.categories=>experience.end-enter', ['$log', 'c6AniCache', function($log, c6AniCache) {
            return c6AniCache({
                id: 'end-enter',
                setup: function(element) {
                    $log.log('In end-enter setup');
                    var timeline = new TimelineLite({paused:true});

                    element.css({
                        '-webkit-transform': 'rotate(30deg)',
                        '-moz-transform': 'rotate(30deg)',
                        '-ms-transform': 'rotate(30deg)',
                        '-o-transform': 'rotate(30deg)',
                        opacity: 0, visibility: 'hidden',
                        left: '-2400px', top: '-200px'
                    });

                    return timeline;
                },
                start: function(element, done, timeline) {
                    $log.log('In end-enter start');

                    timeline.to(element, 2, {autoAlpha: 1, rotation: '0deg', left: 0, top: 0, ease: Power4.easeOut}, '+=1.5')
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

    /* ---------------------- share --------------------- */
        .animation('shareBox-enter', [function() {
            return {
                setup: function(element) {
                    element.css({opacity: 0, visibility: 'hidden'});
                },
                start: function(element, done) {
                    var timeline = new TimelineLite({paused: true}),
                        shareBox$ = element.find('#share-box');

                    timeline.to(element, 0.65, {autoAlpha: 1})
                        .from(shareBox$, 0.5, {bottom: '-4em', ease: Power4.easeOut}, '-=0.25')
                        .eventCallback('onComplete', done);

                    timeline.play();
                }
            };
        }])

        .animation('shareBox-leave', [function() {
            return {
                setup: function(element) {
                    element.css({opacity: 1, visibility: 'visible'});
                },
                start: function(element, done) {
                    var timeline = new TimelineLite({paused: true}),
                        shareBox$ = element.find('#share-box');

                    timeline.to(shareBox$, 0.5, {bottom: '-4em', ease: Power4.easeIn})
                        .to(element, 0.65, {autoAlpha: 0})
                        .eventCallback('onComplete', done);

                    timeline.play();
                }
            };
        }]);
})();
