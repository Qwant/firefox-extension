'use strict';

/**
 * Main interface for the addon.
 * @file communication.js
 * @author Qwant
 * @module Communication
 * @class Communication
 * @param Core
 * @param Interface
 * @constructor
 */
var Communication = function (Core, Interface) {
	Interface.qwantPopup.port.on('search', function (search) {
		Core.tabs.open({
			url: 'https://www.qwant.com/?q=' + search + '&client=firefox'
		});
		Interface.displayPanel();
	});
	
	Interface.qwantPopup.port.on('options', function () {
		Interface.displayOptions();
		Interface.displayPanel();
	});
	
	Interface.qwantPopup.port.on('open', function () {
		if (Core.sStorage.storage.qwantQuery !== null) {
			Interface.qwantPopup.port.emit('storage', Core.sStorage.storage.qwantQuery);
		}
	});
};

module.exports = Communication;