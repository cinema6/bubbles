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
.controller('C6AppCtrl', ['$log', '$scope', '$location', '$routeParams', function($log, $scope, $location, $routeParams) {
	$log.log('Creating C6AppCtrl');
	var self = this;
	
	this.experience = null;
	this.inExperience = false;
	this.goToRoute = function(route) {
		$location.path(route);
	}
	this.category = function() {
		return $routeParams.category;
	}
	
	$scope.appCtrl = this;
	
	$scope.$on('$routeChangeSuccess', function() {
		if (!$location.path().match(/\/experience/) && self.inExperience) {
			self.inExperience = false;
		}
	});
}])
.controller('C6CategoryListCtrl',['$log','$scope', '$rootScope',
                                        'c6VideoListingService', function($log,$scope,$rootScope,vsvc){
    $log.log('Creating cCategoryListCtrl');
	$rootScope.currentRoute = 'categories';
	
	$scope.appCtrl.experience = null;
	
    var obj = vsvc.getCategories();
    $scope.categories = obj.categories;
}])
.controller('C6InputCtrl', ['$log', '$scope', '$rootScope', '$routeParams', 'c6VideoListingService', function($log, $scope, $rootScope, $routeParams, vsvc) {
    $log.log('Creating C6InputCtrl: ' + $routeParams.category);
	$rootScope.currentRoute = 'input';

	$scope.$watch('inputCtrl.currentPromptIndex()', function(newValue, oldValue) {
		if (newValue > oldValue) {
			$scope.inputCtrl.currentDirection = 'next';
		} else if (newValue < oldValue) {
			$scope.inputCtrl.currentDirection = 'previous';
		}
	});
	
    $scope.appCtrl.experience = $scope.appCtrl.experience? $scope.appCtrl.experience : vsvc.getExperienceByCategory($routeParams.category);
    
    this.promptModel = new PromptModel($scope.appCtrl.experience);
    if ($scope.appCtrl.experience.responses) { this.promptModel.responses = $scope.appCtrl.experience.responses; }
    
    this.currentPrompt = this.promptModel.prompts[0];
    this.currentResponse = function() {
	    return this.promptModel.responses[this.currentPromptIndex()];
    }
    this.currentPromptIndex = function() {
	    return this.promptModel.prompts.indexOf(this.currentPrompt);
    }
    this.totalPrompts = function() {
	    return this.promptModel.prompts.length;
    }
    this.currentDirection = null;
    this.nextQuestion = function() {
	    this.currentPrompt = this.promptModel.prompts[this.currentPromptIndex() + 1];
    }
    this.prevQuestion = function() {
	    this.currentPrompt = this.promptModel.prompts[this.currentPromptIndex() - 1];
    }
    this.canGoBack = function() {
	    return this.currentPromptIndex();
    }
    this.isDone = function() {
	    return (this.currentPromptIndex() === this.totalPrompts() - 1);
    }
    this.canGoForward = function() {
	    return (!this.isDone() && this.currentResponse());
    }
    this.startExperience = function() {
		$scope.$broadcast('experienceStart');
    	$scope.appCtrl.experience.responses = this.promptModel.responses;
	    $scope.appCtrl.goToRoute('/entry/' + $routeParams.category + '/experience');
    }
    
    $scope.inputCtrl = this;
}])
.controller('C6ExperienceCtrl', ['$log', '$scope', '$routeParams', 'c6VideoListingService', function($log, $scope, $routeParams, vsvc) {
    $log.log('Creating C6ExperienceCtrl');
    
    $scope.appCtrl.experience = $scope.appCtrl.experience? $scope.appCtrl.experience : vsvc.getExperienceByCategory($routeParams.category);
    
    $scope.appCtrl.inExperience = true;
}])
.controller('C6EndCtrl', ['$log', '$scope', '$rootScope', function($log, $scope, $rootScope) {
    $log.log('Creating C6EndCtrl');
	$rootScope.currentRoute = 'end';
	
	$scope.endCtrl = this;
}])
.controller('C6AnnotationsCtrl',['$log', '$scope', '$rootScope', '$location', '$routeParams', function($log, $scope, $rootScope, $location, $routeParams){
    $log.log('Creating C6AnnotationsCtrl');
    var self = this;
    
    var interpolate = function(tmpl,data) {
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

    var interpolateTemplates = function(data) {
        var annoLength = self.model.annotations.length;
        $log.info('Interpolate ' + annoLength + ' annotations with ' + data.length + ' responses.');
//       for (var x = 0; x < data.length; x++) {
//            $log.info('DATA[' + x + ']: [' + data[x] + ']');
//        }
        for (var i = 0; i < annoLength; i++) {
            var a = self.model.annotations[i];
            a.text = interpolate(a.template,data);
            $log.info('Annotation [' + i + ']: ' + a.text);
        }
    };
	
	$scope.$on('c6video-ready', function(event, player) {
		$scope.video = player;
	});
	
	$scope.$watch('appCtrl.experience', function(experience) {
		if (experience) { self.model = new AnnotationsModel($scope.appCtrl.experience); }
	});
	
	$scope.$watch('appCtrl.inExperience', function(yes) {
		if (yes) {
			$log.log('Starting experience.');
			$rootScope.currentRoute = 'experience';
			if ($scope.appCtrl.experience.responses) { interpolateTemplates($scope.appCtrl.experience.responses); }
		} else {
			$scope.video.player.pause();
		}
	});
	
	this.activeAnnotations = [];
	
	this.setActiveAnnotations = function(event, video) {
		var annotations = self.model.annotations,
			activeAnnotations = self.activeAnnotations,
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
					self.activeAnnotations[index] = annotation;
					$log.log('Activated annotation: ' + annotation.text);
				}
			} else {
				if (activeAnnotations[index]) {
					self.activeAnnotations.splice(index, 1);
					$log.log('Deactivated annotation: ' + annotation.text);
				}
			}
		});
	};
	
	this.goToEnd = function() {
		$location.path('/entry/' + $routeParams.category + '/end');
	}
    
    this.annotationIsActive = function(index) {
	    return this.activeAnnotations[index]? true : false;
    }
    
    $scope.annoCtrl = this;
}]);

})();
