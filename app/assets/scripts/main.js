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
        'vidUrl'            : 'http://cdn1.mutantplayground.com/src/screenjack/video/',
        'dubUrl'            : 'http://mutantplayground.com/dub',
        'dubInterval'       : 5,  // how often to check status of job (seconds)
        'dubTimeout'        : 45  // how long to wait until giving up on dub job (seconds)
    },
    betaConfig = {
        'release'           : false,
        'logging'           : ['error','warn','log','info'],
        'showPlayerData'    : true,
        'vidUrl'            : 'http://cdn1.mutantplayground.com/src/screenjack/video/',
        'dubUrl'            : 'http://beta.mutantplayground.com/dub',
        'dubInterval'       : 5,  // how often to check status of job (seconds)
        'dubTimeout'        : 45  // how long to wait until giving up on dub job (seconds)
    },
    debugConfig = {
        'release'           : false,
        'logging'           : ['error','warn','log','info'],
        'showPlayerData'    : true,
        'vidUrl'            : 'https://s3.amazonaws.com/c6.dev/media/src/screenjack/video/',
        'dubUrl'            : 'http://dv-api1.mutantplayground.com/dub',
        'dubInterval'       : 5,  // how often to check status of job (seconds)
        'dubTimeout'        : 45  // how long to wait until giving up on dub job (seconds)
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

var config = (function() {
    switch(c6.env) {
    case 'debug':
        return debugConfig;
    case 'staging':
        return betaConfig;
    case 'release':
        return releaseConfig;
    }
})();

extend(c6.appConfig, config);
c6.rootDomain = (function(w){
    var r = w.location.toString(), m = null;
    if (w.location.origin) {
        r = w.location.origin;
    }
    m = r.match(/(http[s]*:\/\/[^\/]*)/);
    if (m !== null && m !== undefined){
        r = m[0];
    }
    return r;

}(window));

if (c6.rootDomain.match(/\/\/(www\.)*mutantplayground.com/) !== null){
    ga('create', 'UA-44457821-2', 'mutantplayground.com');
} else {
    ga('create', 'UA-44457821-1', { 'cookieDomain' : 'none' });
}

var libUrl = c6.libUrl.bind(window.c6),
    appScripts,
    libScripts = [
        libUrl('modernizr/modernizr.custom.71747.js'),
        libUrl('jquery/2.0.3-0-gf576d00/jquery.min.js'),
        libUrl('gsap/1.11.2-0-g79f8c87/TimelineMax.min.js'),
        libUrl('gsap/1.11.2-0-g79f8c87/TweenMax.min.js'),
        libUrl('angular/v1.1.5-0-g9a7035e/angular.min.js'),
        libUrl('ui-router/0.2.0-0-g818b0d6/angular-ui-router.min.js'),
        libUrl('c6ui/v1.2.12-0-g08ccc1d/c6uilib.min.js'),
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
        nope: [
            libUrl('c6ui/v1.2.12-0-g08ccc1d/css/c6uilib--hover.min.css'),
            __C6_APP_BASE_URL__ + '/styles/Screenjack--hover.css'
        ]
    });

    loadScriptsInOrder(appScripts, function() {
        angular.bootstrap(document, ['c6.app']);
    });
});

})();
