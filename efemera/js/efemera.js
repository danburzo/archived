var Efemera = {

	volume: 100,

	FADE_TIME: 3000,

	STATUS_BLANK: 0,
	STATUS_PLAYING: 1,
	STATUS_PAUSED: 2,
	STATUS_STOPPED: 3,
	STATUS_ENDED: 4,

	TYPE_SOUNDCLOUD: 0,
	TYPE_YOUTUBE: 1,

	store: window.store,

	youTubeAPIKey: "AIzaSyDDXIPTpDjtE6f7Hhn_KylMVBHBZ00M2pk",
	soundCloudClientId: "f20a9e7a1a89e138628aa4b68682b040",

	YT_API_URL: 'https://www.googleapis.com/youtube/v3',

	searchSuggestions: [
		"Radiohead", "Atoms for Peace", "Nick Cave & the Bad Seeds", "Jon Hopkins", "Maria Tănase", "Hyperdub", "Burial",
		"Rhye", "The National", "William Basinski", "Brian Eno", "The Caretaker", "Alternativ Quartet", "Beirut",
		"Florence + the Machine", "Blonde Redhead", "Harold Budd", "Beach House", "Sigur Rós", "Mogwai", "Lisa Gerrard",
		"Ella Fitzgerald", "Miles Davis", "Aphex Twin", "Warp Records", "Chilly Gonzales", "Philip Glass", "Erik Satie",
		"Portishead", "Massive Attack", "Tindersticks", "Bon Iver", "The Knife", "DJ Shadow", "Hauschka", "Autechre", "Pixies",
		"PJ Harvey", "Devendra Banhart", "Jóhann Jóhannsson", "Beth Gibbons & Rustin Man", "Tycho", "Com Truise", "Djivan Gasparyan",
		"Jun Miyake", "Fărămiță Lambru", "Interpol", "Joy Division", "David Byrne", "Dead Can Dance", "Nine Inch Nails", "Wild Beasts",
		"Regina Spektor", "Kronos Quartet", "Clint Mansell", "The XX", "Nina Simone", "Flying Lotus", "Zakir Hussain", "Anouar Brahem",
		"Edward Sharpe and the Magnetic Zeros", "METZ", "Duke Ellington", "Frédéric Chopin"
	],

	initialize: function(opts) {
		// Initialize SoundCloud connector
		SC.initialize({
			client_id: this.soundCloudClientId
		});
		this.nowPlaying.initialize();
	},

	_searchTimer: null,

	songForEvent: function(el) {
		var item = $(el).closest('.result'), id = item.data('id');
		return Efemera.playlistManager.searchResults.songById(id);
	},

	initializeUI: function() {

		function suggest() {
			var val = $("#search input").val();
			if (val.length > 3) {
				Efemera.suggest(val);
			} else {
				Efemera._showSearchSuggestions();
			}
		};

		$("#search").on('click', '.submit', function(){
			var q = $("#search input").val();
			Efemera.search(q);
			return false;
		})
		.on('click', '.suggestion', function() {
			var q = $(this).text();
			$("#search input").val(q);
			Efemera.search(q);
			return false;
		})
		.on('keyup', 'input', function(e) {
			if (e.keyCode === 13) {
				// enter
				Efemera.search($(this).val());
			}
			if (this._searchTimer) {
				window.clearTimeout(this._searchTimer);
			}
			this._searchTimer = window.setTimeout(suggest, 500);
		});

		$("#results").on('click', '.result', function() {
			Efemera.select(this);
		}).on('click', '.quicklist', function() {
			var song = Efemera.songForEvent(this);
			Efemera.playlistManager.quicklist.addSong(song);
			return false;
		}).on('click', '.love', function() {
			var song = Efemera.songForEvent(this);
			Efemera.playlistManager.loved.addSong(song);
			return false;
		}).on('dblclick', '.result', function() {
			Efemera.select(this);
			Efemera.playSelected();
		});

		$("#now-playing")
			.on('click', '.prev', function() {
				Efemera.playlistManager.prev();
				return false;
			})
			.on('click', '.next', function() {
				Efemera.playlistManager.next();
				return false;
			})
			.on('click', '.play', function() {
				Efemera.nowPlaying.togglePlay();
				return false;
			});

		$("#results").on('click', '.play', function() {
			Efemera.playResult($(this).parents('.result')[0]);
			return false;
		});

		$(document).on('keydown', ':not(:input)', function(e) {
			if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(e.target.nodeName) === -1) {
				if (e.metaKey || e.ctrlKey) {
					switch (e.which) {
						case 38: // Up
							onvolumechange(Math.max(Math.min(Efemera.volume + 3, 100),0));
							return false;
							break;
						case 40: // Down
							onvolumechange(Math.max(Math.min(Efemera.volume - 3, 100),0));
							return false;
							break;
						case 37: // Left
							return false;
							break;
						case 39: // Right
						 	return false;
							break;
					}
				} else {
					switch(e.which) {
						case 74: // j
							Efemera.playlistManager.prev();
							return false;
							break;
						case 75: // k
							Efemera.playlistManager.next();
							return false;
							break;
						case 32: // space
							Efemera.nowPlaying.togglePlay();
							return false;
							break;
						case 112: // F1
							Efemera.showHelp();
							return false;
							break;
						case 27: // Esc
							Efemera.hideHelp();
							return false;
							break;
						case 38: // Up
							Efemera.moveUp();
							return false;
							break;
						case 37: // Left
							Efemera.moveLeft();
							return false;
							break;
						case 39: // Right
							Efemera.moveRight();
							return false;
							break;
						case 40: // Down
							Efemera.moveDown();
							return false;
							break;
						case 13: // Enter
							Efemera.playSelected();
							return false;
							break;
					}
				}
			}
		})
		.on('keydown', ':input', function(e) {
			if (e.keyCode === 27) $(this).blur();
		})
		.on('click', '#help', function() {
			Efemera.hideHelp();
		});

		var volumeDial = $("#volume-dial input"), volumeDialIcon = $("#volume-dial i");

		function adjustVolumeIcon(vol) {
			if (vol > 50) {
					volumeDialIcon.attr('class', 'icon-volume-up');
				} else if (vol > 0) {
					volumeDialIcon.attr('class', 'icon-volume-down');
				} else {
					volumeDialIcon.attr('class', 'icon-volume-off');
				}
		};

		function onvolumechange(vol) {
			Efemera.volume = vol;
			Efemera.nowPlaying.volume(vol);
			adjustVolumeIcon(vol);
		}

		Efemera.volume = volumeDial.val();
		volumeDial.knob({
			fgColor: "#333333",
			bgColor: "transparent",
			inputColor: "#333333",
			displayInput: false,
			angleOffset: 180,
			change: onvolumechange
		});

		onvolumechange(Efemera.volume);

		Efemera.nowPlaying
			.on('play pause stop finish', Efemera._showNowPlaying, Efemera)
			.on('play', function() {
				window.onbeforeunload = function() {
					return "\"" + Efemera.nowPlaying._song.title + "\" is still playing.";
				};
			})
			.on('stop pause finish', function() {
				window.onbeforeunload = null;
			})
			.on('finish', function() {
				Efemera.playlistManager.next();
			})
			.on('play', function() {
				document.title = this._song.title + " | Efemera";
			});
		
		var playButton = $("#now-playing .play");

		Efemera.nowPlaying.on('play', function() {
			playButton.addClass('enabled');
		}).on('pause stop finish', function() {
			playButton.removeClass('enabled');
		});

		var loved = $("#now-playing .love");

		function updateLovedUI() {	
			if (Efemera.playlistManager.isLoved(Efemera.nowPlaying._song)) {
				loved.addClass('enabled');
			} else {
				loved.removeClass('enabled');
			}
		}
		Efemera.nowPlaying.on('play', updateLovedUI);

		loved.on('click', function() {
			var song = Efemera.nowPlaying._song;
			if (song) {
				Efemera.playlistManager.toggleLoved(song);
				updateLovedUI();
			}
			return false;
		});

		var shuffle = $("#now-playing .shuffle");
		if (Efemera.playlistManager.shuffle) {
			shuffle.addClass('enabled');
		} else {
			shuffle.removeClass('enabled');
		}

		shuffle.on('click', function() {
			$(this).toggleClass('enabled');
			Efemera.playlistManager.shuffle = $(this).hasClass('enabled');
			return false;
		});

		$(document).on('click', '#now-playing-seek-bar', function(e) {
			var pos = e.clientX, box = this.getBoundingClientRect();
			var seekTo = (pos - box.left) / (box.right - box.left) * 100;
			Efemera.nowPlaying.seekToPercentage(seekTo);
		});

		this._showSearchSuggestions();
	},

	_focus: null,
	FOCUS_RESULTS: 1,
	FOCUS_PLAYLIST: 2,

	isElementInViewport: function(el) {
		var rect = el.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) && /*or $(window).height() */
			rect.right <= (window.innerWidth || document. documentElement.clientWidth) /*or $(window).width() */
			);
	},

	// TODO: cache dom selectors, refactor these methods

	focus: function() {
		return this._focus || (Efemera.playlistManager.searchResults.size() ? this.FOCUS_RESULTS : null);
	},

	playResult: function(el) {
		var id = $(el).data('id'), type= $(el).data('type'),
			arr = Efemera.playlistManager.searchResults,
			song = arr.songById(id);

		this.nowPlaying
			.stop()
			.setSong(song)
			.play();

		Efemera.playlistManager._playlist = arr;
		Efemera.playlistManager._idx = arr.songIndex(song);
	},

	playSelected: function() {
		var selected = $(".result.selected");
		if (selected.length) {
			this.playResult(selected[0]);
		}
	},

	select: function(el) {
		if (this.focus() === this.FOCUS_RESULTS) {
			var selected = el ? $(el) : $("#results .result.selected");
			if (selected.length) {
				$("#results .result").removeClass('selected');
				selected.addClass('selected');
			}
		}
	},

	moveDown: function() {
		if (this.focus() === this.FOCUS_RESULTS) {
			var selected = $("#results .result.selected"), next;
			if (selected.length) {
				next = selected.next('.result');
				if (!next.length) next = selected.parent().find(".result:first");
			} else {
				next = $("#results .result:first");
			}
			$("#results .result").removeClass('selected');
			next.addClass('selected');
			if (!this.isElementInViewport(next[0])) next[0].scrollIntoView(false);
		}
	},

	moveUp: function() {
		if (this.focus() === this.FOCUS_RESULTS) {
			var selected = $("#results .result.selected"), next;
			if (selected.length) {
				next = selected.prev('.result');
				if (!next.length) next = selected.parent().find(".result:last");
			} else {
				next = $("#results .result:last");
			}
			$("#results .result").removeClass('selected');
			next.addClass('selected');
			if (!this.isElementInViewport(next[0])) next[0].scrollIntoView(true);
		}
	},

	moveLeft: function() {
		if (this.focus() === this.FOCUS_RESULTS) {
			var selected = $("#results .result.selected");
			if (!selected.length) {
				selected = $("#results .result:first");
			}
			var idx = selected.index();
			var sibling = selected.closest('.result-set').prev('.result-set');
			if (sibling.length) {
				var results = sibling.find('.result');
				var next = results.eq(Math.min(idx, results.length - 1));
				$("#results .result").removeClass('selected');
				next.addClass('selected');
				if (!this.isElementInViewport(next[0])) next[0].scrollIntoView(true);
			}
		}
	},

	moveRight: function() {
		if (this.focus() === this.FOCUS_RESULTS) {
			var selected = $("#results .result.selected");
			if (!selected.length) {
				selected = $("#results .result:first");
			}
			var idx = selected.index();
			var sibling = selected.closest('.result-set').next('.result-set');
			if (sibling.length) {
				var results = sibling.find('.result');
				var next = results.eq(Math.min(idx, results.length - 1));
				$("#results .result").removeClass('selected');
				next.addClass('selected');
				if (!this.isElementInViewport(next[0])) next[0].scrollIntoView(true);
			}
		}
	},

	searchInfo: {
		query: ''
	},

	search: function(query) {
		this.searchInfo.query = query;

		Efemera.playlistManager.youtube.clear();
		Efemera.playlistManager.soundcloud.clear();

		// search youtube
		$.ajax({
			url: this.YT_API_URL + '/search',
			data: {
				part: 'snippet',
				q: query,
				key: this.youTubeAPIKey,
				maxResults: 50,
				type: 'video'
			},
			dataType: 'jsonp',
			success: function(resp) {
				if (resp && resp.items) {
					var songs = resp.items.map(function(item) {
						return new Efemera.Song({
							id: item.id.videoId,
							sourceType: Efemera.TYPE_YOUTUBE,
							title: item.snippet.title,
							author: item.snippet.channelTitle,
							url: 'http://youtu.be/' + item.id.videoId,
							thumb: item.snippet.thumbnails.default.url,
							date: item.snippet.publishedAt
						});
					});
					Efemera.playlistManager.youtube.songs = songs ;
					Efemera._showResults();
					Efemera.getYouTubeDurations(songs.map(function(song) {
						 return song.id;
					}));
				}
			}
		});

		// search soundcloud
		SC.get('/tracks', { q: query }, function(resp) {
			Efemera.playlistManager.soundcloud.songs = resp.map(function(item) {
				return new Efemera.Song({
					id: item.id,
					sourceType: Efemera.TYPE_SOUNDCLOUD,
					title: item.title,
					author: item.user.username,
					url: item.permalink_url,
					thumb: item.artwork_url,
					duration:  item.duration,
					date: item.created_at
				});
			});
			Efemera._showResults();
		});
	},

	getYouTubeDurations: function(ids) {
		// search youtube
		$.ajax({
			url: this.YT_API_URL + '/videos',
			data: {
				part: 'contentDetails',
				id: ids.join(','),
				key: this.youTubeAPIKey
			},
			dataType: 'jsonp',
			success: function(resp) {
				if (resp && resp.items) {
					for (var i = 0; i < resp.items.length; i++) {
						var item = resp.items[i];
						var res = /((\d+)H)?((\d+)M)?((\d+)S)?$/.exec(item.contentDetails.duration);
						var duration = res ? (res[2] ? parseInt(res[2], 10) * 3600 : 0) + (res[4] ? parseInt(res[4], 10) * 60 : 0) + (res[6] ? parseInt(res[6], 10) : 0) : 0;
						var song = Efemera.playlistManager.youtube.songById(item.id);
						if (song) song.duration = duration * 1000; // milliseconds
					}
					Efemera._showResults();
				}
			}
		});
	},

	suggest: function(query) {
		// youtube suggestions
		$.ajax({
			url: "http://suggestqueries.google.com/complete/search",
			data: {
				q: query,
				key: this.youTubeAPIKey,
				client: 'youtube',
				limit: 5
			},
			dataType: 'jsonp',
			success: function(resp) {
				Efemera.searchInfo.suggestions = resp[1].map(function(item) {
					return item[0];
				});
				Efemera._showSearchSuggestions(Efemera.searchInfo.suggestions.slice(0, 5));
			}
		});
	},

	_showSearchSuggestions: function(suggestions) {
		suggestions = suggestions || Efemera.utils.pickRandom(this.searchSuggestions, 5);
		var tmpl = Handlebars.compile($("#search-suggestions-tmpl").html());
		$("#search-suggestions").html(
			tmpl({suggestions: suggestions })	
		);
	},

	showHelp: function() {
		$("#help").show();
	},

	hideHelp: function() {
		$("#help").hide();
	},

	_showResults: function() {
		var tmpl = Handlebars.compile($("#playlist-tmpl").html());
		$("#results").html(
			tmpl(this.playlistManager.searchResults)
		).css('visibility', 'visible');
	},

	_showNowPlaying: function() {
		var song = this.nowPlaying._song;
		if (song) {
			$("#now-playing-title").text(song.title).attr('href', song.url);
			$("#now-playing-thumb img").attr('src', song.thumb);
			$("html").addClass('now-playing');
		} else {
			$("html").removeClass('now-playing');
		}
	}
};

Efemera.utils = {
	mixin: function(obj, methods) {
		for (var i in methods) obj[i] = methods[i];
	},

	toTimeStr: function(t) {
		t = Math.floor(t / 1000);
		var min = Math.floor(t / 60), sec = Math.floor(t % 60);
		return min + ":" + (sec > 9 ? sec : ('0' + sec));
	},
	
	pickRandom: function(arr, n) {
		var picks = [];
		while (picks.length < n) {
			var idx = Math.round(Math.random() * (arr.length - 1));
			if (picks.indexOf(arr[idx]) === -1) picks.push(arr[idx]);
		}
		return picks;
	} 
};
