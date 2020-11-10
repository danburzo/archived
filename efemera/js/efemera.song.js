/*
	Song model.
*/

Efemera.Song = function(attrs) {
	Efemera.utils.mixin(this, attrs);
};

/* This is the information we need to save to localStorage/server */
Efemera.Song.prototype.toJSON = function() {
	var resp = {},
	props = 'id sourceType title description url duration thumb author date'.split(/\s+/);
	for (var i = 0; i < props.length; i++) {
		resp[props[i]] = this[props[i]];
	}
	return resp;
};

Efemera.Song.prototype.durationStr = function() {
	if (this.duration) return Efemera.utils.toTimeStr(this.duration);
	return null;
}