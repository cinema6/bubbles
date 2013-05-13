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
    for (var i = 0; i < experience.annotations.length; i++) {
        var a = experience.annotations[i];
        if (!a.type)     { throw localException('Missing Property (type): ' + JSON.stringify(a));} 
        if (!a.ts)       { throw localException('Missing Property (ts): ' + JSON.stringify(a));} 
        if (!a.dur)      { throw localException('Missing Property (dur): ' + JSON.stringify(a));} 
        if (!a.plot)     { throw localException('Missing Property (plot): ' + JSON.stringify(a));} 
        if (!a.template) { throw localException('Missing Property (template): ' + JSON.stringify(a));} 

        this.annotations.push({
            type : a.type, ts : a.ts, dur : a.dur, plot : a.plot, template : a.template, 
            text : null, index : i
        });
    }
}

angular.module('c6.ctrl',['c6.svc'])
.controller('c6CategoryListCtrl',['$log','$scope',
                                        'c6VideoListingService', function($log,$scope,vsvc){
    $log.log('Creating cCategoryListCtrl');
    var obj = vsvc.getCategories();
    $scope.categories = [];
    obj.categories.forEach(function(cat){
        $scope.categories.push(cat);
    });
}])
.controller('c6ExperienceCtrl', ['$log', '$scope', '$routeParams', 'c6VideoListingService',
                                        function($log,$scope,$routeParams,vsvc){
    $log.log('Creating c6ExperienceCtrl: ' + $routeParams.category);
    var experience = vsvc.getExperienceByCategory($routeParams.category);
    this.model = {
        id              : experience.id,
        title           : experience.title,
        category        : $routeParams.category
    };
    $scope.expCtrl = this;
    $scope._experience = experience;
}])
.controller('c6PromptCtrl',['$log','$scope',function($log,$scope){
    $log.log('Creating c6PromptCtrl');
    this.model = new PromptModel($scope._experience);
    $scope.promptCtrl  = this;
}])
.controller('c6AnnotationsCtrl',['$log', '$scope', function($log,$scope){
    $log.log('Creating c6AnnotationsCtrl');

    this.model = new AnnotationsModel($scope._experience);
    
    this.interpolate = function(tmpl,data) {
        var patt  = /\${(\d+)}/g,
            dataLen,
            match;

        if (!data) {
            return tmpl;
        }

        if ((data instanceof Array) === false) {
            throw new TypeError('Data parameter must be an array.'); 
        }

        dataLen = data.length;
        
        while((match = patt.exec(tmpl)) !== null) {
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
        var annoLength = this.model.annotations.length;
        $log.info('Interpolate ' + annoLength + ' annotations with ' + data.length + ' responses.');
        for (var i = 0; i < annoLength; i++) {
            var a = this.model.annotations[i];
            a.text = this.interpolate(a.template,data);
            $log.info('Annotation [' + i + ']: ' + a.text);
        }
    };

    this.timerUpdate = function(tm, currNotes, fnActivate, fnDeactivate){
        var currIdx = {};
        if (currNotes){
            if (currNotes instanceof Array) {
                currNotes.forEach(function(note){
                    if ((note.ts + note.dur) <= tm) {
                        fnDeactivate(note);
                    }
                    currIdx[note.index] = note;
                });
            } else {
                if ((currnote.ts + currNote.dur) <= tm) {
                    fnDeactivate(currNote);
                }
                currIdx[currNotes.index] = currNotes;
            }
        }
        this.model.annotations.forEach(function(note){
            if (!currIdx[note.index]){
                if ((note.ts <= tm) && ((note.ts + note.dur) > tm)) {
                    fnActivate(note);
                }
            }
        });
    };

    $scope.annoCtrl = this;
}]);

})();
