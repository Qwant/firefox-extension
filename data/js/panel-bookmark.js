"use strict";

var visible = false;
var SHOW_CLASS = "qwant-panel--visible";

var body = document.body;

var overlay = document.createElement("div");
overlay.classList.add("qwant-overlay");

var panel = document.createElement("div");
panel.classList.add("qwant-panel");
panel.addEventListener("click", function (e) {
    e.stopPropagation();
});

var panelContent = document.createElement("div");
panelContent.classList.add("qwant-panel__content");

var panelTitle = document.createElement("h2");
panelTitle.classList.add("qwant-panel__content__title");
panelTitle.textContent = self.options.title;

var panelCloseButton = document.createElement("span");
panelCloseButton.classList.add("qwant-panel__content__close--button");
panelCloseButton.classList.add("icon");
panelCloseButton.classList.add("icon-close");

var panelURLLabel = document.createElement("p");
panelURLLabel.textContent = self.options.urlLabel;
panelURLLabel.classList.add("qwant-panel__content__label");
panelURLLabel.classList.add("qwant-panel__content__label--url");

var panelURLInput = document.createElement("input");
panelURLInput.type = "text";
panelURLInput.value = self.options.url;
panelURLInput.required = true;
panelURLInput.classList.add("qwant-panel__content__input");
panelURLInput.classList.add("qwant-panel__content__input--url");

var panelNameLabel = document.createElement("p");
panelNameLabel.textContent = self.options.nameLabel;
panelNameLabel.classList.add("qwant-panel__content__label");
panelNameLabel.classList.add("qwant-panel__content__label--name");

var panelNameInput = document.createElement("input");
panelNameInput.value = self.options.name;
panelNameInput.required = true;
panelNameInput.classList.add("qwant-panel__content__input");
panelNameInput.classList.add("qwant-panel__content__input--name");

var loader = document.createElement("span");
loader.classList.add("icon");
loader.classList.add("icon-loading");
loader.style.display = "none";

var cancelButton = document.createElement("a");
cancelButton.href = "javascript:;";
cancelButton.classList.add("qwant-panel__button");
cancelButton.classList.add("qwant-panel__button--cancel");
cancelButton.textContent = self.options.cancel;

var submitButton = document.createElement("a");
submitButton.href = "javascript:;";
submitButton.classList.add("qwant-panel__button");
submitButton.classList.add("qwant-panel__button--submit");
submitButton.textContent = self.options.submit;

var poweredBy = document.createElement("a");
poweredBy.href = "https://www.qwant.com";
poweredBy.target = "_blank";
poweredBy.classList.add("qwant-panel__powered-by");
poweredBy.classList.add("icon");
poweredBy.classList.add("icon-powered");

panelContent.appendChild(panelTitle);
panelContent.appendChild(panelCloseButton);
panelContent.appendChild(panelURLLabel);
panelContent.appendChild(panelURLInput);
panelContent.appendChild(panelNameLabel);
panelContent.appendChild(panelNameInput);
panelContent.appendChild(loader);
panelContent.appendChild(cancelButton);
panelContent.appendChild(submitButton);
panelContent.appendChild(poweredBy);

panel.appendChild(panelContent);

overlay.appendChild(panel);

var show = function () {
    if (!visible && body !== undefined) {
        body.insertBefore(overlay, body.firstChild);
        body.style.overflow = "hidden";
        panel.style.display = "block";
        setTimeout(function () {
            panel.classList.add(SHOW_CLASS);
        }, 10);
        visible = true;
        self.port.emit("panel-visible");
    }
};

var hide = function () {
    if (visible) {
        panel.classList.remove(SHOW_CLASS);
        setTimeout(function () {
            if (body !== undefined) {
                panel.style.display = "none";
                visible = false;
                self.port.emit("panel-hidden");
                body.removeChild(overlay);
                body.style.overflow = "auto";
                while (overlay.hasChildNodes()) {
                    overlay.removeChild(overlay.lastChild);
                }
            }
        }, 300);
    }
};

setTimeout(show, 1);

panelCloseButton.addEventListener("click", function () {
    hide();
});

cancelButton.addEventListener("click", function () {
    hide();
});

submitButton.addEventListener("click", function () {
    loader.style.display = "block";
    cancelButton.style.display = "none";
    submitButton.style.display = "none";

    if (panelNameInput.value !== "") {
        self.port.emit("panel-submit", {
            name: panelNameInput.value,
            url: panelURLInput.value
        });
    }

});

self.port.on("panel-destroy", function () {
    hide();
});

self.port.on("panel-enable", function () {
    loader.style.display = "none";
    cancelButton.style.display = "inline-block";
    submitButton.style.display = "inline-block";
});