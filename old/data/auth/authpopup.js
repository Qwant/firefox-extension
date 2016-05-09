
document.getElementById('auth-connect')
        .addEventListener('click', function(){
            self.port.emit("go-connect");
        });
document.getElementById('auth-register')
        .addEventListener('click', function(){
            self.port.emit("go-register");
        });
document.getElementById('auth-lost-password')
        .addEventListener('click', function(){
            self.port.emit("go-lost-password");
        });
