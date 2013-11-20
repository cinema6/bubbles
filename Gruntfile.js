/* jshint node:true */
'use strict';
var fs           = require('fs-extra'),
    path         = require('path'),
    lrSnippet    = require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
    proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest,
    c6sandbox    = require('c6-sandbox'),
    mountFolder  = function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    },
    os = require('os'),
    myIp = (function(){
        var os=require('os'),
            ifaces=os.networkInterfaces(),
            result;
        for (var dev in ifaces) {
            if (dev.substr(0,3) === 'Loo'){
                continue;
            }
            ifaces[dev].forEach(function(details){
                if (details.family==='IPv4') {
                    result = details.address;
                }
            });
        }
        if (!result) {
            result = 'localhost';
        }

        return result;
    }());

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var initProps = {
        c6AppUrl    : 'http://' + myIp + ':9000/',
        contentPath : '/media/src/site/collateral/',
        prefix      : process.env.HOME,
        app         : path.join(__dirname,'app'),
        dist        : path.join(__dirname,'dist'),
        packageInfo : grunt.file.readJSON('package.json')
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
        settings: initProps,
        watch: {
            livereload: {
                files: [
                    '<%= settings.app %>/{,*/}*.html',
                    '<%= settings.app %>/assets/views/{,*/}*.html',
                    '{.tmp,<%= settings.app %>}/assets/styles/{,*/}*.css',
                    '{.tmp,<%= settings.app %>}/assets/scripts/{,*/}*.js',
                    '{.tmp,<%= settings.app %>}/assets/scripts/c6/{,*/}*.js',
                    '<%= settings.app %>/assets/media/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
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
            sandbox: {
                options: {
                    port: 8000,
                    middleware: function () {
                        return [c6sandbox({
                                    experiences: (function() {
                                        var experiences = grunt.file.readJSON(path.join(__dirname, 'app/assets/mock/experiences.json'));

                                        experiences.forEach(function(experience) {
                                            experience.appUriPrefix = initProps.c6AppUrl;
                                        });

                                        return experiences;
                                    })()
                               })];
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
                url: 'http://localhost:8000'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= settings.dist %>/*',
                        '!<%= settings.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        sed: {
            index: {
                pattern: 'assets',
                replacement: '<%= settings.version() %>',
                path: '<%= settings.dist %>/index.html'
            },
            index2: {
                pattern: 'ng-app="c6.app" ',
                replacement: '',
                path: '<%= settings.dist %>/index.html'
            },
            main: {
                pattern: 'undefined',
                replacement: '\'<%= settings.version() %>\'',
                path: '<%= settings.distVersionPath() %>/scripts/main.js'
            },
            templates: {
                pattern: 'assets',
                replacement: '<%= settings.version() %>',
                path: '.tmp/angular_templates/templates.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                '<%= settings.app %>/assets/scripts/**/{,*/}*.js'
            ]
        },
        karma: {
            debug: {
                configFile: 'test/karma.conf.js',
                singleRun: false
            },
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
            app: {
                files: {
                    '.tmp/scripts/app.js' : [
                        // App Scripts
                        '<%= settings.app %>/assets/scripts/c6/app.js',
                        '<%= settings.app %>/assets/scripts/c6/services/services.js',
                        '<%= settings.app %>/assets/scripts/c6/controllers/controllers.js',
                        '<%= settings.app %>/assets/scripts/c6/directives/directives.js',
                        '<%= settings.app %>/assets/scripts/c6/animations/animations.js',
                        // C6UI Scripts
                        '<%= settings.app %>/assets/lib/c6ui/c6ui.js',
                        '<%= settings.app %>/assets/lib/c6ui/imagepreloader/imagepreloader.js',
                        '<%= settings.app %>/assets/lib/c6ui/computed/computed.js',
                        '<%= settings.app %>/assets/lib/c6ui/sfx/sfx.js',
                        '<%= settings.app %>/assets/lib/c6ui/events/emitter.js',
                        '<%= settings.app %>/assets/lib/c6ui/anicache/anicache.js',
                        '<%= settings.app %>/assets/lib/c6ui/postmessage/postmessage.js',
                        '<%= settings.app %>/assets/lib/c6ui/site/site.js',
                        '<%= settings.app %>/assets/lib/c6ui/controls/controls.js',
                        '<%= settings.app %>/assets/lib/c6ui/videos/video.js',
                        '<%= settings.app %>/assets/lib/c6ui/browser/user_agent.js'
                    ]
                }
            },
            dist: {
                files: {
                    '.tmp/scripts/c6app.js': [
                        '.tmp/scripts/app.js',
                        '.tmp/angular_templates/templates.js'
                    ]
                }
            }
        },
        cssmin: {
            dist: {
                expand: true,
                flatten: true,
                src:    ['<%= settings.app %>/assets/styles/{,*/}*.css'],
                dest:   '<%= settings.distVersionPath() %>/styles/'
            }
        },
        ngtemplates: {
            app: {
                cwd: '<%= settings.app %>',
                src: 'assets/views/**/*.html',
                dest: '.tmp/angular_templates/templates.js',
                options: {
                    module: 'c6.app',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= settings.app %>',
                        src: ['*.html'],
                        dest: '<%= settings.dist %>'
                    }
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= settings.distVersionPath() %>/scripts/c6app.min.js': [
                        '.tmp/scripts/c6app.js'
                    ]
                }
            }
        },
        copy: {
            angular: {
                files: [{ expand: true, dot: true, cwd: '<%= settings.angular.buildDir %>',
                dest: '<%= settings.angular.targetDir %>', src: [ '*.js', 'version.*' ] }]
            },
            jquery: {
                files: [{ expand: true, dot: true, cwd: '<%= settings.jquery.buildDir %>',
                dest: '<%= settings.jquery.targetDir %>', src: [ '*.js', 'version.*' ] }]
            },
            jqueryui: {
                files: [{ expand: true, dot: true, cwd: '<%= settings.jqueryui.buildDir %>',
                dest: '<%= settings.jqueryui.targetDir %>', src: [ '*.js', 'version.*' ] }]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= settings.app %>',
                        dest: '<%= settings.dist %>',
                        src: [
                          '*.{ico,txt}',
                          '.htaccess'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= settings.app %>/assets',
                        dest: '<%= settings.distVersionPath() %>',
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
                        dest   : '<%= settings.installPath() %>'
                    }
                ]
            }
        },
        s3: {
            options: {
                key:    '<%= settings.aws.accessKeyId %>',
                secret: '<%= settings.aws.secretAccessKey %>',
                bucket: 'cinema6.com-etc',
                access: 'public-read',
                maxOperations: 4
            },
            production: {
                upload: [
                    {
                        src: 'dist/**',
                        dest: 'experiences/screenjack/',
                        rel : 'dist/'
                    },
                    {
                        src: 'dist/index.html',
                        dest: 'experiences/screenjack/<%= settings.version() %>/index.html',
                        headers : { 'cache-control' : 'max-age=0' }
                    },
                    {
                        src: 'dist/index.html',
                        dest: 'experiences/screenjack/index.html',
                        headers : { 'cache-control' : 'max-age=0' }
                    }
                ]
            },
            productionContent: {
                upload: [
                    {
                        src: 'siteContent/**',
                        rel: 'siteContent/',
                        dest: 'collateral/',
                        headers : { 'cache-control' : 'max-age=0' }
                    }
                ]
            },
            test: {
                options: {
                    bucket: 'c6.dev'
                },
                upload: [
                    {
                        src: 'dist/**',
                        dest: 'content/screenjack/',
                        rel : 'dist/'
                    },
                    {
                        src: 'dist/index.html',
                        dest: 'content/screenjack/<%= settings.version() %>/index.html',
                        headers : { 'cache-control' : 'max-age=0' }
                    },
                    {
                        src: 'dist/index.html',
                        dest: 'content/screenjack/index.html',
                        headers : { 'cache-control' : 'max-age=0' }
                    }
                ]
            },
            contentTest: {
                options: {
                    bucket: 'c6.dev'
                },
                upload: [
                    {
                        src: 'siteContent/**',
                        rel: 'siteContent/',
                        dest: '<%= settings.contentPath %>',
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
                target : '<%= settings.installPath() %>',
                link   : path.join('<%= settings.linkPath() %>','<%= settings.name() %>')
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('server', [
        'clean:server',
        'configureProxies',
        'livereload-start',
        'connect:livereload',
        'connect:sandbox',
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
        'ngtemplates',
        'sed:templates',
        'concat:app',
        'concat:dist',
        'copy:dist',
        'uglify',
        'sed:index',
        'sed:index2',
        'sed:main'
    ]);

    grunt.registerTask('release',function(type){
        type = type ? type : 'patch';
    //    grunt.task.run('test');
        grunt.task.run('build');
    });

    grunt.registerTask('publish-test',function(){
        grunt.task.run('build');
        grunt.task.run('s3:test');
        grunt.task.run('s3:contentTest');
    });
    
    grunt.registerTask('publish-prod',function(){
        grunt.task.run('build');
        grunt.task.run('s3:production');
        grunt.task.run('s3:productionContent');
    });

    grunt.registerTask('default', ['build']);

    grunt.registerTask('mvbuild', 'Move the build to a release folder.', function(){
        if (grunt.config.get('moved')){
            grunt.log.writeln('Already moved!');
            return;
        }
        var settings = grunt.config.get('settings'),
            installPath = settings.installPath();
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
        var settings = grunt.config.get('settings'),
            installPath = settings.installPath();

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
        var settings       = grunt.config.get('settings'),
            installBase = settings.name(),
            installPath = settings.installPath(),
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
        var settings = grunt.config.get('settings'),
            done = this.async(),
            handleVersionData = function(data){
                if ((data.commit === undefined) || (data.date === undefined)){
                    grunt.log.errorlns('Failed to parse version.');
                    return done(false);
                }
                data.date = new Date(data.date * 1000);
                settings.gitLastCommit = data;
                grunt.log.writelns('Last git Commit: ' +
                    JSON.stringify(settings.gitLastCommit,null,3));
                grunt.config.set('settings',settings);
                return done(true);
            };

        if (settings.gitLastCommit){
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
