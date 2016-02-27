"use strict";
var authentication = require('./authentication');
var _ = require("sdk/l10n").get;
var querystring = require('sdk/querystring');
const XMLHttpRequest = require("sdk/addon/window").window.XMLHttpRequest;

/**
 * call a qwant API using the token of the authenticated user
 * @return Promise
 */
function callUserApi(path, parameters, method) {
    let token = authentication.getToken();
    if (!token) {
        throw new Error("no token");
    }
    parameters = parameters || {};
    parameters.session_token = token;
    return callApi(path, parameters, method);
}

/**
 * call a qwant API using the token of the authenticated user
 * the API is called on the boards endpoint
 * @return Promise
 */
function callBoardApi (path, parameters, method) {
    let token = authentication.getToken();
    if (!token) {
        throw new Error("no token");
    }
    parameters = parameters || {};
    parameters.session_token = token;
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

exports.doLogin = function(email, password) {
    //let p = new Promise(function(resolve, fail) {
    //    resolve({status:"success", data:{user: { username: 'laurentj'}, session_token:'foo'}});
    //});
    //return p
    return callApi('/account/login', {email, password}, 'post')
        .then(function(response) {
            if (response.status != 'success') {
                console.debug("Error on /account/login" + JSON.stringify(response));
                if (response.error == 101) {
                    throw new Error(_('auth.error.badlogin'));
                }
                throw new Error(_('auth.error.login'));
            }
            authentication.login(response.data.user.username, response.data.session_token);
            // TODO we receive also favorites in response.data.favorites [{id,url,name,status}]
            return true;
        });
}

exports.getBoards = function() {
    return callBoardApi('/board/getFlatList')
        .then(function(response) {
            if (response.status != 'success') {
                console.debug("Error on /board/getFlatList" + JSON.stringify(response));
                throw new Error(_('boardnote.error.get.boards'));
            }
            return response.data.boards;
        });
}

exports.getUrlInfo = function(url) {
    return callBoardApi('/note/preview', { content: url })
        .then(function(response) {
            if (response.status != 'success') {
                console.debug("Error on /note/preview" + JSON.stringify(response));
                throw new Error(_('boardnote.error.get.preview'));
            }
            return response.data;
        });
}

exports.postNote = function(formData) {
    return callBoardApi('/note/create', formData, 'post')
        .then(function(response) {
            if (response.status != 'success') {
                console.debug("Error on /note/create" + JSON.stringify(response));
                if (response.error == '304') {
                    throw new Error(_('boardnote.error.already.exists'));
                }
                throw new Error(_('boardnote.error.create.note'));
            }
            return true;
        });
}

exports.createBoard = function(formData) {
    return callBoardApi('/board/create', formData, 'post')
        .then(function(response) {
            if (response.status != 'success') {
                console.debug("Error on /board/create" + JSON.stringify(response));
                throw new Error(_('boardnote.error.create.board'));
            }
            return response.data.board;
        });
}

exports.postFavorite = function(formData) {
    return callUserApi('/account/favorite/create', formData, 'post')
        .then(function(response) {
            if (response.status != 'success') {
                if (response.error != 401) { // 401 = link already exists (?)
                    console.debug("Error on /account/favorite/create" + JSON.stringify(response));
                    throw new Error(_('bookmark.error.create.favorite'));
                }
                return false;
            }
            return true;
        });
}

// cache for categories
var categories = null;
exports.getCategories = function() {
    if (categories) {
        return new Promise(function(resolve, reject) {
            resolve(categories);
        });
    }
    return callApi('/board/category/list', null, 'get', true)
        .then(function(response) {
            if (response.status != 'success') {
                console.debug("Error on /board/category/list" + JSON.stringify(response));
                throw new Error(_('boardnote.error.get.categories'));
            }
            categories = response.data;
            return categories;
        });
}
