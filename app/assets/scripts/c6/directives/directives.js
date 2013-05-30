/* global $ */
(function(){

'use strict';
angular.module('c6.dir.screenJack',[])
.directive('c6Resize', ['$window', function($window) {
	return function($scope, $element, $attrs) {
		$($window).resize(function() {
			// set variable dimensions for viewport
			var baseW = 1280,
				baseH = 684,
				fontSize = 28,
			
				//find current dimensions of window
				winH = $window.innerHeight,
				winW = $window.innerWidth,
			
				//find scale factor
				scaleH = winH / baseH,
				scaleW = winW / baseW,
				scaleFactor = Math.min(scaleH, scaleW);
			
			//apply new dimensions to viewport
			$element.find(".viewport").height(baseH * scaleFactor)
				.width(baseW * scaleFactor)
				.css("font-size", (fontSize * scaleFactor))
				.css("margin-top", ((baseH * scaleFactor) / -2))
				.css("margin-left", ((baseW * scaleFactor) / -2));
			
			//feed screen divs window dimensions
			$element.height(winH).width(winW);
		});
		
		//Resize content immediately when page is loded
		$($window).resize();
	}
}])

.directive('c6Question', [function(){
    return  function(scope,iElement, iAttrs) {
                if (iAttrs.c6Question) {
                    var pos = iAttrs.c6Question.replace(/\s+/g,'').split(',');
                    scope.$emit('onAddedQuestion',iElement,parseInt(pos[0]),
                                                            (pos[1] === 'true'));
                }
    };
}])
.directive('c6PromptInterface',['$log',function($log) {
    $log.log('Creating c6WordSelect');
    return {
        controller : 'c6PromptCtrl',
        link :       function(scope,iElt,iAttr,ctrl) {
            $log.log('Linking c6WordSelect');
            var prevElt = $('[name=prev]'),
                nextElt = $('[name=next]'),
                currentIndex = 0 ,
                questionElts = [],
                sigPromptStart = false;

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
                    questionElts[currentIndex].find('input').get(0).focus();
                    buttonStates();
                }
            };

            scope.nextQuestion = function(){
                if (currentIndex === questionElts.length - 1){
                    $log.log('Done wiht questions!');
                    iElt.addClass('hidden');
                    scope.$emit('promptsComplete',ctrl.model.responses);
                }
                else {
                    if ((sigPromptStart === false) && (currentIndex === 0)) {
                        sigPromptStart = true;
                        scope.$emit('promptsStart');
                    }
                    questionElts[currentIndex++].addClass('hidden');
                    questionElts[currentIndex].removeClass('hidden');
                    questionElts[currentIndex].find('input').get(0).focus();
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
                sigPromptStart = false;
                questionElts[currentIndex].removeClass('hidden');
                questionElts[currentIndex].find('input').get(0).focus();
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

            scope.$on('promptsStart',function(){
                vid.src(ctrl.model.videoSrc); 
            });
            
            scope.$on('promptsComplete',function(evt,responses){
                ctrl.interpolateTemplates(responses);
                iElt.find('li').each(function(idx,elt){
                    var $elt      = angular.element(elt),
                        note      = ctrl.model.annotations[idx];
                    note.cls.forEach(function(c){
                        $elt.addClass(c);
                    });
                    noteElts[('note' + note.index)] = $elt;
                });
                $(vid.player).removeClass('hidden');
                vid.player.play();
                vid.player.focus();
            });

            var fnActivate = function(note){
                var className   = 'note' + note.index,
                    $elt        = noteElts[className];
                $elt.removeClass('hidden');
                $log.info('Activate note: ' + className);
                currNotes.push(note);
            };

            var fnDeactivate = function(note){
                var className = 'note' + note.index,
                $elt = noteElts[className];
                $elt.addClass('hidden');
                for (var i = 0; i < currNotes.length; i++){
                    if (currNotes[i] === note){
                        $log.info('Remove note ' + note.index + ' from currnotes');
                        currNotes.splice(i,1);
                    }
                }

            };

            scope.$on('c6video-timeupdate',function(evt,vid){
                //$log.info(vid + ': ' + vid.player.currentTime);
                ctrl.timerUpdate(vid.player.currentTime,currNotes,fnActivate,fnDeactivate);
            });
        }
    };
}]);

})();
