/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const {utils: Cu} = Components;

Cu.import("resource://gre/modules/Services.jsm");

const rootURI                               = __SCRIPT_URI_SPEC__.replace("bootstrap.js", "");
const COMMONJS_URI                          = "resource://gre/modules/commonjs";
const {require}                             = Cu.import(COMMONJS_URI + "/toolkit/require.js", {});
const {Bootstrap}                           = require(COMMONJS_URI + "/sdk/addon/bootstrap.js");

var {startup, shutdown, uninstall}          = new Bootstrap(rootURI);

function install (aData, aReason) {
    if (aReason == 5) {
        Services.prefs.setBoolPref("extensions.qwant.firstrun", true);
    }
}