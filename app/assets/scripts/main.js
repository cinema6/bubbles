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
    c6Scripts = [ 'scripts/c6vs.min' ];
} else {
    c6Scripts = [   'scripts/c6/app', 
                    'scripts/c6/services',
                    'scripts/c6/controllers',
                    'scripts/c6/directives',
                    ];
}

require([   'lib/jquery/jquery.min',
            'lib/video-js/video.min'
            /*'lib/jqueryui/jquery-ui.min'*/], function(){

    require(['lib/angular/angular.min'],function(){
        require(c6Scripts, function(){
            angular.bootstrap(document, ['c6.app']);
        });
    });
});

})();
