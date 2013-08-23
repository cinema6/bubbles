/*jshint -W080, -W117 */
var __C6_BUILD_VERSION__ = undefined,
    __C6_APP_BASE_URL__  = (__C6_BUILD_VERSION__ ? __C6_BUILD_VERSION__ : 'assets');
(function(){
'use strict';

require.config({
    baseUrl:  __C6_APP_BASE_URL__
});

var c6Scripts;
if (__C6_BUILD_VERSION__) {
    c6Scripts = [   'scripts/c6app.min' ];
} else {
    c6Scripts = [   'scripts/c6/app',
                    'scripts/c6/services/services',
                    'scripts/c6/controllers/controllers',
                    'scripts/c6/animations/animations',
                    'scripts/c6/directives/directives'
                    ];
}

require([   'lib/jquery/jquery.min',
            'lib/greensock/TimelineMax.min',
            'lib/greensock/TweenMax.min'
            /*'lib/jqueryui/jquery-ui.min'*/], function(){

    require(['lib/angular/angular.min'],function(){
        require(['lib/c6ui/c6ui'], function() {
            require(['lib/c6ui/computed/computed'], function() {
				require(['lib/c6ui/sfx/sfx',
					'lib/c6ui/controls/controls',
					'lib/c6media/c6lib.video',
					'lib/ui-router/angular-ui-router.min'],function(){
					require(c6Scripts, function(){
						angular.bootstrap(document, ['c6.app']);
					});
				});
			});
        });
    });
});

})();
