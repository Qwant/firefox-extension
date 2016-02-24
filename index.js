"use strict";

var self = require("sdk/self");
var buttons = require('sdk/ui/button/action');
var _ = require("sdk/l10n").get;

exports.main = function (options, callbacks) {

    let isFirstEnabling = options.loadReason == 'install' ||
                          options.loadReason == 'enable';
                          // loadReason = install enable startup upgrade downgrade

    require('./lib/privacy').init(isFirstEnabling);
    require('./lib/boardnotes').init();
    require('./lib/bookmarks').init();

    if (isFirstEnabling) {
        require('./lib/searchplugin').register();
    }
};

exports.onUnload = function (reason) {
    //reason = uninstall disable shutdown upgrade downgrade
    if (reason == 'uninstall' || reason == 'disable') {
        require('./lib/privacy').reset();
    }
};