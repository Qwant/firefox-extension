'use strict';

var Core = require('main');

/**
 * Main interface for the addon.
 * @file interface.js
 * @author Qwant
 * @module Interface
 * @class Interface
 * @constructor
 */
var Interface = function() {
	var	qwantButton	= Core.toggleButton.ToggleButton({
        id: 'toolbar_button_id',
		//label: 'Qwant',
		label: Core._.get('toolbar_button_label'),
			icon: {
				'16': './img/logo-16.png',
				'32': './img/logo-32.png',
				'64': './img/logo-64.png'
			},
			onClick: displayPanel
		}),
		qwantPopup		= Core.panel.Panel({
			width: 525,
			height: 93,
			contentURL: Core.self.data.url('popup.html'),
			contentScriptFile: Core.self.data.url('./js/popupScript.js')
		}),
		qwantHotkey		= Core.hotkey.Hotkey({
			combo: 'alt-Q',
			onPress: displayPanel
		});
/**
 * Displays panel
 * @function displayPanel
 */
	function displayPanel() {
		if (qwantPopup.isShowing) {
			qwantPopup.hide();
			qwantButton.state('window', {
				checked: false
			});
		} else {
			qwantPopup.show({
				position: qwantButton
			});
			
		}
	}
/**
 * Display the options
 * @function displayOptions
 */
	function displayOptions() {
		Core.tabs.open({
			url:  Core.self.data.url('options.html'),
			onReady: function(tab) {
				var worker = tab.attach({
					contentScriptFile: Core.self.data.url('./js/optionsScript.js')
				});
				worker.port.emit('getOptions', Core.sPrefs);
				worker.port.on('google', function(state) {
					Core.sPrefs.prefs.embedded_google = state;
				});
				worker.port.on('bing', function(state) {
					Core.sPrefs.prefs.embedded_bing = state;
				});
				worker.port.on('yahoo', function(state) {
					Core.sPrefs.prefs.embedded_yahoo = state;
				});
				worker.port.on('yandex', function(state) {
					Core.sPrefs.prefs.embedded_yandex = state;
				});
				worker.port.on('mail', function(state) {
					Core.sPrefs.prefs.embedded_mail = state;
				});
				worker.port.on('save', function(state) {
					Core.sPrefs.prefs.save_last = state;
				});
				worker.port.on('default_engine', function(state) {
					Core.sPrefs.prefs.default_engine = state;
				});
			}
		});
	}
	
	return {
		qwantButton		: qwantButton,
		qwantPopup		: qwantPopup,
		qwantHotkey		: qwantHotkey,
		displayPanel	: displayPanel,
		displayOptions	: displayOptions
	};
}();

module.exports = Interface;