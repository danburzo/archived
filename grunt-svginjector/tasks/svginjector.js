'use strict';

var ejs = require('ejs'),
    path = require('path');

module.exports = function (grunt) {

    grunt.registerMultiTask('svginjector', 'Prepare SVG for injecting them into HTML via script file', function () {
        var options = this.options({
            container: '#svginjector',
            mode: 'replace'
        });

        var template = ejs.compile(
            grunt.file.read(path.join(__dirname, 'templates', 'svginjector.ejs'))
        );

        this.files.forEach(function (file) {
            var content = file.src.filter(function (filepath) {
                // filter out files that don't exist (and log warnings)
                return grunt.file.exists(filepath) || grunt.log.warn('File ' + filepath + ' not found.') && false;

            }).map(function (filepath) {
                return grunt.file.read(filepath);

            }).join('\n');

            var output = template({
                container: options.container,
                content: JSON.stringify(content),
                mode: options.mode
            });

            grunt.file.write(file.dest, output);
        });
    });

};
