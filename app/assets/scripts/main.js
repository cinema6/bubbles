/*jshint -W080, -W117 */
var __C6_BUILD_VERSION__ = undefined,
    __C6_APP_BASE_URL__  = (__C6_BUILD_VERSION__ ? __C6_BUILD_VERSION__ : 'assets');
(function(){
'use strict';

require.config({
    baseUrl:  __C6_APP_BASE_URL__
});

var appScripts,
    scripts,
    c6uiScripts = [
        'lib/c6ui/c6ui',
        'lib/c6ui/imagepreloader/imagepreloader',
        'lib/c6ui/browser/user_agent',
        'lib/c6ui/computed/computed',
        'lib/c6ui/sfx/sfx',
        'lib/c6ui/events/emitter',
        'lib/c6ui/anicache/anicache',
        'lib/c6ui/postmessage/postmessage',
        'lib/c6ui/site/site',
        'lib/c6ui/controls/controls',
        'lib/c6ui/videos/video'
    ],
    libScripts = [
        'lib/jquery/jquery.min',
        'lib/greensock/TimelineMax.min',
        'lib/greensock/TweenMax.min',
        'lib/angular/angular.min',
        'lib/ui-router/angular-ui-router.min'
    ];

function loadScriptsInOrder(scriptsList, done) {
    if (scriptsList) {
        var script = scriptsList.shift();
        if (script) {
            require([script], function() {
                loadScriptsInOrder(scriptsList, done);
            });
            return;
        }
    }
    done();
}

if (__C6_BUILD_VERSION__) {
    scripts = [   'scripts/c6app.min' ];
} else {
    appScripts = [   'scripts/c6/app',
                    'scripts/c6/services/services',
                    'scripts/c6/controllers/controllers',
                    'scripts/c6/animations/animations',
                    'scripts/c6/directives/directives'
                    ];

    c6uiScripts.push.apply(c6uiScripts, appScripts);
    scripts = c6uiScripts;
}
require(['lib/modernizr/modernizr.custom.29953'], function() {
    var Modernizr = window.Modernizr;

    Modernizr.load({
        test: Modernizr.touch,
        nope: __C6_APP_BASE_URL__ + '/lib/c6ui/controls/controls--hover.css'
    });

    loadScriptsInOrder(libScripts, function() {
        loadScriptsInOrder(scripts, function() {
            angular.bootstrap(document, ['c6.app']);
        });
    });
});

})();
