"use strict";

var PROTOCOLE     = "https:";
var BOARDS_URL    = "//boards.qwant.com";

var avatar = document.querySelectorAll(".account__avatar")[0];
var username = document.querySelectorAll(".account__username")[0];
var boardsLink = document.querySelectorAll(".button__link--board")[0];

document.querySelectorAll(".account__logout")[0]
	.addEventListener("click", function() {
		self.port.emit("do_logout");
	});

document.querySelectorAll(".button__action--board")[0]
	.addEventListener("click", function() {
		self.port.emit("do_boards");
	});

document.querySelectorAll(".button__action--bookmark")[0]
	.addEventListener("click", function() {
		self.port.emit("do_bookmarks");
	});

boardsLink.addEventListener("click", function() {
	self.port.emit("close-popup");
});

document.querySelectorAll(".button__link--bookmark")[0]
	.addEventListener("click", function() {
		self.port.emit("close-popup");
	});

document.querySelectorAll(".account__settings")[0]
	.addEventListener("click", function() {
		self.port.emit("close-popup");
	});

document.querySelectorAll(".account__logout")[0]
	.addEventListener("click", function() {
		self.port.emit("close-popup");
	});

self.port.on("popup_data", function(user) {
	avatar.src = PROTOCOLE + user.avatar;
	username.innerText = user.username;
	boardsLink.href = PROTOCOLE + BOARDS_URL + "/user/" + user.username;
});

self.port.on("popup_action", function(action) {
	if (action === "boards") {
		document.querySelectorAll(".button__action--board")[0].click();
	} else if (action === "bookmarks") {
		document.querySelectorAll(".button__action--bookmark")[0].click();
	}
});