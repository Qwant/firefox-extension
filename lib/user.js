"use strict";

var querystring = require('sdk/querystring');

var qwant           = require("./qwant");
var localstorage    = require("./localstorage");

const NO_USER   = 0;
const USER_WEB  = 1;
const USER_EXT  = 2;

var user = {
	username: "",
	avatar: "",
	session_token: "",
	bookmarks: []
};

var isLogged = function() {
	return (user.session_token !== "");
};

var login = function(data) {
	return new Promise(function(resolveLogin, rejectLogin) {
		qwant.api(qwant.routes.login, {login: data.username, password: data.password})
			.then(function(resolveAPI) {
				if (!resolveAPI.error){
					fillInfos({
						username : resolveAPI.data.user.username,
						avatar : resolveAPI.data.user.avatar,
						session_token : resolveAPI.data.session_token,
						bookmarks : resolveAPI.data.favorites
					});
					save();
					resolveLogin(user);
				} else {
					rejectLogin({
						user: resolveAPI.error
					});
				}
			}, function(rejectAPI) {
				rejectLogin({
					api : rejectAPI
				});
			});
	});

};

var fillInfos = function(data) {
	user.username = data.username;
	user.avatar = data.avatar;
	user.session_token = data.session_token;
	user.bookmarks = data.bookmarks;
};

var logout = function() {
	fillInfos({
		username: "",
		avatar: "",
		session_token: "",
		bookmarks: ""
	});
	localstorage.remove("user");
	localstorage.remove("userExtension");
};

var save = function() {
	localstorage.save("userExtension", JSON.stringify(user));
};

var load = function() {
	var userExtension = localstorage.load("userExtension") || null;
	var userWebsite = localstorage.load("user") || null;
	var userJson = null;
	var flag = NO_USER;

	if (!userExtension && userWebsite) {
		userJson = JSON.parse(userWebsite);
		flag = USER_WEB;
	} else if (userExtension) {
		userJson = JSON.parse(userExtension);
		flag = USER_EXT;
	}
	if (userJson && userJson !== "undefined") {
		fillInfos({
			username:       userJson.username,
			avatar:         userJson.avatar,
			session_token:  userJson.session_token || userJson.token,
			bookmarks:      userJson.favorites
		});
		if (flag === USER_WEB) save();
	}
	return isLogged();
};

var getBoards = function() {
	return new Promise(function(resolve, reject) {
		qwant.api(qwant.routes.getBoards, {
			session_token: user.session_token
		})
			.then(function(resolveAPI) {
				resolve(resolveAPI);
			}, function(rejectApi) {
				reject(rejectApi);
			});
	});
};

module.exports = {
	user: user,
	isLogged: isLogged,
	login: login,
	logout: logout,
	save: save,
	load: load,
	getBoards: getBoards
};