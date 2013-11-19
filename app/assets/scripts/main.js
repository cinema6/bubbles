/*jshint -W080, -W117 */
var __C6_BUILD_VERSION__ = undefined,
    __C6_APP_BASE_URL__  = (__C6_BUILD_VERSION__ ? __C6_BUILD_VERSION__ : 'assets');
(function(){
'use strict';

require.config({
    baseUrl:  __C6_APP_BASE_URL__
});

var c6 = window.c6,
    releaseConfig = {
        'release'           : true,
        'logging'           : [],
        'showPlayerData'    : false,
        'vidUrl'            : 'https://s3.amazonaws.com/c6media/src/screenjack/video/'
    },
    debugConfig = {
        'release'           : false,
        'logging'           : ['error','warn','log','info'],
        'showPlayerData'    : true,
        'vidUrl'            : 'https://s3.amazonaws.com/c6.dev/media/src/screenjack/video/'
    };

function extend(dest, src) {
    var keys = Object.keys(src),
        length = keys.length,
        key;

    while(length--) {
        key = keys[length];

        dest[key] = src[key];
    }

    return dest;
}

extend(c6.appConfig, ((c6.env === 'release') ? releaseConfig : debugConfig));

var libUrl = c6.libUrl.bind(window.c6),
    appScripts,
    libScripts = [
        libUrl('modernizr/modernizr.custom.71747.js'),
        libUrl('jquery/2.0.3-0-gf576d00/jquery.min.js'),
        libUrl('gsap/1.11.1-0-g4819f8a/TimelineMax.min.js'),
        libUrl('gsap/1.11.1-0-g4819f8a/TweenMax.min.js'),
        libUrl('angular/v1.1.5-0-g9a7035e/angular.min.js'),
        libUrl('ui-router/0.2.0-0-g818b0d6/angular-ui-router.min.js'),
        libUrl('c6ui/v1.0.0-0-gc527e0e/c6uilib.min.js'),
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
    appScripts = [   'scripts/c6app.min' ];
} else {
    appScripts = [   'scripts/c6/app',
                    'scripts/c6/services/services',
                    'scripts/c6/controllers/controllers',
                    'scripts/c6/animations/animations',
                    'scripts/c6/directives/directives'
                    ];
}
loadScriptsInOrder(libScripts, function() {
    var Modernizr = window.Modernizr;

    Modernizr.load({
        test: Modernizr.touch,
        nope: libUrl('c6ui/v1.2.4-0-g148dede/css/c6uilib--hover.min.css')
    });

    loadScriptsInOrder(appScripts, function() {
        angular.bootstrap(document, ['c6.app']);
    });
});

})();
