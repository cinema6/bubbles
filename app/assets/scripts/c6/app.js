/*jshint -W117 */
(function(){
	'use strict';
	
    if (window.location.toString().match(/www\.cinema6\.com/) !== null){
        ga('create', 'UA-44457821-2', 'cinema6.com');
    } else {
        ga('create', 'UA-44457821-1', { 'cookieDomain' : 'none' });
    }

	var dependencies = [
		'ui.router',
		'c6.ui',
		'c6.ctrl',
		'c6.svc',
		'c6.anim',
		'c6.dir.screenJack'
	];

	angular.module('c6.app', dependencies)
		.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/');
			$stateProvider
				.state('landing_wizard', {
					templateUrl: __C6_APP_BASE_URL__ + '/views/wizard_landing.html',
					url: '/wizard'
				})
				.state('landing_usergen', {
				    templateUrl: __C6_APP_BASE_URL__ + '/views/usergen_landing.html',
				    url: '/usergen'
				})
				.state('experience', {
					templateUrl: __C6_APP_BASE_URL__ + '/views/experience.html',
					url: '/exp'
				})
					.state('experience.input', {
						templateUrl: __C6_APP_BASE_URL__ + '/views/input.html',
						controller: 'C6InputCtrl',
						url: '/input'
					})
					.state('experience.video', {
						template: '<!-- Foo -->',
						controller: 'C6VideoCtrl',
						url: '/video'
					})
					.state('experience.end', {
						templateUrl: __C6_APP_BASE_URL__ + '/views/end.html',
						controller: 'C6EndCtrl',
						url: '/end'
					});
		}])
		.config(['$provide', 'environment', function($provide, env) {
			$provide.decorator('$log', ['$delegate', function($delegate) {
				var key,
					value,
					logLevels = env.logging,
					dummyFunction = function() {};
				for (key in $delegate) {
					value = $delegate[key];

					if ((typeof value === 'function') && (logLevels.indexOf(key) === -1)) {
						$delegate[key] = dummyFunction;
					}
				}

				return $delegate;
			}]);
		}])
		.constant('appBaseUrl', __C6_APP_BASE_URL__)
		.constant('environment', window.c6.appConfig);
})();
