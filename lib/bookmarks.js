"use strict";

var buttons = require('sdk/ui/button/action');
var _ = require("sdk/l10n").get;
var bookmarkButton = null;

exports.init = function() {

    bookmarkButton = buttons.ActionButton({
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

exports.activate = function() {
    if (!bookmarkButton) {
        return
    }
    bookmarkButton.state('window', {
        disabled : false,
        icon: {
            "16": "./img/icon_bookmark_16.png",
            "32": "./img/icon_bookmark_32.png",
            "48": "./img/icon_bookmark_48.png"
        },
    });
}

exports.deactivate = function() {
    if (!bookmarkButton) {
        return
    }
    bookmarkButton.state('window', {
        disabled : true,
        icon: {
            "16": "./img/icon_bookmark_disabled_16.png",
            "32": "./img/icon_bookmark_disabled_32.png",
            "48": "./img/icon_bookmark_disabled_48.png"
        },
    });
}
