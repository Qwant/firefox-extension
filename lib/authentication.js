"use strict";

const {Cc,Cu,Ci,Cm} = require("chrome");
const {Services} = Cu.import("resource://gre/modules/Services.jsm");
var secMan = Cc["@mozilla.org/scriptsecuritymanager;1"]
            .getService(Ci.nsIScriptSecurityManager);
var domStorageManager = Cc["@mozilla.org/dom/storagemanager;1"]
                            .getService(Ci.nsIDOMStorageManager);

/**
 * try to retrieve user data stored into a localStorage database of qwant.com
 *
 * We use this function only at startup of the addon, and not each time we need
 * to know if the user is logged or not, because domStorageManager
 * manages a kind of cache, so we don't have realtime data from localstorage.
 * @return object  user informations
 */
function getUserFromStorage() {
    // retrieve security context for qwant.com
    let url = Services.io.newURI("https://www.qwant.com", null, null);
    let principal = secMan.createCodebasePrincipal(url,
                                                    {});
    // retrieve the localStorage object corresponding to qwant.com
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


var panels = require('sdk/panel');
var tabs = require('sdk/tabs');

/**
 * contains the token used to call API, when the user is authenticated
 */
var currentToken = null;
var currentUser = null;

exports.init = function() {
    // we prepare listeners to listen event from messages from qwant.com,
    // sent when the user login or logout
    var pageMod = require('sdk/page-mod').PageMod({
    include: ['*.qwant.com'],
    contentScriptFile: './content-message.js',
    onAttach: function(worker) {
      worker.port.on('login', function(details) {
        currentToken = details.token;
        currentUser = details.username;
      });
      worker.port.on('logout', function() {
        currentToken = null;
        currentUser = null;
      });
    }
  });

    currentToken = null;
    currentUser = null;

    // get data from the localStorage of qwant.com, where we can know if it is
    let user = getUserFromStorage();
    if (user && ('isLogged' in user) && user.isLogged
             && ('token' in user)    && user.token != '') {
        currentToken = user.token;
        currentUser = user.username;
    }
}


/**
 * retrieve the token created during the login step on qwant.com
 * @return string
 */
exports.getToken = function() {
    return currentToken;
};

exports.getUsername = function() {
    return currentUser;
}

/**
 * indicates if the user is authenticated on qwant.com or not
 * @return bool
 */
exports.isAuthenticated = function() {
    return (currentToken != '');
}

var authPopup = null;

/**
 * returns the popup used to display the authentication form when the
 * user is not authenticated on qwant.com
 * @return Popup
 */
exports.getPopup = function() {
    if (!authPopup) {
        authPopup = panels.Panel({
            width: 340,
            height: 170,
            contentURL: './auth/authpopup.html',
            contentScriptFile: './auth/authpopup.js'
        });
        authPopup.port.on('cancel', function(){
            authPopup.hide();
        });
        authPopup.port.on("go-connect", function() {
            tabs.open({
                url: "https://www.qwant.com/login"
            });
            authPopup.hide();
        });
        authPopup.port.on("go-register", function() {
            tabs.open({
                url: "https://www.qwant.com/register"
            });
            authPopup.hide();
        });
        authPopup.port.on("go-lost-password", function() {
            tabs.open({
                url: "https://www.qwant.com/password_lost"
            });
            authPopup.hide();
        });
    }
    return authPopup;
};
