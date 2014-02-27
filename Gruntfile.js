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
        src: ['js/hopscotch.js'],
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
        src:  'dist/<%= pkg.version %>/hopscotch.js',
        dest: 'dist/<%= pkg.version %>/hopscotch.min.js'
      }
    },
    less: {
      development: {
        options: {
          paths: ['less']
        },
        files: {
          'dist/<%= pkg.version %>/css/hopscotch.css': 'less/hopscotch.less'
        }
      },
      production: {
        options: {
          paths: ['less'],
          yuicompress: true,
          banner: bannerComment
        },
        files: {
          'dist/<%= pkg.version %>/css/hopscotch.min.css': 'less/hopscotch.less'
        }
      }
    },
    shell: {
      'mocha-phantomjs': {
        command: 'mocha-phantomjs test/index_versioned.html',
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
    },
    jst:{
      jstBuild: {
        options:{
          namespace: 'hopscotch.templates'
        },
        files: {
          '__build/tl_compiled.js': ['tl/*.jst']
        }
      }
    },
    concat:{
      jstBuild: {
        src: ['tl/_underscore_shim.js', '__build/tl_compiled.js'],
        dest: '__build/tl_dist.js'
      },
      dist: {
        src: ['js/hopscotch.js', '__build/tl_dist.js'],
        dest: 'dist/<%= pkg.version %>/hopscotch.js'
      }
    },
    clean:{
      build:['__build'],
      dist:['dist/<%= pkg.version %>'],
      test:['test/index_versioned.html']
    },
    copy:{
      imgDist: {
        src: 'img/*',
        dest: 'dist/<%= pkg.version %>/'
      },
      licenseDist: {
        src: 'LICENSE',
        dest: 'dist/<%= pkg.version %>/'
      },
      versionedTest: {
        src: 'test/index.html',
        dest: 'test/index_versioned.html',
        options: {
          process: function(content, srcpath){
            return content.replace(new RegExp('~VERSION', 'g'), grunt.config('pkg').version);
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('tl', 'Build default bubble templates', ['jst', 'concat:jstBuild']);
  grunt.registerTask('dist', 'Create distribution from source files', ['jshint', 'tl', 'concat:dist', 'uglify', 'less', 'copy:imgDist', 'copy:licenseDist', 'clean:build']);
  grunt.registerTask('test', 'Run unit tests using mocha-phantomjs', ['copy:versionedTest', 'shell']);
  grunt.registerTask('default', 'Build versioned distribution and run unit tests', ['dist', 'test']);
};
