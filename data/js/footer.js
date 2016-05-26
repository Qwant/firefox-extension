"use strict";

var tooltip = document.querySelectorAll(".tooltip__informations")[0];

document.querySelectorAll(".footer__informations")[0]
	.addEventListener("click", function() {
		tooltip.style.display = tooltip.style.display === 'none' ? 'inherit' : 'none';
	});

document.querySelectorAll(".content")[0]
	.addEventListener("click", function() {
		tooltip.style.display = 'none';
	});