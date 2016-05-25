"use strict";

var toggleButton    = require('sdk/ui/button/toggle').ToggleButton;
var panel           = require('sdk/panel');
var _               = require("sdk/l10n").get;
var tabs            = require("sdk/tabs");
var self            = require("sdk/self");
var pageMod         = require("sdk/page-mod");

var events          = require("./events");
var privacy         = require("./privacy");
var user            = require("./user");
var bookmarks       = require("./bookmarks");
var qwant           = require("./qwant");
var alerts          = require("./alerts");
var panelNote       = require("./panel-note");
var panelBookmark   = require("./panel-bookmark");

var popup   = null;
var button  = null;
var chosenPopup = null;
var chosenAction = null;
var popups  = {
	welcome : {
		url : "./html/welcome.html",
		script : [
			"./js/tracking-protection.js",
			"./js/footer.js",
			"./js/welcome.js"
		],
		width : 350,
		height: 540,
		events: function() {
			commonEvents();
			popup.port.on("popup_login", function(data) {
				chosenAction = data.action;
				chosenPopup = popups.login;
				displayPopup();
			});
		}
	},
	login   : {
		url: "./html/login.html",
		script: [
			"./js/tracking-protection.js",
			"./js/footer.js",
			"./js/login.js"
		],
		width: 350,
		height: 610,
		events: function() {
			commonEvents();
			popup.port.on("popup_previous", function() {
				chosenPopup = popups.welcome;
				displayPopup();
			});
			popup.port.on("do_login", function(data) {
				user.login(data)
					.then(function(resolve) {
						bookmarks.sync()
							.then(function(resolve) {
							}, function(reject) {
							});
						chosenPopup = popups.account;
						displayButton();
						displayPopup();
					}, function(reject) {
						if (reject.user) {
							alerts.display({
								type: "error",
								message: qwant.errorMessage(reject.user),
								hasLink: false,
								url: ""
							});
						} else {
							alerts.display({
								type: "error",
								message: qwant.errorMessage(0),
								hasLink: false,
								url: ""
							});
						}
						popup.port.emit("popup_display_submit");
					});
			});
		}
	},
	account : {
		url : "./html/account.html",
		script : [
			"./js/tracking-protection.js",
			"./js/footer.js",
			"./js/account.js"
		],
		width : 350,
		height: 510,
		onShow : function() {
			popup.port.emit("popup_data", user.user);
			if (chosenAction !== null) {
				popup.port.emit("popup_action", chosenAction);
				chosenAction = null;
			}
		},
		events: function() {
			commonEvents();
			popup.port.on("do_logout", function() {
				chosenPopup = popups.welcome;
				displayPopup();
				user.logout();
			});
			popup.port.on("do_boards", function() {
				popup.hide();
				panelNote.display();
			});
			popup.port.on("do_bookmarks", function() {
				popup.hide();
				panelBookmark.display();
			});
		}
	}
};

var buttonIcons = {
	tp_loggedout : {
		"16": "./img/q2-16.png",
		"32": "./img/q2-32.png",
		"48": "./img/q2-48.png"
	},
	notp_loggedout : {
		"16": "./img/q1-16.png",
		"32": "./img/q1-32.png",
		"48": "./img/q1-48.png"
	},
	notp_loggedin : {
		"16": "./img/q3-16.png",
		"32": "./img/q3-32.png",
		"48": "./img/q3-48.png"
	},
	tp_loggedin : {
		"16": "./img/q4-16.png",
		"32": "./img/q4-32.png",
		"48": "./img/q4-48.png"
	}
};

var getIcon = function() {
	var icon = null;

	if (user.isLogged()) {
		if (privacy.isEnabled()) {
			icon = buttonIcons.tp_loggedin;
		} else {
			icon = buttonIcons.notp_loggedin;
		}
	} else {
		if (privacy.isEnabled()) {
			icon = buttonIcons.tp_loggedout;
		} else {
			icon = buttonIcons.notp_loggedout;
		}
	}

	return icon;
};

var main = function(firstLoad) {
	if (user.load())    chosenPopup = popups.account;
	else                chosenPopup = popups.welcome;

	if (chosenPopup === popups.account) bookmarks.sync();

	popup = panel.Panel({
		width: chosenPopup.width,
		height: chosenPopup.height,
		contentURL: chosenPopup.url,
		contentScriptFile: chosenPopup.script,
		onHide: function() {
			button.state('window', {
				checked: false,
				icon: getIcon()
			});
		},
		onShow: chosenPopup.onShow
	});
	displayButton();

	events.main()
		.then(function(resolve) {
			eventsHandler(resolve);
		});
};

var eventsHandler = function(eventsWorker) {
	eventsWorker.port.on("qwant_website_login", function() {
		if (!user.isLogged()) {
			if (!user.load()) {
				alerts.display({
					type: "error",
					message: qwant.errorMessage(0),
					hasLink: false,
					url: ""
				});
			} else {
				chosenPopup = popups.account;
				displayButton();
			};
		}
	});
	eventsWorker.port.on("qwant_website_logout", function() {
		if (user.isLogged()) {
			user.logout();
		}
	});
	eventsWorker.port.on("qwant_website_bookmark_created", function() {
		bookmarks.sync();
	});
	eventsWorker.port.on("qwant_website_open_extension", function() {
		displayPopup();
	});
};

var displayButton = function() {
	if (button !== null) {
		button.destroy();
	}
	button = toggleButton({
		id: "qwant-button",
		label:  _("toolbar.button.text"),
		icon: getIcon(),
		onClick: function(state) {
			if (popup.isShowing) {
				popup.hide();
			}
			else {
				if (!user.isLogged()) {
					if (user.load()) {
						chosenPopup = popups.account;
					}
				}
				displayPopup();
			}
		}
	});
};

var commonEvents = function() {
	popup.port.on("tracking_protection_on", function(){
		privacy.enable();
		button.state("window", {
			icon: getIcon()
		});
	});
	popup.port.on("tracking_protection_off", function(){
		privacy.disable();
		button.state("window", {
			icon: getIcon()
		});
	});
	popup.port.on("close-popup", function() {
		popup.hide();
	});
};

var displayPopup = function() {
	popup = panel.Panel({
		width: chosenPopup.width,
		height: chosenPopup.height,
		contentURL: chosenPopup.url,
		contentScriptFile: chosenPopup.script,
		onHide: function() {
			button.state('window', {
				checked: false,
				icon: getIcon()
			});
		},
		onShow: chosenPopup.onShow
	});
	chosenPopup.events();
	if (button !== null) popup.show({position: button});
	popup.on("show", function(){
		popup.port.emit("tracking_protection_status", privacy.isEnabled());
	});
};

module.exports = {
	main: main
};