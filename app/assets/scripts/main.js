/*jshint -W080 */
var __C6_BUILD_VERSION__ = undefined,
    __C6_APP_BASE_URL__  = (__C6_BUILD_VERSION__ ? __C6_BUILD_VERSION__ : 'assets');
(function(){
'use strict';

require.config({
    baseUrl:  __C6_APP_BASE_URL__
});

var c6Scripts;
if (__C6_BUILD_VERSION__) {
    c6Scripts = [ 'scripts/c6app.min' ];
} else {
    c6Scripts = [   'scripts/c6/app',
                    'scripts/c6/services/services',
                    'scripts/c6/controllers/controllers',
                    'scripts/c6/directives/directives',
                    'scripts/c6/directives/videonode'
                    ];
}

require([   'lib/jquery/jquery.min',
            /*'lib/jqueryui/jquery-ui.min'*/], function(){

    require(['lib/angular/angular.min', 'assets/lib/c6media/c6lib.video.js'],function(){
        require(c6Scripts, function(){
            angular.bootstrap(document, ['c6.app']);
        });
    });
});

})();
