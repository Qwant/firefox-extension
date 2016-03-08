"use strict";

var imgContainer = document.getElementById('img-container');

var boardFields = document.getElementById('board-fields');

self.port.on("load", function(type) {
    document.body.classList.remove('error');
    document.body.classList.add(type);
})

self.port.on("initform", function(data) {
    document.body.classList.remove('error', 'load', 'save');

    // boards list
    let list = document.getElementById('board-field');
    let previousItems = list.querySelectorAll('option');
    for (let opt of previousItems) {
        opt.parentNode.removeChild(opt);
    }
    if (data.boards.length) {
        boardFields.classList.remove('newboard');
        data.boards.forEach(function(board) {
            let opt = document.createElement('option');
            opt.setAttribute('value', board.board_id);
            opt.textContent = board.board_name + (board.board_status  == "0"?' 🔒 ':'');
            list.appendChild(opt);
        });
    }
    else {
        boardFields.classList.add('newboard');
        document.getElementById('btn-cancel-board').style.display = 'none';
    }

    // categories list
    list = document.getElementById('category-field');
    previousItems = list.querySelectorAll('option');
    for (let opt of previousItems) {
        opt.parentNode.removeChild(opt);
    }
    data.categories.forEach(function(cat) {
        let opt = document.createElement('option');
        opt.setAttribute('value', cat.id);
        opt.textContent = cat.label;
        list.appendChild(opt);
    });

    // images list
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

    // other fields
    document.getElementById('url-field').value = data.url;
    document.getElementById('title-field').value = data.title;
    document.getElementById('content-field').value = data.description;
    document.getElementById('boardname-field').value = "";
    document.getElementById('visibility-field').checked = true;

});

self.port.on("error", function(err) {
    document.body.classList.remove('load', 'save');
    document.body.classList.add('error');
    document.getElementById('error').textContent = err;
});

document.getElementById('btn-submit').addEventListener('click', function(ev) {
    let form = document.getElementById('note-form');
    if (!form.elements['title'].checkValidity() ||
        !form.elements['content'].checkValidity()){
        return;
    }
    let formData = {
        title: form.elements['title'].value,
        description :form.elements['content'].value,
        type: 'url',
        image_src: "",
        image_key: "",
        board_id: "",
        url: form.elements['url'].value
    };
    let img = document.querySelector('#img-container img.selected');
    if (img ) {
        formData.image_src = img.dataset.src;
        formData.image_key = img.dataset.key;
    }

    let boardData = null;
    if (boardFields.classList.contains('newboard')) {
        if (!form.elements['category'].checkValidity() ||
            !form.elements['boardname'].checkValidity()) {
            return;
        }

        boardData = {
            board_category: form.elements['category'].value,
            board_description:'',
            board_name: form.elements['boardname'].value,
            board_status: (form.elements['visibility'].checked?"1":"0")
        };
    }
    else {
        formData.board_id = form.elements['board'].value;
    }
    self.port.emit('submit', { note: formData, board: boardData});
    return false;
}, false);

document.getElementById('btn-cancel').addEventListener('click', function(ev) {
    self.port.emit('cancel');
}, false);

document.getElementById('btn-new-board').addEventListener('click', function(ev) {
    boardFields.classList.add('newboard');
}, false);

document.getElementById('btn-cancel-board').addEventListener('click', function(ev) {
    boardFields.classList.remove('newboard');
}, false);

imgContainer.addEventListener('click', function(ev) {
    if (ev.target.parentNode == imgContainer){
        imgContainer.querySelector('.selected').classList.remove('selected');
        ev.target.classList.add('selected');
    }
});

