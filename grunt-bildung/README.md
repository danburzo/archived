# bildung

`bildung` is a Grunt plugin for generating static websites. Inspiration from [Jekyll]() and similar tools. Prior art: [`grunt-pages`](https://github.com/CabinJS/grunt-pages) by [@crhisawren](https://twitter.com/chrisawren) et al.

__Note:__ This project is still in its early stages, so the API is subject to changes.

## Usage

See `Gruntfile.js` for an example usage.

### Options

#### destination

__Type:__ `String`
__Default:__ `dist`

The destination folder for the generated website. 

#### content

__Type:__ `String`
__Default:__ `content`

The path to the articles.

#### assets

__Type:__ `String`
__Default:__ `assets`

The path to the assets folder, the contents of which will be copied as is to the destination folder. Put your CSS, JS, images and what-not here.

#### templates

__Type:__ `String`
__Default:__ `templates`

The path to the templates folder, which are used to render the articles. 

#### index_template

__Type:__ `String`
__Default:__ `list`

The name of the template to use for the index page (which contains the list of all articles).

#### permalink

__Type:__ `String`
__Default:__ `:year/:month/:day/:slug`

The permalink to each individual post. You can use any property from the `Article` class (described below).

#### sort

__Type:__ `Function`
__Default:__ Sort by date (recent first)

The sort function to use when generating the list of articles for the index page.

#### filter

__Type:__ `Function`
__Default:__ Exclude filenames starting with `_` (we consider those are drafts)

The filter function can be used to exclude some articles from the generation process.

#### marked

__Type:__ `Object`

Send options directly to the [`marked`](https://github.com/chjj/marked) plugin. See its documentation for available options.

#### moment

__Type:__ `String`
__Default:__ `MMM D, YYYY`

The format to use with [`moment.js`](http://momentjs.com/) for generating the human-readable date for the article.

#### datetime

__Type:__ `String`
__Default:__ `YYYY-MM-DD`

The format to use with [`moment.js`](http://momentjs.com/) for generating the [machine-readable date](http://www.brucelawson.co.uk/2012/best-of-time/) for the article.

#### rss

__Type:__ `Object`/`Boolean`

Set `rss: false` to skip RSS generation. The various options if you do want to create a RSS feed:

* __`title`__ _`String`_ Title of the feed; if missing, falls back to the `title` option on the global config object.
* __`description`__ _`String`_ Description of the feed; if missing, falls back to the `description` option on the global config object.
* __`posts`__ _`Number`_ (default: `20`) The number of posts to include in the RSS feed.
* __`author`__ _`String`_ The author of the feed; if missing, falls back to the `author` option on the global config object. Other RSS options you can specify: `managingEditor`, `webMaster` (they fall back to `author`).

### The `Article` class

* `metadata`
	* `title` title of the article
	* `date` raw `Date` for the article
	* `year` year of the article (4-digit number)
	* `month` month of the article (1 to 12)
	* `day` day of the article (1 to 31)
	* `moment` human-readable article date with the format controlled by the `moment` option
	* `datetime` machine-readable article date with the format controlled by the `datetime` option
	* `slug` article slug
	* `permalink` permalink to the article
	* `basepath` path to the root of the site (taking into account the permalink pattern)
	* `template` the name of the template to use for rendering the article (default is `article`)
* `filename` file name of the source file, useful for filtering out drafts (see `filter` option)
* `content` HTML content of the article passed through `marked` (see `marked` option for parser configuration)

__Note:__ The `metadata` object for each article will reflect all the properties from the article's front matter. Careful with the name collisions though, there's no check -- if you use any of the properties outlined under `metadata` above, they most certainly will be overwritten (YOLO).

