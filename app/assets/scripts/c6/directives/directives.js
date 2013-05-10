(function(){

'use strict';

function mediaErrorToString(e) {
    var result;
    switch(e.code) {
        case 0: result = "MEDIA_ERR_OK";   break;
        case 1: result = "MEDIA_ERR_ABORTED";   break;
        case 2: result = "MEDIA_ERR_NETWORK";   break;
        case 3: result = "MEDIA_ERR_DECODE";            break;
        case 4: result = "MEDIA_ERR_SRC_NOT_SUPPORTED"; break;
        default:
            result = "<unknown: " + state;
            break;
    }
    return result;
}

function totalTimeInRanges(tr) {
    var result = 0;
    for (var i =0; i < tr.length; i++) {
        result += (tr.end(i) - tr.start(i));
    }
    return result;
}

function addVideoEvents(v, videoEventHandler){
    v.addEventListener("abort",videoEventHandler,false);
    v.addEventListener("canplay",videoEventHandler,false);
    v.addEventListener("canplaythrough",videoEventHandler,false);
    v.addEventListener("duration",videoEventHandler,false);
    v.addEventListener("durationchanged",videoEventHandler,false);
    v.addEventListener("emptied",videoEventHandler,false);
    v.addEventListener("ended",videoEventHandler,false);
    v.addEventListener("loadeddata",videoEventHandler,false);
    v.addEventListener("loadedmetadata",videoEventHandler,false);
    v.addEventListener("loadstart",videoEventHandler,false);
    v.addEventListener("play",videoEventHandler,false);
    v.addEventListener("playing",videoEventHandler,false);
    v.addEventListener("progress",videoEventHandler,false);
    v.addEventListener("ratechanged",videoEventHandler,false);
    v.addEventListener("seeked",videoEventHandler,false);
    v.addEventListener("seeking",videoEventHandler,false);
    v.addEventListener("stalled",videoEventHandler,false);
    v.addEventListener("suspend",videoEventHandler,false);
    v.addEventListener("timeupdate",videoEventHandler,false);
    v.addEventListener("volumechanged",videoEventHandler,false);
    v.addEventListener("waiting",videoEventHandler,false);
}

function removeVideoEvents(v, videoEventHandler){
    v.removeEventListener("abort",videoEventHandler,false);
    v.removeEventListener("canplay",videoEventHandler,false);
    v.removeEventListener("canplaythrough",videoEventHandler,false);
    v.removeEventListener("duration",videoEventHandler,false);
    v.removeEventListener("durationchanged",videoEventHandler,false);
    v.removeEventListener("emptied",videoEventHandler,false);
    v.removeEventListener("ended",videoEventHandler,false);
    v.removeEventListener("loadeddata",videoEventHandler,false);
    v.removeEventListener("loadedmetadata",videoEventHandler,false);
    v.removeEventListener("loadstart",videoEventHandler,false);
    v.removeEventListener("play",videoEventHandler,false);
    v.removeEventListener("playing",videoEventHandler,false);
    v.removeEventListener("progress",videoEventHandler,false);
    v.removeEventListener("ratechanged",videoEventHandler,false);
    v.removeEventListener("seeked",videoEventHandler,false);
    v.removeEventListener("seeking",videoEventHandler,false);
    v.removeEventListener("stalled",videoEventHandler,false);
    v.removeEventListener("suspend",videoEventHandler,false);
    v.removeEventListener("timeupdate",videoEventHandler,false);
    v.removeEventListener("volumechanged",videoEventHandler,false);
    v.removeEventListener("waiting",videoEventHandler,false);
}


angular.module('c6.dir.videoNode',[])
.directive('c6Video',['$log','$timeout','environment', function($log,$timeout,environment) {
    return function(scope,iElt,iAttrs){
        $log.log('Linking c6Video');
        
        var videoNode               = {};
        videoNode.id                = iAttrs.c6Video ? iAttrs.c6Video : iAttrs.id;
        if (!videoNode.id) {
            throw new TypeError('c6Video directives need a unique id!');
        }
        videoNode.el                = iElt;
        videoNode.video             = function() { return this.el.get(0); }
        videoNode.userBufferHack    = false;
        videoNode.bufferedPercent   = function(){
            if (this.video().duration) {
                var buffsecs = Math.ceil(totalTimeInRanges(this.video.buffered));
                var res = (Math.round(100 * (buffsecs / Math.ceil(this.video.duration))) / 100);
                return res;
            }
            return 0;
        };
        videoNode.loadSource = function(newVal){
            if (newVal) {
                var loaded = false;
                newVal.forEach(function(vdata){
                    if ((loaded === false) && (videoNode.video().canPlayType(vdata.type))){
                        $log.log('Will attempt to load: ' + vdata.src);
                        if (environment.browser.needsChromeHack) {
                            $log.info('Needs Chrome Hack');
                            videoNode.useBufferHack = true;
                        }
                        videoNode.video().src = vdata.src;
                        videoNode.video().load();
                        loaded = true;
                    }
                });
                $log.info('Current Source Set [' + videoNode + ']: ['  + 
                                                    videoNode.video().currentSrc + ']');
            } else {
                // Do something if this goes away 
            }
        };
        videoNode.toString = function() { return 'c6Video [' + this.id + ']'; }

        var videoEventHandler = function(e){
            var _videoNode  = videoNode,
                _videoElt   = e.target,
                eventType   = e.type;
          
            if ((eventType === 'canplay') && _videoNode.useBufferHack) {
                // If we are getting this event its because this is chrome and
                // we need to work some magic to deal with a bug
                $log.log('Implementing canplay trick for: ' + _videoNode);
                _videoNode.useBufferHack = false;
                _videoElt.muted = true;
                _videoElt.play();
                $timeout(function(){
                    _videoElt.pause();
                    _videoElt.currentTime = 0;
                    _videoElt.muted = false;
                },250);
            }

            if (eventType !== 'timeupdate') {
                $log.info('VideoEvent [' + _videoNode + ']: ' + eventType);
            }

            if (eventType === 'error') {
                $log.error('caught a video error: ' + mediaErrorToString(_videoElt.error));
            }

            // The $apply call here should prompt angular to 
            // refresh any dom elements with a data binding
            // to our scope/model.
            if (environment.showPlayerData) {
                scope.$apply(function(){ });
            }
            // Re-forward the event along with the videoNode
            // associated with it.
            scope.$emit('video-' +  eventType, _videoNode);
        };

        addVideoEvents(videoNode.video(), videoEventHandler);
        if (!scope.videos) {
            scope.videos = {};
            scope.videos[videoNode.id] = videoNode;
        }
        $log.log('Created: ' + videoNode);
    };
}]);


})();
