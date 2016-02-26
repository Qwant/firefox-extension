"use strict";

var toggleButtons = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var _ = require("sdk/l10n").get;
var authentication = require('./authentication');
var qwantAPI = require('./qwantapi');
var tabs = require("sdk/tabs");

var bookmarkButton = null;

exports.init = function() {

    var authPopup = authentication.getPopup();
    var bookmarkPopup = panels.Panel({
        width: 300,
        height: 220,
        contentURL: './bookmark/bmpopup.html',
        contentScriptFile: './bookmark/bmpopup.js'
    });

    bookmarkPopup.on("show", function() {
        let tab = tabs.activeTab;
        var formInfo = {
            url : tab.url,
            name: tab.title
        }
        bookmarkPopup.port.emit("initform", formInfo);
    });

    bookmarkPopup.on("hide", function() {
        currentPopup = null;
        bookmarkButton.state('window', {
            checked: false
        });
    });

    bookmarkPopup.port.on('cancel', function() {
        bookmarkPopup.hide();
    });

    bookmarkPopup.port.on('submit', function(formData) {
        bookmarkPopup.port.emit("load", "save");
        qwantAPI.postFavorite(formData)
        .then(function() {
            bookmarkPopup.hide();
        },
        function(error) {
            bookmarkPopup.port.emit("error", error.message);
        });
    });

    authPopup.on("hide", function() {
        currentPopup = null;
        bookmarkButton.state('window', {
            checked: false
        });
    })

    var currentPopup = null;

    bookmarkButton = toggleButtons.ToggleButton({
        id: "qwant-bookmark",
        label: _("bookmark.toolbarbutton.label"),
        icon: {
            "16": "./img/icon_bookmark_16.png",
            "32": "./img/icon_bookmark_32.png",
            "48": "./img/icon_bookmark_48.png"
        },
        onClick: function handleBookmarkClick(state) {
            if (currentPopup && currentPopup.isShowing) {
                currentPopup.hide();
                return;
            }
            if (!authentication.isAuthenticated()) {
                currentPopup = authPopup;
            }
            else {
                currentPopup = bookmarkPopup;
            }
            currentPopup.show({
                position: bookmarkButton
            });
        }
    });
}

exports.showPopup = function() {
    bookmarkButton.click();
}

exports.isActivated = function() {
    if (!bookmarkButton) {
        return false;
    }
    return !bookmarkButton.state('window').disabled;
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
