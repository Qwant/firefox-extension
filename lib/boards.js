"use strict";

var user   = require("./user");
var qwant   = require("./qwant");

var createNote = function(data) {
	return new Promise(function(resolve, reject) {
		data.session_token = user.user.session_token;
		qwant.api(qwant.routes.createNote, data)
			.then(function(resolveApi) {
					resolve(resolveApi);
				},
				function(rejectApi) {
					reject(rejectApi);
				});
	});
};

var createAdvancedNote = function() {

};

var createBoard = function(data) {
	return new Promise(function(resolve, reject) {
		data.session_token = user.user.session_token;
		data.board_description = "";
		qwant.api(qwant.routes.createBoard, data)
			.then(function (resolveApi) {
					resolve(resolveApi);
				},
				function (rejectApi) {
					reject(rejectApi);
				});
	});
};

module.exports = {
	createNote: createNote,
	createAdvancedNote: createAdvancedNote,
	createBoard: createBoard
};