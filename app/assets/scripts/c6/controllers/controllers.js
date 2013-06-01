(function(){

'use strict';

function PromptModel(experience) {
    var localException = function(msg) {
        return {
          'name'     : 'PromptModel',
          'message'  : (msg !== undefined) ? msg : 'Unspecified error.',
          'toString' : function() { return this.name + ': ' + this.message; }
        };
      };
    this.defSizeLimit    = (experience.defSizeLimit) ? experience.defSizeLimit : 30;
    this.prompts         = [];
    this.responses       = [];
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
                sizeLimit : this.defSizeLimit, 
            });
        }
        else {
            throw localException('Unknown question type: ' + typeof q);
        }
       this.responses.push(null);
    }
}

function AnnotationsModel(experience) {
    var localException = function(msg) {
        return {
          'name'     : 'AnnotationsModel',
          'message'  : (msg !== undefined) ? msg : 'Unspecified error.',
          'toString' : function() { return this.name + ': ' + this.message; }
        };
      };
    this.videoSrc        = experience.src;    
    this.annotations     = [];
    for (var i = 0; i < experience.annotations.notes.length; i++) {
        var a = experience.annotations.notes[i],
            n = { type : a.type, ts : a.ts, duration : a.duration, template : a.template, cls : a.cls,
            text : null, index : i
            };
        if (experience.annotations.options){
            if (!n.type) {
                n.type = experience.annotations.options.type;
            }
            if (!n.duration) {
                n.duration = experience.annotations.options.duration;
            }
            if (!n.cls) {
                var eCls = experience.annotations.options.cls;
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
            for (var j = 0; j < n.cls.length; j++) {
                n.cls[j] = n.cls[j].replace('${index}',n.index);
            }
        }
        
        if (!n.type){ throw localException('Missing Property (type): ' + JSON.stringify(a));} 
        if (!n.ts)  { throw localException('Missing Property (ts): ' + JSON.stringify(a));} 
        if (!n.duration) { throw localException('Missing Property (duration): ' + 
                JSON.stringify(a));} 
        if (!n.template){ throw localException('Missing Property (template): ' 
                + JSON.stringify(a));} 

        this.annotations.push(n);
    }
}

angular.module('c6.ctrl',['c6.svc'])
.controller('C6AppCtrl', ['$log', '$scope', '$location', function($log, $scope, $location) {
	$log.log('Creating C6AppCtrl');
	$scope.app = {};
	
	$scope.app.experience = null;
	$scope.app.inExperience = false;
	$scope.app.goToRoute = function(route) {
		$location.path(route);
	}
	
	$scope.$on('$routeChangeSuccess', function() {
		if ($location.path() === '/experience') {
			if (!$scope.app.experience) {
				$location.path('/');
			} else {
				$scope.app.inExperience = true;
			}
		} else {
			if ($scope.app.inExperience) {
				$scope.app.inExperience = false;
			}
		}
	});
}])
.controller('C6CategoryListCtrl',['$log','$scope', '$rootScope',
                                        'c6VideoListingService', function($log,$scope,$rootScope,vsvc){
    $log.log('Creating cCategoryListCtrl');
	$rootScope.currentRoute = 'categories';
    var obj = vsvc.getCategories();
    $scope.categories = obj.categories;
}])
.controller('C6InputCtrl', ['$log', '$scope', '$rootScope', '$routeParams', 'c6VideoListingService', function($log, $scope, $rootScope, $routeParams, vsvc) {
    $log.log('Creating C6InputCtrl: ' + $routeParams.category);
    $scope.input = {};
	$rootScope.currentRoute = 'input';
	
	$scope.$watch('input.currentPrompt', function(value) {
		$scope.$broadcast('newPrompt');
	});
	
    $scope.app.experience = vsvc.getExperienceByCategory($routeParams.category);
    
    $scope.input.promptModel = new PromptModel($scope.app.experience);
    console.log($scope.input.promptModel);
    
    $scope.input.currentPrompt = $scope.input.promptModel.prompts[0];
    $scope.input.currentResponse = function() {
	    return $scope.input.promptModel.responses[$scope.input.currentPromptIndex()];
    }
    console.log($scope.input.currentPrompt);
    $scope.input.currentPromptIndex = function() {
	    return $scope.input.promptModel.prompts.indexOf($scope.input.currentPrompt);
    }
    $scope.input.totalPrompts = function() {
	    return $scope.input.promptModel.prompts.length;
    }
    $scope.input.nextQuestion = function() {
	    $scope.input.currentPrompt = $scope.input.promptModel.prompts[$scope.input.currentPromptIndex() + 1];
    }
    $scope.input.prevQuestion = function() {
	    $scope.input.currentPrompt = $scope.input.promptModel.prompts[$scope.input.currentPromptIndex() - 1];
    }
    $scope.input.canGoBack = function() {
	    return $scope.input.currentPromptIndex();
    }
    $scope.input.isDone = function() {
	    return ($scope.input.currentPromptIndex() === $scope.input.totalPrompts() - 1);
    }
    $scope.input.canGoForward = function() {
	    return (!$scope.input.isDone() && $scope.input.currentResponse());
    }
    $scope.input.startExperience = function() {
    	$scope.app.experience.responses = $scope.input.promptModel.responses;
	    $scope.app.goToRoute('/experience');
    }
}])
.controller('C6EndCtrl', ['$log', '$scope', '$rootScope', function($log, $scope, $rootScope) {
    $log.log('Creating C6EndCtrl');
	$rootScope.currentRoute = 'end';
}])
.controller('C6AnnotationsCtrl',['$log', '$scope', '$rootScope', '$location', function($log, $scope, $rootScope, $location){
    $log.log('Creating C6AnnotationsCtrl');
    var self = this;
	$scope.anno = {};
	$scope.anno.activeAnnotations = [];
	
	$scope.$on('c6video-ready', function(event, player) {
		$scope.video = player;
		player.on('timeupdate', function(event, video) {
			var annotations = $scope.anno.model.annotations,
				activeAnnotations = $scope.anno.activeAnnotations,
				time = video.player.currentTime,
				ts,
				duration,
				index;
			
			annotations.forEach(function(annotation) {
				ts = annotation.ts;
				duration = annotation.duration;
				index = annotation.index;
				
				if (time >= ts && time <= (ts + duration)) {
					if (!activeAnnotations[index]) {
						$scope.anno.activeAnnotations[index] = annotation;
						$log.log('Activated annotation: ' + annotation.text);
					}
				} else {
					if (activeAnnotations[index]) {
						$scope.anno.activeAnnotations.splice(index, 1);
						$log.log('Deactivated annotation: ' + annotation.text);
					}
				}
			});
			if (time === video.player.duration) { $location.path('/end'); }
		});
	});
	
	$scope.$watch('app.experience', function(experience) {
		if (experience) { $scope.anno.model = new AnnotationsModel($scope.app.experience); }
	});
	
	$scope.$watch('app.inExperience', function(yes) {
		if (yes) {
			$rootScope.currentRoute = 'experience';
			self.interpolateTemplates($scope.app.experience.responses);
			$scope.video.player.currentTime = 0;
			$scope.video.player.play();
		} else {
			$scope.video.player.pause();
		}
	});
    
    $scope.anno.annotationIsActive = function(index) {
	    return $scope.anno.activeAnnotations[index]? true : false;
    }
    
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

    this.interpolateTemplates = function(data) {
        var annoLength = $scope.anno.model.annotations.length;
        $log.info('Interpolate ' + annoLength + ' annotations with ' + data.length + ' responses.');
//       for (var x = 0; x < data.length; x++) {
//            $log.info('DATA[' + x + ']: [' + data[x] + ']');
//        }
        for (var i = 0; i < annoLength; i++) {
            var a = $scope.anno.model.annotations[i];
            a.text = this.interpolate(a.template,data);
            $log.info('Annotation [' + i + ']: ' + a.text);
        }
    };
}]);

})();
