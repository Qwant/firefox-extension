"use strict";

var toggleButtons = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var _ = require("sdk/l10n").get;
var authentication = require('./authentication');

exports.init = function() {

    var authPopup = authentication.getPopup();
    var notePopup = panels.Panel({
        width: 500,
        height: 200,
        contentURL: './boardnote/notepopup.html',
        contentScriptFile: './boardnote/notepopup.js'
    });
    notePopup.on("show", function() {
        //notePopup.port.emit("show", {isAuth:isAuth});
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

    var noteButton = toggleButtons.ToggleButton({
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