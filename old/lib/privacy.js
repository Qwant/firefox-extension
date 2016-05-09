
var Preferences = require("sdk/preferences/service");
//var _ = require("sdk/l10n").get;

const prefTrack = "privacy.trackingprotection.enabled";

exports.init  = function(isInstall) {
    // create button
    /*
     var { PrefsTarget } = require("sdk/preferences/event-target");
     var buttons = require('sdk/ui/button/action');
     let privacyButton = buttons.ActionButton({
        id: "qwant-privacy",
        label: _("privacy.toolbarbutton.label"),
        icon: {
            "16": "./img/icon_privacy_16.png",
            "32": "./img/icon_privacy_32.png",
            "48": "./img/icon_privacy_48.png"
        },
        onClick: function handlePrivacyClick(state) {
            var val = Preferences.get(prefTrack, false);
            Preferences.set(prefTrack, !val);
        }
    });*/

    // to update the icon dependng of the preference status
    /*let updateButton = function() {
        if (Preferences.get(prefTrack, false)) {
            privacyButton.state("window", {
                label: _("privacy.toolbarbutton.disable.label"),
                icon: {
                    "16": "./img/icon_privacy_16.png",
                    "32": "./img/icon_privacy_32.png",
                    "48": "./img/icon_privacy_48.png"
                },
            });
        }
        else {
            privacyButton.state("window", {
                label: _("privacy.toolbarbutton.enable.label"),
                icon: {
                    "16": "./img/icon_privacy_off_16.png",
                    "32": "./img/icon_privacy_off_32.png",
                    "48": "./img/icon_privacy_off_48.png"
                },
            });
        }
    }*/

    // listen change on the tracking protection setting
    /*var target = PrefsTarget({
        branchName: "privacy.trackingprotection."
    });
    target.on("enabled", updateButton);
    */

    // first install, we save the initial value to restore it when needed
    if (isInstall) {
        var val = Preferences.get(prefTrack, false);
        require("sdk/simple-prefs").prefs['trackingInitialValue'] = val;
        Preferences.set(prefTrack, true);
    }

    //updateButton();
}

exports.isEnabled = function() {
    return Preferences.get(prefTrack, false);
}

exports.enable = function(enable) {
    Preferences.set(prefTrack, enable);
}

exports.reset  = function() {
    Preferences.set(prefTrack, require("sdk/simple-prefs").prefs['trackingInitialValue']);
}
