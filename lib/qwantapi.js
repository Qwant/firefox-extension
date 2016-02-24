"use strict";
var authentication = require('./authentication');

exports.getBoards = function() {
    return authentication
        .callApi('/board/getFlatList')
        .then(function(response) {
            if (response.status != 'success') {
                throw new Error("Problem occured during boards retrieval ("+JSON.stringify(response)+")");
            }
            return response.data.boards;
        });
}
