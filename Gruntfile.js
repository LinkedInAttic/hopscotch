module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner : ['/**! <%=pkg.name%> - v<%=pkg.version%>',
        '*',
        '* Copyright 2017 LinkedIn Corp. All rights reserved.',
        '*',
        '* Licensed under the Apache License, Version 2.0 (the "License");',
        '* you may not use this file except in compliance with the License.',
        '* You may obtain a copy of the License at',
        '*',
        '*     http://www.apache.org/licenses/LICENSE-2.0',
        '*',
        '* Unless required by applicable law or agreed to in writing, software',
        '* distributed under the License is distributed on an "AS IS" BASIS,',
        '* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
        '* See the License for the specific language governing permissions and',
        '* limitations under the License.',
        '*/\n'
    ].join('\n'),
    distName:   '<%=pkg.name%>-<%=pkg.version%>',
    paths : {
      archive:  'archives',
      dist:     'dist',
      source:   'src',
      jsSource: '<%=paths.source%>/js/hopscotch.js',
      build:    'tmp',
      test:     'test'
    },
    jshint: {
      lib: {
        src: ['<%=paths.jsSource%>']
      },
      gruntfile: {
        src: ['Gruntfile.js']
      },
      options: {
        curly:    true,
        eqeqeq:   true,
        eqnull:   true,
        browser:  true,
        jquery:   true,
        yui:      true
      }
    },
    clean : {
      build: ['<%=paths.build%>'],
      dist: ['<%=paths.dist%>']
    },
    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: '<%=paths.source%>/',
            src: ['img/*'],
            dest: '<%=paths.build%>/'
          }
        ]
      },
      releaseWithBanner : {
        files: [
          {
            expand: true,
            cwd: '<%=paths.build%>/',
            src: ['js/hopscotch.js', 'js/hopscotch.min.js', 'css/*'],
            dest: '<%=paths.dist%>/'
          }
        ],
        options: {
          process: function (content, srcpath) {
            return grunt.template.process('<%=banner%>') + content;
          }
        }
      },
      release : {
        files: [
          {
            src: 'LICENSE',
            dest: '<%=paths.dist%>/LICENSE'
          },
          {
            expand: true,
            cwd: '<%=paths.build%>/',
            src: ['img/*'],
            dest: '<%=paths.dist%>/'
          }
        ]
      }
    },
    uglify: {
      build: {
        src:  '<%=paths.build%>/js/hopscotch.js',
        dest: '<%=paths.build%>/js/hopscotch.min.js'
      }
    },
    less: {
      dev: {
        options: {
          paths: ['<%=paths.source%>/less']
        },
        files: {
          '<%=paths.build%>/css/hopscotch.css': '<%=paths.source%>/less/hopscotch.less'
        }
      },
      prod: {
        options: {
          cleancss: true,
          paths: ['<%=paths.source%>/less']
        },
        files: {
          '<%=paths.build%>/css/hopscotch.min.css': '<%=paths.source%>/less/hopscotch.less'
        }
      }
    },
    jst: {
      compile: {
        options: {
          namespace: 'templates',
          processName: function(filename){
            var splitName = filename.split('/'),
                sanitized = splitName[splitName.length - 1].replace('.jst', '').replace(new RegExp('-', 'g'), '_');
            return sanitized;
          },
          templateSettings: {
            variable: 'data'
          }
        },
        files: {
          '<%=paths.build%>/js/hopscotch_templates.js': ['<%=paths.source%>/tl/*.jst']
        }
      }
    },
    includereplace: {
      jsSource: {
        options: {
          prefix: '// @@',
          suffix: ' //'
        },
        src: '<%=paths.jsSource%>',
        dest: '<%=paths.build%>/js/hopscotch.js'
      }
    },
    watch: {
      jsFiles: {
        files: ['<%=paths.source%>/**/*', '<%=paths.test%>/**/*'],
        tasks: ['test']
      }
    },
    compress: {
      distTarBall: {
        options: {
          archive: '<%=paths.archive%>/<%=distName%>.tar.gz',
          mode: 'tgz',
          pretty: true
        },
        files: [
          {
            expand: true,
            cwd: '<%=paths.dist%>',
            src: ['**/*'],
            dest: '<%=distName%>/'
          }
        ]
      },
      distZip: {
        options: {
          archive: '<%=paths.archive%>/<%=distName%>.zip',
            mode: 'zip',
            pretty: true
        },
        files: [
          {
            expand: true,
            cwd: '<%=paths.dist%>',
            src: ['**/*'],
            dest: '<%=distName%>/'
          }
        ]
      }
    },
    jasmine : {
      testProd: {
        src: '<%=paths.build%>/js/hopscotch.min.js',
        options: {
          keepRunner: false,
          specs:  ['<%=paths.test%>/js/*.js'],
          vendor: ['node_modules/jquery/dist/jquery.min.js'],
          styles: ['<%=paths.build%>/css/hopscotch.min.css']
        }
      },
      testDev: {
        src: '<%=paths.build%>/js/hopscotch.js',
        options: {
          keepRunner: false,
          specs:  ['<%=paths.test%>/js/*.js'],
          vendor: ['node_modules/jquery/dist/jquery.min.js'],
          styles: ['<%=paths.build%>/css/hopscotch.css']
        }
      },
      coverage: {
        src: '<%=paths.build%>/js/hopscotch.js',
        options: {
          keepRunner: false,
          specs:  ['<%=paths.test%>/js/*.js'],
          vendor: ['node_modules/jquery/dist/jquery.min.js'],
          styles: ['<%=paths.build%>/css/hopscotch.css'],
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: '<%=paths.build%>/coverage/coverage.json',
            report: '<%=paths.build%>/coverage',
            thresholds: {
              lines: 80,
              statements: 80,
              branches: 65,
              functions: 80
            }
          }
        }
      }
    },
    connect: {
      testServer: {
        options: {
          port: 3000,
          keepalive: true
        }
      }
    },
    shell: {
      gitAddArchive: {
        command: 'git add <%= paths.archive %>',
        options: {
          stdout: true
        }
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        push: false,
        commit: true,
        commitFiles: ['-a'],
        createTag: true
      }
    },
    log: {
      dev: {
        options: {
          message: "Open http://localhost:<%= connect.testServer.options.port %>/_SpecRunner.html in a browser\nCtrl + C to stop the server."
        }
      },
      coverage: {
        options: {
          message: 'Open <%=jasmine.coverage.options.templateOptions.report%>/index.html in a browser to view the coverage.'
        }
      }
    }
  });

  //external tasks
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-include-replace');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerMultiTask('log', 'Print some messages', function() {
    grunt.log.ok(this.data.options.message);
  });

  //grunt task aliases
  grunt.registerTask(
    'build',
    'Build hopscotch for testing (jshint, minify js, process less to css)',
    ['jshint:lib', 'clean:build', 'copy:build', 'jst:compile', 'includereplace:jsSource', 'uglify:build', 'less']
  );

  grunt.registerTask(
    'test',
    'Build hopscotch and run unit tests',
    ['build','jasmine:testProd', 'jasmine:coverage']
  );

  grunt.registerTask  (
    'dev',
    'Start test server to allow debugging unminified hopscotch code in a browser',
    ['build', 'jasmine:testDev:build', 'log:dev', 'connect:testServer']
  );

  grunt.registerTask(
    'coverage',
    'log:coverage',
    ['build', 'jasmine:coverage', 'log:coverage']);

  //release tasks
  grunt.registerTask(
    'buildRelease',
    'Build hopscotch for release (update files in dist directory and create tar.gz and zip archives of the release)',
    ['test', 'clean:dist', 'copy:releaseWithBanner', 'copy:release', 'compress']
  );
  grunt.registerTask(
    'releasePatch',
    'Release patch update to hopscotch (bump patch version, update dist and archives folders, tag release and commit)',
    ['bump-only:patch', 'buildRelease', 'shell:gitAddArchive', 'bump-commit']
  );
  grunt.registerTask(
    'releaseMinor',
    'Release minor update to hopscotch (bump minor version, update dist and archives folders, tag release and commit)',
    ['bump-only:minor', 'buildRelease', 'shell:gitAddArchive', 'bump-commit']
  );

  // Default task.
  grunt.registerTask(
    'default',
    'Build hopscotch and run unit tests',
    ['test']
  );
};
