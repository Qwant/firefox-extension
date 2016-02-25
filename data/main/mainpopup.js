
var language = "en";


function showWelcome() {
    document.getElementById("welcome-panel").style.display = 'block';
    document.getElementById("main-panel").style.display = 'none';
    document.querySelector('footer').style.display = 'none';
}

function showMain() {
    document.getElementById("welcome-panel").style.display = 'none';
    document.getElementById("main-panel").style.display = 'block';
    document.querySelector('footer').style.display = 'block';
}


self.port.on("show", function(options) {

    // show only elements in the active language
    language = options.language;
    let nodes = document.querySelectorAll("[data-l10n-lang]");
    for (var elem of nodes) {
        if (elem.dataset.l10nLang == language) {
            elem.style.display = "block";
        }
        else {
            elem.style.display = "none";
        }
    }

    if (options.showWelcome) {
        showWelcome();
    }
    else {
        showMain();
    }

    document.getElementById("login-panel").style.display =
            (options.isAuthenticated ? 'none':'block');

    document.getElementById('privacy-check').checked = options.privacyEnabled;
});

document.getElementById('welcome-start')
        .addEventListener('click', function(){
            showMain();
            self.port.emit("showmain");
        });
document.getElementById('welcome-register')
        .addEventListener('click', function(){
            self.port.emit("go-register");
        });
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

document.getElementById('privacy-check')
        .addEventListener('click', function(){
            self.port.emit("privacy-change", this.checked);
        });
