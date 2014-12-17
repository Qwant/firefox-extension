'use strict';

/**
 * User preferences management
 * @file onLoad.js
 * @author Qwant
 * @module OnLoad
 * @class OnLoad
 * @param Core
 * @param Preferences
 * @constructor
 */
var OnLoad = function(Core, Preferences) {
	var search = Core.services.search;
	var reason = Core.self.loadReason;

	switch (reason) {
		case 'install' :
			search.init(function() {
//				Preferences.setQwantEngineAsDefault();
				Core.tabs.open({
					url: Core.self.data.url('thanks.html')
				});
				Preferences.setQwantAsHomepage();
			});
			break;
		case 'enable' :
//			if (Core.sPrefs.prefs.default_engine === true) {
//				Preferences.setQwantEngineAsDefault();
//			}
			if (Core.sPrefs.prefs.homepage === true) {
				Preferences.setQwantAsHomepage();
			}
			break;
		case 'startup' :
//			if (Core.sPrefs.prefs.default_engine === true) {
//				Preferences.setQwantEngineAsDefault();
//			}
			if (Core.sPrefs.prefs.homepage === true) {
				Preferences.setQwantAsHomepage();
			}
			break;
		case 'upgrade' :
			break;
		case 'downgrade' :
			break;
	}
};

module.exports = OnLoad;