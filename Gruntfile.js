module.exports = function(grunt) {
  var bannerComment = ['/**!',
    '*',
    '* Copyright 2013 LinkedIn Corp. All rights reserved.',
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
    '*/\n'].join('\n');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      hopscotch: {
        src: ['js/hopscotch-<%= pkg.version %>.js'],
      },
      gruntfile: {
        src: ['Gruntfile.js'],
      },
      options: {
        curly:    true,
        eqeqeq:   true,
        eqnull:   true,
        browser:  true,
        jquery:   true,
        yui:      true,
      }
    },
    uglify: {
      options: {
        banner: bannerComment
      },
      build: {
        src:  'js/hopscotch-<%= pkg.version %>.js',
        dest: 'js/hopscotch-<%= pkg.version %>.min.js'
      }
    },
    less: {
      development: {
        options: {
          paths: ['less']
        },
        files: {
          'css/hopscotch-<%= pkg.version %>.css': 'less/hopscotch.less'
        }
      },
      production: {
        options: {
          paths: ['less'],
          yuicompress: true,
          banner: bannerComment
        },
        files: {
          'css/hopscotch-<%= pkg.version %>.min.css': 'less/hopscotch.less'
        }
      }
    },
    shell: {
      'mocha-phantomjs': {
        command: 'mocha-phantomjs test/index.html',
        options: {
          stdout: true,
          stderr: true
        }
      }
    },
    watch: {
      jsFiles: {
        files: ['js/*.js'],
        tasks: ['shell:mocha-phantomjs', 'jshint:hopscotch']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'less', 'shell']);
  // Aliasing 'test' task to run Mocha tests
  grunt.registerTask('test', 'run mocha-phantomjs', function() {
    var done = this.async();
    require('child_process').exec('mocha-phantomjs ./test/index.html', function (err, stdout) {
      grunt.log.write(stdout);
      done(err);
    });
  });
};
