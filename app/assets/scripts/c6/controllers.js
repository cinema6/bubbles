(function(){

'use strict';

function FillInModel(currentCategory, experience) {
    this.currentCategory = currentCategory;
    this.experience      = experience;
    this.responses       = [];
    for (var i = 0; i < this.experience.questions.length; i++) {
        this.responses[i] = null;
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
    }

    $scope.model = this.model;
    $scope.ctrl  = this;
}]);

})();
