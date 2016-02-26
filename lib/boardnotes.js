"use strict";
var toggleButtons = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var _ = require("sdk/l10n").get;
var authentication = require('./authentication');
var qwantAPI = require('./qwantapi');
var tabs = require("sdk/tabs");

var noteButton = null;

exports.init = function() {

    var authPopup = authentication.getPopup();
    var notePopup = panels.Panel({
        width: 400,
        height: 470,
        contentURL: './boardnote/notepopup.html',
        contentScriptFile: './boardnote/notepopup.js'
    });
    notePopup.on("show", function() {
        let tab = tabs.activeTab;
        notePopup.port.emit("load", "load");

        let desc = 'not found';
        if ('qwantInfo' in tab) {
            desc = tab.qwantInfo.description;
        }

        var formInfo = {
            url : tab.url,
            title: tab.title,
            description: desc,
            images : [],
            boards : []
        }
        qwantAPI.getUrlInfo(tab.url)
        .then(function(urlInfo) {
            if (urlInfo.description) {
                formInfo.description = urlInfo.description;
            }
            if (urlInfo.images && urlInfo.images.length) {
                formInfo.images = urlInfo.images;
            }
            return qwantAPI.getBoards();
        })
        .then(function(boards) {
            formInfo.boards = boards;
            notePopup.port.emit("initform", formInfo);
        })
        .catch(function(error) {
            notePopup.port.emit("error", error.message);
        });
    });

    notePopup.on("hide", function() {
        currentPopup = null;
        noteButton.state('window', {
            checked: false
        });
    });

    notePopup.port.on('cancel', function() {
        notePopup.hide();
    });

    notePopup.port.on('submit', function(formData) {
        notePopup.port.emit("load", "save");
        /*qwantAPI.postNote(formData)
        .then(function() {
            notePopup.hide();
        },
        function(error) {
            notePopup.port.emit("error", error.message);
        });*/
    });

    authPopup.on("hide", function() {
        currentPopup = null;
        noteButton.state('window', {
            checked: false
        });
    })

    var currentPopup = null;

    noteButton = toggleButtons.ToggleButton({
        id: "qwant-note",
        label:  _("boardnote.toolbarbutton.label"),
        icon: {
            "16": "./img/icon_note_16.png",
            "32": "./img/icon_note_32.png",
            "48": "./img/icon_note_48.png"
        },
        onClick: function handleNoteClick(state) {
            if (currentPopup && currentPopup.isShowing) {
                currentPopup.hide();
                return;
            }
            if (!authentication.isAuthenticated()) {
                currentPopup = authPopup;
            }
            else {
                currentPopup = notePopup;
            }
            currentPopup.show({
                position: noteButton
            });
        }
    });
}

exports.showPopup = function() {
    noteButton.click();
}

exports.isActivated = function() {
    if (!noteButton) {
        return false;
    }
    return !noteButton.state('window').disabled;
}

exports.activate = function() {
    if (!noteButton) {
        return;
    }

    noteButton.state('window', {
        disabled : false,
        icon: {
            "16": "./img/icon_note_16.png",
            "32": "./img/icon_note_32.png",
            "48": "./img/icon_note_48.png"
        }
    });
}

exports.deactivate = function() {
    if (!noteButton) {
        return
    }
    noteButton.state('window', {
        disabled : true,
        icon: {
            "16": "./img/icon_note_disabled_16.png",
            "32": "./img/icon_note_disabled_32.png",
            "48": "./img/icon_note_disabled_48.png"
        }
    });
}
