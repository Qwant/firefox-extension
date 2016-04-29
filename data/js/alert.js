"use strict";

var visible = false;

var SHOW_CLASS = "qwant-alert--visible";

/**
 * Definition of HTMLElements
 */

var body = document.body;

var alert = document.createElement("div");
alert.classList.add("qwant-alert");

var alertContent = document.createElement("div");
alertContent.classList.add("qwant-alert__content");

var icon = document.createElement("span");
icon.classList.add("qwant-alert__content__icon");
icon.classList.add("qwant-alert__content__icon--" + self.options.type);

var message = document.createElement("span");
message.classList.add("qwant-alert__content__message");
if (self.options.hasLink) {
	var link = document.createElement("a");
	link.href = self.options.url;
	link.target = "_blank";
	link.innerText = self.options.message;
	message.appendChild(link);
} else {
	message.innerText = self.options.message;
}


/**
 * Functions to show and hide the alert
 */

var show = function() {
	if (!visible) {
		alert.classList.add(SHOW_CLASS);
		visible = true;
		self.port.emit("alert-visible");
		setTimeout(hide, 30000);
	}
};

var hide = function() {
	if (visible) {
		alert.classList.remove(SHOW_CLASS);
		visible = false;
		self.port.emit("alert-hidden");
		setTimeout(function(){
			body.removeChild(alert)
		}, 600);
	}
};

self.port.on("alert-display", function() {
	show();
});

self.port.on("alert-destroy", function() {
	hide();
});

/**
 * Definition of CloseButton.
 * Placed here as it requires the hide function be defined
 */

var closeButton = document.createElement("span");
closeButton.classList.add("qwant-alert__content__icon");
closeButton.classList.add("qwant-alert__content__icon--close");
closeButton.addEventListener("click", hide);

/**
 * Adding content in the webpage
 */

alertContent.appendChild(icon);
alertContent.appendChild(message);
alertContent.appendChild(closeButton);
alert.appendChild(alertContent);

body.insertBefore(alert, body.firstChild);

setTimeout(show, 1);