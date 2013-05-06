(function(){
'use strict';
/*jshint -W117 */
var browserVersion = (function(){
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    var isMobile = ua.match(/iPhone|iPod|iPad|Android/);
    var isIPad   = ua.match(/iPad/);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!== null){
        M[2]= tem[1];
    }

    if (M) {
        return { "app" : M[1].toLowerCase(), "version" : M[2], 
                 "isMobile": isMobile, "isIPad" : isIPad };
    } 

    return { "app" : N, "version" : navigator.appVersion };
})(),
    release_config = {
        "browser"           : browserVersion,
        "logging"           : [],
        "showPlayerData"    : false
    },
    debug_config = {
        "browser"           : browserVersion,
        "logging"           : ['error','warn','log','info'],
        "showPlayerData"    : true
    },
    app_config = release_config;
    if (window.location.toString().match(/\?debug$/)) {
        app_config = debug_config;
    }

var dependencies = [
    'c6.ctl',
    'c6.svc',
    'c6.dir'
];

angular.module('c6.app', dependencies)
  .config(['$routeProvider',function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: __C6_APP_BASE_URL__ + '/views/categories.html',
        controller: 'c6CategoryListCtrl'
      })
      .when('/entry/:category', {
        templateUrl: __C6_APP_BASE_URL__ + '/views/entry.html',
        controller: 'c6FillInEntryCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .constant('appBaseUrl', __C6_APP_BASE_URL__)
  .constant('environment', app_config)
  .controller('MainCtrl', ['$scope',function ($scope) {
    $scope.stub = 'Hello from Stubby!';
  }]);

})();
