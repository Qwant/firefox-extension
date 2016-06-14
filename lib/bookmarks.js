"use strict";

var _               = require("sdk/l10n").get;
var bookmarks       = require("sdk/places/bookmarks");
var preferences     = require('sdk/simple-prefs');

var alerts  = require("./alerts");
var user    = require("./user");
var qwant   = require("./qwant");

var qwantGroup = bookmarks.Group({
	title: _("bookmarks.group"),
	group: bookmarks.MENU,
	id: preferences.prefs.bookmarksGroupId
});

/**
 * @return Promise
 */
var getFirefoxBookmarks = function() {
	if (!preferences.prefs["bookmarksGroupId"]) {
		return new Promise(function(resolve, reject){ resolve([]);});
	}

	return new Promise(function(resolve, reject){
		bookmarks.search({ group: qwantGroup})
			.on("end", function(results) {
				resolve(results);
			})
	});
};

/**
 * @return Promise
 */
var sync = function() {
	return new Promise(function(resolveSync, rejectSync) {
		var qwBookmarks = user.getBookmarks();
		var fxBookmarks = getFirefoxBookmarks();

		Promise
			.all([qwBookmarks, fxBookmarks])
			.then(function(values) {
				var newBookmarks = [];
				values[0].forEach(function (qwBookmark) {
					if (/^https?:\/\/[^\/]+$/.test(qwBookmark.url)) {
						// when there are only the domain in the url, let's add a trailing slash
						// because we want that url matches as it is in bookmarks
						// (yes, Places adds a trailing slash if it is missing)
						qwBookmark.url += '/';
					}
					var flag = false;
					values[1].forEach(function (fxBookmark) {
						if (fxBookmark.url === qwBookmark.url) {
							flag = true;
						}
					});
					if (flag === false) {
						//qwBookmark is a new one, we add him to the list
						newBookmarks.push(bookmarks.Bookmark({
							title: qwBookmark.name,
							url: qwBookmark.url,
							group: qwantGroup
						}));
					}
				});
				// let's add the list to Fx
				return saveToFirefox(newBookmarks);
			});
	});

};

/**
 * @return Promise
 */
var saveToFirefox = function(newBookmarks) {
	return new Promise(function(resolve, reject) {
		bookmarks.save(newBookmarks)
			.on("data", function(item, inputItem) {
				// if the inputItem is the Group we want to create
				// we retrieve the id, to do synchronisation later
				if (inputItem === qwantGroup) {
					preferences.prefs.bookmarksGroupId = item.id
				}
			})
			.on("end", function(results) {
				resolve(true);
			})
			.on("error", function(error, item) {
				reject(item);
			});
	});
};

/**
 * @return array of Promises
 */
var saveToQwant = function(newBookmark) {
	return qwant.api(qwant.routes.createBookmark, newBookmark);
};

/**
 * @return array of Promises
 */
var save = function(data) {
	var responses = [];
	var fxBookmark = bookmarks.Bookmark({
		title: data.name,
		url: data.url,
		group: qwantGroup
	});
	var qwBookmark = {
		session_token: user.user.session_token,
		url: data.url,
		name: data.name,
		status: 1
	};
	responses.push(saveToFirefox(fxBookmark));
	responses.push(saveToQwant(qwBookmark));

	return responses;
};

module.exports = {
	sync: sync,
	save: save
};