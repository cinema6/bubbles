(function(){
'use strict';

// Holds data for text-to-speech lines
function TalkieModel(annotations, extension) {
    var options = annotations.options;
    this.options = {
        effect: options.effect,
        level: options.level,
        vid: options.vid + '.' + extension,
        voice: options.voice
    };
    this.annotations = [];

    annotations.notes.forEach(function(annotation) {
        var note = {
            ts: annotation.ts,
            template: annotation.template,
            text: null
        };
        this.annotations.push(note);
    }, this);
}

// Holds data for thought bubble annotations
function BubblesModel(annotations) {
    var localException = function(msg) {
        return {
          'name'     : 'AnnotationsModel',
          'message'  : (msg !== undefined) ? msg : 'Unspecified error.',
          'toString' : function() { return this.name + ': ' + this.message; }
        };
      };
    this.annotations     = [];
    this.sfx             = (annotations.options) ? annotations.options.sfx : null;
    for (var i = 0; i < annotations.notes.length; i++) {
        var a = annotations.notes[i],
            n = {   type : a.type, ts : a.ts, duration : a.duration, template : a.template,
                    cls : a.cls, text : null, index : i, tail: a.tail, sfx : a.sfx
            };
        if (annotations.options){
            if (!n.type) {
                n.type = annotations.options.type;
            }
            if (!n.duration) {
                n.duration = annotations.options.duration;
            }
            if (!n.sfx) {
                n.sfx = annotations.options.defaultSfx;
            }
            if (!n.cls) {
                var eCls = annotations.options.cls;
                if (eCls instanceof Array) {
                    var lenCls = eCls.length;
                    n.cls = [];
                    for (var j = 0; j < lenCls; j++) {
                        n.cls.push(eCls[j]);
                    }
                }
            }
        }

        if (n.cls instanceof Array) {
            for (var k = 0; k < n.cls.length; k++) {
                n.cls[k] = n.cls[k].replace('${index}',n.index);
            }
        }

        if (!n.type){ throw localException('Missing Property (type): ' + JSON.stringify(a));}
        if (!n.ts)  { throw localException('Missing Property (ts): ' + JSON.stringify(a));}
        if (!n.duration) { throw localException('Missing Property (duration): ' +
                JSON.stringify(a));}
        if (!n.template){ throw localException('Missing Property (template): ' +
            JSON.stringify(a));}

        this.annotations.push(n);
    }
}

angular.module('c6.svc',[])
.service('C6VideoControlsService', ['$timeout', function($timeout) {
    this.bind = function(video, delegate, controller) {
        var wasPlaying; // Used for seeking

        // Set up video events
        video
            .on('play', function() {
                controller.play();
            })
            .on('pause', function() {
                controller.pause();
            })
            .on('timeupdate', function(event, video) {
                var percent = (video.player.currentTime / video.player.duration) * 100;

                controller.progress(percent);
            })
            .on('progress', function(event, video) {
                controller.buffer(video.bufferedPercent() * 100);
            })
            .on('volumechange', function(event, video) {
                controller.muteChange(video.player.muted);
                controller.volumeChange(video.player.volume * 100);
            });

        // Set up delegate methods
        delegate.play = function() {
            video.player.play();
        };
        delegate.pause = function() {
            video.player.pause();
        };
        delegate.seekStart = function() {
            if (!video.player.paused) {
                wasPlaying = true;
                video.player.pause();
            }
        };
        delegate.seek = function(event) {
            video.player.currentTime = (event.percent * video.player.duration) / 100;
        };
        delegate.seekStop = function() {
            if (wasPlaying && video.player.paused) {
                $timeout(function() { video.player.play(); }, 200);
            }
            wasPlaying = undefined;
        };
        delegate.volumeSeek = function(percent) {
            video.player.volume = percent / 100;
        };
        delegate.mute = function() {
            video.player.muted = true;
        };
        delegate.unmute = function() {
            video.player.muted = false;
        };
    };
}])

.service('C6ResponseCachingService', ['$window', function($window) {
    if (!$window.localStorage) {
        $window.localStorage = {};
    }

    var data = JSON.parse($window.localStorage.responseCache || '{}'),
        writeToStorage = function() {
            $window.localStorage.responseCache = JSON.stringify(data);
        };

    this.sameResponses = function(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    };

    this.setResponses = function(responses, category, id) {
        data[category + '/' + id] = responses;
        writeToStorage();
    };

    this.getResponses = function(category, id) {
        return data[category + '/' + id] || null;
    };
}])

// Has functions for creating annotation models and interpolating responses with tempaltes
.service('C6AnnotationsService', ['c6VideoService', '$log', function(vidSvc, $log) {

    this.getAnnotationsModelByType = function(type, annotations) {
        var toReturn,
            Klass;

        if (type === 'bubble') {
            Klass = BubblesModel;
        } else if (type === 'talkie') {
            Klass = TalkieModel;
        }

        annotations.forEach(function(annoConfig) {
            if (annoConfig.options.type === type) {
                toReturn = new Klass(annoConfig, vidSvc.extensionForFormat(vidSvc.bestFormat()));
            }
        });
        return toReturn;
    };

    // Insert a response into a line template
    this.interpolate = function(tmpl,data) {
        var patt  = /\${(\d+)}/,
            dataLen,
            match;

        if (!data) {
            return tmpl;
        }

        if ((data instanceof Array) === false) {
            throw new TypeError('Data parameter must be an array.');
        }

        dataLen = data.length;
//        $log.info('Template:' + tmpl);
        while((match = patt.exec(tmpl)) !== null) {
//            $log.info('Match: ' + JSON.stringify(match));
            var idx = (match[1] - 1);
            if (idx < 0) {
                throw new RangeError('Template parameters should start at ${1}');
            }
            if (idx >= dataLen) {
                throw new RangeError('Invalid template parameter (too high): ' + match[0]);
            }
            tmpl = tmpl.replace(match[0],data[idx]);
        }
        return tmpl;
    };

    // Inserts responses into annotations
    this.interpolateAnnotations = function(annoModel, responses) {
        var annoLength = annoModel.annotations.length;
        $log.info('Interpolate ' + annoLength + ' annotations with ' + responses.length + ' responses.');
        for (var i = 0; i < annoLength; i++) {
            var a = annoModel.annotations[i];
            a.text = this.interpolate(a.template,responses);
            $log.info('Annotation [' + i + ']: ' + a.text);
        }

        return annoModel;
    };

}])

// Handles looking up text-to-speech videos (from a cache, S3, or dub)
.service('C6VideoLookupService', ['$log','$http','$q','environment','$timeout','$window',
                                  function($log,$http,$q,env,$timeout,$window) {
    var genVidUrlCache = {};

    // Check if the video url is in the genVidUrlCache object
    var haveCachedUrl = function(model) {
        var cache = genVidUrlCache,
            cachedModel = cache[model.options.vid] && cache[model.options.vid].model;

        return ((cachedModel ? true : false) && (function() {
            var newModelAnnotations = model.annotations;

            return cachedModel.annotations.every(function(annotation, index) {
                return annotation.text === newModelAnnotations[index].text;
            });
        })());
    };
    
    // Check that the sharedUrl points to an existent object on S3
    var verifySharedUrl = function(sharedUrl) {
        if (!sharedUrl) {
            return $q.reject();
        }
        $log.log('Checking shared url for video');
        return $http.head(sharedUrl);
    };
    
    // If you need to switch back to the dub v1 API, uncomment this and switch the reference in fetchText2SpeechVideoUrl
    /*var getDubVideoV1 = function(body) {
        body.version = 1;
        return $http.post(env.dubUrl + '/create', body).then(function(response) {
            return response.data.output;
        });
    };*/
    
    // Poll the dub service for the status of the current dub job
    var checkStatus = function(jobId, host) {
        var deferred = $q.defer(),
            statusUrl = env.dubUrl + '/status/' + jobId + '?host=' + host,
            timeout, interval, lastStep;
            
        interval = $window.setInterval(function() {
            $http.get(statusUrl).then(function(response) {
                if (response.status === 201) {
                    deferred.resolve(response.data.output);
                    $window.clearInterval(interval);
                    $timeout.cancel(timeout);
                } else if (response.status !== 202) {
                    deferred.reject('Error from /dub/status: ' + JSON.stringify(response.data));
                    $window.clearInterval(interval);
                    $timeout.cancel(timeout);
                } else {
                    lastStep = response.data.lastStatus.step;
                }
            }, function(error) {
                $window.clearInterval(interval);
                $timeout.cancel(timeout);
                deferred.reject('Error from /dub/status: ' + JSON.stringify(error));
            });
        }, env.dubInterval * 1000);
        
        timeout = $timeout(function() {
            $window.clearInterval(interval);
            deferred.reject('Timed out checking status of dub job ' + jobId + ' at host ' + host +
                            ', lastStep = ' + lastStep);
        }, env.dubTimeout * 1000);
        
        return deferred.promise;
    };
    
    // Post a create request to dub and deal with the response
    var getDubVideo = function(body) {
        body.version = 2;
        
        return $http.post(env.dubUrl + '/create', body).then(function(response) {
            if (response.status === 201) {
                return response.data.output;
            } else if (response.status !== 202) {
                return $q.reject('Error posting create job: ' + JSON.stringify(response.data));
            } else if (!response.data || !response.data.jobId || !response.data.host) {
                return $q.reject('Incomplete data from /dub/create: ' + JSON.stringify(response.data));
            } else {
                return checkStatus(response.data.jobId, response.data.host);
            }
        }, function(err) {
            return $q.reject('Error posting create job: ' + JSON.stringify(err.data));
        });
    };

    // Will first check a local cache, then attempt to verify the src url from the shared script
    // Then, if those fail, it will go to dub to create a video.
    this.fetchText2SpeechVideoUrl = function(model, sharedUrl) {
        var deferred = $q.defer();

        if (haveCachedUrl(model)) {
            $log.log('Already have a URL for these responses');
            deferred.resolve(genVidUrlCache[model.options.vid].url);
        } else {
            verifySharedUrl(sharedUrl).then(function() {
                deferred.resolve(sharedUrl);
                genVidUrlCache[model.options.vid] = { model: model, url: sharedUrl };
            }, function(error) {
                if (error) {
                    $log.error('Could not get shared url: ' + error);
                }
                $log.log('No video URL for these responses. Going to the server!');

                var requestBodyObject = {
                    video: model.options.vid,
                    tts: {
                        voice: model.options.voice,
                        effect: model.options.effect,
                        level: model.options.level
                    },
                    script: []
                };
                model.annotations.forEach(function(annotation) {
                    var line = {
                        ts: annotation.ts,
                        line: annotation.text
                    };
                    requestBodyObject.script.push(line);
                });

                getDubVideo(requestBodyObject).then(function(url) {
                    genVidUrlCache[model.options.vid] = { model: model, url: url };
                    deferred.resolve(url);
                }, function(error) {
                    $log.error(error);
                    return getDubVideo(requestBodyObject);  // retry once if we fail
                }).then(function(url) { 
                    genVidUrlCache[model.options.vid] = { model: model, url: url };
                    deferred.resolve(url);
                }, function(error) {
                    $log.error(error);
                    deferred.reject(error);
                });
            });
        }

        return deferred.promise;
    };
}])
    
.service('C6ResizeService', ['$window', '$log', function($window, $log) {
    var resizeFunctions = [];

    this.registerDirective = function(code) {
        if (resizeFunctions.indexOf(code) === -1) {
            resizeFunctions.push(code);
            $log.log('Registered new resizer. Current total is ' + resizeFunctions.length);
            code($window.innerWidth, $window.innerHeight);
        }
    };

    this.unregisterDirective = function(code) {
        var codesIndex = resizeFunctions.indexOf(code);

        resizeFunctions.splice(codesIndex, 1);
        $log.log('Unregistered new resizer. Current total is ' + resizeFunctions.length);
    };

    angular.element($window).bind('resize', function() {
        resizeFunctions.forEach(function(code) {
            code($window.innerWidth, $window.innerHeight);
        });
    });
}]);
})();
