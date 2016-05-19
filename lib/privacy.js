"use strict";

var simplePrefs     = require("sdk/simple-prefs");
var Preferences     = require("sdk/preferences/service");
const TP_SETTING    = "privacy.trackingprotection.enabled";
const DNT_SETTING   = "privacy.donottrackheader.enabled";

var main = function(firstLoad) {
	if (Preferences.get(TP_SETTING) !== true || Preferences.get(DNT_SETTING) !== true) {
		simplePrefs.prefs['TrackProtection'] = false;
	}
	if (firstLoad) {
		simplePrefs.prefs['TP_initial'] = Preferences.get(TP_SETTING, false);
		simplePrefs.prefs['DNT_initial'] = Preferences.get(DNT_SETTING, false);
		enable();
	}
};

var enable = function() {
	Preferences.set(TP_SETTING, true);
	Preferences.set(DNT_SETTING, true);
	simplePrefs.prefs['TrackProtection'] = true;
};

var disable = function() {
	Preferences.set(TP_SETTING, false);
	Preferences.set(DNT_SETTING, false);
	simplePrefs.prefs['TrackProtection'] = false;
};

var reset  = function() {
	Preferences.set(TP_SETTING, simplePrefs.prefs['TP_initial']);
	Preferences.set(DNT_SETTING, simplePrefs.prefs['TP_initial']);
	
};

var isEnabled = function() {
	return simplePrefs.prefs['TrackProtection'];
};

module.exports = {
	main        : main,
	enable      : enable,
	disable     : disable,
	reset       : reset,
	isEnabled   : isEnabled
};