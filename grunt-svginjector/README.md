# grunt-svginjector [![NPM version](https://badge.fury.io/js/grunt-svginjector.svg)](http://badge.fury.io/js/grunt-svginjector)

> Inject external SVG files into HTML

`grunt-svginjector` is a Grunt plugin that allows you to inline SVGs into your HTML by way of a generated JavaScript file. It works great in conjunction with [grunt-svgstore](https://github.com/FWeinb/grunt-svgstore) for using SVG icons.

[Read this article](http://danburzo.ro/svg-icon-system/) to see how I'm using it.

## Getting Started

This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-svginjector --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-svginjector');
```

## The `svginjector` task

_Run this task with the `grunt svginjector` command._

### Options

#### `container`

Type: `String`
Default: `#svginjector`

The ID of the element into which to inject the SVGs.

#### `mode`
	
Type: `String`
Default: `replace`

The `mode` option controls how the SVG is inserted into the DOM. Possible values:

* `replace` replaces the content of the DOM element;
* `append` adds the SVG as the last child of the DOM element;
* `prepend` adds the SVG as the first child of the DOM element.

### Usage

A quick example (see the `example` folder for more input/output examples):

```js
grunt.initConfig({
	svginjector: {
		example: {
			options: {
				container: '#icons-container'
			},
			files: {
				'example/dist/icons.js': 'example/src/icons.svg'
			}
		}
	}
});
```
