"use strict";

var _ = require("sdk/l10n").get;
var simplePrefs = require("sdk/simple-prefs");
var Preferences = require("sdk/preferences/service");
var tabs = require('sdk/tabs');
var alerts = require('./alerts');

const TP_SETTING = "privacy.trackingprotection.enabled";
const DNT_SETTING = "privacy.donottrackheader.enabled";

var main = function (firstLoad) {
	simplePrefs.prefs['TrackProtection'] = (Preferences.get(TP_SETTING) === true && Preferences.get(DNT_SETTING) === true);

	if (firstLoad) {
		simplePrefs.prefs['TP_initial'] = Preferences.get(TP_SETTING, false);
		simplePrefs.prefs['DNT_initial'] = Preferences.get(DNT_SETTING, false);
		enable(false);
	}
};

var enable = function (alert) {
	Preferences.set(TP_SETTING, true);
	Preferences.set(DNT_SETTING, true);
	simplePrefs.prefs['TrackProtection'] = true;
	if (alert === true) {
		alerts.display({
			type: "question",
			message: _('alert.reloadOK'),
			yes: _('yes'),
			no: _('no'),
			hasLink: false,
			url: ""
		});
	}

};

var disable = function () {
	Preferences.set(TP_SETTING, false);
	Preferences.set(DNT_SETTING, false);
	simplePrefs.prefs['TrackProtection'] = false;
	alerts.display({
		type: "question",
		message: _('alert.reloadKO'),
		yes: _('yes'),
		no: _('no'),
		hasLink: false,
		url: ""
	});
};

var reset = function () {
	Preferences.set(TP_SETTING, simplePrefs.prefs['TP_initial']);
	Preferences.set(DNT_SETTING, simplePrefs.prefs['TP_initial']);
};

var isEnabled = function () {
	return simplePrefs.prefs['TrackProtection'];
};

module.exports = {
	main: main,
	enable: enable,
	disable: disable,
	reset: reset,
	isEnabled: isEnabled
};