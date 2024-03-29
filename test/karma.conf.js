// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  '../app/assets/lib/angular/angular.js',
  '../app/assets/lib/ui-router/angular-ui-router.js',
  '../app/assets/lib/c6media/c6lib.video.js',
  '../app/assets/lib/c6ui/c6ui.js',
  '../app/assets/lib/c6ui/sfx/sfx.js',
  '../app/assets/lib/c6ui/events/emitter.js',
  '../app/assets/lib/c6ui/postmessage/postmessage.js',
  '../app/assets/lib/c6ui/site/site.js',
  '../app/assets/lib/angular/angular-mocks.js',
/*
  '../app/assets/lib/require/require.js',
  '../app/assets/scripts/main.js',
  '../app/assets/scripts/c6/app.js', 
*/
  '../app/assets/scripts/c6/services/services.js',
  '../app/assets/scripts/c6/controllers/controllers.js',
  '../app/assets/scripts/c6/directives/directives.js',
  'spec/**/*.js'
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress'];

// web server port
port = 8000;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
