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
    watch: {
      main: {
        files: 'app/**/*',
        tasks: 'default'
      }
    }
  });

  grunt.registerTask('default', 'browserify');
  grunt.registerTask('run', ['default', 'watch']);

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
};