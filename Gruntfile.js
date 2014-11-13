module.exports = function (grunt) {

    grunt.initConfig({
        '6to5': {
            options: {
                modules: 'amd'
            },

            build: {
                files: [{
                    expand: true,
                    cwd: 'javascript/',
                    src: ['main.js', 'indexedDB.js'],
                    dest: 'dist/javascript',
                }],
            }
        },
        copy: {
            main: {
                cwd: './',
                src: 'index.html',
                dest: 'dist/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
        }
    });

    grunt.loadNpmTasks('grunt-6to5');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['6to5', 'copy']);

};