"use strict";

var pageMod         = require("sdk/page-mod");

var eventsWorker = null;

var main = function() {
	return new Promise(function(resolve, reject) {
		pageMod.PageMod({
			include: "*",
			contentScriptFile : "./js/events.js",
			onAttach: function(worker) {
				eventsWorker = worker;
				resolve(worker);
			}
		});
	});
};

var login = function() {
	if (eventsWorker === null) {
		main().then(function(eventsWorker) {
			eventsWorker.port.emit("qwant_extension_login");
		});
	} else {
		eventsWorker.port.emit("qwant_extension_login");
	}
};

var logout = function() {
	if (eventsWorker === null) {
		main().then(function(eventsWorker) {
			eventsWorker.port.emit("qwant_extension_logout");
		});
	} else {
		eventsWorker.port.emit("qwant_extension_logout");
	}
};

module.exports = {
	main : main,
	login : login,
	logout : logout
};