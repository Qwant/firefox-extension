
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

    authForm.show(options.isAuthenticated);

    document.getElementById('privacy-check').checked = options.privacyEnabled;
    document.getElementById('add-note').disabled = !options.canAddNote;
    document.getElementById('add-favorite').disabled = !options.canAddFavorite;
    document.getElementById('show-notes').disabled = ! options.isAuthenticated;
});

self.port.on("auth-state", function(options) {
    authForm.show(options.isAuthenticated, options.error);
});

var authForm = {
    divPanel: null,
    divForm : null,
    btnConnection : null,
    btnLogin : null,
    fieldLogin : null,
    fieldPassword : null,

    initButtons : function () {
        this.divPanel = document.getElementById("login-panel");
        this.divForm = document.getElementById("auth-form");
        this.btnConnection = document.getElementById('auth-connect');
        this.btnLogin = document.getElementById('auth-connection');
        this.fieldLogin = document.getElementById("auth-login");
        this.fieldPassword = document.getElementById("auth-password")

        this.btnConnection.addEventListener('click', function(){
            authForm.divPanel.setAttribute('class', 'connectform');
            authForm.fieldLogin.focus();
        });

        this.btnLogin.addEventListener('click', function(){
            authForm.divPanel.setAttribute('class', 'wait');
            self.port.emit("auth-login", { email: authForm.fieldLogin.value,
                                    password: authForm.fieldPassword.value
            });
        });

        document.getElementById('auth-register')
                .addEventListener('click', function(){
                    self.port.emit("go-register");
                });
        document.getElementById('auth-lost-password')
                .addEventListener('click', function(){
                    self.port.emit("go-lost-password");
                });
    },
    show : function(isAuthenticated, error) {
        let status =  (isAuthenticated?'connected':'hastoconnect');
        if ( !isAuthenticated && error) {
            status = 'error';
        }
        this.divPanel.setAttribute('class', status);
        this.fieldLogin.value = '';
        this.fieldPassword.value = '';
        document.getElementById('msg-err').textContent = (error?error:'');
    },
}

authForm.initButtons();

document.getElementById('welcome-start')
        .addEventListener('click', function(){
            showMain();
            self.port.emit("showmain");
        });
document.getElementById('welcome-register')
        .addEventListener('click', function(){
            self.port.emit("go-register");
        });
document.getElementById('privacy-check')
        .addEventListener('click', function(){
            self.port.emit("privacy-change", this.checked);
        });

document.getElementById('add-favorite')
        .addEventListener('click', function(){
            self.port.emit("show-add-favorite");
        });
document.getElementById('add-note')
        .addEventListener('click', function(){
            self.port.emit("show-add-note");
        });
document.getElementById('show-notes')
        .addEventListener('click', function(){
            self.port.emit("go-notes");
        });

