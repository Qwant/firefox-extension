"use strict";

var imgContainer = document.getElementById('img-container');

self.port.on("show", function() {
    document.body.classList.remove('error');
    document.body.classList.add('load');
})

self.port.on("initform", function(data) {
    document.body.classList.remove('error', 'load');
    let list = document.getElementById('board-field');
    data.boards.forEach(function(board) {
        let opt = document.createElement('option');
        opt.setAttribute('value', board.board_id);
        opt.textContent = board.board_name + (board.board_status  == "0"?' 🔒 ':'');
        list.appendChild(opt);
    });

    document.getElementById('url-field').value = data.url;
    document.getElementById('title-field').value = data.title;
    document.getElementById('content-field').value = data.description;
    
    let previousImg = imgContainer.querySelectorAll('img');
    for (let img of previousImg) {
        img.parentNode.removeChild(img);
    }
    let div = imgContainer.firstElementChild;
    data.images.forEach(function(image) {
        let img = document.createElement('img');
        img.setAttribute('src', 'https:'+image.thumbnailMini);
        img.setAttribute('data-src', image.src);
        img.setAttribute('data-key', image.key);
        imgContainer.insertBefore(img, div);
    });
    imgContainer.firstElementChild.classList.add('selected');
});

self.port.on("error", function(err) {
    document.body.classList.remove('load');
    document.body.classList.add('error');
    document.getElementById('error').textContent = err;
});

document.getElementById('btn-submit').addEventListener('click', function(ev) {
    let form = document.getElementById('note-form');
    let formData = {
        title: form.elements['title'].value,
        description :form.elements['content'].value,
        type: 'url',
        image_src: "",
        image_key: "",
        board_id: form.elements['board'].value,
        url: form.elements['url'].value
    }
    let img = document.querySelector('#img-container img.selected');
    if (img ) {
        formData.image_src = img.dataset.src;
        formData.image_key = img.dataset.key;
    }
    self.port.emit('submit', formData);
    return false;
}, false);

document.getElementById('btn-cancel').addEventListener('click', function(ev) {
    self.port.emit('cancel');
}, false);

imgContainer.addEventListener('click', function(ev) {
    if (ev.target.parentNode == imgContainer){
        imgContainer.querySelector('.selected').classList.remove('selected');
        ev.target.classList.add('selected');
    }
});

