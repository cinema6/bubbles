// Karma E2E configuration

// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
  '../app/assets/lib/jquery/jquery.min.js',
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  '../app/assets/lib/greensock/TimelineMax.min.js',
  '../app/assets/lib/greensock/TweenMax.min.js',
  '../app/assets/lib/c6media/c6lib.video.js',
  '../app/assets/lib/ui-router/angular-ui-router.js',
  'e2e/env.js',
  '../app/assets/scripts/c6/app.js',
  '../app/assets/scripts/c6/services/services.js',
  '../app/assets/scripts/c6/controllers/controllers.js',
  '../app/assets/scripts/c6/animations/animations.js',
  '../app/assets/scripts/c6/directives/directives.js',
  '../app/assets/scripts/c6/directives/videonode.js',
  'e2e/**/*.js'
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress'];

// web server port
port = 8080;

// cli runner port
runnerPort = 9101;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;

proxies =  {
  '/': 'http://localhost:9000'
};

urlRoot = '/__e2e/';