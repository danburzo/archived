# Galleria

Galleria is a hackable library to create image galleries / slideshows.

## Usage

### Include the CSS / JavaScript

Include the Galleria CSS and JavaScript in your `<head>`\*:

```html
<link rel="stylesheet" type="text/css" href="galleria.css"/>
<script type="text/javascript" src='galleria.js'></script>
```

(\* Just for the purpose of quickly setting it up; in general, add scripts as close to `</body>` as possible)

### Set up your markup

It should look something like this:

```html
<div class='gallery'>

	<a href='#' data-galleria-role='nav-prev'>← Previous</a>
	<a href='#' data-galleria-role='nav-next'>Next →</a>

	<div data-galleria-role='viewport'>
		<div data-galleria-role='slider'>
			<figure data-galleria-role='item'>
				<img src="sample-images/1.jpg">
			</figure>
			<figure data-galleria-role='item'>
				<img src="sample-images/2.jpg">
			</figure>
			<figure data-galleria-role='item'>
				<img src="sample-images/3.jpg">
			</figure>
			<figure data-galleria-role='item'>
				<img src="sample-images/4.jpg">
			</figure>
		</div>
	</div>
</div>
```

Notice the `data-galleria-role` attributes. You need to include at least:

* `data-galleria-role='viewport'` — this gets the class `.galleria__viewport`
* `data-galleria-role='slider'` — this gets the class `.galleria__slider`
* `data-galleria-role='item'` that includes an `img` element — I recommend using a `figure` element to keep things nice and semantic; all these get the class `.galleria__item`; in addition, the currently visible item gets the class `.galleria__item--current`.

The navigation elements are optional but if you want a simple next/prev out of the box, add elements with:

* `data-galleria-role='nav-prev'` — gets the classes `.galleria__nav .galleria__nav--prev`
* `data-galleria-role='nav-next'` — gets the classes `.galleria__nav .galleria__nav--next`

If the CSS classes look a bit weird, it's because they follow the [BEM naming convention](http://getbem.com/naming/), which I find is very useful for organizing the styles.

#### This is all very yucky to me

If you don't like this particular way of working with the markup and the CSS, you can override the selectors and the applied classes: just look in the source code for the methods that set up each of the elements.

### Initialize Galleria

Once you have your markup, just run `new Galleria(container)` on your container element (in the example markup above, it's the `<div id='gallery'>`):

```html
<script type='text/javascript'>
	var my_gallery = new Galleria(document.getElementById('gallery'));
</script>
```

The main container gets the class `.galleria__main`.

### Hack away

Customize the CSS and add new functionality to your heart's content. See the _Recipes_ section below, and read through the source code of the CSS file and the JS file to figure out oportunities to hack Galleria to suit your needs.

## Anatomy of the gallery

An overview of the main moving pieces will help you figure out how to work with Galleria.

#### The main container

todo 

#### The viewport

todo

#### The slider

todo 

#### The items

todo

## Recipes

### Customizing the transition

By default, the current element slides into view. This is done in the `animate()` method and works by applying a `transform` to the _Slider_ element on the X-axis, with an `ease` transition.

#### Custom duration and timing function

You can set your own [`transition-duration`](https://developer.mozilla.org/en/docs/Web/CSS/transition-duration), [`transition-delay`](https://developer.mozilla.org/en/docs/Web/CSS/transition-delay) and [`transition-timing-function`](https://developer.mozilla.org/en/docs/Web/CSS/transition-timing-function):

```css
.galleria__slider {
	/* slowest slideshow in the werrld */
	transition-duration: 5s; 

	/* not a particularly sexy timing function */
	transition-timing-function: cubic-bezier(.79,.09,.3,1.3)
}
```

([Ceaser](https://matthewlein.com/ceaser/) is a fun tool to make your own timing functions.)

#### Cross-fade

If you want your images to crossfade instead of sliding, you need to:

__Disable the sliding transition__ by disabling the `animate()` function:

```js 
var my_gallery = Galleria(my_element);
my_gallery.animate = function() { /* do nothing */ }
```
__Make the cross-fade transition__ yourself, by working with the `galleria__item` and `galleria__item--current` classes:

```css
.galleria__item {
	opacity: 0;
	transition: opacity 0.2s;
}

.galleria__item--current {
	opacity: 1;
}
```

### Customizing the height of the gallery

Galleria needs an explicit height on the main container for things to work as expected. You'll see in the CSS that `.galleria__main` has a fixed height. You can overwrite that with any height you prefer.

#### But I want it to be responsive

I, gentle reader, also want my image galleries to be responsive. Luckily, it's easy to achieve a dynamic height based on the width of the main container:

```css
.galleria__main {
	height: 0;
	padding-bottom: 75%; /* 3/4 of the width */
}
```

So, just put for `padding-bottom` the aspect ratio (`height / width`) you want and you're all set. Some common values:

Aspect ratio | `padding-bottom`
------------ | ---------------
16/9 | 56.25%
3/2 | 66.66%
4/3 | 75%

### Toggleable full-page mode

Running the gallery in full-page mode is as simple as making a modifier class for the main container:

```css
.galleria__main--fullscreen {
	
	/* 
		Position `fixed` and top/right/bottom/left = 0 
		makes the container take up all the available screen space.
	*/
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	
	/* 
		Setup a nice background
	*/
	background-color: #fff;

	/* 
		Resets the height and the bottom padding in
		case they've been customized. 
	*/
	height: auto;
	padding-bottom: 0;
	
	/* 
		Make sure the full-page gallery is relatively
		on top of other things (don't overdo the Z-index though)
	*/
	z-index: 100;
}
```

Then add a button to toggle this class:

```js

var fullscreen_btn = document.querySelector('.galleria__fullscreen-btn');
fullscreen_btn.addEventListener('click', function(e) {
	my_gallery.el.classList.toggle('galleria__main--fullscreen');
});

```

### Customizing the previous/next buttons

You can put anything you want inside the `previous` / `next` elements: text, images, inline SVGs. Use the `galleria__nav`, `galleria__nav--prev`, and `galleria__nav--next` classes to position your elements. For example, I can put a simple SVG chevron inside:

```html
<div data-galleria-role='nav-next'>
	<svg viewBox='0 0 20 20'>
		<polyline points='2,2 5,2 13,10 5,18 2,18 10,10'></polyline>
	</svg>
</div>


<div data-galleria-role='nav-prev'>
	<svg viewBox='0 0 20 20'>
		<polyline points='18,2 15,2 7,10 15,18 18,18 10,10'></polyline>
	</svg>
</div>
```

and then maybe style them with CSS:

```css
.galleria__nav svg {
	width: 3em;
	height: 3em;
	fill: white;
	fill-opacity: 0.5;
	stroke: none;
}

.galleria__nav:hover svg {
	fill-opacity: 1;
}
```

### Spacing the items

By default Galleria has zero space between the items. Since the items have `display:inline-block`, the library has to go and extract all whitespace between the elements to achieve this.

To add some space between the items:

```
.galleria__item {
	margin-right: 5%;
}

.galleria__item:last-child {
	margin-right: 0;
}
```

If you're using the default slide transition, it's preferable to set the `margin-right` as a percentage, to make sure the _Slider_ remains properly aligned in the _Viewport_ even if you resize the window.

If you need to use an absolute value (in `px`, `em` or `rem`), you can fix the window resizing issue by calling `animate()` when the window gets resized:

```js
window.addEventListener('resize', function(e) {
	my_gallery.animate();
});
```

This example is just for brevity: please note this has very yucky performance and is in general to be avoided. You can [`debounce`](https://lodash.com/docs/4.17.4#debounce) the operation, or do [even fancier, more efficient, things](https://www.html5rocks.com/en/tutorials/speed/animations/).

### Slides with floating captions

If you include a `figcaption` element in your `figure`, it will, by default, get positioned at the bottom of the image, on top of it:

```html
<figure data-galleria-role='item'>
	<img src='path/to/image.png'>
	<figcaption>My best snapshot as of yet.</figcaption>
</figure>
```

```css
.galleria__item figcaption {
	white-space: normal;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
}
```

You can style the background (e.g. `background-color: rgba(255,255,255,0.75)`) and the text (e.g. `text-align:center`), add some padding, etc.

### Slides with stacked images and captions

Taking the recipe above further, you can make your image and caption stack on top of each other rather than overlap, with a few caveats:

* you need to define a fixed height for your caption
* make sure you adjust your gallery's aspect ratio now that the image container becomes shorter

Based on the same markup as above, you can write some styles:

```css

.galleria__item {
	/* 
		Make room for the caption underneath the image 
	*/
	padding-bottom: 5em;

	/* 
		Setting the sizing policy to border box ensures
		that even if we've added 5em of padding, the 
		overall height remains the same 100% percent.
	*/
	box-sizing: border-box;
}

.galleria__item figcaption {
	/*
		Stretch the caption to fill the space underneath the image.
		Set overflow:hidden to prevent it from spilling out of the 
		container, and abbreviate the text inside.
	*/
	height: 5em;
	overflow: hidden;
	text-overflow: ellipsis;
}
```

### The size and position of images

We use the [`object-fit`](https://css-tricks.com/almanac/properties/o/object-fit/) and [`object-position`](https://css-tricks.com/almanac/properties/o/object-position/) CSS properties to control how the image is sized within its container. By default, it has:

```css
.galleria__item img {
	object-fit: contain;
	object-position: 50% 50%;
}
```

which means it will fit inside its container, regardless of its aspect ratio. You can experiment with `object-fit: cover` and other values.

### Detect swipes on the trackpad

todo -- use _.debounce.

### Detect swipes on a mobile device

todo -- use [zingtouch](https://github.com/zingchart/zingtouch)

### Tiniest API in the world

At the moment, you can do the following things programmatically:

* `next()` goes to the next slide
* `prev()` goes to the previous slide

So you could implement separate navigation buttons:

```js
var custom_next_button = document.querySelector('.custom-next-btn');
custom_next_button.on('click', function(e) {
	my_gallery.next();
	e.preventDefault();
});
```

## Browser support

This works as expected on recent versions of Firefox, Chrome and Safari on macOS, but IE/Edge have patchy support for some features.

### `object-fit` and `object-position` 

These are not supported in IE/Edge, but [this polyfill](https://github.com/bfred-it/object-fit-images/) fixes that.

## License

This library is licensed under MIT, i.e. do whatever you want with it, and don't hold me responsible for anything :)