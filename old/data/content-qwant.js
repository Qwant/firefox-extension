
/**
 * we expect to receive this message from qwant.com when the user login on the web site
 */
window.addEventListener("addon-login", function(event) {
    if (event.detail &&
        typeof event.detail.username != undefined &&
        typeof event.detail.session_token != undefined)
        {
            self.port.emit('login', {
                username: event.detail.username,
                token: event.detail.session_token
                }
            );
    }
}, false);

/**
 * we expect to receive this message from qwant.com when the user logout on the web site
 */
window.addEventListener("addon-logout", function(event) {
    self.port.emit('logout');
}, false);


/**
 * when the user log in from the addon, let's send a message to qwant.com page
 */
self.port.on("login", function(message) {
    var event = new window.CustomEvent("from-addon-login", {
      detail: JSON.stringify(message)
    });
    window.dispatchEvent(event);
});

/**
 * when the user log out from the addon, let's send a message to qwant.com page
 */
self.port.on("logout", function(message) {
    var event = new window.CustomEvent("from-addon-logout", {});
    window.dispatchEvent(event);
});
