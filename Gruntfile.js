module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner : ['/**! <%=pkg.name%> - v<%=pkg.version%>',
        '*',
        '* Copyright 2014 LinkedIn Corp. All rights reserved.',
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
      archive : 'archives',
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
            src: '<%=paths.jsSource%>',
            dest: '<%=paths.build%>/js/hopscotch.js'
          },
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
            src: ['js/*', 'css/*'],
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
    mocha : {
      test : {
        src:['<%=paths.test%>/index.html']
      }
    },
    shell: {
      gitAddArchive: {
        command: 'git add <%= paths.archive %>',
        options: {
          stdout: true
        }
      }
    }
  });

  //external tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-shell');

  //grunt task aliases
  grunt.registerTask('build',        ['jshint:lib', 'clean:build', 'copy:build', 'uglify:build', 'less']);
  grunt.registerTask('test',         ['build','mocha']);

  //release tasks
  grunt.registerTask('buildRelease', ['test', 'clean:dist', 'copy:releaseWithBanner', 'copy:release', 'compress']);
  grunt.registerTask('releasePatch', ['bump-only:patch', 'buildRelease', 'shell:gitAddArchive', 'bump-commit']);
  grunt.registerTask('releaseMinor', ['bump-only:minor', 'buildRelease', 'shell:gitAddArchive', 'bump-commit']);

  // Default task.
  grunt.registerTask('default',      ['test']);
};