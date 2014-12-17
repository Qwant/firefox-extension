/**
 * @file popupScript.js
 * @author Qwant
 * @type {HTMLElement}
 */
var btnSearchBar		= document.getElementById('qwant_popup_submit_button');
var inputTxtSearchbar	= document.getElementById('qwant_popup_search_input');
var optionsTitle		= document.getElementById('addon_options');

/*
 * On button press, check if there is text in the input text, if so
 * send to main.js the signal and the input to load a Qwant page.
 */
self.port.emit('open');
self.port.on('storage', function(content) {
	inputTxtSearchbar.value = content;
});

btnSearchBar.addEventListener('click', function() {
	if (inputTxtSearchbar.value.length > 0) {
		self.port.emit('search', inputTxtSearchbar.value.trim());
        inputTxtSearchbar.value = '';
	}
}, false);

/*
 * On Enter press, check if there is text in the input text, if so
 * send to main.js the signal and the input to load a Qwant page.
 */
inputTxtSearchbar.addEventListener('keyup', function(event){
    event.preventDefault();
	if (event.keyCode == 13 && inputTxtSearchbar.value.length > 0) {
		self.port.emit('search', inputTxtSearchbar.value.trim());
		inputTxtSearchbar.value = '';
	}
}, false);

/*
 * On click on 'Options' choose to show or hide the options.
 */
optionsTitle.addEventListener('click', function(event) {
    event.preventDefault();
	self.port.emit('options');
}, false);
