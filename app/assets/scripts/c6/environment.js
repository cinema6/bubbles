(function(){

var browserVersion = (function(){
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    var isMobile = ua.match(/iPhone|iPod|iPad|Android/);
    var isIPad   = ua.match(/iPad/);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!== null){
        M[2]= tem[1];
    }

    if (M) {
        return { "app" : M[1].toLowerCase(), "version" : M[2], 
                 "isMobile": isMobile, "isIPad" : isIPad };
    } 

    return { "app" : N, "version" : navigator.appVersion };
})(),
    release_config = {
        "browser"           : browserVersion,
        "logging"           : [],
        "showPlayerData"    : false
    },
    debug_config = {
        "browser"           : browserVersion,
        "logging"           : ['error','warn','log','info'],
        "showPlayerData"    : true
    },
    app_config = release_config;
    if (window.location.toString().match(/\?debug$/)) {
        app_config = debug_config;
    }


angular.module('c6.environment', [] )
.constant('environment', app_config);

}());


