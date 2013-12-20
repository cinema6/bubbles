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

    // next button //
        .animation('prompt-next-leave', ['$log', function($log) {
            return {
                setup: function(response) {
                    $log.log('Next-Prompt Leave setup');
                    response.css({'opacity': 1});
                },
                start: function(response, done) {
                    var timeline = new TimelineLite({paused: true});

                    timeline.to(response, 0.25, {'opacity': 0})
                        .eventCallback('onComplete', function() {
                            $log.info('Next-Prompt Leave done');
                            done();
                        });
                    timeline.play();
                }
            };
        }])
        .animation('prompt-next-enter', ['$window', '$log', function($window, $log) {
            return {
                setup: function(response) {
                    $log.log('Next-Prompt Enter setup');
                    response.css({'opacity': 0});
                },
                start: function(response, done) {
                    var timeline = new TimelineLite({paused: true});

                    timeline.to(response, 0.1, {'opacity': 1}, '+=0.2')
                        .from(response, 0.275, {x: '200', ease: Back.easeOut}, '-=0.1')
                        .eventCallback('onComplete', function() {
                            $log.info('Next-Prompt Enter done');
                            done();
                        });
                    timeline.play();
                }
            };
        }])

    // prev button //
        .animation('prompt-previous-leave', ['$log', function($log) {
            return {
                setup: function(response) {
                    $log.log('Prev-Prompt Leave setup');
                    response.css({'opacity': 1});
                },
                start: function(response, done) {
                    
                    var timeline = new TimelineLite({paused: true});

                    timeline.to(response, 0.25, {'opacity': 0})
                        .eventCallback('onComplete', function() {
                            $log.info('Prev-Prompt Leave done');
                            done();
                        });
                    timeline.play();
                }
            };
        }])
        .animation('prompt-previous-enter', ['$window', '$log', function($window, $log) {
            return {
                setup: function(response) {
                    $log.log('Prev-Prompt Enter setup');
                    response.css({'opacity': 0});
                },
                start: function(response, done) {
                    var timeline = new TimelineLite({paused: true});

                    timeline.to(response, 0.1, {'opacity': 1}, '+=0.2')
                        .from(response, 0.3, {x: '-45', ease: Back.easeOut}, '-=0.1')
                        .eventCallback('onComplete', function() {
                            $log.info('Prev-Prompt Enter done');
                            done();
                        });
                    timeline.play();

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
