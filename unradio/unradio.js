(function(root) {

	var parsers = {
		json: function(data) {
			return JSON.parse(data);
		}
	};


	root.unradio = new Vue({
		el: '#unradio',

		data: {
			streams: [],
			current_stream: {},
			metadata: {},
			paused: true
		},

		ready: function() {

			// Fetch the streams from an external JSON

			this.$http.get('streams.json').then(function(response) {
				this.streams = response.json();
			}, function(response) {
				// todo implement error response
			});

			// Listen to audio elements from the DOM element
			// to make sure we keep the `paused` flag in sync

			var audio_el = this.$els.audio;

			audio_el.addEventListener('play', function() {
				this.paused = false;
			}.bind(this));

			audio_el.addEventListener('pause', function() {
				this.paused = true;
			}.bind(this));

			this.$watch('current_stream', function(stream) {
				if (stream && stream.metadata) {
					var url = stream.metadata.url;
					var parser = parsers[stream.metadata.parser];
					this.$http.get(url).then(function(response) {
						this.metadata = parser ? parser(response) : response.json();
					});
				}
			});
			
		},

		methods: {

			// Checks whether a stream is the current stream
			// this is used in the sidebar to toggle the CSS classes for each stream
			iscurrent: function(stream) {
				return stream === this.current_stream;
			}, 

			// Switch to a stream
			switchto: function(stream) {
				this.current_stream = stream;
				// update the tab's title to include the stream
				document.title = stream.title + ' ・ Unradio';
			},

			play: function() {
				this.$els.audio.play();
			},

			pause: function() {
				this.$els.audio.pause();
			}
		}
	});
})(window);