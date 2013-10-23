/*jshint -W117 */
(function(){
	'use strict';

	var browserVersion = (function() {
		var N= navigator.appName, ua= navigator.userAgent, tem;
		var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
		var isMobile = ua.match(/iPhone|iPod|iPad|Android|Silk/);
		var isIPad   = ua.match(/iPad/);
		var isAndroid = ua.match(/Android|Silk/);

		if(M && (tem= ua.match(/version\/([\.\d]+)/i))!== null){
			M[2]= tem[1];
		}

		if (M) {
			return { 'app' : M[1].toLowerCase(), 'version' : M[2], 'isMobile': isMobile, 'isIPad' : isIPad, 'isAndroid' : isAndroid };
		}

		return { 'app' : N, 'version' : navigator.appVersion };
	})(),
		releaseConfig = {
		'release'           : true,
		'browser'           : browserVersion,
		'logging'           : [],
		'showPlayerData'    : false
		},
		debugConfig = {
		'release'           : false,
		'browser'           : browserVersion,
		'logging'           : ['error','warn','log','info'],
		'showPlayerData'    : true
		},
		appConfig = ((!window.location.host.match(/cinema6.com/i)) || (window.location.search.indexOf('debug=true') !== -1)) ? debugConfig : releaseConfig;

	var dependencies = [
		'ui.state',
		'c6.ui',
		'c6.ctrl',
		'c6.svc',
		'c6.anim',
		'c6.dir.screenJack'
	];

	angular.module('c6.app', dependencies)
		.config(['$stateProvider', '$urlRouterProvider', 'environment', function ($stateProvider, $urlRouterProvider, env) {
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
						templateUrl: __C6_APP_BASE_URL__ + '/views/input' + (env.browser.isMobile? '_mobile' : '') + '.html',
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
		.constant('environment', appConfig);
})();
