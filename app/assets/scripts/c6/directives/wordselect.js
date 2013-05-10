/* global $ */
(function(){

'use strict';
angular.module('c6.dir.wordSelect',[])
.directive('c6Question', [function(){
    return  function(scope,iElement, iAttrs) {
                if (iAttrs.c6Question) {
                    var pos = iAttrs.c6Question.replace(/\s+/g,'').split(',');
                    scope.$emit('onAddedQuestion',iElement,parseInt(pos[0]),
                                                            (pos[1] === 'true'));
                }
    };
}])
.directive('c6WordSelect',['$log',function($log) {
    $log.log('Creating c6WordSelect');
    return {
        controller : 'c6PromptCtrl',
        link :       function(scope,iElt,iAttr,ctrl) {
            $log.log('Linking c6WordSelect');
            var prevElt = $('[name=prev]'),
                nextElt = $('[name=next]'),
                currentIndex = 0 ,
                questionElts = [];

            scope.currQuestNo = function () { return currentIndex + 1; };
            scope.questionCount = function() { return questionElts.length; };
            prevElt.attr('disabled','disabled');
            nextElt.attr('disabled','disabled');

            var buttonStates = function(){
                if (currentIndex === 0) {
                    nextElt.text('Next');
                    prevElt.attr('disabled','disabled');
                } else
                if (currentIndex === (questionElts.length - 1)) {
                    nextElt.text('Done');
                } else {
                    if (prevElt.attr('disabled')){
                        prevElt.removeAttr('disabled');
                    }
                    if (nextElt.text() === 'Done') {
                        nextElt.text('Next');
                    }
                }
                if (!ctrl.model.responses[currentIndex]){
                    nextElt.attr('disabled','disabled');
                } else {
                    nextElt.removeAttr('disabled');
                }
            };
            scope.prevQuestion = function(){
                if (currentIndex > 0) {
                    questionElts[currentIndex--].addClass('hidden');
                    questionElts[currentIndex].removeClass('hidden');
                    buttonStates();
                }
            };

            scope.nextQuestion = function(){
                if (currentIndex === questionElts.length - 1){
                    $log.log('Done wiht questions!');
                    scope.$emit('promptsComplete',ctrl.model.responses);
                }
                else {
                    questionElts[currentIndex++].addClass('hidden');
                    questionElts[currentIndex].removeClass('hidden');
                    buttonStates();
                } 
            };

            scope.$on('onAddedQuestion',function(evt,elt,idx,last){
                questionElts.push(elt);
                if (last === true) {
                    scope.$emit('expReady');
                }

                scope.$watch('promptCtrl.model.responses[' + idx + ']',function(newVal){
                    if (currentIndex === idx) {
                        if (!newVal) {
                            if (!nextElt.attr('disabled')) {
                                nextElt.attr('disabled','disabled');
                            }
                        } else {
                            if (nextElt.attr('disabled')) {
                                nextElt.removeAttr('disabled'); 
                            }
                        }
                    }
                },true );

            });

            scope.$on('expReady',function(){
                $log.log('Ready with ' + questionElts.length + ' questions.');
                questionElts[currentIndex].removeClass('hidden');
            });
        }
    };
}])
.directive('c6AnnotationsPlayer',['$log',function($log) {
    $log.log('Creating c6AnnotationsPlay');
    return {
        controller : 'c6AnnotationsCtrl',
        link : function(scope,iElt,iAttr,ctrl) {
            $log.log('Link c6AnnotationsPlayer: ' + scope.expCtrl.model.title);
            var vid = scope.videos.player,
                noteElts = {},
                currNotes = [];

            $log.info('got the player: ' + vid);
            vid.loadSource(ctrl.model.videoSrc); 
            
            scope.$on('promptsComplete',function(evt,responses){
                ctrl.interpolateTemplates(responses);
                iElt.find('li').each(function(idx,elt){
                    var className = 'note' + idx,
                        $elt      = angular.element(elt);
                    $elt.addClass(className);
                    noteElts[className] = $elt;
                });
                vid.el.removeClass('hidden');
                vid.video().play();
            });

            var fnActivate = function(note){
                var className = 'note' + note.index,
                $elt = noteElts[className];
                $elt.removeClass('hidden');
                $log.info('Activate note: ' + className);
            };

            var fnDeactivate = function(note){


            };

            scope.$on('video-timeupdate',function(evt,vid){
                $log.info(vid + ': ' + vid.video().currentTime);
                ctrl.timerUpdate(vid.video().currentTime,currNotes,fnActivate,fnDeactivate);
            });
        }
    };
}]);

})();
