'use strict';

/**
 * Addon reaction when being unloaded / uninstalled
 * @file onUnload
 * @author Qwant
 * @param Core
 * @param Preferences
 * @constructor
 */
var OnUnload = function(Core, Preferences) {
	var reason = Core.unload.when(function(reason) { // Because of a bug on the 'uninstall' reason, we do not check FOR NOW the reason
		Preferences.resetUserPreferences();
	});
};

module.exports = OnUnload;