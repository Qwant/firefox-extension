"use strict";

document.querySelectorAll(".button__login")[0]
	.addEventListener("click", function() {
		self.port.emit("popup_login");
	});

document.querySelectorAll(".buttons__boards")[0]
	.addEventListener("click", function(){
		self.port.emit("popup_login");
	});
document.querySelectorAll(".buttons__bookmarks")[0]
	.addEventListener("click", function(){
		self.port.emit("popup_login");
	});