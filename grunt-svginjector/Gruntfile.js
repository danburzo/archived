module.exports = function (grunt) {
    grunt.loadTasks('tasks/');

    grunt.initConfig({
        svginjector: {
            example: {
                options: {
                    container: '#icons-container'
                },
                files: {
                    'example/dist/icons.js': 'example/src/icons.svg'
                }
            },
            examplePrepend: {
                options: {
                    container: 'body',
                    mode: 'prepend'
                },
                files: {
                    'example/dist/icons-prepend.js': 'example/src/icons.svg'
                }
            },
            exampleAppend: {
                options: {
                    container: 'body',
                    mode: 'append'
                },
                files: {
                    'example/dist/icons-append.js': 'example/src/icons.svg'
                }
            }
        }
    });
};
