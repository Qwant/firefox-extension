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
        width: 500,
        height: 200,
        contentURL: './boardnote/notepopup.html',
        contentScriptFile: './boardnote/notepopup.js'
    });
    notePopup.on("show", function() {
        let tab = tabs.activeTab;
        
        notePopup.port.emit("show");
        qwantAPI.getBoards()
        .then(function(boards) {
            let desc = 'not found';
            if ('qwantInfo' in tab) {
                desc = tab.qwantInfo.description;
            }
            notePopup.port.emit("initform", {
                boards:boards,
                url : tab.url,
                title: tab.title,
                description: desc
            });
        }, function(error) {
            notePopup.port.emit("error", error.message);
        });
    })

    notePopup.on("hide", function() {
        noteButton.state('window', {
            checked: false
        });
    })

    authPopup.on("hide", function() {
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
                currentPopup = null;
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
