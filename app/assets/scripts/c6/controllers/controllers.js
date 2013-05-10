(function(){

'use strict';

function FillInModel(currentCategory, experience) {
    var localException = function(msg) {
        return {
          'name'     : 'FillInModel',
          'message'  : (msg !== undefined) ? msg : 'Unspecified error.',
          'toString' : function() { return this.name + ': ' + this.message; }
        };
      };
    this.currentCategory = currentCategory;
    this.id              = experience.id;
    this.title           = experience.title;
    this.defSizeLimit    = (experience.defSizeLimit) ? experience.defSizeLimit : 30;
    this.prompts         = [];
    this.responses       = [];
    this.annotations     = [];
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

    for (var i = 0; i < experience.annotations.length; i++) {
        var a = experience.annotations[i];
        if (!a.type)     { throw localException('Missing Property (type): ' + JSON.stringify(a));} 
        if (!a.ts)       { throw localException('Missing Property (ts): ' + JSON.stringify(a));} 
        if (!a.dur)      { throw localException('Missing Property (dur): ' + JSON.stringify(a));} 
        if (!a.plot)     { throw localException('Missing Property (plot): ' + JSON.stringify(a));} 
        if (!a.template) { throw localException('Missing Property (template): ' + JSON.stringify(a));} 

        this.annotations.push({
            type : a.type, ts : a.ts, dur : a.dur, plot : a.plot, template : a.template, text : null
        });
    }
}

angular.module('c6.ctl',['c6.svc'])
.controller('c6CategoryListCtrl',['$log','$scope',
                                        'c6VideoListingService', function($log,$scope,vsvc){
    $log.log('Creating cCategoryListCtrl');
    var obj = vsvc.getCategories();
    $scope.categories = [];
    obj.categories.forEach(function(cat){
        $scope.categories.push(cat);
    });
}])
.controller('c6FillInEntryCtrl',[   '$log',
                                    '$scope',
                                    '$routeParams',
                                    'c6VideoListingService',
                                        function($log,$scope,$routeParams,vsvc){

    $log.log('Creating c6FillInEntryCtrl: ' + $routeParams.category);
    
    var localException = function(msg) {
        return {
          'name'     : 'c6FillInEntryCtrl',
          'message'  : (msg !== undefined) ? msg : 'Unspecified error.',
          'toString' : function() { return this.name + ': ' + this.message; }
        };
      };

    this.model = new FillInModel($routeParams.category,
                                    vsvc.getExperienceByCategory($routeParams.category));



    this.complete = function(){
        for (var i = 0; i < this.model.experience.questions.length; i++) {
            $log.log(this.model.experience.questions[i] + ': ' +
                        this.model.responses[i]);
        }
    };

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

    this.interpolateTemplates = function() {
        for (var i = 0; i < this.model.annotations.length; i++) {
            var a = this.model.annotations[i];
            a.text = this.interpolate(a.template,this.model.responses);
        }
    };

    $scope.model = this.model;
    $scope.ctrl  = this;
}]);

})();
