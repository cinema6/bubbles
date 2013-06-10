'use strict';
var _path       = require('path'),
    lrSnippet   = require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
    mountFolder = function (connect, dir) {
            return connect.static(require('path').resolve(dir));
    };

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var getPackageVersion = function() {
        var pkg       = grunt.file.readJSON(_path.join(__dirname,'package.json'));
        return 'v' + pkg.version.replace(/\./g,'_');
      },
      yeomanConfig = {
        app:    _path.join(__dirname,'app'),
        dist:   _path.join(__dirname,'dist'),
        version: getPackageVersion(),
        distVer: function() { return _path.join(this.dist, this.version); },
        angular : {
            'sourceDir' : _path.join(__dirname,'vendor','angular'),
            'buildDir'  : _path.join(__dirname,'vendor','angular','build'),
            'targetDir' : _path.join(__dirname,'app','assets','lib','angular')
          },
        jquery : {
            'sourceDir' : _path.join(__dirname,'vendor','jquery'),
            'buildDir'  : _path.join(__dirname,'vendor','jquery','dist'),
            'targetDir' : _path.join(__dirname,'app','assets','lib','jquery')
          },
        jqueryui : {
            'sourceDir' : _path.join(__dirname,'vendor','jqueryui'),
            'buildDir'  : _path.join(__dirname,'vendor','jqueryui','dist'),
            'targetDir' : _path.join(__dirname,'app','assets','lib','jqueryui')
          }
      };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      livereload: {
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/assets/views/{,*/}*.html',
          '{.tmp,<%= yeoman.app %>}/assets/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/assets/scripts/{,*/}*.js',
          '{.tmp,<%= yeoman.app %>}/assets/scripts/c6/{,*/}*.js',
          '<%= yeoman.app %>/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    bumpup: 'package.json',
    clean: {
      angular:  [ '<%= yeoman.angular.buildDir %>' ,'<%= yeoman.angular.targetDir %>' ] ,
      jquery:   [ '<%= yeoman.jquery.buildDir %>'  ,'<%= yeoman.jquery.targetDir %>' ] ,
      jqueryui: [ '<%= yeoman.jqueryui.buildDir %>','<%= yeoman.jqueryui.targetDir %>' ] ,
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp',
      local: '/usr/local/share/nginx/demos/screenjack'
    },
    sed: {
        index: {
            pattern: 'assets',
            replacement: '<%= yeoman.version %>',
            path: '<%= yeoman.dist %>/index.html'
        },
        main: {
            pattern: 'undefined',
            replacement: '\'<%= yeoman.version %>\'',
            path: '<%= yeoman.distVer() %>/scripts/main.js'
        }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/assets/scripts/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      },
      e2e: {
        configFile: 'test/karma-e2e.conf.js',
        singleRun: false
      }
    },
    concat: {
      dist: {
        files: {
          '.tmp/scripts/c6app.js' : [
            '<%= yeoman.app %>/assets/scripts/c6/app.js',
            '<%= yeoman.app %>/assets/scripts/c6/services/services.js',
            '<%= yeoman.app %>/assets/scripts/c6/controllers/controllers.js',
            '<%= yeoman.app %>/assets/scripts/c6/directives/directives.js',
            '<%= yeoman.app %>/assets/scripts/c6/directives/videonode.js'
          ]
        }
      }
    },
    cssmin: {
        dist:    {
                    expand: true,
                    flatten: true,
                    src:    ['<%= yeoman.app %>/assets/styles/{,*/}*.css'],
                    dest: '<%= yeoman.distVer() %>/styles/'
                 }
        },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
              expand: true,
              cwd: '<%= yeoman.app %>',
              src: ['*.html'],
              dest: '<%= yeoman.dist %>'
            },
            {
              expand: true,
              cwd: '<%= yeoman.app %>/assets',
              src: ['views/*.html'],
              dest: '<%= yeoman.distVer() %>'
            }
        ]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.distVer() %>/scripts/c6app.min.js': [
            '.tmp/scripts/c6app.js'
          ],
        }
      }
    },
    copy: {
      angular: {
        files: [{ expand: true, dot: true, cwd: '<%= yeoman.angular.buildDir %>',
          dest: '<%= yeoman.angular.targetDir %>', src: [ '*.js', 'version.*' ] }]
      },
      jquery: {
        files: [{ expand: true, dot: true, cwd: '<%= yeoman.jquery.buildDir %>',
          dest: '<%= yeoman.jquery.targetDir %>', src: [ '*.js', 'version.*' ] }]
      },
      jqueryui: {
        files: [{ expand: true, dot: true, cwd: '<%= yeoman.jqueryui.buildDir %>',
          dest: '<%= yeoman.jqueryui.targetDir %>', src: [ '*.js', 'version.*' ] }]
      },
      dist: {
        files: [{
              expand: true,
              dot: true,
              cwd: '<%= yeoman.app %>',
              dest: '<%= yeoman.dist %>',
              src: [
                '*.{ico,txt}',
                '.htaccess'
              ]
          },
          {
              expand: true,
              dot: true,
              cwd: '<%= yeoman.app %>/assets',
              dest: '<%= yeoman.distVer() %>',
              src: [
                'img/**',
                'media/**',
                'lib/**',
                'scripts/main.js'
              ]
        }]
      },
      local:    {
        files:  [{
              expand : true,
              dot    : true,
              cwd    : _path.join(__dirname,'dist'),
              src    : ['**'],
              dest   : '/usr/local/share/nginx/demos/screenjack'
              }]
        }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('updatePackageVersion', function(){
    var yeocfg     = grunt.config.get('yeoman');
    yeocfg.version = getPackageVersion();
    grunt.config.set('yeoman',yeocfg);
    grunt.log.writeln('Package Version is: ' + yeocfg.version);
  });

  grunt.registerTask('server', [
    'clean:server',
    'livereload-start',
    'connect:livereload',
    'open',
    'watch'
  ]);

  grunt.registerTask('test', [
    //'jshint',
   'clean:server',
    'livereload-start',
    'connect:livereload',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'test',
    'cssmin',
    'htmlmin',
    'concat',
    'copy:dist',
    'uglify'
  ]);

  grunt.registerTask('release',function(type){
    type = type ? type : 'patch';
    grunt.task.run('clean:dist');
    grunt.task.run('test');
    grunt.task.run('bumpup:' + type);
    grunt.task.run('updatePackageVersion');
    grunt.task.run('cssmin');
    grunt.task.run('htmlmin');
    grunt.task.run('concat');
    grunt.task.run('copy:dist');
    grunt.task.run('uglify');
    grunt.task.run('sed');
    grunt.task.run('clean:local');
    grunt.task.run('copy:local');
  });

  grunt.registerTask('default', ['release']);
  /*****************************************************
   * Vendor submodules
   */
  function npmInstallAndGrunt(fnComplete,sourceDir,gruntArgs) {
      (function(done){
              var opts = {
                cmd : 'npm',
                args : ['install'],
                opts : {
                  cwd : sourceDir,
                  env : process.env
                }
              };
              grunt.util.spawn( opts, function(error, result, code) {
                  if ((error) || (code)) {
                    grunt.log.errorlns('npm install returns: error=' + error +
                                        ', result=' + result +
                                        ', code=' + code);
                    done(false);
                    return;
                  }
                  opts = {
                    cmd : 'grunt',
                    args : gruntArgs,
                    opts : {
                      cwd : sourceDir,
                      env : process.env
                    }
                  };
                  grunt.util.spawn( opts, function(error, result, code) {
                    if ((error) || (code)) {
                      grunt.log.errorlns('grunt package returns: error=' + error +
                                          ', result=' + result +
                                          ', code=' + code);
                    }
                    done(!error);
                  });
                });
            })(fnComplete);
    }

  // Angular
  grunt.registerTask('angular.build',   'Build angular', function(){
      /*jshint validthis:true */
      grunt.log.writeln('Building angular');
      npmInstallAndGrunt(this.async(),
          grunt.config.get('yeoman.angular.sourceDir'),['package']);
  });
  grunt.registerTask('angular.clean',   'Remove angular source & target dist',
                                                                  ['clean:angular']);
  grunt.registerTask('angular.install', 'Install angular', ['copy:angular']);
  grunt.registerTask('angular',         'Build and install angular',
          ['angular.clean','angular.build','angular.install']);

  // Jquery
  grunt.registerTask('jquery.build',   'Build jquery', function(){
      /*jshint validthis:true */
      grunt.log.writeln('Building jquery');
      npmInstallAndGrunt(this.async(),
          grunt.config.get('yeoman.jquery.sourceDir'));
  });
  grunt.registerTask('jquery.clean',   'Remove jquery source & target dist',
                                                                  ['clean:jquery']);
  grunt.registerTask('jquery.install', 'Install jquery', ['copy:jquery']);
  grunt.registerTask('jquery',         'Build and install jquery',
          ['jquery.clean','jquery.build','jquery.install']);

  // JqueryUI
  grunt.registerTask('jqueryui.build',   'Build jqueryui', function(){
      /*jshint validthis:true */
      grunt.log.writeln('Building jqueryui');
      npmInstallAndGrunt(this.async(),
          grunt.config.get('yeoman.jqueryui.sourceDir'),['build']);
  });
  grunt.registerTask('jqueryui.clean',   'Remove jqueryui source & target dist',
                                                                  ['clean:jqueryui']);
  grunt.registerTask('jqueryui.install', 'Install jqueryui', ['copy:jqueryui']);
  grunt.registerTask('jqueryui',         'Build and install jqueryui',
          ['jqueryui.clean','jqueryui.build','jqueryui.install']);

  // All vendor
  grunt.registerTask('vendor',['angular','jquery','videojs']);
};
