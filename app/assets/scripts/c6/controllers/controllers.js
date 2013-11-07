(function(){
'use strict';

function PromptModel(experience) {
    var localException = function(msg) {
        return {
            'name'     : 'PromptModel',
            'message'     : (msg !== undefined) ? msg : 'Unspecified error.',
            'toString' : function() { return this.name + ': ' + this.message; }
        };
    };
    this.defSizeLimit     = (experience.defSizeLimit) ? experience.defSizeLimit : 30;
    this.prompts         = [];
    this.responses         = [];
    for (var i = 0; i < experience.prompts.length; i++) {
        var q = experience.prompts[i];
        if (q instanceof Object) {
            if (!q.query) {
                throw localException('question object must have a query!');
            }
            this.prompts.push({
                query : q.query,
                sizeLimit : (q.sizeLimit) ? q.sizeLimit : this.defSizeLimit
            });
        }
        else if ((typeof q === 'string') || (q instanceof String)){
            this.prompts.push({
                query : q,
                sizeLimit : this.defSizeLimit
            });
        }
        else {
            throw localException('Unknown question type: ' + typeof q);
        }
        this.responses.push(null);
    }
}

// A parent controller that contains much of the necessary data and functions needed by multiple 
// child controllers. Contains code for initializing the experience and other models.
angular.module('c6.ctrl',['c6.svc'])
.controller('C6AppCtrl', ['$log', '$scope', '$location', '$q', '$stateParams', '$timeout',
                          'appBaseUrl', 'c6Sfx', '$state', 'C6AnnotationsService',
                          'C6ResponseCachingService', 'c6AniCache', 'site', 'environment',
                          'c6UserAgent', 'c6ImagePreloader',
            function($log, $scope, $location, $q, $stateParams, $timeout, appBase, sfxSvc, $state,
                     annSvc, respSvc, c6AniCache, site, env,
                    c6UserAgent, c6ImagePreloader) {

    $log.log('Creating C6AppCtrl');
    var self = this,
        hideC6ControlsTimeout,
        allowStateChange = false,
        siteSession = site.init({
            setup: function(appData) {
                var experience = appData.experience;

                return c6ImagePreloader.load([experience.img.bg]);
            }
        });

    if (c6UserAgent.device.isMobile()) {
        $state.get('experience.input').templateUrl = appBase + '/views/input_mobile.html';
    }

    this.sfxSvc = sfxSvc;
    this.experience = null;
    this.expData = null;
    this.experienceAnimation = null;
    this.promptModel = null; // Holds the prompts for the user and their responses
    this.annotationsModel = null; // holds the annotations (speech bubbles)

    this.sfxReady = false;
        
    siteSession.on('pendingPath', function(path, respond) {
        if (path !== '/') {
            allowStateChange = true;
            $location.path(path);
            respond(true);
        } else {
            respond(false);
        }
    });

    siteSession.on('gotoState', function(state) {
        if (state === 'start') {
            var appUriParts = self.experience.appUri.split('/');
            $state.transitionTo('landing_' + appUriParts[appUriParts.length - 1]);
        }
    });

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
        if ((fromState.name.match(/landing/) || (toState.name.match(/landing/) && fromState.name)) && !allowStateChange) {
            event.preventDefault();
            site.requestTransitionState(true).then(function() {
                allowStateChange = true;
                $timeout(function() {
                    if (!self.sfxReady) {
                        $log.warn('Sfx failed to load. NUKING!');
                        sfxSvc.getSounds().forEach(function(sfx) {
                            angular.forEach(sfx, function(value, key) {
                                if (angular.isFunction(value)) {
                                    sfx[key] = angular.noop;
                                }
                            });
                        });
                    }

                    $state.transitionTo(toState.name);
                    $timeout(function() {
                        allowStateChange = false;
                        $timeout(function() { site.requestTransitionState(false); });
                    });
                });
            });
        } else {
            allowStateChange = false;
        }
    });

    c6AniCache.enabled(true);

    $scope.$on('$viewContentLoaded', function() {
        $scope.appCtrl.experienceAnimation = 'experience';
    });

    this.goToRoute = function(route) {
        $location.path(route);
    };
    
    this.currentCategory = function() {
        return this.expData.category;
    };
    
    this.currentVideo = function() {
        return this.expData.video;
    };

    this.askForVideoLoad = function() {
        $scope.$broadcast('videoShouldLoad');
    };
    
    this.startExperience = function() {
        if ($state.is('landing_usergen') && self.expData.responses) {
            $state.transitionTo('experience.video');
        } else {
            $state.transitionTo('experience.input');
        }
    };

    this.userIsUsingC6Chrome = false;
    this.showC6Chrome = false;
    $scope.$watch('appCtrl.showC6Chrome || !$state.is(\'experience.video\')', function(shouldShow) {
        if (site.ready) {
            site.requestBar(shouldShow);
        } else {
            site.once('ready', function() {
                site.requestBar(shouldShow);
            });
        }
    });

    this.stateHistory = {
        from: null,
        to: null
    };
    
    this.randomAnnotations = [];
    this.getRandomAnnotations = function(num) {
        var randAnnots = [];
        
        self.expData.annotations.forEach(function(annotation) {
            if (annotation.options && annotation.options.type === 'talkie') {
                num = 0;
            }
        });
        
        if (num === 0 || !self.annotationsModel || !self.expData.responses) {
            self.randomAnnotations = [];
            return;
        }
        
        var new_annots = angular.copy(self.annotationsModel.annotations);
        
        for (var i = 0; i < Math.min(num, self.annotationsModel.annotations.length); i++) {
            var randIndex = Math.floor(Math.random() * new_annots.length);
            var randAnnot = new_annots.splice(randIndex, 1)[0];
            randAnnot.text = annSvc.interpolate(randAnnot.template, self.expData.responses);
            randAnnots.push(randAnnot);
        }
        
        self.randomAnnotations = randAnnots;
    };

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
        self.stateHistory.from = fromState.name;
        self.stateHistory.to = toState.name;
    });

    $scope.$on('c6MouseActivityStart', function() {
        if (hideC6ControlsTimeout) { $timeout.cancel(hideC6ControlsTimeout); }
        self.showC6Chrome = true;
    });

    $scope.$on('c6MouseActivityStop', function() {
        hideC6ControlsTimeout = $timeout(function() {
            if (!self.userIsUsingC6Chrome) {
                self.showC6Chrome = false;
            }
        }, 3000);
    });

    $scope.appCtrl = this;
    $scope.$state = $state;
    $scope.$stateParams = $stateParams;
    
    site.getAppData().then(function(data) {
        var sfxToLoad = [
            { name: 'type', src: appBase + '/media/tw_strike' },
            { name: 'bell', src: appBase + '/media/tw_bell' },
            { name: 'pop', src: appBase + '/media/pop_1' },
            { name: 'yank', src: appBase + '/media/tw_yank' }
        ];

        $log.log('Profile: ' + JSON.stringify(data.profile, null, 3));

        TweenLite.ticker.useRAF(data.profile.raf);

        self.experience = data.experience;
        self.expData = data.experience.data;

        if (self.expData && self.expData.src && !self.expData.src.match(env.vidUrl)) {
            self.expData.src = env.vidUrl + self.expData.src;
        }
        self.promptModel = new PromptModel(self.expData);
        self.annotationsModel = annSvc.getAnnotationsModelByType('bubble',self.expData.annotations);
        
        self.getRandomAnnotations(3);

        if (self.annotationsModel && self.annotationsModel.sfx){
            $log.log('Experience (' + self.experience.uri + ') has some sounds.');
            angular.forEach(self.annotationsModel.sfx,function(sfxSrc,sfxName){
                sfxSrc  = appBase + '/' + sfxSrc;
                if (sfxToLoad.map(function(sfx) { return sfx.name; }).indexOf(sfxName) < 0){
                    $log.info('Will load sfx name=' + sfxName + ', src=' + sfxSrc);
                    sfxToLoad.push( { name: sfxName, src: sfxSrc });
                } else {
                    $log.info('Already loaded sfx name=' + sfxName);
                }
            });
        }

        $log.info('Loading sounds');
        sfxSvc.loadSounds(sfxToLoad).then(function() {
            $log.info('Sounds successfuly loaded!');
            self.sfxReady = true;
        });

        if (self.expData.responses) {
            $scope.appCtrl.promptModel.responses = self.expData.responses;
        }

    }, function(error) {
        // if here, communication has somehow broken down with the site. Show a fail screen?
        $log.error('Failed to get experience from site');
        $log.error(error);
    });
        
}])

// Contains code for finishing the setup of the experience object and other models, as well as 
// controls for the video and interactive content.
.controller('C6ExperienceCtrl',['$log','$scope','$rootScope','$location','$stateParams',
                                'C6AnnotationsService','$state','$timeout','environment',
                                'C6ResponseCachingService','c6Sfx','C6VideoControlsService',
                                'c6UserAgent',
            function($log,$scope,$rootScope,$location,$stateParams,annSvc,$state,$timeout,env,
                     respSvc,sfxSvc,vidCtrlsSvc,c6UserAgent) {
                     
    $log.log('Creating C6ExperienceCtrl');
    var self = this,
        readyEvent = c6UserAgent.device.isMobile() ? 'loadstart' : 'canplaythrough',
        oldResponses,
        video;

    $scope.$on('c6video-ready', function(event, player) {
        video = player;

        var undoWatch = $scope.$watch('expCtrl.c6ControlsController.ready', function(ready) {
            if (ready) {
                vidCtrlsSvc.bind(player, self.c6ControlsDelegate, self.c6ControlsController);
                undoWatch();
            }
        });

        player.on([readyEvent, 'play'], function(event, video) {
            self.videoCanPlay = true;
            $timeout(function() {
                if ($state.is('experience.video') && video.player.paused) { video.player.play(); }
            }, 200, false);
        });
    });

    $scope.$on('c6video-regenerated', function(event, video) {
        video.player.load();
    });

    $scope.$on('videoShouldLoad', function() {
        if (!video.bufferedPercent()) {
            $log.log('Video not buffered! Attempting to load!');
            video.player.load();
        }
    });

    $scope.$on('finishedAnimatingVideoShow', function() {
        if (self.videoCanPlay && video.player.paused) {
            if (video.hasPlayed()) {
                video.player.currentTime = 0;
            }
            $log.log('Playing the video!');
            video.player.play();
        }
    });

    // This is fired when the app reaches the video state and the promptModel is initialized,
    // including when a shared experience has been initialized. This will interpolate the user
    // responses and line templates, and retrieve the text-to-speech video url.
    $scope.$watch('$state.is("experience.video") && appCtrl.promptModel', function(yes) {
        if (yes) {
            var bubbleModel = $scope.appCtrl.annotationsModel,
                txt2SpchModel = annSvc.getAnnotationsModelByType('talkie',
                                    $scope.appCtrl.expData.annotations),
                responses = $scope.appCtrl.promptModel.responses;
                
            if (!angular.equals(responses, oldResponses) || c6UserAgent.device.isMobile()) {
                respSvc.setResponses(responses, $scope.appCtrl.currentCategory(),
                                     $scope.appCtrl.currentVideo());
                if (txt2SpchModel) {
                    self.videoCanPlay = false;
                }
            }

            if (bubbleModel) {
                self.annotationsModel = annSvc.interpolateAnnotations(bubbleModel, responses);
            } else {
                self.annotationsModel = null;
            }
            if (txt2SpchModel) {
                txt2SpchModel = annSvc.interpolateAnnotations(txt2SpchModel, responses);

                oldResponses = angular.copy(responses);

                annSvc.fetchText2SpeechVideoUrl(txt2SpchModel, $scope.appCtrl.expData.sharedSrc)
                .then(function(url) {
                    $scope.appCtrl.expData.src = url;
                });
            }
        }
    });

    $scope.$watch('!$state.is(\'experience.video\')', function(notInVideoState) {
        if (notInVideoState && !video.player.paused) {
            video.player.pause();
        }
    });

    // For c6Controls
    this.c6ControlsDelegate = {};
    this.c6ControlsController = {};

    this.videoCanPlay = false;

    this.annotationsModel = $scope.appCtrl.annotationsModel;

    this.activeAnnotations = [];

    // Called while the video is playing to control what speech bubbles are displayed
    this.setActiveAnnotations = function(event, video) {
        var annotations = self.annotationsModel? self.annotationsModel.annotations : [],
            activeAnnotations = self.activeAnnotations,
            time = video.player.currentTime,
            ts,
            duration,
            inActiveArray;
        annotations.forEach(function(annotation) {
            ts = annotation.ts;
            duration = annotation.duration;
            inActiveArray = activeAnnotations.indexOf(annotation) !== -1;

            if ((time >= ts) && (time <= (ts + duration))) {
                if (!inActiveArray) {
                    self.activeAnnotations.push(annotation);
                    if (annotation.sfx) {
                        sfxSvc.playSound(annotation.sfx);
                    } else {
                        sfxSvc.playSound('pop');
                    }
                    $log.log('Activated annotation: ' + annotation.text);
                }
            } else {
                if (inActiveArray) {
                    self.activeAnnotations.splice(activeAnnotations.indexOf(annotation), 1);
                    $log.log('Deactivated annotation: ' + annotation.text);
                }
            }
        });
    };

    this.goToEnd = function(player) {
        player.fullscreen(false);
        $state.transitionTo('experience.end', $stateParams);
    };

    this.annotationIsActive = function(annotation) {
         return self.activeAnnotations.indexOf(annotation) !== -1;
    };

    $scope.expCtrl = this;
}])

.controller('C6InputCtrl', ['$log', '$scope', '$rootScope', '$stateParams', '$state', function($log, $scope, $rootScope, $stateParams, $state) {
    var self = this;
    $log.log('Creating C6InputCtrl: ' + $stateParams.category);
    $rootScope.currentRoute = 'input';

    $scope.$watch('inputCtrl.currentPromptIndex()', function(newValue, oldValue) {
        $scope.$broadcast('newPrompt');
        if (newValue > oldValue) {
            $scope.inputCtrl.currentDirection = 'next';
        } else if (newValue < oldValue) {
            $scope.inputCtrl.currentDirection = 'previous';
        }
    });

    this.promptModel = $scope.appCtrl.promptModel;

    this.currentPrompt = this.promptModel? this.promptModel.prompts[0] : null;
    this.currentResponse = function() {
         return this.promptModel? this.promptModel.responses[this.currentPromptIndex()] : null;
    };
    this.currentResponseIsValid = function() {
         return (this.currentResponse() && this.promptModel.validations[this.currentPromptIndex()])? true : false;
    };
    this.currentPromptIndex = function() {
         return this.promptModel? this.promptModel.prompts.indexOf(this.currentPrompt) : null;
    };
    this.totalPrompts = function() {
         return this.promptModel? this.promptModel.prompts.length : null;
    };
    this.currentDirection = null;
    this.nextQuestion = function() {
        this.currentPrompt = this.promptModel.prompts[this.currentPromptIndex() + 1];
    };
    this.prevQuestion = function() {
         this.currentPrompt = this.promptModel.prompts[this.currentPromptIndex() - 1];
    };
    this.canGoBack = function() {
         return this.currentPromptIndex();
    };
    this.isDone = function() {
         return (this.currentPromptIndex() === this.totalPrompts() - 1);
    };
    this.canGoForward = function() {
         return (!this.isDone() && this.currentResponse());
    };

    this.startExperience = function() {
        $scope.$broadcast('experienceStart');
        $state.transitionTo('experience.video', $stateParams);
    };

    $scope.inputCtrl = this;

    $scope.$watch('appCtrl.promptModel', function(promptModel) {
        self.promptModel = promptModel;
        self.currentPrompt = promptModel? promptModel.prompts[0] : null;
    });
}])

.controller('C6VideoCtrl', ['$log', '$scope', '$rootScope', function($log, $scope, $rootScope) {
    $log.log('Creating C6ExperienceCtrl');
    $rootScope.currentRoute = 'experience';
}])

.controller('C6EndCtrl', ['$log', '$scope', '$window', '$rootScope', 'C6AnnotationsService', 'site',
            function($log, $scope, $window, $rootScope, annSvc, site) {
            
    $log.log('Creating C6EndCtrl');
    $rootScope.currentRoute = 'end';

    var self = this;
    this.lastAnnotation = null;
    self.sharedUrl = null;
    self.sharedMsg = 'Check out this Screenjack I made!';

    // Called by share buttons. Will ask the site to complete the share action.
    this.share = function() {
        var shareExp = angular.copy($scope.appCtrl.experience);
        shareExp.data.responses = $scope.appCtrl.promptModel.responses;
        shareExp.data.annotations.forEach(function(annotation) {
            if (annotation.options && annotation.options.type === 'talkie') {
                shareExp.data.sharedSrc = $scope.appCtrl.expData.src;
                shareExp.data.src = null;
            }
        });
        shareExp.data.content_type = 'usergen';
        shareExp.appUri = shareExp.appUri.replace(/wizard$/, 'usergen');
        site.shareUrl(shareExp);
    };

    $scope.$watch('appCtrl.annotationsModel', function(annotationsModel) {
        if (annotationsModel) {
            var lastAnnotation = annotationsModel.annotations[annotationsModel.annotations.length - 1];

            if (!lastAnnotation.text) {
                lastAnnotation.text = annSvc.interpolate(lastAnnotation.template, $scope.appCtrl.promptModel.responses);
            }

            $scope.endCtrl.lastAnnotation = lastAnnotation;
        }
    });
    $scope.endCtrl = this;
}]);
})();
