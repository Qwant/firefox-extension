"use strict";

var self           = require("sdk/self")
    , _            = require("sdk/l10n").get
    , tabs         = require("sdk/tabs")
    , searchPlugin = require('./lib/searchplugin')
    , Preferences  = require("sdk/preferences/service")
    , pageMod      = require('sdk/page-mod')
    , simplePrefs  = require("sdk/simple-prefs");

var config = require("./lib/configuration");

const FIREFOX4QWANT = "app.distributor";

exports.main = function (options) {
    let firstLoad = Preferences.get("extensions.qwant.firstrun", false);
    let f4q       = Preferences.get(FIREFOX4QWANT, "") === "qwant";

    Preferences.set("extensions.qwant.firstrun", false);

    require('./lib/privacy').main(firstLoad);
    require('./lib/panel').main(firstLoad);

    if (firstLoad) {
        searchPlugin.addQwant(searchPlugin.setAsDefault);
        tabs.open("https://www.qwant.com/extension/firefox/first-run");
    }

    pageMod.PageMod({
        include     : "*.qwant.com",
        contentStyle: ".home__snippet__extension {display : none;}",
        attachTo    : ["existing", "top"]
    });
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