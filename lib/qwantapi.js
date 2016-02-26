"use strict";
var authentication = require('./authentication');
var _ = require("sdk/l10n").get;

exports.getBoards = function() {
    return authentication
        .callBoardApi('/board/getFlatList')
        .then(function(response) {
            if (response.status != 'success') {
                console.log("Error on /board/getFlatList" + JSON.stringify(response));
                throw new Error(_('boardnote.error.get.boards'));
            }
            return response.data.boards;
        });
}

exports.getUrlInfo = function(url) {
    return authentication
        .callBoardApi('/note/preview', { content: url })
        .then(function(response) {
            if (response.status != 'success') {
                console.log("Error on /note/preview" + JSON.stringify(response));
                throw new Error(_('boardnote.error.get.preview'));
            }
            return response.data;
        });
}

exports.postNote = function(formData) {
    return authentication
        .callBoardApi('/note/create', formData, 'post')
        .then(function(response) {
            if (response.status != 'success') {
                console.log("Error on /note/create" + JSON.stringify(response));
                if (response.error == '304') {
                    throw new Error(_('boardnote.error.already.exists'));
                }
                throw new Error(_('boardnote.error.create.note'));
            }
            return true;
        });
}

exports.createBoard = function(formData) {
    return authentication
        .callBoardApi('/board/create', formData, 'post')
        .then(function(response) {
            if (response.status != 'success') {
                console.log("Error on /board/create" + JSON.stringify(response));
                throw new Error(_('boardnote.error.create.board'));
            }
            return response.data.board;
        });
}

exports.postFavorite = function(formData) {
    return authentication
        .callUserApi('/account/favorite/create', formData, 'post')
        .then(function(response) {
            if (response.status != 'success') {
                console.log("Error on /account/favorite/create" + JSON.stringify(response));
                throw new Error(_('bookmark.error.create.favorite'));
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
    return authentication
        .callApi('/board/category/list', null, 'get', true)
        .then(function(response) {
            if (response.status != 'success') {
                console.log("Error on /board/category/list" + JSON.stringify(response));
                throw new Error(_('boardnote.error.get.categories'));
            }
            categories = response.data;
            return categories;
        });
}
