Efemera.nowPlaying = {
	status: Efemera.STATUS_BLANK,
	_song: null,
	_events: {},
	_nowPlayingPosition: null,
	_nowPlayingPositionInterval: null,

	initialize: function() {
		this.on('play', function() {
			if (this._nowPlayingPositionInterval) {
				window.clearInterval(this._nowPlayingPositionInterval);
				this._nowPlayingPositionInterval = null;
			}
			this._nowPlayingPosition = null;
			this._nowPlayingPositionInterval = window.setInterval(function() {
				Efemera.nowPlaying.onposition();
			}, 300);
		}).on('pause stop finish', function() {
			if (this._nowPlayingPositionInterval) {
				window.clearInterval(this._nowPlayingPositionInterval);
				this._nowPlayingPositionInterval = null;
			}
		});
	},

	onposition: function() {
		var pos = this.position() || 0, duration = this.duration();
		// if (!this._fadeOutTimer && duration - pos < Efemera.FADE_TIME) {
		// 	this.fadeOut();
		// } else if (!this._fadeInTimer && pos < Efemera.FADE_TIME) {
		// 	this.fadeIn();
		// }
		if (!this._nowPlayingPosition) this._nowPlayingPosition = document.getElementById("now-playing-position");
		if (!this._nowPlayingDuration) this._nowPlayingDuration = document.getElementById("now-playing-duration");
		if (!this._nowPlayingSeekCursor) this._nowPlayingSeekCursor = document.getElementById('now-playing-seek-cursor');
		this._nowPlayingPosition.innerHTML = Efemera.utils.toTimeStr(pos);
		this._nowPlayingDuration.innerHTML = Efemera.utils.toTimeStr(duration);
		this._nowPlayingSeekCursor.style.width = (pos / duration * 100) + "%";
	},

	on: function(events, handler, thisObj) {
		events = events.split(' ');
		for (var i = 0; i < events.length; i++) {
			var event = events[i];
			if (!this._events[event]) this._events[event] = [];
			this._events[event].push([handler, thisObj]);
		}
		return this;
	},

	trigger: function(event, eventData) {
		var listeners = this._events[event] || [];
		for (var i = 0; i < listeners.length; i++) {
			listeners[i][0].call(listeners[i][1] || this, eventData);
		}
		return this;
	},

	setSong: function(song) {
		this._song = song;
		return this;
	},
	play: function() {
		if (this._song) {
			switch (this._song.sourceType) {
				case Efemera.TYPE_SOUNDCLOUD:
					this._playSC(this._song);
					break;
				case Efemera.TYPE_YOUTUBE:
					this._playYT(this._song);
					break;
			}
		}
		return this;
	},

	fadeIn: function() {
		if (this._fadeInTimer) {
			window.clearInterval(this._fadeInTimer);
			this._fadeInTimer = null;
		} 
		if (this._fadeOutTimer) {
			window.clearInterval(this._fadeOutTimer);
			this._fadeOutTimer = null;
		}
		this._fadeInTimer = window.setInterval(function() {
			var vol = Efemera.nowPlaying.volume();
			console.log('volume: ' + vol);
			if (vol < Efemera.volume) {
				vol = Math.min(Efemera.volume, vol + 5);
				Efemera.nowPlaying.volume(vol);
			} else {
				window.clearInterval(Efemera.nowPlaying._fadeInTimer);
				Efemera.nowPlaying._fadeInTimer = null;
			}
		}, Efemera.FADE_TIME / 20);
	},
	fadeOut: function() {
		if (this._fadeInTimer) {
			window.clearInterval(this._fadeInTimer);
			this._fadeInTimer = null;
		} 
		if (this._fadeOutTimer) {
			window.clearInterval(this._fadeOutTimer);
			this._fadeOutTimer = null;
		}
		this._fadeOutTimer = window.setInterval(function() {
			var vol = Efemera.nowPlaying.volume();
			console.log('volume: ' + vol);
			if (vol > 0) {
				vol = Math.max(0, vol - 5);
				Efemera.nowPlaying.volume(vol);
			} else {
				window.clearInterval(Efemera.nowPlaying._fadeOutTimer);
				Efemera.nowPlaying._fadeOutTimer = null;
			}
		}, Efemera.FADE_TIME / 20);
	},

	seekToPercentage: function(percent) {
		if (this._song) {
			var duration = this.duration(), pos = duration * percent / 100;
			this.seekTo(pos);
		}
		return this;
	},

	seekTo: function(pos) {
		if (this._song) {
			switch (this._song.sourceType) {
				case Efemera.TYPE_SOUNDCLOUD:
					if (this._song.sound) {
						this._song.sound.setPosition(pos);
					} else {
						console.error('No sound object in SC song.');
					}
					break;
				case Efemera.TYPE_YOUTUBE:
					Efemera.YTplayer.seekTo(pos / 1000);
					break; 
			}
		}
		return this;
	},

	_playSC: function(track) {
		if (!track.sound) {
			SC.stream('/tracks/' + track.id, function(sound) {
				track.sound = sound;	
				Efemera.nowPlaying._playSC(track);
			});
			return;
		}
		if (this.status === Efemera.STATUS_PAUSED) {
			this._song.sound.resume();
		} else {
			track.sound.play({
				volume: Efemera.volume,
				onfinish: function() {
					Efemera.nowPlaying.status = Efemera.STATUS_ENDED;
					Efemera.nowPlaying.trigger('finish');
				},
				onload: function() {
					Efemera.nowPlaying.trigger('load');
				},
				onplay: function() {		
					Efemera.nowPlaying.status = Efemera.STATUS_PLAYING;
					Efemera.nowPlaying.trigger('play');
				}
			});
		}
	},

	_playYT: function(track) {
		this.volume(Efemera.volume);
		if (this.status === Efemera.STATUS_PAUSED) {
			Efemera.YTplayer.playVideo();
		} else {
			Efemera.YTplayer.loadVideoById(track.id);
		}
	},

	pause: function() {
		if (this._song.sound) {
			this._song.sound.pause();
		} else {
			Efemera.YTplayer.pauseVideo();
		}
		this.status = Efemera.STATUS_PAUSED;
		this.trigger('pause');
		return this;
	},

	togglePlay: function() {
		if (this.status === Efemera.STATUS_PLAYING) {
			this.pause();
		} else if (this.status !== Efemera.STATUS_BLANK) {
			this.play();
		}
	},

	stop: function() {
		if (this._song) {
			if (this._song.sound) {
				this._song.sound.stop();
			} else {
				Efemera.YTplayer.stopVideo();
			}
		}
		this.status = Efemera.STATUS_STOPPED;
		this.trigger('stop');
		return this;
	},
	volume: function(vol) {
		if (vol !== undefined) {
			if (this._song) {
				switch (this._song.sourceType) {
					case Efemera.TYPE_SOUNDCLOUD:
						this._song.sound.setVolume(vol);
						break;
					case Efemera.TYPE_YOUTUBE:
						Efemera.YTplayer.setVolume(vol);
						break;
				}
			}
		} else {
			// get volume
			if (this._song) {
				switch (this._song.sourceType) {
					case Efemera.TYPE_SOUNDCLOUD:
						return this._song.sound.volume;
					case Efemera.TYPE_YOUTUBE:
						return Efemera.YTplayer.getVolume();
				}
			}
		}
	},

	_ytPlayerStateChanged: function(e) {
		switch (e.data) {
			case YT.PlayerState.ENDED:
				this.status = Efemera.STATUS_ENDED;
				this.trigger('finish');

				break;
			case YT.PlayerState.PLAYING:
			case YT.PlayerState.BUFFERING:
				this.status = Efemera.STATUS_PLAYING;
				this.trigger('play');
				break;
		}
	},

	duration: function() {
		switch (this._song.sourceType) {
			case Efemera.TYPE_SOUNDCLOUD:
				return this._song.duration;
			case Efemera.TYPE_YOUTUBE:
				return Efemera.YTplayer.getDuration() * 1000;
		}
	},

	position: function() {
		switch (this._song.sourceType) {
			case Efemera.TYPE_SOUNDCLOUD:
				return this._song.sound.position;
			case Efemera.TYPE_YOUTUBE:
				return Efemera.YTplayer.getCurrentTime() * 1000; 
		}
	}
};