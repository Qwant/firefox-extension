"use strict";

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
        };
        qwantAPI.getUrlInfo(tab.url)
        .then(function(urlInfo) {
	        if (urlInfo.type) {
		        formInfo.type = urlInfo.type;
	        }
            if (urlInfo.description) {
                formInfo.description = urlInfo.description;
            }
            if (urlInfo.images && urlInfo.images.length) {
                formInfo.images = urlInfo.images;
            }
            return Promise.all([
                                qwantAPI.getBoards(),
                                qwantAPI.getCategories()
                               ]);
        })
        .then(function([boards, categories]) {
            formInfo.boards = boards;
            formInfo.categories = categories;
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
        let p;
        if (formData.board) {
            p = qwantAPI.createBoard(formData.board)
                .then(function(newBoard){
                    formData.note.board_id = newBoard.board_id;
                    return qwantAPI.postNote(formData.note);
                });
        }
        else {
            p = qwantAPI.postNote(formData.note);
        }
        p.then(function() {
            notePopup.port.emit("submitok");
        },
        function(error) {
            notePopup.port.emit("error", error.message);
        });
    });

    authPopup.on("hide", function() {
        currentPopup = null;
        noteButton.state('window', {
            checked: false
        });
    });

    var currentPopup = null;
};

exports.showPopup = function() {
    noteButton.click();
};

exports.isButtonActivated = function() {
    if (!noteButton) {
        return false;
    }
    return !noteButton.state('window').disabled;
};

exports.activateButton = function() {
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
};

exports.deactivateButton = function() {
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
};
