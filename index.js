"use strict";

var self = require("sdk/self");
var buttons = require('sdk/ui/button/action');
var _ = require("sdk/l10n").get;
var tabs = require("sdk/tabs");

exports.main = function (options, callbacks) {

    let isFirstEnabling = options.loadReason == 'install' ||
                          options.loadReason == 'enable';
                          // loadReason = install enable startup upgrade downgrade

    require('./lib/privacy').init(isFirstEnabling);
    require('./lib/mainpanel').init(isFirstEnabling);
    let boardnotes = require('./lib/boardnotes')
    let bookmarks = require('./lib/bookmarks')

    boardnotes.init();
    bookmarks.init();

    function checkGoodUrl() {
        let url = tabs.activeTab.url;
        if (/^https?:\/\//.test(url)) {
            boardnotes.activate();
            bookmarks.activate();
            return true;
        }
        else {
            boardnotes.deactivate();
            bookmarks.deactivate();
            return false;
        }
    }

    tabs.on('activate', function (tab) {
        checkGoodUrl();
    });
    tabs.on('ready',  function (tab) {
        if (checkGoodUrl()) {
            tab.qwantInfo = { description: '' };
            var worker = tab.attach({
                contentScriptFile: './content-tab-info.js'
            });
            worker.port.on("tab-meta-info", function(info) {
                tab.qwantInfo = info;
            });
        }
    });
    checkGoodUrl();

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