"use strict";
var config = require('./configuration');

let {Cc, Ci} = require('chrome');

var ios = Cc["@mozilla.org/network/io-service;1"]
    .getService(Ci.nsIIOService);
var ssm = Cc["@mozilla.org/scriptsecuritymanager;1"]
    .getService(Ci.nsIScriptSecurityManager);
var dsm = Cc["@mozilla.org/dom/storagemanager;1"]
    .getService(Ci.nsIDOMStorageManager);

var uri = ios.newURI(config.QWT_URL, "", null);
var principal = ssm.getCodebasePrincipal(uri);
var storage = dsm.getLocalStorageForPrincipal(principal, "");

var checksum = function(str) {
    if(!str) {
        return -1;
    }
    var hash = 0, i, chr, len;
    if (str.length == 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var save = function (key, value) {
    storage.setItem(key, value);
    storage.setItem("h_" + key, checksum(value));
};

var load = function (key) {
    var value = storage.getItem(key);
    if (parseInt(storage.getItem("h_" + key)) === checksum(value)) {
        return value;
    }
    return null;
};

var remove = function (key) {
    delete storage[key];
    delete storage["h_" + key];
};

module.exports = {
    save: save,
    load: load,
    remove: remove
};