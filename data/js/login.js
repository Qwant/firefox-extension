"use strict";

var hideSubmit = function () {
    var loginDiv = document.querySelectorAll(".login")[0];
    var submitButton = document.querySelectorAll(".login__input__submit")[0];
    var loader = document.querySelectorAll(".login__input__loader")[0];

    loader.style.display = "block";
    submitButton.style.display = "none";

};
var displaySubmit = function () {
    var loginDiv = document.querySelectorAll(".login")[0];
    var submitButton = document.querySelectorAll(".login__input__submit")[0];
    var loader = document.querySelectorAll(".login__input__loader")[0];

    loader.style.display = "none";
    submitButton.style.display = "block";
};

var formValidation = function (event) {
    event.preventDefault();
    if (event.key && event.key != "Enter") return;

    var username = document.querySelectorAll(".login__input__login")[0].value;
    var password = document.querySelectorAll(".login__input__password")[0].value;

    hideSubmit();
    self.port.emit("do_login", {username, password});
};

document.querySelectorAll(".login__input__submit")[0]
    .addEventListener("click", formValidation);
document.querySelectorAll(".login__input__login")[0]
    .addEventListener("keyup", formValidation);
document.querySelectorAll(".login__input__password")[0]
    .addEventListener("keyup", formValidation);

self.port.on("popup_display_submit", function () {
    displaySubmit();
});

document.querySelectorAll(".login__input__register")[0]
    .addEventListener("click", function () {
        self.port.emit("close-popup");
    });

document.querySelectorAll(".login__input__lost-password")[0]
    .addEventListener("click", function () {
        self.port.emit("close-popup");
    });
