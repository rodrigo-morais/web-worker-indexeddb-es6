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
        '6to5': {
            options: {
            },

            build: {
                files: [{
                    expand: true,
                    cwd: 'javascript/worker',
                    src: ['repositories.js', 'worker.js'],
                    dest: 'dist/javascript/worker',
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