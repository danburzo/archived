var menubar = require('menubar');
const { TouchBar } = require('electron');

var mb = menubar({
	dir: '.',
	width: 200,
	height: 200
});

const volumeSlider = new TouchBar.TouchBarSlider({
	label: 'Volume',
	change: new_volume => mb.window.webContents.send('change-volume', new_volume),
	minValue: -40,
	maxValue: 0
});
const pitchSlider = new TouchBar.TouchBarSlider({
	label: 'Pitch',
	change: new_pitch => mb.window.webContents.send('change-pitch', new_pitch),
	minValue: 440,
	maxValue: 880
});


const touchBar = new TouchBar([
	volumeSlider,
	new TouchBar.TouchBarSpacer({size: 'small'}),
	pitchSlider
])

mb.on('after-create-window', function() {
  mb.window.setTouchBar(touchBar);
}).on('show', function() {
	mb.window.webContents.send('start');
}).on('hide', function() {
	mb.window.webContents.send('stop');
})