'use strict';
var fs          = require('fs-extra'),
    path        = require('path'),
    lrSnippet   = require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
    proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest,
    mountFolder = function (connect, dir) {
            return connect.static(require('path').resolve(dir));
    },
    os = require('os');

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var initProps = {
        prefix      : process.env.HOME,
        app         : path.join(__dirname,'app'),
        dist        : path.join(__dirname,'dist'),
        packageInfo : grunt.file.readJSON('package.json'),
        angular : {
            'sourceDir' : path.join(__dirname,'vendor','angular'),
            'buildDir'  : path.join(__dirname,'vendor','angular','build'),
            'targetDir' : path.join(__dirname,'app','assets','lib','angular')
          },
        jquery : {
            'sourceDir' : path.join(__dirname,'vendor','jquery'),
            'buildDir'  : path.join(__dirname,'vendor','jquery','dist'),
            'targetDir' : path.join(__dirname,'app','assets','lib','jquery')
          },
        jqueryui : {
            'sourceDir' : path.join(__dirname,'vendor','jqueryui'),
            'buildDir'  : path.join(__dirname,'vendor','jqueryui','dist'),
            'targetDir' : path.join(__dirname,'app','assets','lib','jqueryui')
          }
        };

    if ((process.env.HOME) && (fs.existsSync(path.join(process.env.HOME,'.aws.json')))){
        initProps.aws = grunt.file.readJSON(
                path.join(process.env.HOME,'.aws.json')
        );
    }

    initProps.version     = function(){
        return this.gitLastCommit.commit;
    };

    initProps.name        = function() {
        return this.packageInfo.name;
    };

    initProps.installDir = function() {
        return (this.name() + '.' +
                this.gitLastCommit.date.toISOString().replace(/\W/g,'') + '.' +
                this.gitLastCommit.commit);
    };
    initProps.installPath = function(){
        return (path.join(this.prefix, 'releases', this.installDir()));
    };
    initProps.linkPath = function(){
        return path.join(this.prefix, 'www' );
    };
    initProps.distVersionPath= function() {
        return path.join(this.dist, this.gitLastCommit.commit);
    };

    grunt.initConfig( {
        props: initProps,
        watch: {
            livereload: {
                files: [
                    '<%= props.app %>/{,*/}*.html',
                    '<%= props.app %>/assets/views/{,*/}*.html',
                    '{.tmp,<%= props.app %>}/assets/styles/{,*/}*.css',
                    '{.tmp,<%= props.app %>}/assets/scripts/{,*/}*.js',
                    '{.tmp,<%= props.app %>}/assets/scripts/c6/{,*/}*.js',
                    '<%= props.app %>/assets/media/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['livereload']
            }
        },
		express: {
			dev: {
				options: {
					port: 9000,
					script: 'express.js'
				}
			}
		},
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0'
            },
            proxies: [
              {
	        context: '/dub',
	        host: 'c6box.local',
	        port: 80,
	        https: false,
	        changeOrigin: false
              }
            ],
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            proxySnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, initProps.app)
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
                            mountFolder(connect, initProps.app)
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
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= props.dist %>/*',
                        '!<%= props.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        sed: {
            index: {
                pattern: 'assets',
                replacement: '<%= props.version() %>',
                path: '<%= props.dist %>/index.html'
            },
            index2: {
                pattern: 'ng-app="c6.app" ',
                replacement: '',
                path: '<%= props.dist %>/index.html'
            },
            main: {
                pattern: 'undefined',
                replacement: '\'<%= props.version() %>\'',
                path: '<%= props.distVersionPath() %>/scripts/main.js'
            },
            views: {
                pattern: 'assets',
                replacement: '<%= props.version() %>',
                path: '<%= props.distVersionPath() %>/views',
                recursive: true
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= props.app %>/assets/scripts/**/{,*/}*.js'
            ]
        },
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            },
            e2e: {
                configFile: 'test/karma-e2e.' + os.platform() + '.conf.js',
                singleRun: true
            }
        },
        concat: {
            dist: {
                files: {
                    '.tmp/scripts/c6app.js' : [
                        '<%= props.app %>/assets/scripts/c6/app.js',
                        '<%= props.app %>/assets/scripts/c6/services/services.js',
                        '<%= props.app %>/assets/scripts/c6/controllers/controllers.js',
                        '<%= props.app %>/assets/scripts/c6/directives/directives.js',
                        '<%= props.app %>/assets/scripts/c6/animations/animations.js'
                    ]
                }
            }
        },
        cssmin: {
            dist: {
                expand: true,
                flatten: true,
                src:    ['<%= props.app %>/assets/styles/{,*/}*.css'],
                dest:   '<%= props.distVersionPath() %>/styles/'
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/props/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= props.app %>',
                        src: ['*.html'],
                        dest: '<%= props.dist %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= props.app %>/assets',
                        src: ['views/*.html'],
                        dest: '<%= props.distVersionPath() %>'
                    }
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= props.distVersionPath() %>/scripts/c6app.min.js': [
                        '.tmp/scripts/c6app.js'
                    ],
                }
            }
        },
        copy: {
            angular: {
                files: [{ expand: true, dot: true, cwd: '<%= props.angular.buildDir %>',
                dest: '<%= props.angular.targetDir %>', src: [ '*.js', 'version.*' ] }]
            },
            jquery: {
                files: [{ expand: true, dot: true, cwd: '<%= props.jquery.buildDir %>',
                dest: '<%= props.jquery.targetDir %>', src: [ '*.js', 'version.*' ] }]
            },
            jqueryui: {
                files: [{ expand: true, dot: true, cwd: '<%= props.jqueryui.buildDir %>',
                dest: '<%= props.jqueryui.targetDir %>', src: [ '*.js', 'version.*' ] }]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= props.app %>',
                        dest: '<%= props.dist %>',
                        src: [
                          '*.{ico,txt}',
                          '.htaccess'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= props.app %>/assets',
                        dest: '<%= props.distVersionPath() %>',
                        src: [
                          'img/**',
                          'media/**',
                          'lib/**',
                          'experiences/**',
                          'scripts/main.js'
                        ]
                    }
                ]
            },
            release:    {
                files:  [
                    {
                        expand : true,
                        dot    : true,
                        cwd    : path.join(__dirname,'dist'),
                        src    : ['**'],
                        dest   : '<%= props.installPath() %>',
                    }
                ]
            }
        },
        s3: {
            options: {
                key:    '<%= props.aws.accessKeyId %>',
                secret: '<%= props.aws.secretAccessKey %>',
                bucket: 'demos.cinema6.com',
                access: 'public-read',
                maxOperations: 4
            },
            demo: {
                upload: [
                    {
                        src: 'dist/**',
                        dest: 'screenjack/',
                        rel : 'dist/'
                    },
                    {
                        src: 'dist/index.html',
                        dest: 'screenjack/index.html',
                        headers : { 'cache-control' : 'max-age=0' }
                    }
                ]
            },
            devtest: {
                options: {
                    bucket: 'c6.dev',
                },
                upload: [
                    {
                        src: 'dist/**',
                        dest: 'test/screenjack/',
                        rel : 'dist/'
                    },
                    {
                        src: 'dist/index.html',
                        dest: 'test/screenjack/index.html',
                        headers : { 'cache-control' : 'max-age=0' }
                    }
                ]
            }
        },
        link : {
            options : {
                overwrite: true,
                force    : true,
                mode     : '755'
            },
            www : {
                target : '<%= props.installPath() %>',
                link   : path.join('<%= props.linkPath() %>','<%= props.name() %>')
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('server', [
        'clean:server',
        'configureProxies',
        'livereload-start',
        'express:dev',
        'open',
        'watch'
    ]);

     grunt.registerTask('test', [
        'jshint',
        'clean:server',
        'livereload-start',
        'connect:livereload',
        'karma:unit'
     ]);

     grunt.registerTask('build', [
        'gitLastCommit',
        'clean:dist',
        'cssmin',
        'htmlmin',
        'concat',
        'copy:dist',
        'uglify',
        'sed'
    ]);

    grunt.registerTask('release',function(type){
        type = type ? type : 'patch';
    //    grunt.task.run('test');
        grunt.task.run('build');
    });

    grunt.registerTask('publish',function(type){
        grunt.task.run('build');
        grunt.task.run('s3:demo');
    });

    grunt.registerTask('default', ['release']);

    grunt.registerTask('mvbuild', 'Move the build to a release folder.', function(){
        if (grunt.config.get('moved')){
            grunt.log.writeln('Already moved!');
            return;
        }
        var props = grunt.config.get('props'),
            installPath = props.installPath();
        grunt.log.writeln('Moving the module to ' + installPath);
        grunt.task.run('copy:release');
        grunt.config.set('moved',true);
    });

    grunt.registerMultiTask('link', 'Link release apps.', function(){
        var opts = grunt.config.get('link.options'),
            data = this.data;

        if (!opts) {
            opts = {};
        }

        if (!data.options){
            data.options = {};
        }

        if (!opts.mode){
            opts.mode = '0755';
        }

        if (opts){
           Object.keys(opts).forEach(function(opt){
                if (data.options[opt] === undefined){
                    data.options[opt] = opts[opt];
                }
           });
        }

        if (data.options.overwrite === true){
            if (fs.existsSync(data.link)){
                grunt.log.writelns('Removing old link: ' + data.link);
                fs.unlinkSync(data.link);
            }
        }

        if (data.options.force){
            var linkDir = path.dirname(data.link);
            if (!fs.existsSync(linkDir)){
                grunt.log.writelns('Creating linkDir: ' + linkDir);
                grunt.file.mkdir(linkDir, '0755');
            }
        }

        grunt.log.writelns('Create link: ' + data.link + ' ==> ' + data.target);
        fs.symlinkSync(data.target, data.link);

        grunt.log.writelns('Make link executable.');
        fs.chmodSync(data.link,data.options.mode);

        grunt.log.writelns(data.link + ' is ready.');
    });

    grunt.registerTask('installCheck', 'Install check', function(){
        var props = grunt.config.get('props'),
            installPath = props.installPath();

        if (fs.existsSync(installPath)){
            grunt.log.errorlns('Install dir (' + installPath +
                                ') already exists.');
            return false;
        }
    });

    grunt.registerTask('install', [
        'gitLastCommit',
        'installCheck',
        'release',
        'mvbuild',
        'link',
        'installCleanup'
    ]);

    grunt.registerTask('installCleanup', [
        'gitLastCommit',
        'rmbuild'
    ]);

    grunt.registerTask('rmbuild','Remove old copies of the install',function(){
        this.requires(['gitLastCommit']);
        var props       = grunt.config.get('props'),
            installBase = props.name(),
            installPath = props.installPath(),
            installRoot = path.dirname(installPath),
            pattPart = new RegExp(installBase),
            pattFull = new RegExp(installBase +  '.(\\d{8})T(\\d{9})Z'),
            history     = grunt.config.get('rmbuild.history'),
            contents = [];

        if (history === undefined){
            history = 2;
        }
        grunt.log.writelns('Max history: ' + history);

        fs.readdirSync(installRoot).forEach(function(dir){
            if (pattPart.test(dir)){
                contents.push(dir);
            }
        });

        if (contents){
            var sorted = contents.sort(function(A,B){
              var  mA = pattPart.exec(A),
                   mB = pattPart.exec(B),
                   i;
               // The version is the same
               mA = pattFull.exec(A);
               mB = pattFull.exec(B);
               if (mA === null) { return 1; }
               if (mB === null) { return -1; }
               for (i = 1; i <= 2; i++){
                   if (mA[i] !== mB[i]){
                        return mA[i] - mB[i];
                   }
                }
               return 1;
            });
            while (sorted.length > history){
                var dir = sorted.shift();
                grunt.log.writelns('remove: ' + dir);
                fs.removeSync(path.join(installRoot,dir));
            }
        }
    });

    grunt.registerTask('gitLastCommit','Get a version number using git commit', function(){
        var props = grunt.config.get('props'),
            done = this.async(),
            handleVersionData = function(data){
                if ((data.commit === undefined) || (data.date === undefined)){
                    grunt.log.errorlns('Failed to parse version.');
                    return done(false);
                }
                data.date = new Date(data.date * 1000);
                props.gitLastCommit = data;
                grunt.log.writelns('Last git Commit: ' +
                    JSON.stringify(props.gitLastCommit,null,3));
                grunt.config.set('props',props);
                return done(true);
            };

        if (props.gitLastCommit){
            return done(true);
        }

        if (grunt.file.isFile('version.json')){
            return handleVersionData(grunt.file.readJSON('version.json'));
        }

        grunt.util.spawn({
            cmd     : 'git',
            args    : ['log','-n1','--format={ "commit" : "%h", "date" : "%ct" , "subject" : "%s" }']
        },function(err,result){
            if (err) {
                grunt.log.errorlns('Failed to get gitLastCommit: ' + err);
                return done(false);
            }
            handleVersionData(JSON.parse(result.stdout));
        });
    });

    grunt.registerTask('gitstatus','Make surethere are no pending commits', function(){
        var done = this.async();
        grunt.util.spawn({
            cmd     : 'git',
            args    : ['status','--porcelain']
        },function(err,result){
            if (err) {
                grunt.log.errorlns('Failed to get git status: ' + err);
                done(false);
            }
            if (result.stdout === '""'){
                grunt.log.writelns('No pending commits.');
                done(true);
            }
            grunt.log.errorlns('Please commit pending changes');
            grunt.log.errorlns(result.stdout.replace(/\"/g,''));
            done(false);
        });
    });
};
