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
    this.prompts       = [];
    for (var i = 0; i < experience.prompts.length; i++) {
        var q = experience.prompts[i];
        if (q instanceof Object) {
            if (!q.query) {
                throw localException('question object must have a query!');
            }
           this.prompts[i] = {
                query : q.query,
                sizeLimit : (q.sizeLimit) ? q.sizeLimit : this.defSizeLimit,
                response : null
           }
        } 
        else if ((typeof q === 'string') || (q instanceof String)){
            this.prompts[i] = { query : q, sizeLimit : this.defSizeLimit, response: null }; 
        }
        else {
            throw localException('Unknown question type: ' + typeof q);
        }
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

    this.model = new FillInModel($routeParams.category,
                                    vsvc.getExperienceByCategory($routeParams.category));



    this.complete = function(){
        for (var i = 0; i < this.model.experience.questions.length; i++) {
            $log.log(this.model.experience.questions[i] + ': ' +
                        this.model.responses[i]);
        }
    };

    this.interpolate = function(tmpl,data) {
        var m = tmpl.match(/\$\{\d+\}/g);
        $log.log('m=' + m);
    }

    $scope.model = this.model;
    $scope.ctrl  = this;
}]);

})();
