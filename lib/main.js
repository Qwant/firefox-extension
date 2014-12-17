'use strict';
/**
 * Core object
 * @file main.js
 * @author Qwant
 * @module Core
 * @class Core
 * @constructor
 */
var Core = function() {
	var {Cc,Cu,Ci,Cm}	= require("chrome"),
		{Services}		= Cu.import("resource://gre/modules/Services.jsm"),

		_				= require('sdk/l10n'),
		clipboard		= require('sdk/clipboard'),
		contextMenu		= require('sdk/context-menu'),
		notifications	= require("sdk/notifications"),
		preferences		= require("sdk/preferences/service"),
		self			= require('sdk/self'),
		sPrefs			= require('sdk/simple-prefs'),
		sStorage		= require('sdk/simple-storage'),
		tabs			= require('sdk/tabs'),
		unload			= require('sdk/system/unload'),

		hotkey			= require('sdk/hotkeys'),
		pageMod			= require('sdk/page-mod'),
		panel			= require('sdk/panel'),
		request			= require('sdk/request'),
		toggleButton	= require('sdk/ui/button/toggle');

	return {
		Cc				: Cc,
		Cu				: Cu,
		Ci				: Ci,
		Cm				: Cm,
		services		: Services,

		_				: _,
		clipboard		: clipboard,
		contextMenu		: contextMenu,
		notifications	: notifications,
		preferences		: preferences,
		self			: self,
		sPrefs			: sPrefs,
		sStorage		: sStorage,
		tabs			: tabs,
		unload			: unload,

		hotkey			: hotkey,
		pageMod			: pageMod,
		panel			: panel,
		request			: request,
		toggleButton	: toggleButton
	};
}();

module.exports = Core;

var Interface		= require('interface'),
	Preferences		= require('preferences'),
	Communication	= require('communication')(Core, Interface),
	OnLoad			= require('onLoad')(Core, Preferences),
	OnUnload		= require('onUnload')(Core, Preferences),
	Engines			= require('engines')();


/*
 TODO : Add this to the package.rdf when encoding will be okay.
{
	"name": "default_engine",
	"title": "",
	"description": "",
	"type": "bool",
	"value": false
}

*/