var path = require('path'),
	yaml = require('js-yaml'),
	marked = require('marked'),
	ejs = require('ejs'),
	slug = require('slug'),
	fs = require('fs-extra'),
	moment = require('moment'),
	rss = require('rss');

module.exports = function(grunt) {

	grunt.registerTask('bildung', 'Build a static website', function() {

		var config = this.options({
			content: 'content',
			templates: 'templates',
			index_template: 'list',
			assets: 'assets',
			destination: 'dist',
			permalink: ':year/:month/:day/:slug',
			sort: function(a, b) {
				return b.metadata.date - a.metadata.date;
			},
			// filter out drafts beginning with _
			filter: function(article) {
				return !article.filename.match(/^_/);
			},
			rss: {
				name: 'articles',
				posts: 20,
				title: null,
				description: null,
				author: null,
				managingEditor: null,
				webMaster: null
			},
			title: 'Untitled Website',
			description: '',
			author: '',
			marked: {
				gfm: true,
				tables: true,
				smartypants: true
			},
			url: null,
			moment: 'MMM D, YYYY',
			datetime: 'YYYY-MM-DD',
			preprocess: function(content, config) {
				return content;
			}
		});

		function prepareMetadata(metadata) {

			metadata.date = new Date(metadata.date);
			metadata.year = metadata.date.getFullYear();
			metadata.month = metadata.date.getMonth() + 1;
			metadata.day = metadata.date.getDate();
			metadata.moment = moment(metadata.date).format(config.moment);
			metadata.datetime = moment(metadata.datetime).format(config.datetime);
			metadata.slug = metadata.slug || slug(metadata.title).toLowerCase();
			
			metadata.permalink = config.permalink.replace(/\:([a-z0-9A-Z\_\-]+)/g, function(match, k) {
				return metadata[k];
			});

			metadata.basepath = metadata.permalink.split('/').map(function() {
				return '..';
			}).join('/');
		};

		function processArticle(source) {
			var content = fs.readFileSync(path.join(config.content, source), 'utf8');
			var FRONT_MATTER_REGEX = /^(-{3}(?:\n|\r)([\w\W]+?)-{3})?([\w\W]*)*/;
			var ret = FRONT_MATTER_REGEX.exec(content);
			if (ret && ret.length === 4) {
				var metadata = yaml.safeLoad(ret[2]);
				// mixin some goodies
				prepareMetadata(metadata);

				var content = config.preprocess(ret[3], config);

				return {
					metadata: metadata,
					content: marked(content, config.marked),
					filename: source 
				}
			}
			return null;
		}

		// Clean up destination folder
		fs.removeSync(config.destination);

		// Compile templates

		var templates = {};
		fs.readdirSync(config.templates).forEach(function(filename) {
			var filepath = path.join(config.templates, filename);
			if (grunt.file.isFile(filepath)) {
				var ret = /([^\.]+)\.[^\.]+$/.exec(filename);
				if (ret) {
					var name = ret[1];
					templates[name] = ejs.compile(grunt.file.read(filepath), {
						filename: filepath
					});
				}
			}
		});

		var articles = fs.readdirSync(config.content)
			.filter(function(filepath) {
				return filepath.match(/\.md$/);
			})
			.map(function(filepath) {
				return processArticle(filepath);
			})
			.filter(config.filter)
			.sort(config.sort);

		// Create list page
		if (templates[config.index_template]) {
			var index_html = templates[config.index_template]({
				articles: articles,
				basepath: '.',
				title: 'Articles'
			});
			grunt.file.write(path.join(config.destination, 'index.html'), index_html);
		} else {
			grunt.log.warn('List template not found.');
		}

		// Create individual article page
		articles.forEach(function(article) {
			var article_template = templates[article.metadata.template || 'article'];
			if (article_template) {
				var article_html = article_template({
					article: article,
					articles: articles,
					basepath: article.metadata.basepath,
					title: article.metadata.title
				});
				grunt.file.write(path.join(config.destination, article.metadata.permalink, 'index.html'), article_html);
			} else {
				grunt.log.warn('Article template not found.');
			}
		});

		// Copy assets folder content to destination
		fs.copySync(config.assets, config.destination);

		// Generate RSS
		if (config.rss) {
			if (!config.url) {
				grunt.log.error('`url` for website needed for RSS!');	
			} else {
				var feed_path = config.rss.name + '.xml';
				var feed = new rss({
					title: config.rss.title || config.title,
					description: config.rss.description || config.description,
					author: config.rss.author || config.author,
					managingEditor: config.rss.managingEditor || config.rss.author || config.author,
					webMaster: config.rss.webMaster || config.rss.author || config.author,
					feed_url: config.url + '/' + feed_path,
					site_url: config.url
				});
				articles.slice(0, config.rss.posts).forEach(function(article) {
					feed.item({
						title: article.metadata.title,
						description: article.content,
						url: config.url + '/' + article.metadata.permalink,
						date: article.metadata.date
					});
				});
				grunt.file.write(path.join(config.destination, feed_path), feed.xml('  '));
			}
		} else {
			grunt.log.info('RSS disabled, skipping...');
		}
	});
};	