"use strict";

document.addEventListener("qwant_website_login", function() {
	self.port.emit("qwant_website_login");
});

document.addEventListener("qwant_website_logout", function() {
	self.port.emit("qwant_website_logout");
});

document.addEventListener("qwant_website_bookmark_created", function() {
	self.port.emit("qwant_website_bookmark_created");
});
document.addEventListener("qwant_website_bookmark_deleted", function() {
	self.port.emit("qwant_website_bookmark_deleted");
});