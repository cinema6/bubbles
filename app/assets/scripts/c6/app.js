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
        return { 'app' : M[1].toLowerCase(), 'version' : M[2],
                 'isMobile': isMobile, 'isIPad' : isIPad };
    }

    return { 'app' : N, 'version' : navigator.appVersion };
})(),
    releaseConfig = {
        'browser'           : browserVersion,
        'logging'           : [],
        'showPlayerData'    : false
    },
    debugConfig = {
        'browser'           : browserVersion,
        'logging'           : ['error','warn','log','info'],
        'showPlayerData'    : true
    },
    appConfig = releaseConfig;
    if (window.location.toString().match(/\?debug$/)) {
        appConfig = debugConfig;
    }

var dependencies = [
    'ui.state',
    'c6.ctrl',
    'c6.svc',
    'c6.anim',
    'c6.dir.screenJack',
    'c6lib.video'
];

angular.module('c6.app', dependencies)
  .config(['$stateProvider', '$urlRouterProvider', 'environment', function ($stateProvider, $urlRouterProvider, env) {
    $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('landing', {
            templateUrl: __C6_APP_BASE_URL__ + '/views/landing.html',
            controller: 'C6LandingCtrl',
            url: '/'
        })
        .state('experience', {
            templateUrl: __C6_APP_BASE_URL__ + '/views/experience.html',
            url: '/categories'
        })
            .state('experience.categories', {
                templateUrl: __C6_APP_BASE_URL__ + '/views/categories.html',
                controller: 'C6CategoryListCtrl',
                url: '/'
            })
            .state('experience.input', {
                templateUrl: __C6_APP_BASE_URL__ + '/views/input' + (env.browser.isMobile? '_mobile' : '') + '.html',
                controller: 'C6InputCtrl',
                url: '/:category'
            })
            .state('experience.video', {
                template: '<!-- Foo -->',
                controller: 'C6VideoCtrl',
                url: '/:category/video'
            })
            .state('experience.end', {
                templateUrl: __C6_APP_BASE_URL__ + '/views/end.html',
                controller: 'C6EndCtrl',
                url: '/:category/end'
            });
  }])
  .constant('appBaseUrl', __C6_APP_BASE_URL__)
  .constant('environment', appConfig)
  .controller('MainCtrl', ['$scope',function ($scope) {
    $scope.stub = 'Hello from Stubby!';
  }]);

})();
