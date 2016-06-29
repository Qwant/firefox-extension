"use strict";

var textElement = document.querySelectorAll(".tracking-protection__content__text")[0];
var textOK = "";
var textKO = "";

var changeTPIcon = function(state) {
	var icon = document.querySelectorAll(".tracking-protection__content__icon")[0];
	if (state === true) {
		icon.classList.remove("icon__tracking-protection--disabled");
		icon.classList.add("icon__tracking-protection--enabled");
	} else {
		icon.classList.remove("icon__tracking-protection--enabled");
		icon.classList.add("icon__tracking-protection--disabled");
	}
};

var changeText = function(state) {
	textElement.innerText = state ? textOK : textKO;
};

document.querySelectorAll(".tracking-protection__content__button")[0]
	.addEventListener("click", function(){
		var checkbox = document.querySelectorAll(".tracking-protection__content__button__checkbox")[0];

		if (checkbox.checked === true) {
			self.port.emit("tracking_protection_on");
			changeTPIcon(true);
			changeText(true);
		} else {
			self.port.emit("tracking_protection_off");
			changeTPIcon(false);
			changeText(false);
		}
		self.port.emit("close-popup");
	});

self.port.on("tracking_protection_status", function(data){
	var checkbox = document.querySelectorAll(".tracking-protection__content__button__checkbox")[0];
	var checkboxElement = document.querySelectorAll(".tracking-protection__content__button")[0];

	textOK = data.text_enabled;
	textKO = data.text_disabled;

	checkboxElement.style.display = "inherit";
	checkbox.checked = data.status;
	changeTPIcon(data.status);
	changeText(data.status);
});


document.querySelectorAll(".tracking-protection__content__text")[0]
	.addEventListener("click", function() {
		self.port.emit("close-popup");
	});