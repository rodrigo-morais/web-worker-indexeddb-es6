module.exports = function (grunt) {

    grunt.initConfig({
        '6to5': {
            options: {
                modules: 'common'
            },

            build: {
                files: [{
                    expand: true,
                    cwd: 'javascript/',
                    src: ['main.js', 'indexedDB.js'],
                    dest: 'dist/javascript',
                }],
            }
        }
    });

    grunt.loadNpmTasks('grunt-6to5');

    grunt.registerTask('default', ['6to5']);

};