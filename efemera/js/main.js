function onYouTubeIframeAPIReady() {
	Efemera.YTplayer = new YT.Player('ytplayer', { 
		width: '1', 
		height: '1',
		events: {
			onReady: function() {
				// Efemera.playAll();
			},
			onError: function(e) {
				// Fuck off, youtube
			},
			onStateChange: function(e) {
				Efemera.nowPlaying._ytPlayerStateChanged(e);
			}
		} 
	});
};

Efemera.initialize();
$(function() { 
	Efemera.initializeUI();

	// Google Analytics
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-42742950-1', 'efemera.ro');
	ga('send', 'pageview');
});