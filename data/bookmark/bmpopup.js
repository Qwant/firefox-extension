"use strict";

self.port.on("load", function(msg) {
    document.body.classList.remove('error');
    document.body.classList.add(msg);
})

self.port.on("initform", function(data) {
    document.body.classList.remove('error', 'load', 'save');
    document.getElementById('url-field').value = data.url;
    document.getElementById('name-field').value = data.name;
});

self.port.on("error", function(err) {
    document.body.classList.remove('load', 'save');
    document.body.classList.add('error');
    document.getElementById('error').textContent = err;
});

document.getElementById('btn-submit').addEventListener('click', function(ev) {
    let form = document.getElementById('bookmark-form');
    let formData = {
        name: form.elements['name'].value,
        url: form.elements['url'].value,
        status : "1"
    }
    self.port.emit('submit', formData);
}, false);

document.getElementById('btn-cancel').addEventListener('click', function(ev) {
    self.port.emit('cancel');
}, false);

