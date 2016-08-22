"use strict";

var extensionInstalled = true;

unsafeWindow.extensionInstalled = cloneInto(extensionInstalled, unsafeWindow);

document.addEventListener("qwant_website_login", function () {
    if (self.options.DEBUG) {
        console.log("Received event from Qwant subdomain : qwant_website_login");
    }
    self.port.emit("qwant_website_login");
});

document.addEventListener("qwant_website_logout", function () {
    if (self.options.DEBUG) {
        console.log("Received event from Qwant subdomain : qwant_website_logout");
    }
    self.port.emit("qwant_website_logout");
});

document.addEventListener("qwant_website_bookmark_created", function () {
    if (self.options.DEBUG) {
        console.log("Received event from Qwant subdomain : qwant_website_bookmark_created");
    }
    self.port.emit("qwant_website_bookmark_created");
});

document.addEventListener("qwant_website_bookmark_deleted", function () {
    if (self.options.DEBUG) {
        console.log("Received event from Qwant subdomain : qwant_website_bookmark_deleted");
    }
    self.port.emit("qwant_website_bookmark_deleted");
});

document.addEventListener("qwant_website_open_extension", function () {
    if (self.options.DEBUG) {
        console.log("Received event from Qwant subdomain : qwant_website_open_extension");
    }
    self.port.emit("qwant_website_open_extension");
});

self.port.on("qwant_extension_login", function () {
    if (self.options.DEBUG) {
        console.log("Sending event to Qwant subdomain : qwant_extension_login");
    }
    document.dispatchEvent(new CustomEvent("qwant_extension_login"));
});

self.port.on("qwant_extension_logout", function () {
    if (self.options.DEBUG) {
        console.log("Sending event to Qwant subdomain : qwant_extension_logout");
    }
    document.dispatchEvent(new CustomEvent("qwant_extension_logout"));
});