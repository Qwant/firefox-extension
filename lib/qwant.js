"use strict";

var querystring = require('sdk/querystring');
var _ = require("sdk/l10n").get;
const XMLHttpRequest = require("sdk/addon/window").window.XMLHttpRequest;

const SEARCH_API = "https://api.qwant.com/api";
const BOARDS_API = "https://api-boards.qwant.com/api";

var routes = {
    login: {
        path: "/account/login",
        method: "POST",
        apiType: SEARCH_API
    },
    getBookmarks: {
        path: "/account/favorite",
        method: "GET",
        apiType: SEARCH_API
    },
    createBookmark: {
        path: "/account/favorite/create",
        method: "POST",
        apiType: SEARCH_API
    },
    getBoards: {
        path: "/board/getFlatList",
        method: "GET",
        apiType: BOARDS_API
    },
    createBoard: {
        path: "/board/create",
        method: "POST",
        apiType: BOARDS_API
    },
    getNotePreview: {
        path: "/note/preview",
        method: "GET",
        apiType: BOARDS_API
    },
    createNote: {
        path: "/note/create?XDEBUG_SESSION_START=vagrant",
        method: "POST",
        apiType: BOARDS_API
    }
};

var errors = {
    0: {
        code: "ERROR_EXTENSION",
        message: _("error.0.message")
    },
    1: {
        code: "ERROR_FORM_VALIDATION",
        message: _("error.1.message")
    },
    2: {
        code: "ERROR_DATABASE",
        message: _("error.2.message")
    },
    3: {
        code: "ERROR_INTERNAL",
        message: _("error.3.message")
    },
    101: {
        code: "ERROR_USER_NOT_FOUND",
        message: _("error.101.message")
    },
    102: {
        code: "ERROR_USER_DISABLED",
        message: _("error.102.message")
    },
    104: {
        code: "ERROR_USER_BANNED",
        message: _("error.104.message")
    },
    108: {
        code: "ERROR_INVALID_TOKEN",
        message: _("error.108.message")
    },
    201: {
        code: "ERROR_BOARD_NOT_FOUND",
        message: _("error.201.message")
    },
    206: {
        code: "ERROR_BOARD_ALREADY_EXISTS",
        message: _("error.206.message")
    },
    304: {
        code: "ERROR_NOTE_ALREADY_EXISTS",
        message: _("error.304.message")
    },
    401: {
        code: "ERROR_FAVORITE_ALREADY_EXISTS",
        message: _("error.401.message")
    },
    402: {
        code: "ERROR_FAVORITE_URL_NOT_ACCESSIBLE",
        message: _("error.402.message")
    }
};

var categories = [
    {
        id: 10,
        i18n: _('category.animals')
    },
    {
        id: 6,
        i18n: _('category.architecture')
    },
    {
        id: 2,
        i18n: _('category.art')
    },
    {
        id: 11,
        i18n: _('category.automoto')
    },
    {
        id: 12,
        i18n: _('category.beauty')
    },
    {
        id: 19,
        i18n: _('category.culture')
    },
    {
        id: 14,
        i18n: _('category.entrepreneur')
    },
    {
        id: 7,
        i18n: _('category.fashion')
    },
    {
        id: 9,
        i18n: _('category.gastronomy')
    },
    {
        id: 15,
        i18n: _('category.geek')
    },
    {
        id: 29,
        i18n: _('category.health')
    },
    {
        id: 24,
        i18n: _('category.hightech')
    },
    {
        id: 25,
        i18n: _('category.hobbies')
    },
    {
        id: 3,
        i18n: _('category.humor')
    },
    {
        id: 27,
        i18n: _('category.illustration')
    },
    {
        id: 8,
        i18n: _('category.job')
    },
    {
        id: 13,
        i18n: _('category.kids')
    },
    {
        id: 18,
        i18n: _('category.marketing')
    },
    {
        id: 28,
        i18n: _('category.movies')
    },
    {
        id: 26,
        i18n: _('category.music')
    },
    {
        id: 16,
        i18n: _('category.nature')
    },
    {
        id: 4,
        i18n: _('category.news')
    },
    {
        id: 1,
        i18n: _('category.people')
    },
    {
        id: 5,
        i18n: _('category.politics')
    },
    {
        id: 23,
        i18n: _('category.sciences')
    },
    {
        id: 70,
        i18n: _('category.sexy')
    },
    {
        id: 22,
        i18n: _('category.society')
    },
    {
        id: 21,
        i18n: _('category.sport')
    },
    {
        id: 20,
        i18n: _('category.travel')
    },
    {
        id: 17,
        i18n: _('category.videogames')
    },
    {
        id: 30,
        i18n: _('category.web')
    },
    {
        id: 69,
        i18n: _("category.adult")
    },
    {
        id: 31,
        i18n: _('category.others')
    }
];

var api = function (route, params) {
    return new Promise(function (resolve, reject) {
        var client = new XMLHttpRequest();
        var uri = route.apiType + route.path;
        var data = null;

        if (route.method === "POST") {
            params.st_encoded = true;
            data = querystring.unescape(querystring.stringify(params));
        }
        else {
            uri += "?" + querystring.stringify(params);
        }

        client.open(route.method, uri);
        client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        client.timeout = 10000;
        client.send(data);

        client.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(this.response));
            } else {
                reject(this.statusText);
            }
        };

        client.onerror = function () {
            reject(this.statusText);
        };

        client.ontimeout = function () {
            reject(0);
        };
    });
};

var errorMessage = function (errorCode) {
    return errors[errorCode].message;
};

var getCategories = function () {
    var cats = categories.slice(0), // We need to clone the categories array in order not to remove the Adult category
        others = {
            idx: 0,
            item: null
        },
        adult = {
            idx: 0,
            item: null
        },
        stop = false;

    cats.sort(function (a, b) {
        if (a.i18n > b.i18n)
            return 1;
        if (a.i18n < b.i18n)
            return -1;
        return 0;
    });

    stop = false;
    cats.forEach(function (cat, idx) {
        if (69 === cat.id && !stop) {
            adult.idx = idx;
            adult.item = cat;
            cats.splice(adult.idx, 1);
            cats.push(adult.item);
            stop = true;
        }
    });

    stop = false;
    cats.forEach(function (cat, idx) {
        if (31 === cat.id && !stop) {
            others.idx = idx;
            others.item = cat;
            cats.splice(others.idx, 1);
            cats.unshift(others.item);
            stop = true;
        }
    });

    return cats;
};

module.exports = {
    api: api,
    routes: routes,
    errorMessage: errorMessage,
    getCategories: getCategories
};