"use strict";

var self      = require("sdk/self")
	, _       = require("sdk/l10n").get
	, tabs    = require("sdk/tabs");

exports.main = function (options) {
	// loadReason = install enable startup upgrade downgrade
	let firstLoad = options.loadReason == 'install' ||
		options.loadReason == 'upgrade';

	require('./lib/privacy').main(firstLoad);
	require('./lib/panel').main(firstLoad);

	if (firstLoad) {
		var searchPlugin = require('./lib/searchplugin');
		searchPlugin.addQwant(searchPlugin.setAsDefault);
		tabs.open("https://www.qwant.com/extension/firefox/first-run");
	}
};

exports.onUnload = function (reason) {
	//reason = uninstall disable shutdown upgrade downgrade
	if (reason == 'uninstall' || reason == 'disable') {
		require('./lib/privacy').reset();
	}
};