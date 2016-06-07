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

document.addEventListener("qwant_website_open_extension", function() {
	self.port.emit("qwant_website_open_extension");
});

self.port.on("qwant_extension_login", function() {
	console.log('login');
	document.dispatchEvent(new CustomEvent("qwant_extension_login"));
});

self.port.on("qwant_extension_logout", function() {
	console.log('logout');
	document.dispatchEvent(new CustomEvent("qwant_extension_logout"));
});