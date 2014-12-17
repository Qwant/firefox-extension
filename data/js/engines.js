/**
 * @file engines.js
 * @author Qwant
 */
var disabledOn = {
	bing: '',
	google: 'tbm=',
	mail: '',
	yahoo: 'tbm=',
	yandex: 'tbm='
};

var url = window.location.hostname.split('.'),
	hostname = url[url.length - 2],
	title = document.title;

/**
 * Get search engine input
 * @function getInput
 * @param hostname
 * @returns {*}
 */
var getInput = function(hostname) {
	var query;
	switch (hostname) {
		case 'bing' :
			query = document.getElementsByName('q')[0];
			break;
		case 'google' :
			query = document.getElementsByName('q')[0];
			break;
		case 'mail' :
			query = document.getElementsByName('q')[0];
			break;
		case 'yahoo' : 
			query = document.getElementsByName('p')[0];
			break;
		case 'yandex' :
			query = document.querySelector('.input__control');
			break;
	}
	return query;
};
/**
 * Shows the addon
 * @function show
 * @param text
 */
var show = function(text){
	// Variables definition
	var getQuery = function() {
		var query;
		switch (hostname) {
			case 'bing' :
				query = document.getElementsByName('q')[0].value;
				break;
			case 'google' :
				query = document.getElementsByName('q')[0].value;
				break;
            case 'mail' :
				query = document.getElementsByName('q')[0].value;
				break;
			case 'yahoo' : 
				query = document.getElementsByName('p')[0].value;
				break;
			case 'yandex' :
				query = document.querySelector('.input__control').value;
				break;
		}
		return query;
	};

	var getTarget = function(hostname) {
		var target;
		switch (hostname) {
			case 'bing' :
				target =  document.getElementById('b_context');
				break;
			case 'google' :
				target =  document.getElementById('rhs');
				break;
			case 'mail' :
				target =  document.querySelector('.responses__wrapper');
				break;
			case 'yahoo' : 
				target =  document.getElementById('right');
				break;
			case 'yandex' :
				target =  document.querySelector('.content__left');
				break;
		}
		return target;
	};

	var data = {
		preferredLanguage: window.navigator.language.substr(0, 2),
		search: window.location.search,
		ext: url[url.length - 1],
		hostname: url[url.length - 2],
		disabledOn: disabledOn[hostname],
		query: getQuery(hostname),
		target: getTarget(hostname)
		};

	if (text !== undefined) {
		data.query = text;
	}

	// Displays the addon
	if (data.disabledOn === "" || (data.search.indexOf(data.disabledOn) === -1) && data.query.length > 0) {

		self.port.emit('is_engine_allowed', data.hostname);
		self.port.on('engine_allowed', function (result) {

			var qwtEmbed = document.createElement('div'),
				qwtSpinner = createSpinner(),
				qwtParent = data.target;

			qwtEmbed.setAttribute('class', 'qwt-embed');
			fillEmbed(qwtEmbed, qwtSpinner, null, data.query);
			if (qwtParent.firstChild) {
				qwtParent.insertBefore(qwtEmbed, qwtParent.firstChild);
			} else {
				qwtParent.appendChild(qwtEmbed);
			}

			self.port.emit('search', data);
			self.port.on('data', function(result) {
				fillEmbed(qwtEmbed, qwtSpinner, result.items, data.query);
			});
			document.body.addEventListener('mousedown', exchange, false);
		});

	} else {
		console.log('AddOn disabled on this page or query empty');
	}
};
/**
 * Create a loading spinner.
 * @function createSpinner
 * @returns {HTMLElement}
 */
var createSpinner = function() {
	var qwtSpinner = document.createElement('div');
	qwtSpinner.setAttribute('class', 'qwt-spinner');
	return qwtSpinner;
};
/**
 * Sort the results.
 * @function sortResults
 * @param results
 * @returns {{web: Array, news: Array, media: Array, social: Array}}
 */
var sortResults = function(results) {
	var sorted	= {
		web		: [],
		news	: [],
		media	: [],
		social	: []
	};
	for (var i = 0; i < results.length; ++i) {
		switch (results[i]._type) {
			case 'web' :
				sorted.web.push(results[i]);
				break;
			case 'news' :
				sorted.news.push(results[i]);
				break;
			case 'media' :
				sorted.media.push(results[i]);
				break;
			case 'social' :
				sorted.social.push(results[i]);
				break;
		}
	}
	return sorted;
};
/**
 * Fill the embedded Qwant object.
 * @function fillEmbed
 * @param qwtEmbed
 * @param qwtSpinner
 * @param results
 */
var fillEmbed = function(qwtEmbed, qwtSpinner, results, query) {
	if (results === null) {
		qwtEmbed.appendChild(qwtSpinner);

	} else {
		var qwtResults = document.createElement('div'),
			qwtFragment = document.createDocumentFragment(),
			sortedResults = sortResults(results);

		if (qwtEmbed.children.length > 1) {
			qwtSpinner.setAttribute('style', '');
			for (var i = 0; i < 3; ++i) {
				qwtEmbed.removeChild(qwtEmbed.children[1]);
			}
		}

		qwtResults.setAttribute('class', 'qwt-results');

		if (sortedResults.web.length > 0) {
			var webResults = createWeb(sortedResults.web);
			qwtResults.appendChild(webResults);
		}
		if (sortedResults.news.length > 0) {
			var newsResults = createNews(sortedResults.news);
			qwtResults.appendChild(newsResults);
		}
		if (sortedResults.media.length > 0) {
			var mediaResults = createMedia(sortedResults.media);
			qwtResults.appendChild(mediaResults);
		}
		if (sortedResults.social.length > 0) {
			var socialResults = createSocial(sortedResults.social);
			qwtResults.appendChild(socialResults);
		}

		qwtFragment.appendChild(createHeader());
		qwtFragment.appendChild(qwtResults);
		qwtFragment.appendChild(createFooter(query));
		qwtSpinner.setAttribute('style', 'display:none');
		qwtEmbed.appendChild(qwtFragment);
	}
};
/**
 * Create the header section.
 * @function createHeader
 * @returns {HTMLElement}
 */
var createHeader = function() {
	var qwtHeader = document.createElement('div');
	qwtHeader.setAttribute('class', 'qwt-header');

	var qwtOptions = document.createElement('a');
	qwtOptions.setAttribute('class', 'qwt-options');
	qwtOptions.setAttribute('title', 'options');
	qwtOptions.setAttribute('href', '#');
	qwtOptions.addEventListener('click', function(e){
		e.preventDefault();
		self.port.emit('options');
	});

	var qwtOptionsImg = document.createElement('img');
	qwtOptionsImg.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABL0lEQVQ4jY1SscqDMBDuLiR2EOIiHYROLbgUB7GLS1C6iJNTXzJrmxu6C76ALyB9g69L41+T/KUHB0fu7rt8391m88UYi1LGovRbzVcLw5jCMKafGzgXnZnIuegMAOeiMz8ysWdalIVhTHwbK76NlWleQFbvUeYAaP3IDscT2Y22H44n0vrhAgAQvwIAEF7+n4VFWdE0TTRNExVltaZj6+CbdLtrBUACkLe7djRZbaduWkp2+1Uyz8/S5PP8LD9zyW5PddP+AQCgYRgd1RkTkjEh7a0Mw0gA1vcBoLO5+rwoKwLg3kIQRMKm4fNkt6cgiNwtSHnJzIS+vzqNfX9dtiHlxXsH2TCMNM9PBUB9avLmrOb5qd6xC2B0AJCauG5aqpt24Qwg9fL/zwC4alv2Ag4I6fETvv/XAAAAAElFTkSuQmCC');

	qwtHeader.appendChild(qwtOptions);
	qwtOptions.appendChild(qwtOptionsImg);

	return qwtHeader;
};
/**
 * Create the Web results section.
 * @param webResults
 * @returns {HTMLElement}
 */
var createWeb = function(webResults) {
	var qwtWeb = document.createElement('div');
	qwtWeb.setAttribute('class', 'qwt-web');

	for (var i = 0; i < 1; ++i) {
		var qwtWebResultLink = document.createElement('div'),
			qwtLink = document.createElement('a'),
			qwtLinkInfo = document.createElement('div'),
			qwtLinkUrl = document.createElement('span'),
			urlParser = document.createElement('a');

		urlParser.href = webResults[i].url;

		qwtWebResultLink.setAttribute('class', 'qwt-web-result-link');

		qwtLink.setAttribute('class', 'qwt-link');
		qwtLink.setAttribute('data-src', webResults[i]['url_csrf']);
		qwtLink.setAttribute('href', webResults[i].url);
		qwtLink.textContent = webResults[i].title;

		qwtLinkInfo.setAttribute('class', 'qwt-link-info');

		qwtLinkUrl.setAttribute('class', 'qwt-link-url');
		qwtLinkUrl.textContent = urlParser.hostname;

		qwtLinkInfo.appendChild(qwtLinkUrl);
		qwtWebResultLink.appendChild(qwtLink);
		qwtWebResultLink.appendChild(qwtLinkInfo);
		qwtWeb.appendChild(qwtWebResultLink);
	}
	return qwtWeb;
};
/**
 * Create the News results section.
 * @function createNews
 * @param newsResults
 * @returns {HTMLElement}
 */
var createNews = function(newsResults) {
	var qwtNews = document.createElement('div');
	qwtNews.setAttribute('class', 'qwt-news');

	for (var i = 0; i < newsResults.length; ++i) {
		var qwtNewsResultLink = document.createElement('div'),
			qwtLink = document.createElement('a'),
			qwtLinkInfo = document.createElement('div'),
			qwtLinkUrl = document.createElement('span'),
			qwtLinkInfoSeparator = document.createElement('p'),
			qwtLinkDate = document.createElement('span'),
			urlParser = document.createElement('a');

		urlParser.href = newsResults[i].url;

		qwtNewsResultLink.setAttribute('class', 'qwt-news-result-link');

		qwtLink.setAttribute('class', 'qwt-link');
		qwtLink.setAttribute('data-src', newsResults[i]['url_csrf']);
		qwtLink.setAttribute('href', newsResults[i].url);
		qwtLink.textContent = newsResults[i].title;

		qwtLinkInfo.setAttribute('class', 'qwt-link-info');

		qwtLinkUrl.setAttribute('class', 'qwt-link-url');
		qwtLinkUrl.textContent = urlParser.hostname;

		qwtLinkInfoSeparator.textContent = ' - ';

		qwtLinkDate.setAttribute('class', 'qwt-link-date');
		self.port.emit('date', parseInt(newsResults[i].date) * 1000);
		self.port.on('date', function(date){
			qwtLinkDate.textContent = date;	
		});

		qwtLinkInfo.appendChild(qwtLinkUrl);
		qwtLinkInfo.appendChild(qwtLinkInfoSeparator);
		qwtLinkInfo.appendChild(qwtLinkDate);
		qwtNewsResultLink.appendChild(qwtLink);
		qwtNewsResultLink.appendChild(qwtLinkInfo);
		qwtNews.appendChild(qwtNewsResultLink);
	}
	return qwtNews;
};
/**
 * Create the Media section.
 * @function createMedia
 * @param mediaResults
 * @returns {HTMLElement}
 */
var createMedia = function(mediaResults) {
	var qwtMedia = document.createElement('div');
	qwtMedia.setAttribute('class', 'qwt-media');

	for (var i = 0; i < mediaResults.length; ++i) {
		var qwtMediaThumb = document.createElement('div'),
			qwtMediaThumbImg = document.createElement('img'),
			qwtMediaThumbLink = document.createElement('a'),
			qwtMediaThumbLinkImg = document.createElement('img'),
			qwtMediaResultLink = document.createElement('div'),
			qwtLink = document.createElement('a'),
			qwtLinkInfo = document.createElement('div'),
			qwtLinkUrl = document.createElement('span'),
			qwtLinkInfoSeparator = document.createElement('p'),
			qwtLinkDate = document.createElement('span'),
			urlParser = document.createElement('a');

		urlParser.href = mediaResults[i].url;

		qwtMediaThumb.setAttribute('class', 'qwt-media-thumb');

		qwtMediaThumbImg.setAttribute('src', mediaResults[i].img);

		qwtMediaThumbLink.setAttribute('title', mediaResults[i].title);
		qwtMediaThumbLink.setAttribute('href', mediaResults[i].url);

		qwtMediaThumbLinkImg.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAuCAYAAABwF6rfAAABfElEQVRoge3XP0tCURyH8afoH0VDwzVaqqHJkBbFhoTmFpfmiEa35vaCRukluDQoQQ1GfzZD30CexQp1CVzktDn8GjSwUmu4euD6+8DZvw93OOeCUkoppZRSSo2hGWANWAYmHW8ZqdVCoXCdz+evgHXGKH6jWq0+i4iUSqV7YBOYcj1qFDZqtVpZOorF4mM0Gt0FZl0PG7Zv4SIi5XL5rRM/7XrcMP0KFxGpVCov8Xh8hwB/+Z7hIiL1ev01EonsAQvAhOuhfusb/hWfTCb3CWD8wHARkUajYVOp1AEw73qsn/4MFxFpNps2nU5vE6B7/l/h1tpWLBa7oP3SC4Q/w621rUQi8QScA0uuB/tlYLgxxobD4QfgDNhyPdZPfcONMdbzvFvgBFhxPdRvPcODHg09wo0xH6FQ6I4AR8OP8Gw2+w7cAMcEOBq6fktzudxX9BGw6HjX0HnGmMtMJvMKZIFDxiAa2i8xDzgFDhiT6G5znaOUUkoppZRSPX0CBNSzvEFuuEAAAAAASUVORK5CYII=');

		qwtMediaResultLink.setAttribute('class', 'qwt-media-result-link');

		qwtLink.setAttribute('class', 'qwt-link');
		qwtLink.setAttribute('data-src', mediaResults[i]['url_csrf']);
		qwtLink.setAttribute('href', mediaResults[i].url);
		qwtLink.textContent = mediaResults[i].title;

		qwtLinkInfo.setAttribute('class', 'qwt-link-info');

		qwtLinkUrl.setAttribute('class', 'qwt-link-url');
		qwtLinkUrl.textContent = urlParser.hostname;

		qwtLinkInfoSeparator.textContent = ' - ';

		qwtLinkDate.setAttribute('class', 'qwt-link-date');
		self.port.emit('date', parseInt(mediaResults[i].date) * 1000);
		self.port.on('date', function(date){
			qwtLinkDate.textContent = date;	
		});

		qwtMediaThumbLink.appendChild(qwtMediaThumbLinkImg);
		qwtMediaThumb.appendChild(qwtMediaThumbImg);
		qwtMediaThumb.appendChild(qwtMediaThumbLink);

		qwtLinkInfo.appendChild(qwtLinkUrl);
		qwtLinkInfo.appendChild(qwtLinkInfoSeparator);
		qwtLinkInfo.appendChild(qwtLinkDate);
		qwtMediaResultLink.appendChild(qwtMediaThumb);
		qwtMediaResultLink.appendChild(qwtLink);
		qwtMediaResultLink.appendChild(qwtLinkInfo);
		qwtMedia.appendChild(qwtMediaResultLink);
	}
	return qwtMedia;
};
/**
 * Create the Social section.
 * @function createSocial
 * @param socialResults
 * @returns {HTMLElement}
 */
var createSocial = function(socialResults) {
	var qwtSocial = document.createElement('div');
	qwtSocial.setAttribute('class', 'qwt-social');

	for (var i = 0; i < socialResults.length; ++i) {
		var qwtSocialAccountLink = document.createElement('a'),
			qwtSocialAccountImg = document.createElement('div'),
			qwtSocialResultLink = document.createElement('div'),
			qwtLink = document.createElement('a'),
			qwtLinkInfo = document.createElement('div'),
			qwtLinkAuthor = document.createElement('span'),
			qwtLinkAuthorSeparator = document.createElement('p'),
			qwtLinkUrl = document.createElement('span'),
			qwtLinkInfoSeparator = document.createElement('p'),
			qwtLinkDate = document.createElement('span'),
			urlParser = document.createElement('a');

		urlParser.href = socialResults[i].url;

		qwtSocialAccountLink.setAttribute('href', socialResults[i].url + '/status/' + socialResults[i].post);
		qwtSocialAccountLink.setAttribute('title', socialResults[i].post);

		qwtSocialAccountImg.setAttribute('class', 'qwt-social-author-thumb');
		qwtSocialAccountImg.setAttribute('style', 'background:url(' + socialResults[i].img + ')');

		qwtSocialResultLink.setAttribute('class', 'qwt-social-result-link');

		qwtLink.setAttribute('class', 'qwt-link');
		qwtLink.setAttribute('data-src', socialResults[i]['url_csrf']);
		qwtLink.setAttribute('href', socialResults[i].url + '/status/' + socialResults[i].post);
		qwtLink.textContent = socialResults[i].desc;

		qwtLinkInfo.setAttribute('class', 'qwt-link-info');

		qwtLinkAuthor.setAttribute('class', 'qwt-author');
		qwtLinkAuthor.textContent = '@' + socialResults[i].url.split('/').pop();

		qwtLinkAuthorSeparator.textContent = ' via ';

		qwtLinkUrl.setAttribute('class', 'qwt-link-url');
		qwtLinkUrl.textContent = urlParser.hostname;

		qwtLinkInfoSeparator.textContent = ' - ';

		qwtLinkDate.setAttribute('class', 'qwt-link-date');
		self.port.emit('date', parseInt(socialResults[i].date) * 1000);
		self.port.on('date', function(date){
			qwtLinkDate.textContent = date;	
		});

		qwtLinkInfo.appendChild(qwtLinkAuthor);
		qwtLinkInfo.appendChild(qwtLinkAuthorSeparator);
		qwtLinkInfo.appendChild(qwtLinkUrl);
		qwtLinkInfo.appendChild(qwtLinkInfoSeparator);
		qwtLinkInfo.appendChild(qwtLinkDate);
		qwtSocialResultLink.appendChild(qwtSocialAccountLink);
		qwtSocialResultLink.appendChild(qwtSocialAccountImg);
		qwtSocialResultLink.appendChild(qwtLink);
		qwtSocialResultLink.appendChild(qwtLinkInfo);
		qwtSocial.appendChild(qwtSocialResultLink);
	}
	return qwtSocial;
};
/**
 * Create the footer section.
 * @function createFooter
 * @returns {HTMLElement}
 */
var createFooter = function(query) {
	var qwtFooter = document.createElement('div'),
		qwtFooterLink = document.createElement('a');

	qwtFooter.setAttribute('class', 'qwt-footer');

	qwtFooterLink.setAttribute('href', 'https://www.qwant.com/?q=' + query);
	self.port.emit('trad', 'all_results_on_qwant');
	self.port.on('trad', function(msg) {
		qwtFooterLink.textContent = msg;
	});

	qwtFooter.appendChild(qwtFooterLink);

	return qwtFooter;
};

var input = getInput(hostname),
	timer,
	flag = 0;
if (input !== undefined) {
	input.addEventListener('input', function(){
		clearTimeout(timer);
		timer = setTimeout(function(){
			if (flag === 0) {
				show();
				flag = 1;
			}
		}, 700);
	});

	if (input.value.length > 0 && flag === 0) {
		show();
		flag = 1;
	}
}

if (hostname === 'google') {
	window.onhashchange = function() {
		clearTimeout(timer);
		timer = setTimeout(function() {
			if (document.title !== title) {
				title = document.title;
				show();
			}
		}, 700);
	}
}
function exchange(e) {
	e = e || window.event;
	var target = e.target || e.srcElement;
	if (target.className.match('qwt-link')) {
		target.setAttribute('href', target.getAttribute('data-src'));
	}
};