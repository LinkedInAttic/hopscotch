const babel = require('rollup-plugin-babel');
const path = require('path');

module.exports = function(grunt) {
  var HOPSCOTCH = 'hopscotch';
  grunt.initConfig({
    banner: ['/**! <%=pkg.name%> - v<%=pkg.version%>',
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
    clean: {
      build: ['<%=paths.build%>'],
      dist: ['<%=paths.dist%>']
    },
    connect: {
      testServer: {
        options: {
          port: 3000,
          keepalive: true
        }
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
            cwd: '<%=paths.dist%>',
            dest: '<%=distName%>',
            expand: true,
            src: ['**/*']
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
            cwd: '<%=paths.dist%>',
            dest: '<%=distName%>/',
            expand: true,
            src: ['**/*']
          }
        ]
      }
    },
    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: '<%=paths.source%>',
            src: ['img/*'],
            dest: '<%=paths.build%>'
          }
        ]
      },
      dist: {
        files: [
          {
            src: 'LICENSE',
            dest: '<%=paths.dist%>/LICENSE'
          },
          {
            cwd: '<%=paths.source%>',
            dest: '<%=paths.dist%>',
            expand: true,
            src: ['img/*']
          }
        ]
      },
      distBanner: {
        options: {
          process: function (content, srcpath) {
            return grunt.template.process('<%=banner%>') + content;
          }
        },
        files: [
          {
            cwd: '<%=paths.build%>',
            dest: '<%=paths.dist%>',
            expand: true,
            rename: function(dest, src) {
              return (src.indexOf('umd') >= 0) ?
                path.join(dest, src.replace('_umd', '')) :
                path.join(dest, src);
            },
            src: [
              'css/*',
              'js/hopscotch_amd.js',
              'js/hopscotch_amd.min.js',
              'js/hopscotch_umd.js',
              'js/hopscotch_umd.min.js'
            ]
          }
        ]
      }
    },
    distName: '<%=pkg.name%>-<%=pkg.version%>',
    includereplace: {
      jsSourceAmd: {
        options: {
          prefix: '// @@',
          suffix: ' //'
        },
        src: '<%=paths.build%>/js/hopscotch_amd_tmp.js',
        dest: '<%=paths.build%>/js/hopscotch_amd.js'
      },
      jsSourceUmd: {
        options: {
          prefix: '// @@',
          suffix: ' //'
        },
        src: '<%=paths.build%>/js/hopscotch_umd_tmp.js',
        dest: '<%=paths.build%>/js/hopscotch_umd.js'
      },
    },
    jasmine: {
      testAmdProd: {
        src: '<%=paths.build%>/js/hopscotch_amd.min.js',
        options: {
          keepRunner: false,
          outfile: '_SpecRunner.amd.html',
          specs:  ['<%=paths.test%>/js/test.hopscotch.amd.js'],
          styles: ['<%=paths.build%>/css/hopscotch.min.css'],
          template: require('grunt-template-jasmine-requirejs'),
          vendor: ['node_modules/jquery/dist/jquery.min.js']
        }
      },
      testAmdDev: {
        src: '<%=paths.build%>/js/hopscotch_amd.js',
        options: {
          keepRunner: false,
          outfile: '_SpecRunner.amd.html',
          specs:  ['<%=paths.test%>/js/test.hopscotch.amd.js'],
          styles: ['<%=paths.build%>/css/hopscotch.min.css'],
          template: require('grunt-template-jasmine-requirejs'),
          vendor: ['node_modules/jquery/dist/jquery.min.js']
        }
      },
      testProd: {
        src: '<%=paths.build%>/js/hopscotch_umd.min.js',
        options: {
          keepRunner: false,
          specs:  ['<%=paths.test%>/js/test.hopscotch.js'],
          vendor: ['node_modules/jquery/dist/jquery.min.js'],
          styles: ['<%=paths.build%>/css/hopscotch.min.css']
        }
      },
      testDev: {
        src: '<%=paths.build%>/js/hopscotch_umd.js',
        options: {
          keepRunner: false,
          specs:  ['<%=paths.test%>/js/test.hopscotch.js'],
          vendor: ['node_modules/jquery/dist/jquery.min.js'],
          styles: ['<%=paths.build%>/css/hopscotch.css']
        }
      },
      coverage: {
        src: '<%=paths.build%>/js/hopscotch_umd.js',
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
    jshint: {
      lib: {
        src: ['<%=paths.source%>/js']
      },
      options: {
        browser: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        esnext: true,
        jquery: true,
        yui: true
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
    },
    paths: {
      archive: 'archives',
      build: 'tmp',
      dist: 'dist',
      source: 'src',
      test: 'test'
    },
    pkg: grunt.file.readJSON('package.json'),
    rollup: {
      amd: {
        dest: 'tmp/js/hopscotch_amd_tmp.js',
        options: {
          format: 'amd',
          moduleId: HOPSCOTCH
        },
        src: 'src/js/hopscotch.js'
      },
      umd: {
        dest: 'tmp/js/hopscotch_umd_tmp.js',
        options: {
          format: 'umd',
          moduleName: HOPSCOTCH
        },
        src: 'src/js/hopscotch.js'
      },
      options: {
        plugins: [
          babel({
            exclude: 'node_modules/**'
          })
        ]
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
    uglify: {
      amd: {
        src:  '<%=paths.build%>/js/hopscotch_amd.js',
        dest: '<%=paths.build%>/js/hopscotch_amd.min.js'
      },
      umd: {
        src:  '<%=paths.build%>/js/hopscotch_umd.js',
        dest: '<%=paths.build%>/js/hopscotch_umd.min.js'
      }
    },
    watch: {
      jsFiles: {
        files: ['<%=paths.source%>/**/*', '<%=paths.test%>/**/*'],
        tasks: ['test']
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
  grunt.loadNpmTasks('grunt-rollup');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerMultiTask('log', 'Print some messages', function() {
    grunt.log.ok(this.data.options.message);
  });

  grunt.registerTask(
    'build',
    'Build hopscotch for testing (jshint, minify js, process less to css)',
    ['jshint:lib', 'clean', 'copy:build', 'less', 'rollup', 'jst:compile', 'includereplace', 'uglify', 'copy:dist', 'copy:distBanner']
  );

  grunt.registerTask  (
    'dev',
    'Start test server to allow debugging unminified hopscotch code in a browser',
    ['build', 'jasmine:testAmdDev:build', 'jasmine:testDev:build', 'log:dev', 'connect:testServer']
  );

  grunt.registerTask(
    'test',
    'Build hopscotch and run unit tests',
    ['build', 'jasmine:testAmdProd', 'jasmine:testProd', 'jasmine:coverage']
  );

  grunt.registerTask(
    'coverage',
    'log:coverage',
    ['build', 'jasmine:coverage', 'log:coverage']);

  //release tasks
  grunt.registerTask(
    'buildRelease',
    'Build hopscotch for release (update files in dist directory and create tar.gz and zip archives of the release)',
    ['test', 'compress']
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
