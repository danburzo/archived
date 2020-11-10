/* Playlist model */
Efemera.Playlist = function(attrs) {
	
	this.songs = [];
	this.title = "";
	this.description = null;

	Efemera.utils.mixin(this, attrs);
};

Efemera.utils.mixin(Efemera.Playlist.prototype, {
	
	propertiesToPersist: ['id', 'title', 'description', 'songs'], 

	toJSON: function() {
		var resp = {};
		for (var i = 0; i < this.propertiesToPersist.length; i++) {
			resp[this.propertiesToPersist[i]] = this[this.propertiesToPersist[i]];
		}
		return resp;
	},

	load: function() {
		var playlist = Efemera.store.get(this.id, this);
		if (playlist) {
			Efemera.utils.mixin(this, playlist);
		}
		return this;
	},

	save: function() {
		Efemera.store.set(this.id, this);
		return this;
	},

	clear: function() {
		this.songs.length = 0;
		this.save();
		return this;
	},

	destroy: function() {
		this.store.remove(this.id);
		return this;
	},

	songIndex: function(song) {
		var songs = this.songs;
		if (typeof songs === 'function') songs = this.songs();
		for (var i = 0; i < songs.length; i++) {
			if (songs[i].id === song.id) return i;
		}
		return -1;
	},

	songById: function(id) {
		var songs = this.songs;
		if (typeof songs === 'function') songs = this.songs();
		return songs.filter(function(song) {
			return song.id === id;
		})[0];
	},

	eq: function(idx) {
		var songs = this.songs;
		if (typeof songs === 'function') songs = this.songs();
		return songs[idx];
	},

	size: function() {
		var songs = this.songs;
		if (typeof songs === 'function') songs = this.songs();
		return songs.length;
	},

	addSong: function(song, opts) {
		opts = opts || {};
		if (this.songIndex(song) === -1 || opts.duplicates) {
			this.songs.push(song);
		}
		this.save();
	},

	removeSong: function(song) {
		var idx = this.songIndex(song);
		if (idx > -1) {
			this.songs.splice(idx, 1);
		}
		this.save();
	}
});