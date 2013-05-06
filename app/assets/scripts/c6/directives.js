(function(){

'use strict';
angular.module('c6.dir',[]) 
.directive('c6VideoNode',['$log','$timeout','environment',
                        function($log,$timeout,environment) {
    return function(scope, iElement, iAttrs) {
        $log.log('Linking c6VideoNode: ' + iAttrs.c6VideoNode);
        var videoNodeId = iAttrs.c6VideoNode,
            videoElt    = iElement.find('video'),
            videoEltId;

        if (!videoNodeId) {
            // TODO: Do something better here.
            $log.error('c6VideoNode must have an id attribute!');
            return;
        }

        if (!videoElt) {
            // TODO: Do something better here.
            $log.error('Failed to find child video element in: ' + videoNodeId);
            return;
        }

        videoEltId = videoElt.attr('id');
        if (!videoEltId) {
            videoEltId = videoNodeId + '-video';
            videoElt.attr('id',videoEltId);
        }

        _V_(videoEltId).ready(function(){
            $log.info('Player for ' + videoEltId + ' is ready');
            var player          = this,
                _scope          = scope,
                videoNode;

            videoNode               = {
                videoNodeId   : videoNodeId,
                player        : player,
                el            : iElement,
                video         : iElement.find('video'),
                toString      : function() { return this.videoNodeId; }
            };

            var videoEventHandler = function(arg){
                var _videoNode  = videoNode,
                    eventType   = arg.type,
                    player      = this;
              
                if (arg.type === 'canplay') {
                    // If we are getting this event its because this is chrome and
                    // we need to work some magic to deal with a bug
                    $log.log('Implementing canplay trick for: ' + _videoNode);
                    player.muted(true);
                    player.play();
                    $timeout(function(){
                        player.pause();
                        player.currentTime(0);
                        player.muted(false);
                    },250);
                }

                if (arg.type !== 'timeupdate') {
                    $log.info('VideoEvent [' + _videoNode + ']: ' + arg.type);
                }

                if (arg.type === 'error') {
                    $log.error('caught a video error: ' + JSON.stringify(player.error()));
                }

                // The $apply call here should prompt angular to 
                // refresh any dom elements with a data binding
                // to our scope/model.
                if (environment.showPlayerData) {
                    _scope.$apply(function(){ });
                }
                // Re-forward the event along with the videoNode
                // associated with it.
                _scope.$emit('video-' +  eventType, _videoNode);
            };
            
            player.addEvent("timeupdate", videoEventHandler);
            player.addEvent("play", videoEventHandler);
            player.addEvent("pause",videoEventHandler);
            player.addEvent("ended",videoEventHandler);
            player.addEvent("durationchange",videoEventHandler);
            player.addEvent("progress",videoEventHandler);
            player.addEvent("loadstart",videoEventHandler);
            player.addEvent("loadeddata",videoEventHandler);
            player.addEvent("loadedmetadata",videoEventHandler);
            player.addEvent("loadedalldata",videoEventHandler);
            player.addEvent("resize",videoEventHandler);
            player.addEvent("error",videoEventHandler);
          
            if (environment.browser.app === 'chrome') {
                $log.log('Setup canplay trick for: ' + videoNode);
                player.addEvent("canplay",videoEventHandler);
            }
            
            _scope.$on('resetPlayers',function(){
                if (!player.paused()){
                    player.pause();
                }
                player.currentTime(0);
            });
          
            // When we see the videoNode's data update we'll point
            // the player to the video src for the new data
            var watchVar = ('model.experience');
            _scope.$watch(watchVar, function(newVal,oldVal) {
                if (newVal) {
                    player.src(newVal.src);
                    $log.info('Current Source Set [' + videoNode + ']: ['  + 
                                                        player.currentSrc() + ']');
                } else {
                    player.src(null);
                    player.currentSrc("");
                    $log.info('Clear source from ' + videoNode + ' [' +
                                                        player.currentSrc() + ']');
                }
            },true);
        });
    };
}]);


})();
