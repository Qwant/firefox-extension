"use strict";

var changeTPIcon = function(state) {
	var icon = document.querySelectorAll(".tracking-protection__content__icon")[0];
	if (state === true) {
		icon.classList.remove("icon__tracking-protection--disabled");
		icon.classList.add("icon__tracking-protection--enabled");
	} else {
		icon.classList.remove("icon__tracking-protection--enabled");
		icon.classList.add("icon__tracking-protection--disabled");
	}
}

document.querySelectorAll(".tracking-protection__content__button")[0]
	.addEventListener("click", function(){
		var checkbox = document.querySelectorAll(".tracking-protection__content__button__checkbox")[0];

		if (checkbox.checked === true) {
			self.port.emit("tracking_protection_on");
			changeTPIcon(true);
		} else {
			self.port.emit("tracking_protection_off");
			changeTPIcon(false);
		}
	});

self.port.on("tracking_protection_status", function(value){
	var checkbox = document.querySelectorAll(".tracking-protection__content__button__checkbox")[0];
	var checkboxElement = document.querySelectorAll(".tracking-protection__content__button")[0];

	checkboxElement.style.display = "inherit";
	checkbox.checked = value;
	changeTPIcon(value);
});