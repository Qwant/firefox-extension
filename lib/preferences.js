//'use strict';

var Core = require('main');

var FAVICON_BASE_64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2pJREFUeNpcU1toHFUY/s6Zmd1JZmfm7DbZJJsLmxVjm27CiEmDSjVrKQi2NhF8E5KCQVAoRhAVFJGCb1oR6UNdiJcnRTRvfVDcvNhaTMIEa1tb06Sb2zaTdWez99uMM9FI9IcDh3P+7/tv30/wP8s+fmKUlCrnUCrFuKNRBkWGXauahONmrWLhc/nrL+YO+pP9S/7EaUY83hkqq2Pl1Cay60lUfRKoxwOP2ITAscfAKwoaxv3Z2t3bZ9nlWdPF8ftgjgUSVA1odWML5k4K6WLORL2ig1JQjhv1Xl+E3D8I4YG+MaqoYQcdc0n2CKhPmaGqX6tt3kMtbbiP00Op5GcHU808b72KwPK7Vkhm/FNBjTulzOAyxknuyadHSXc0kUxbKBt/mGHLiAUWr+rfh44w1V/SXHD0JWuh+VwyVzh/WCMemqARlXEPDsPa2o5RKskT+XwZ80YN8/W2aRd8pUfTuv3ySmeQJdxjfONLro31adI7t3S7UnnPWt2BXbwO0rQxQfInz6wYdTH8Q0Y1p/RL/kvaFOvmpZVQR551PbPstJlAJEVQvmaKZ+d7CSFm4Xw4ww9KjDBR5+/IHeHtQgPrkqK76W5IqlZnQUY78ujq2AURPBCcUaJcYJWvTrklzXFdnA7bGgVsjf94YBzpTBb3MiXgJ2A2MoDudhXH62nIRptDsISR0DXAU4DNre01VAhvgcgMUEPghcGuVV+uJUxv7Gj/NFz3BJtNoghsW8oB9TDWm3fR4LfNMO7qf0+tpkG1gSZRpzQgzSk9AXBKM3v47cTk0pcT5mouM53l8ygLJZTFQ0iSFvNGgxsnx2rmd4vDk+DAIAoOk3iFZ17uoiDyk+1hhj/Xdy+cjut6MrVgLjuCstdSMVgleCJL+nOPzJvfLgxplJALkKhTh+XkEvhoT8qfXNv6tFSsv3jr1/tYaxhmxk7ieOQ2+3Dsg3+l7kZ2waxZZk+wq0CDxUloc2pPiXpi4/XIkcBQ/0OtWjVXZTlDBHEkvG9O5IxAOeaXFLSrHUDV1tG58Yq7Snte8TeHzLee7R0pmZV4a3cQPQP98Afb8OOdFybd/1bWx9oDUTBfFDWrJY7O4oijh+p/tnHf3vh58ehNM/tyLPj78KOHFoYti77vFcSTtm394vP2XjwcfO23g/5/CTAAuUtTR7QTMVYAAAAASUVORK5CYII=';

/**
 * User preferences management
 * @file preferences.js
 * @author Qwant
 * @module Preferences
 * @class Preferences
 * @constructor
 */
var Preferences = function() {
	var search = Core.services.search;
/**
 * Add Qwant search engine to browser
 * @function addQwantEngine
 */
	function addQwantEngine() {
		if (!(search.getEngineByName('Qwant.com'))) {
			search.addEngineWithDetails(
				'Qwant.com',
				FAVICON_BASE_64,
				'Q',
				Core._.get('engine_description'),
				'GET',
				'https://www.qwant.com/'
			);
		}
		var qwE = search.getEngineByName('Qwant.com');
		qwE.addParam('q', '{searchTerms}', 'text/html');
		qwE.addParam('client', 'firefox', 'text/html');
	}
/**
 * Set qwant.com as homepage
 * @function setQwantAsHomepage
 */
	function setQwantAsHomepage() {
		savePreviousHomepage();
		Core.preferences.set('browser.startup.homepage', 'https://www.qwant.com');
	}
/**
 * Set Qwant search engine as default
 * @function setQwantEngineAsDefault
 */
	function setQwantEngineAsDefault() {
		if (!(search.getEngineByName('Qwant.com'))) {
			addQwantEngine();
			
		}
		if (search.currentEngine.name != 'Qwant.com') {
			search.currentEngine = search.getEngineByName('Qwant.com');
		}
	}
/**
 * Store the previous homepage in order to restore it if uninstall
 * @function savePreviousHomepage
 */
	function savePreviousHomepage() {
		var prevHomepage = Core.preferences.get('browser.startup.homepage');
		if (prevHomepage === undefined || prevHomepage === '') {
			Core.sStorage.storage.previousHomePage = '';
		} else {
			Core.sStorage.storage.previousHomePage = prevHomepage;
		}
	}
/**
 * Reset the user preferences
 * @function resetUserPreferences
 */
	function resetUserPreferences() {
		Core.preferences.set('browser.startup.homepage', Core.sStorage.storage.previousHomePage);
		Core.preferences.reset('embedded_google');
		Core.preferences.reset('embedded_yahoo');
		Core.preferences.reset('embedded_bing');
		Core.preferences.reset('embedded_yandex');
		Core.preferences.reset('embedded_mail');
		Core.preferences.reset('save_last');
		Core.preferences.reset('default_engine');
		Core.preferences.reset('homepage');
	}

	return {
		addQwantEngine			: addQwantEngine,
		setQwantAsHomepage		: setQwantAsHomepage,
		setQwantEngineAsDefault	: setQwantEngineAsDefault,
		savePreviousHomepage	: savePreviousHomepage,
		resetUserPreferences	: resetUserPreferences
	};
}();

module.exports = Preferences;