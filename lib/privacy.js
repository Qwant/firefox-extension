var { PrefsTarget } = require("sdk/preferences/event-target");
var buttons = require('sdk/ui/button/action');
var Preferences = require("sdk/preferences/service");

const prefTrack = "privacy.trackingprotection.enabled";

exports.init  = function(isInstall) {
    // create button
    let privacyButton = buttons.ActionButton({
        id: "qwant-privacy",
        label: "Qwant privacy",
        icon: {
            "16": "./img/icon_privacy_16.png",
            "32": "./img/icon_privacy_32.png",
            "48": "./img/icon_privacy_48.png"
        },
        onClick: function handlePrivacyClick(state) {
            var val = Preferences.get(prefTrack, false);
            Preferences.set(prefTrack, !val);
        }
    });

    // to update the icon dependng of the preference status
    let updateButton = function() {
        if (Preferences.get(prefTrack, false)) {
            privacyButton.state("window", {
                icon: {
                    "16": "./img/icon_privacy_16.png",
                    "32": "./img/icon_privacy_32.png",
                    "48": "./img/icon_privacy_48.png"
                },
            });
        }
        else {
            privacyButton.state("window", {
                icon: {
                    "16": "./img/icon_privacy_off_16.png",
                    "32": "./img/icon_privacy_off_32.png",
                    "48": "./img/icon_privacy_off_48.png"
                },
            });
        }
    }

    // listen change on the tracking protection setting
    var target = PrefsTarget({
        branchName: "privacy.trackingprotection." });
    target.on("enabled", updateButton);

    // first install, we save the initial value to restore it when needed
    if (isInstall) {
        var val = Preferences.get(prefTrack, false);
        require("sdk/simple-prefs").prefs['trackingInitialValue'] = val;
    }

    updateButton();
}

exports.reset  = function() {
    Preferences.set(prefTrack, require("sdk/simple-prefs").prefs['trackingInitialValue']);
}
