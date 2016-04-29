"use strict";

var PROTOCOLE     = "https:";
var BOARDS_URL    = "//boards.qwant.com";

var avatar = document.querySelectorAll(".account__avatar")[0];
var username = document.querySelectorAll(".account__username")[0];
var boardsLink = document.querySelectorAll(".account__boards")[0];

document.querySelectorAll(".button__logout")[0]
	.addEventListener("click", function() {
		self.port.emit("do_logout");
	});

document.querySelectorAll(".buttons__boards")[0]
	.addEventListener("click", function() {
		self.port.emit("do_boards");
	});

document.querySelectorAll(".buttons__bookmarks")[0]
	.addEventListener("click", function() {
		self.port.emit("do_bookmarks");
	});

self.port.on("popup_data", function(user) {
	avatar.src = PROTOCOLE + user.avatar;
	username.innerHTML = user.username;
	boardsLink.href = PROTOCOLE + BOARDS_URL + "/user/" + user.username;
});