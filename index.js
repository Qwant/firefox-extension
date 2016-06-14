"use strict";

var self = require("sdk/self")
	, _ = require("sdk/l10n").get
	, tabs = require("sdk/tabs")
	, searchPlugin = require('./lib/searchplugin');

exports.main = function (options) {
	// loadReason = install enable startup upgrade downgrade
	let firstLoad = options.loadReason == 'install' ||
		options.loadReason == 'upgrade';

	require('./lib/privacy').main(firstLoad);
	require('./lib/panel').main(firstLoad);

	if (options.loadReason === 'enable' || firstLoad) {
		searchPlugin.addQwant(searchPlugin.setAsDefault);
	}

	if (firstLoad) {
		tabs.open("https://www.qwant.com/extension/firefox/first-run");
	}
};

exports.onUnload = function (reason) {
	//reason = uninstall disable shutdown upgrade downgrade
	if (reason == 'uninstall' || reason == 'disable') {
		require('./lib/privacy').reset();
		require('./lib/searchplugin').removeQwant();
	}
};