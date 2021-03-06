/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const {utils: Cu} = Components;

Cu.import("resource://gre/modules/Services.jsm");

const rootURI      = __SCRIPT_URI_SPEC__.replace("bootstrap.js", "");
const COMMONJS_URI = "resource://gre/modules/commonjs";
const {require}    = Cu.import(COMMONJS_URI + "/toolkit/require.js", {});
const {Bootstrap}  = require(COMMONJS_URI + "/sdk/addon/bootstrap.js");
const simplePrefs  = require("sdk/simple-prefs");
const Preferences  = require("sdk/preferences/service");

var {startup, uninstall} = new Bootstrap(rootURI);

function install (aData, aReason) {
    if (aReason == 5 || (aReason == 7 && aData.version === "3.1.3")) {
        simplePrefs.prefs['HomePage_initial'] = Preferences.get("browser.startup.homepage");
        Services.prefs.setCharPref("browser.startup.homepage", "https://www.qwant.com/?client=qwant-firefox");
    }
    if (aReason == 5) {
        Services.prefs.setBoolPref("extensions.qwant.firstrun", true);
        Services.prefs.setCharPref("browser.startup.homepage", "https://www.qwant.com/?client=qwant-firefox");
    }
}

function shutdown(aData, aReason) {
    if (aReason == 4 || aReason == 6) {
        Preferences.set("browser.startup.homepage", simplePrefs.prefs['HomePage_initial']);
    }
}