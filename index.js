var self = require("sdk/self");


exports.main = function (options, callbacks) {

  var buttons = require('sdk/ui/button/action');


  var privacyButton = buttons.ActionButton({
    id: "qwant-privacy",
    label: "Qwant privacy",
    icon: {
      "16": "./img/icon_privacy_16.png",
      "32": "./img/icon_privacy_32.png",
      "48": "./img/icon_privacy_48.png"
    },
    onClick: handlePrivacyClick
  });

  function handlePrivacyClick(state) {
      console.log("privacy click");
  }


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

};



exports.onUnload = function (reason) {
  
};

