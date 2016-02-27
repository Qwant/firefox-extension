
/**
 * we expect to receive this message from qwant.com when the user login
 */
window.addEventListener("addon-login", function(event) {
    self.port.emit('login', event.detail);


}, false);

/**
 * we expect to receive this message from qwant.com when the user logout
 */
window.addEventListener("addon-logout", function(event) {
    self.port.emit('logout');
}, false);

