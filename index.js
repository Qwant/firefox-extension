"use strict";

var self = require("sdk/self");
var buttons = require('sdk/ui/button/action');
var _ = require("sdk/l10n").get;

exports.main = function (options, callbacks) {

    let isFirstEnabling = options.loadReason == 'install' ||
                          options.loadReason == 'enable';
                          // loadReason = install enable startup upgrade downgrade
    prepareButtons()

    require('./lib/privacy').init(isFirstEnabling);

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



function prepareButtons() {

    var noteButton = buttons.ActionButton({
        id: "qwant-note",
        label:  _("boardnote.toolbarbutton.label"),
        icon: {
            "16": "./img/icon_note_16.png",
            "32": "./img/icon_note_32.png",
            "48": "./img/icon_note_48.png"
        },
        onClick: handleNoteClick
    });
    
    function handleNoteClick(state) {
        console.log("note click");
        console.log('token', require('./lib/authentication').getToken());
    }

    var bookmarkButton = buttons.ActionButton({
        id: "qwant-bookmark",
        label: _("bookmark.toolbarbutton.label"),
        icon: {
            "16": "./img/icon_bookmark_16.png",
            "32": "./img/icon_bookmark_32.png",
            "48": "./img/icon_bookmark_48.png"
        },
        onClick: handleBookmarkClick
    });

    function handleBookmarkClick(state) {
        console.log("bookmark click");
    }
}