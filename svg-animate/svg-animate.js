/*
	SVG Path Animation
	------------------
	http://github.com/danburzo/svg-animate

	Usage:

	animatePaths({
		paths: {DOM Element Collection} Path elements to animate
		duration: {Number} Animation duration in milliseconds
		easing: {String} Easing function to use, default is 'linear'
		order: {String} 'parallel' (default) | 'sequence' (TODO) Animate paths in parallel or sequence
	});

*/

(function(root) {

	// From: https://gist.github.com/gre/1650294
	EasingFunctions = {
		// no easing, no acceleration
		linear: function (t) { return t },
		// accelerating from zero velocity
		easeInQuad: function (t) { return t*t },
		// decelerating to zero velocity
		easeOutQuad: function (t) { return t*(2-t) },
		// acceleration until halfway, then deceleration
		easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
		// accelerating from zero velocity
		easeInCubic: function (t) { return t*t*t },
		// decelerating to zero velocity
		easeOutCubic: function (t) { return (--t)*t*t+1 },
		// acceleration until halfway, then deceleration
		easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
		// accelerating from zero velocity
		easeInQuart: function (t) { return t*t*t*t },
		// decelerating to zero velocity
		easeOutQuart: function (t) { return 1-(--t)*t*t*t },
		// acceleration until halfway, then deceleration
		easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
		// accelerating from zero velocity
		easeInQuint: function (t) { return t*t*t*t*t },
		// decelerating to zero velocity
		easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
		// acceleration until halfway, then deceleration
		easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
	};

	var requestAnimationFrame = 
		window.requestAnimationFrame || 
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || 
		window.msRequestAnimationFrame || 
		function(callback) {
			return window.setTimeout.call(window, callback, 40);
		};

	function animatePath(path, opts) {

		function draw(){
			var progress = (new Date()) - start;
			if (progress <= opts.duration) {
				var t = opts.easing(progress / opts.duration);
				path.setAttribute('stroke-dasharray', (len * t) + ',' + (len * (1 - t)));
				requestAnimationFrame(draw);
			}
		}

		var len 	= path.getTotalLength(), 
			start 	= new Date();
		
		requestAnimationFrame(draw);
	}

	root.animatePaths = function(opts) {
		opts = opts || {};

		// default values
		var order 		= opts.order 		|| 'parallel',
			paths 		= opts.paths 		|| [],
			duration 	= opts.duration 	|| 3000,
			easing 		= opts.easing 		|| 'linear';

		switch (order) {
			case 'parallel':
				for (var i = 0; i < paths.length; i++) {
					animatePath(paths[i], {
						duration: duration,
						easing: EasingFunctions[easing]
					});
				}
				break;
			case 'sequential':
				break;
			default:
				console.error('Invalid order: ' + order);
		}

	};
})(window);