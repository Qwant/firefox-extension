"use strict";
var authentication = require('./authentication');

exports.getBoards = function() {
    return authentication
        .callBoardApi('/board/getFlatList')
        .then(function(response) {
            if (response.status != 'success') {
                console.log("Error on /board/getFlatList" + JSON.stringify(response));
                throw new Error("Problem occured during boards retrieval");
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
                throw new Error("Problem occured during url preview retrieval");
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
                throw new Error("Problem occured during note creation");
            }
            return true;
        });
}