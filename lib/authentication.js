"use strict";

const {Cc,Cu,Ci,Cm} = require("chrome");
const {Services} = Cu.import("resource://gre/modules/Services.jsm");
var panels = require('sdk/panel');
var tabs = require('sdk/tabs');

var querystring = require('sdk/querystring');

var secMan = Cc["@mozilla.org/scriptsecuritymanager;1"]
            .getService(Ci.nsIScriptSecurityManager);

var domStorageManager = Cc["@mozilla.org/dom/storagemanager;1"]
                            .getService(Ci.nsIDOMStorageManager);

var currentToken = null;

const XMLHttpRequest = require("sdk/addon/window").window.XMLHttpRequest;

/**
 * try to retrieve user data stored into a localStorage database of qwant.com
 * 
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

/**
 * retrieve the token created during the login step on qwant.com
 * @return string
 */
const getToken = function() {
    let user = getUserFromStorage();
    if (!user) {
        currentToken = null;
        return '';
    }
    if (!('isLogged' in user) || user.isLogged == false) {
        currentToken = null;
        return '';
    }
    if (!('token' in user) || user.token == '') {
        currentToken = null;
        return '';
    }
    currentToken = user.token;
    return user.token;
}
exports.getToken = getToken;

/**
 * indicates if the user is authenticated on qwant.com or not
 * @return bool
 */
exports.isAuthenticated = function() {
    return (getToken() != '');
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

/**
 * call a qwant API using the token of the authenticated user
 * @return Promise
 */
exports.callUserApi = function(path, parameters, method) {
    if (!currentToken) {
        getToken();
        if (!currentToken) {
            throw new Error("no token");
        }
    }
    parameters = parameters || {};
    parameters.session_token = currentToken;
    return callApi(path, parameters, method);
}

/**
 * call a qwant API using the token of the authenticated user
 * the API is called on the boards endpoint
 * @return Promise
 */
exports.callBoardApi = function(path, parameters, method) {
    if (!currentToken) {
        getToken();
        if (!currentToken) {
            throw new Error("no token");
        }
    }
    parameters = parameters || {};
    parameters.session_token = currentToken;
    return callApi(path, parameters, method, true);
}

/**
 * call a qwant API that don't need a token
 * @return Promise
 */
var callApi = function(path, parameters, method, onBoard) {
    method = method || 'get';

    let uri = (onBoard?"https://api-boards.qwant.com/api": "https://api.qwant.com/api") + path;
    let data = null;
    if (method == 'post') {
        data = querystring.stringify(parameters);
    }
    else {
        uri += '?'+querystring.stringify(parameters);
    }

    let p = new Promise(function(resolve, reject) {
        var client = new XMLHttpRequest();
        client.open(method, uri);
        if (data) {
            client.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
            client.send(data);
        }
        else {
            client.send();
        }

        client.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                try {
                    resolve(JSON.parse(this.responseText));
                }
                catch(e) {
                    resolve(this.response);
                }
            } else {
                reject(new Error(this.statusText));
            }
        };
        client.onerror = function () {
            reject(new Error(this.statusText));
        };
    });
    return p;
};

exports.callApi = callApi;

