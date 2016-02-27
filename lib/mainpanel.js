"use strict";
var toggleButtons = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var _ = require("sdk/l10n").get;
var authentication = require('./authentication');
var bookmarks = require('./bookmarks');
var boardnotes = require('./boardnotes');
var qwantAPI = require('./qwantapi');
var tabs = require("sdk/tabs");
var privacy = require('./privacy');
var self = require("sdk/self");

const getLanguage = require("sdk/l10n/json/core").language;

var mainButton = null;
var showWelcome = false;

exports.init = function(firstUse) {
    showWelcome = firstUse;
    let mainPopup = panels.Panel({
        width: 320, 
        height: 640,
        contentURL: './main/mainpopup.html',
        contentScriptFile: './main/mainpopup.js'
    });

    mainPopup.on("show", function() {
        let options = {
            showWelcome: showWelcome,
            language: getLanguage(),
            privacyEnabled: privacy.isEnabled(),
            isAuthenticated: authentication.isAuthenticated(),
            canAddNote : boardnotes.isActivated(),
            canAddFavorite : bookmarks.isActivated()
        }
        mainPopup.port.emit("show", options);
    })

    mainPopup.on("hide", function() {
        mainButton.state('window', {
            checked: false
        });
    })
    mainPopup.port.on("showmain", function() {
        showWelcome = false;
    });
    mainPopup.port.on("auth-login", function(authData) {
        qwantAPI.doLogin(authData.email, authData.password)
        .then(function() {
            mainPopup.hide();
        }, function(error){
            mainPopup.port.emit("auth-state", {isAuthenticated: false, error: (error.message || error)});
        })
    });

    mainPopup.port.on("auth-logout", function() {
        authentication.logout();
        mainPopup.hide();
    });

    mainPopup.port.on("go-register", function() {
        tabs.open({
            url: "https://www.qwant.com/register"
        });
        mainPopup.hide();
    });
    mainPopup.port.on("go-lost-password", function() {
        tabs.open({
            url: "https://www.qwant.com/password_lost"
        });
        mainPopup.hide();
    });
    mainPopup.port.on("privacy-change", function(enable) {
        privacy.enable(enable);
    });

    mainPopup.port.on("show-add-note", function() {
        boardnotes.showPopup();
    });

    mainPopup.port.on("show-add-favorite", function() {
        bookmarks.showPopup();
    });
    mainPopup.port.on("go-notes", function() {
        tabs.open({
            url: "https://boards.qwant.com/user/"+authentication.getUsername()
        });
        mainPopup.hide();
    });

    mainPopup.port.on("about", function() {
        tabs.open({
            url: self.data.url('about.html')
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
