module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          'static/script/app.build.js': ['app/main.js']
        },
        options: {
          transform: ['dustjs-browserify']
        }
      }
    },
    less:{
      main: {
        files: {
          'static/styles/app.css': ['app/less/main.less']
        }
      }
    },
    watch: {
      main: {
        files: 'app/**/**',
        tasks: ['default']
      }
    }
  });

  grunt.registerTask('default', 'browserify', 'less');
  grunt.registerTask('run', ['default', 'watch']);

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
};