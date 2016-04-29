"use strict";

document.querySelectorAll(".footer__informations")[0]
	.addEventListener("click", function(){
		var tooltip = document.querySelectorAll(".tooltip__informations")[0];
		tooltip.style.display = tooltip.style.display === 'none' ? 'inherit' : 'none';
	});

