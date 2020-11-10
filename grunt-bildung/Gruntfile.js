module.exports = function(grunt) {
	grunt.loadTasks('tasks');
	var handlebars = require('handlebars');

	grunt.initConfig({
		bildung: {
			options: {
				content: 'test/content',
				assets: 'test/assets',
				templates: 'test/templates',
				destination: 'dist/',
				url: 'http://danburzo.ro',
				title: "Dan's website",
				description: "Occasional writing",
				rss: {
					name: 'articles',
					posts: 10
				},
				preprocess: function(content, config) {
					console.log(config);
					return handlebars.compile(content)({
						basepath: config.url
					});
				}
			}
		}
	});

	grunt.registerTask('test', ['bildung']);
};