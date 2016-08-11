"use strict";

var self = require("sdk/self")
    , _ = require("sdk/l10n").get
    , tabs = require("sdk/tabs")
    , searchPlugin = require('./lib/searchplugin')
    , Preferences = require("sdk/preferences/service");

const FIREFOX4QWANT = "extensions.qwant.distribution";

exports.main = function (options) {
    // loadReason = install enable startup upgrade downgrade
    let firstLoad = options.loadReason == 'install' ||
        options.loadReason == 'enabled';

    let f4q = Preferences.get(FIREFOX4QWANT) || false;

    require('./lib/privacy').main(firstLoad);
    require('./lib/panel').main(firstLoad);

    if (firstLoad && f4q === false) {
        searchPlugin.addQwant(searchPlugin.setAsDefault);
        tabs.open("https://www.qwant.com/extension/firefox/first-run");
    }
};

exports.onUnload = function (reason) {
    let f4q = Preferences.get(FIREFOX4QWANT);

    //reason = uninstall disable shutdown upgrade downgrade
    if (reason == 'uninstall' || reason == 'disable') {
        if (f4q === false) {
            require('./lib/searchplugin').removeQwant();
        }
        require('./lib/privacy').reset();
    }
};