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
    $log.log('Creating c6BubblesExp');
    return function(scope/*, iElement ,iAttrs*/) {
        $log.log('Linking c6BubblesExp');
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
            if (!scope.model.responses[currentIndex]){
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
                scope.$emit('promptsComplete');
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

            scope.$watch('model.responses[' + idx + ']',function(newVal){
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

        scope.$on('promptsComplete',function(){
            scope.ctrl.interpolateTemplates();
            var $video = angular.element('video');
            $video.removeClass('hidden');
            $video.play();
        });

        scope.$on('expReady',function(){
            $log.log('Ready: ' + questionElts.length);
            questionElts[currentIndex].removeClass('hidden');
        });

    };
}]);


})();
