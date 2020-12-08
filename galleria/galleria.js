var Galleria = function(el, options) {
	return this.initialize(el, options || {});
}

Galleria.prototype.initialize = function(el, options) {

	if (!el) {
		console.error('Galleria needs a main container');
		return;
	}
	this.el = el;
	this.setupMainElement(this.el);

	this.viewport_el = this.getViewportElement(this.el);
	if (!this.viewport_el) {
		console.error('Could not find child element [data-galleria-role="viewport"]');
		return;
	} else {
		this.setupViewportElement(this.viewport_el);
	}

	this.slider_el = this.getSliderElement(this.el);
	if (!this.slider_el) {
		console.error('Could not find child element [data-galleria-role="slider"]');
		return;
	} else {
		this.setupSliderElement(this.slider_el);
	}

	this.nextBtn = this.getNextButtonElement(this.el);
	if (this.nextBtn) {
		this.setupNextButtonElement(this.nextBtn);
		this.nextBtn.addEventListener('click', function(e) {
			this.next();
			e.preventDefault();
		}.bind(this));
	}

	this.prevBtn = this.getPreviousButtonElement(this.el);
	if (this.prevBtn) {
		this.setupPreviousButtonElement(this.prevBtn);
		this.prevBtn.addEventListener('click', function(e) {
			this.prev();
			e.preventDefault();
		}.bind(this));
	} 

	var items = this.getItemElements(this.el);

	if (items.length) {

		this.setupItemElements(items);
		
		var first_item = items[0];

		// Cleanup text nodes
		var parent = first_item.parentNode;
		parent.childNodes.forEach(function(child) {
			if (child.nodeType === 3) {
				parent.removeChild(child);
			}
		});

		this.select(first_item);
		this.animate();
	} else {
		console.warn('No items present at initialization time');
	}

	return this;
}

Galleria.prototype.select = function(element) {
	if (element) {
		if (this.current) {
			this.unsetElementAsCurrent(this.current);
		}
		this.current = element;
		this.setElementAsCurrent(element);
	} else {
		console.info('Could not set undefined element as current item');
	}
}

Galleria.prototype.next = function() {
	this.select(this.current.nextElementSibling || this.getFirstItemElement(this.el));
	this.animate();
}

Galleria.prototype.prev = function() {
	this.select(this.current.previousElementSibling || this.getLastItemElement(this.el));
	this.animate();
}

Galleria.prototype.animate = function() {
	if (!this.current) {
		console.warn('could not find current item');
	}

	var slider_rect = this.slider_el.getBoundingClientRect();
	var item_rect = this.current.getBoundingClientRect();
	var viewport_rect = this.viewport_el.getBoundingClientRect();

	var delta = (slider_rect.left - item_rect.left) + (viewport_rect.width - item_rect.width) / 2;
	var offset;
	if (slider_rect.width) {
		offset = (delta / slider_rect.width * 100) + '%';
	} else {
		offset = delta + 'px';
	}
	this.slider_el.style.transform =
	this.slider_el.style.webkitTransform =
	this.slider_el.style.mozTransform = 'translate(' + offset + ', 0)';
}

/* 
	Interfaces for the DOM
	
	This is where we query the DOM for the needed elements,
	and where we apply classes to them. Modify them as you see fit.
	---------------------------------------------------------------
*/

/* Main element */

Galleria.prototype.setupMainElement = function(main_el) {
	main_el.classList.add('galleria__main');
};

/* Viewport element */

Galleria.prototype.getViewportElement = function(main_el) {
	return main_el.querySelector('[data-galleria-role="viewport"]');
};

Galleria.prototype.setupViewportElement = function(el) {
	el.classList.add('galleria__viewport');
};

/* Slider element */

Galleria.prototype.getSliderElement = function(main_el) {
	return main_el.querySelector('[data-galleria-role="slider"]');
};

Galleria.prototype.setupSliderElement = function(el) {
	el.classList.add('galleria__slider');
};

/* Next button element */

Galleria.prototype.getNextButtonElement = function(main_el) {
	return main_el.querySelector('[data-galleria-role="nav-next"]');
}

Galleria.prototype.setupNextButtonElement = function(el) {
	el.classList.add('galleria__nav');
	el.classList.add('galleria__nav--next');
}

/* Previous button element */

Galleria.prototype.getPreviousButtonElement = function(main_el) {
	return main_el.querySelector('[data-galleria-role="nav-prev"]');
}

Galleria.prototype.setupPreviousButtonElement = function(el) {
	el.classList.add('galleria__nav');
	el.classList.add('galleria__nav--prev');
}

/* Item elements */

Galleria.prototype.getItemElements = function(main_el) {
	return main_el.querySelectorAll('[data-galleria-role="item"]');
}

Galleria.prototype.setupItemElements = function(item_els) {
	Array.prototype.slice.call(item_els).forEach(function(el) {
		el.classList.add('galleria__item');
	});
};

/* Current item */

Galleria.prototype.setElementAsCurrent = function(el) {
	el.classList.add('galleria__item--current');
}

Galleria.prototype.unsetElementAsCurrent = function(el) {
	el.classList.remove('galleria__item--current');
}

/* Getting the first / last items */

Galleria.prototype.getFirstItemElement = function(main_el) {
	return main_el.querySelector('[data-galleria-role="item"]:first-child');
}

Galleria.prototype.getLastItemElement = function(main_el) {
	return main_el.querySelector('[data-galleria-role="item"]:last-child');
}

