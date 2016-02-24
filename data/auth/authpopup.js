
var btnLogin = document.getElementById('login-btn');
var btnCancel = document.getElementById('cancel-btn');


btnLogin.addEventListener('click', function() {
    self.port.emit('login');
}, false);

btnCancel.addEventListener('click', function() {
    self.port.emit('cancel');
}, false);