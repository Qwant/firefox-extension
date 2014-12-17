/**
 * @file optionsScript.js
 * @author Qwant
 */
self.port.on('getOptions', function(opt) {
	var google			= document.getElementById('embedded_google'),
		bing			= document.getElementById('embedded_bing'),
		yahoo			= document.getElementById('embedded_yahoo'),
		yandex			= document.getElementById('embedded_yandex'),
		mailru			= document.getElementById('embedded_mail'),
		save			= document.getElementById('save_last'),
		default_engine	= document.getElementById('default_engine'),
		homepage	= document.getElementById('homepage');

	if (opt.prefs.embedded_google === true) {
		google.checked = true;
	} else {
		google.checked = false;
	}

	if (opt.prefs.embedded_bing === true) {
		bing.checked = true;
	} else {
		bing.checked = false;
	}

	if (opt.prefs.embedded_yahoo === true) {
		yahoo.checked = true;
	} else {
		yahoo.checked = false;
	}

	if (opt.prefs.embedded_yandex === true) {
		yandex.checked = true;
	} else {
		yandex.checked = false;
	}

	if (opt.prefs.embedded_mail === true) {
		mailru.checked = true;
	} else {
		mailru.checked = false;
	}

	if (opt.prefs.save_last === true) {
		save.checked = true;
	} else {
		save.checked = false;
	}

	if (opt.prefs.default_engine === true) {
		default_engine.checked = true;
	} else {
		default_engine.checked = false;
	}
	
	if (opt.prefs.homepage === true) {
		homepage.checked = true;
	} else {
		hpmepage.checked = false;
	}

	google.addEventListener('CheckboxStateChange', function() {
		self.port.emit('google', google.checked);
	}, false);

	bing.addEventListener('CheckboxStateChange', function() {
		self.port.emit('bing', bing.checked);
	}, false);

	yahoo.addEventListener('CheckboxStateChange', function() {
		self.port.emit('yahoo', yahoo.checked);
	}, false);

	yandex.addEventListener('CheckboxStateChange', function() {
		self.port.emit('yandex', yandex.checked);
	}, false);

	mailru.addEventListener('CheckboxStateChange', function() {
		self.port.emit('mail', mailru.checked);
	}, false);

	save.addEventListener('CheckboxStateChange', function() {
		self.port.emit('save', save.checked);
	}, false);

	default_engine.addEventListener('CheckboxStateChange', function() {
		self.port.emit('default_engine', default_engine.checked);
	}, false);
	
	homepage.addEventListener('CheckboxStateChange', function() {
		self.port.emit('homepage', homepage.checked);
	}, false);
});