"use strict";

const {Cc,Cu,Ci,Cm} = require("chrome");
const {Services} = Cu.import("resource://gre/modules/Services.jsm");

/**
 * @return object  user informations stored by qwant.com
 */
function getUserFromStorage() {
    // retrieve security context for qwant.com
    let secMan = Cc["@mozilla.org/scriptsecuritymanager;1"]
                    .getService(Ci.nsIScriptSecurityManager);
    let url = Services.io.newURI("https://www.qwant.com", null, null);
    let principal = secMan.createCodebasePrincipal(url,
                                                    {});
    // retrieve the localStorage object corresponding to qwant.com
    let domStorageManager = Cc["@mozilla.org/dom/storagemanager;1"]
                                .getService(Ci.nsIDOMStorageManager);
    let storage = domStorageManager.getLocalStorageForPrincipal(principal, "https://www.qwant.com");

    if (!storage) {
        return null;
    }
    let user = storage.getItem('user');
    if (!user) {
        return null;
    }
    return JSON.parse(user);
}

const getToken = function() {
    let user = getUserFromStorage();
    if (!user) {
        return '';
    }
    if (!('isLogged' in user) || user.isLogged == false) {
        return '';
    }
    if (!('token' in user) || user.token == '') {
        return '';
    }
    return user.token;
}
exports.getToken = getToken;


exports.isAuthenticated = function() {
    return (getToken() != '');
}

