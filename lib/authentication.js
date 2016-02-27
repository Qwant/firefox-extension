"use strict";

const {Cc,Cu,Ci,Cm} = require("chrome");
const {Services} = Cu.import("resource://gre/modules/Services.jsm");
var secMan = Cc["@mozilla.org/scriptsecuritymanager;1"]
            .getService(Ci.nsIScriptSecurityManager);
var domStorageManager = Cc["@mozilla.org/dom/storagemanager;1"]
                            .getService(Ci.nsIDOMStorageManager);

function getStorage() {
    // retrieve security context for qwant.com
    let url = Services.io.newURI("https://www.qwant.com", null, null);
    let principal = secMan.createCodebasePrincipal(url,
                                                    {});
    // retrieve the localStorage object corresponding to qwant.com
    return domStorageManager.getLocalStorageForPrincipal(principal, "https://www.qwant.com");
    
}


/**
 * try to retrieve user data stored into a localStorage database of qwant.com
 *
 * We use this function only at startup of the addon, and not each time we need
 * to know if the user is logged or not, because domStorageManager
 * manages a kind of cache, so we don't have realtime data from localstorage.
 * @return object  user informations
 */
function getUserFromStorage() {
    let storage = getStorage();
    if (!storage) {
        return null;
    }
    let user = storage.getItem('user');
    if (!user) {
        return null;
    }
    return JSON.parse(user);
}

function setTokenInLocalStorage(username, token) {
    let storage = getStorage();
    storage.setItem('userExtension', JSON.stringify({session_token: token, user: {username: username} }));
}

var panels = require('sdk/panel');
var tabs = require('sdk/tabs');

/**
 * contains the token used to call API, when the user is authenticated
 */
var currentToken = null;
var currentUser = null;


var pageWorkers = [];

exports.init = function() {
    // we prepare listeners to listen event from messages from qwant.com,
    // sent when the user login or logout
    var pageMod = require('sdk/page-mod').PageMod({
    include: ['*.qwant.com'],
    contentScriptFile: './content-qwant.js',
    onAttach: function(worker) {
            worker.port.on('login', function(details) {
                currentToken = details.token;
                currentUser = details.username;
            });
            worker.port.on('logout', function() {
                currentToken = null;
                currentUser = null;
            });
            pageWorkers.push(worker);
            worker.on('detach', function () {
                var index = pageWorkers.indexOf(worker);
                if(index != -1) {
                    pageWorkers.splice(index, 1);
                }
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
    return (currentToken != null && currentToken != '');
}

exports.login = function (username, token) {
    currentUser = username;
    currentToken = token;
    setTokenInLocalStorage(username, token);
    setMessageToWorkers("login", { token: token })
}

exports.logout = function() {
    currentToken = null;
    currentUser = null;
    setMessageToWorkers("logout", {})
}

function setMessageToWorkers(eventName, data) {
    pageWorkers.forEach(function(worker, index) {
        data.isMaster = (index == 0);
        worker.port.emit(eventName, data);
    });
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
