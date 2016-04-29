const QWT_URL = "https://www.qwant.com";

let { Cc, Ci } = require('chrome');

var ios = Cc["@mozilla.org/network/io-service;1"]
	.getService(Ci.nsIIOService);
var ssm = Cc["@mozilla.org/scriptsecuritymanager;1"]
	.getService(Ci.nsIScriptSecurityManager);
var dsm = Cc["@mozilla.org/dom/storagemanager;1"]
	.getService(Ci.nsIDOMStorageManager);

var uri = ios.newURI(QWT_URL, "", null);
var principal = ssm.getCodebasePrincipal(uri);
var storage = dsm.getLocalStorageForPrincipal(principal, "");

var save = function(key, value) {
	storage.setItem(key, value);
};

var load = function(key) {
	return storage.getItem(key);
};

var remove = function(key) {
	delete storage[key];
};

module.exports = {
	save: save,
	load: load,
	remove: remove
};