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
					.state('experience.randomInput', {
						controller: 'C6RandomCategoryCtrl',
						url: '/:category'
					})
					.state('experience.input', {
						templateUrl: __C6_APP_BASE_URL__ + '/views/input' + (env.browser.isMobile? '_mobile' : '') + '.html',
						controller: 'C6InputCtrl',
						url: '/:category/:expid'
					})
					.state('experience.video', {
						template: '<!-- Foo -->',
						controller: 'C6VideoCtrl',
						url: '/:category/:expid/video'
					})
					.state('experience.end', {
						templateUrl: __C6_APP_BASE_URL__ + '/views/end.html',
						controller: 'C6EndCtrl',
						url: '/:category/:expid/end'
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
