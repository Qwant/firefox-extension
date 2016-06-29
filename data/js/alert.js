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
alertContent.classList.add("qwant-alert__content--" + self.options.type);

var icon = document.createElement("span");
icon.classList.add("qwant-alert__content__icon");
icon.classList.add("qwant-alert__content__icon--" + self.options.type);

var message = document.createElement("span");
message.classList.add("qwant-alert__content__message");
message.innerText = self.options.message;

if (self.options.hasLink) {
	var link = document.createElement("a");
	link.href = self.options.url;
	link.target = "_blank";
	link.innerText = self.options.linkText;
	message.appendChild(link);
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
			if (body !== undefined) {
				body.removeChild(alert);
			}
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


if (self.options.type === "question") {
	var buttonsContainer = document.createElement("div");
	buttonsContainer.classList.add("qwant-alert__content__buttons");

	var yes = document.createElement("a");
	yes.classList.add("qwant-alert__content__button");
	yes.classList.add("qwant-alert__content__button--yes");
	yes.href="javascript:;";
	yes.innerText = self.options.yes;
	yes.addEventListener("click", function() {
		self.port.emit("reload-tabs");
		hide();
	});
	buttonsContainer.appendChild(yes);

	var no = document.createElement("a");
	no.classList.add("qwant-alert__content__button");
	no.classList.add("qwant-alert__content__button--no");
	no.href="javascript:;";
	no.innerText = self.options.no;
	no.addEventListener("click", function() {
		self.port.emit("reload-tabs-no");
		hide();
	});
	buttonsContainer.appendChild(no);



	alertContent.appendChild(buttonsContainer);
}

if (body !== undefined) {
	body.insertBefore(alert, body.firstChild);
}


setTimeout(show, 1);