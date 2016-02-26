"use strict";

self.port.on("show", function() {
    document.body.classList.remove('error');
    document.body.classList.add('load');
})

self.port.on("initform", function(data) {
    document.body.classList.remove('error', 'load');
    let list = document.getElementById('board-field');
    data.boards.forEach(function(board) {
        let opt = document.createElement('option');
        opt.textContent = board.board_name + (board.board_status  == "0"?' 🔒 ':'');
        list.appendChild(opt);
    });

    document.getElementById('url-field').value = data.url;
    document.getElementById('title-field').value = data.title;
    document.getElementById('content-field').textContent = data.description;
});

self.port.on("error", function(err) {
    document.body.classList.remove('load');
    document.body.classList.add('error');
    document.getElementById('error').textContent = err;
});