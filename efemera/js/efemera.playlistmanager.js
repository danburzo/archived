Efemera.playlistManager = {

	shuffle: true,

	_playlist: null,
	_idx: 0,
	_prevIdx: null,
	_nextIdx: null,

	youtube: new Efemera.Playlist({
		id: 'youtube-results-playlist',
		title: 'YouTube search results'				
	}),
	soundcloud: new Efemera.Playlist({
		id: 'soundcloud-results-playlist',
		title: 'SoundCloud search results'				
	}),	
	searchResults: new Efemera.Playlist({
		songs: function() {
			var manager = Efemera.playlistManager;
			var ret = [],
				len = Math.max(manager.youtube.songs.length, manager.soundcloud.songs.length);
			for (var i = 0; i < len; i++) {
				if (i < manager.youtube.songs.length - 1) ret.push(manager.youtube.songs[i]);
				if (i < manager.soundcloud.songs.length - 1) ret.push(manager.soundcloud.songs[i]);
			}
			return ret;
		}
	}),

	playlists: (Efemera.store.get('playlists') || []).map(function(playlist) {
		return new Efemera.Playlist(playlist).load();
	}),

	loved: new Efemera.Playlist({ 
		id: 'playlist-loved',
		title: 'Loved tracks'
	}).load(),

	quicklist: new Efemera.Playlist({ 
		id: 'playlist-quicklist',
		title: 'Quicklist'
	}).load(),

	toggleLoved: function(track) {
		var idx = this.loved.songIndex(track);
		if ( idx === -1) {
			this.loved.addSong(track);
		} else {
			this.loved.removeSong(track);
		}
	},

	isLoved: function(track) {
		return this.loved.songIndex(track) > -1;
	},

	next: function() {
		if (this._playlist) {
			if (this.shuffle) {
				this._idx = Math.round(Math.random() * (this._playlist.size() - 1));
			} else {
				if (this._idx + 1 < this._playlist.size() - 1) {
					this._idx++;
				} else {
					this._idx = 0;
				}
			}
			this.playFromPlaylist();
		}
	},

	prev: function() {
		if (this._playlist) {
			if (this.shuffle) {
				this._idx = Math.round(Math.random() * (this._playlist.size() - 1));
			} else {
				if (this._idx > 0) {
					this._idx--;
				} else {
					this._idx = this._playlist.size() - 1;
				}
			}
			this.playFromPlaylist();
		}
	},

	playFromPlaylist: function() {
		Efemera.nowPlaying.stop().setSong(this._playlist.eq(this._idx)).play();
	}
};