"use strict";

var toggleButtons = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var _ = require("sdk/l10n").get;
var authentication = require('./authentication');
var qwantAPI = require('./qwantapi');
var tabs = require("sdk/tabs");
var bookmarks = require("sdk/places/bookmarks");
var preferences = require('sdk/simple-prefs');

var bookmarkButton = null;

var pFavorites;

exports.init = function() {
    // let's retrieve and update firefox bookmarks if the user is already
    // authenticated
    if (authentication.isAuthenticated()) {
        pFavorites = qwantAPI.getFavorites()
                            .then(updateBookmarks)
                            .catch(function(){});
    }

    var authPopup = authentication.getPopup();
    var bookmarkPopup = panels.Panel({
        width: 300,
        height: 220,
        contentURL: './bookmark/bmpopup.html',
        contentScriptFile: './bookmark/bmpopup.js'
    });

    bookmarkPopup.on("show", function() {
        let tab = tabs.activeTab;
        var formInfo = {
            url : tab.url,
            name: tab.title
        }
        bookmarkPopup.port.emit("initform", formInfo);
    });

    bookmarkPopup.on("hide", function() {
        currentPopup = null;
        bookmarkButton.state('window', {
            checked: false
        });
    });

    bookmarkPopup.port.on('cancel', function() {
        bookmarkPopup.hide();
    });

    bookmarkPopup.port.on('submit', function(formData) {
        bookmarkPopup.port.emit("load", "save");
        qwantAPI.postFavorite(formData)
        .then(function(success) {
            if (success) {
                return addBookmark(formData)
            }
        })
        .then(function() {
            bookmarkPopup.hide();
        },
        function(error) {
            bookmarkPopup.port.emit("error", error.message);
        });
    });

    authPopup.on("hide", function() {
        currentPopup = null;
        bookmarkButton.state('window', {
            checked: false
        });
    })

    var currentPopup = null;

    bookmarkButton = toggleButtons.ToggleButton({
        id: "qwant-bookmark",
        label: _("bookmark.toolbarbutton.label"),
        icon: {
            "16": "./img/icon_bookmark_16.png",
            "32": "./img/icon_bookmark_32.png",
            "48": "./img/icon_bookmark_48.png"
        },
        onClick: function handleBookmarkClick(state) {
            if (currentPopup && currentPopup.isShowing) {
                currentPopup.hide();
                return;
            }
            if (!authentication.isAuthenticated()) {
                currentPopup = authPopup;
            }
            else {
                currentPopup = bookmarkPopup;
            }
            currentPopup.show({
                position: bookmarkButton
            });
        }
    });
}

exports.showPopup = function() {
    bookmarkButton.click();
}

exports.isButtonActivated = function() {
    if (!bookmarkButton) {
        return false;
    }
    return !bookmarkButton.state('window').disabled;
}

exports.activateButton = function() {
    if (!bookmarkButton) {
        return
    }
    bookmarkButton.state('window', {
        disabled : false,
        icon: {
            "16": "./img/icon_bookmark_16.png",
            "32": "./img/icon_bookmark_32.png",
            "48": "./img/icon_bookmark_48.png"
        },
    });
}

exports.deactivateButton = function() {
    if (!bookmarkButton) {
        return
    }
    bookmarkButton.state('window', {
        disabled : true,
        icon: {
            "16": "./img/icon_bookmark_disabled_16.png",
            "32": "./img/icon_bookmark_disabled_32.png",
            "48": "./img/icon_bookmark_disabled_48.png"
        },
    });
}


/**
 * @return Promise
 */
function getQwantBookmarks() {

    if (!preferences.prefs["bookmarksGroupId"]) {
        return new Promise(function(resolve, reject){ resolve([]);});
    }

    let qwantGroup = bookmarks.Group({
        title:_("bookmark.places.groupname"),
        group: bookmarks.MENU,
        id: preferences.prefs.bookmarksGroupId
    });

    return new Promise(function(resolve, reject){
        bookmarks.search({ group: qwantGroup})
        .on("end", function(results) {
            resolve(results);
        })
    });
}

function saveBookmarks(bmks, unsavedQwantGroupItem) {
    return new Promise(function(resolve, reject){
        bookmarks.save(bmks)
        .on("data", function(item, inputItem) {
            // if the inputItem is the Group we want to create, we retrieve
            // then the id, to do synchronisation later
            if (inputItem == unsavedQwantGroupItem) {
                preferences.prefs.bookmarksGroupId = item.id
            }
        })
        .on("end", function(results){
            resolve();
        })
        .on("error", reject);
    });
}


/**
 * add the bookmark into the Firefox bookmarks
 *
 * @param object {url,name}
 */
function addBookmark(favorite) {

    // the Qwant bookmark group to use when creating the group and favorites
    // the first time.
    let qwantGroup = bookmarks.Group({title:_("bookmark.places.groupname"), group: bookmarks.MENU });

    if (/^https?:\/\/[^/]+$/.test(favorite.url)) {
        // when there are only the domain in the url, let's add a trailing slash
        // because we want that url matches as it is in bookmarks
        // (yes, Places adds a trailing slash if it is missing)
        favorite.url += '/';
    }
    let newFavorite = bookmarks.Bookmark({
        title: favorite.name,
        url: favorite.url,
        group: qwantGroup
     });

    return getQwantBookmarks()
    .then(function(existingFavorites) {
        let favToSave = newFavorite;
        // first, retrieve favorites to update or to remove
        existingFavorites.forEach(function(fav) {
            newFavorite.group = fav.group;
            if (fav.url == newFavorite.url ) {
                // if the title has changed, let update it,
                // else do nothing.
                if (fav.title != newFavorite.title) {
                    fav.title = newFavorite.title;
                    favToSave = fav;
                }
            }
        })
        return saveBookmarks([favToSave], qwantGroup)
    })
}


/**
 * Synchronize the given list of favorites with bookmarks stored into the
 * Qwant group in Firefox's bookmarks
 *
 * @param array list of objects {id,url,name,status}
 */
function synchronizeBookmarks(favorites) {

    // the Qwant bookmark group to use when creating the group and favorites
    // the first time.
    let qwantGroup = bookmarks.Group({title:_("bookmark.places.groupname"), group: bookmarks.MENU });
    let newFavorites = {}

    // fill newFavorites with Bookmark objects
    favorites.forEach(function(fav){
        if (/^https?:\/\/[^/]+$/.test(fav.url)) {
            // when there are only the domain in the url, let's add a trailing slash
            // because we want that url matches as it is in bookmarks
            // (yes, Places adds a trailing slash if it is missing)
            fav.url += '/';
        }
        newFavorites[fav.url] = bookmarks.Bookmark({
           title: fav.name,
           url: fav.url,
           group: qwantGroup
        });
    });

    return getQwantBookmarks()
    .then(function(existingFavorites) {
        let favToSave = [];
        // this is the existing Qwant group in bookmarks. We retrieve it
        // from existing bookmarks as there is no way to retrieve it
        // from the Bookmarks API :-/
        let originalQwantGroup;
        // first, retrieve favorites to update or to remove
        existingFavorites.forEach(function(fav) {
            originalQwantGroup = fav.group;
            if (fav.url in newFavorites) {
                // if the title has changed, let update it,
                // else do nothing.
                if (fav.title != newFavorites[fav.url].title) {
                    fav.title = newFavorites[fav.url].title;
                    favToSave.push(fav);
                }
                // remove existing favorites from the list of bookmarks
                // to create
                delete newFavorites[fav.url];
            }
            else {
                // existing bookmark is not anymore in qwant bookmarks,
                // let's remove it
                fav.remove = true;
                favToSave.push(fav);
            }
        })

        // remaining favorites in newFavorites are really new favorites,
        // so let's create them
        for (let favUrl in newFavorites) {
            let fav = newFavorites[favUrl];
            if (originalQwantGroup) {
                // if there is an existing Qwant group, let's use it
                fav.group = originalQwantGroup;
            }
            favToSave.push(fav);
        }

        return saveBookmarks(favToSave, qwantGroup)
    })
}

exports.setBookmarks = synchronizeBookmarks;
