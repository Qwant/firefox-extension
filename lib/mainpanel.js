"use strict";
var toggleButtons = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var _ = require("sdk/l10n").get;
var authentication = require('./authentication');
var qwantAPI = require('./qwantapi');
var tabs = require("sdk/tabs");

const getLanguage = require("sdk/l10n/json/core").language;

var mainButton = null;
var showWelcome = false;

exports.init = function(firstUse) {
    showWelcome = firstUse;
    let mainPopup = panels.Panel({
        width: 320, 
        height: 570,
        contentURL: './main/mainpopup.html',
        contentScriptFile: './main/mainpopup.js'
    });

    mainPopup.on("show", function() {
        mainPopup.port.emit("show", {
            showWelcome: showWelcome,
            language: getLanguage()
        });
    })

    mainPopup.on("hide", function() {
        mainButton.state('window', {
            checked: false
        });
    })
    mainPopup.port.on("showmain", function() {
        showWelcome = false;
    });
    mainPopup.port.on("go-register", function() {
        tabs.open({
            url: "https://www.qwant.com/register"
        });
        mainPopup.hide();
    });

    mainButton = toggleButtons.ToggleButton({
        id: "qwant-button",
        label:  _("main.toolbarbutton.label"),
        icon: {
            "16": "./img/icon_16.png",
            "32": "./img/icon_32.png",
            "48": "./img/icon_48.png"
        },
        onClick: function handleNoteClick(state) {
            if (mainPopup.isShowing) {
                mainPopup.hide();
            }
            else {
                mainPopup.show({
                    position: mainButton
                });
            }
        }
    });

    if (firstUse) {
        mainPopup.show({
            position: mainButton
        });
    }
}
