var self = require("sdk/self");
var buttons = require('sdk/ui/button/action');


exports.main = function (options, callbacks) {

    prepareButtons()
    require('./lib/privacy').init(options.loadReason == 'install' ||
                                  options.loadReason == 'enable');
};



exports.onUnload = function (reason) {
    if (reason == 'uninstall' || reason == 'disable') {
        require('./lib/privacy').reset();
    }
};



function prepareButtons() {

    var noteButton = buttons.ActionButton({
        id: "qwant-note",
        label: "Qwant Note",
        icon: {
            "16": "./img/icon_note_16.png",
            "32": "./img/icon_note_32.png",
            "48": "./img/icon_note_48.png"
        },
        onClick: handleNoteClick
    });
    
    function handleNoteClick(state) {
        console.log("note click");
    }

    var bookmarkButton = buttons.ActionButton({
        id: "qwant-bookmark",
        label: "Qwant bookmark",
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