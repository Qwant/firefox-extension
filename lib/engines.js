'use strict';
var Core		= require('main'),
	Interface	= require('interface'),
	QwantEmbed	= require('qwantEmbed');

/**
 * Select which script to use on which page
 * @file engines.js
 * @author Qwant
 * @module Engines
 * @class Engines
 * @constructor
 */
var Engines = function() {
	var qwtEmbed;
	var qwantForFirefox = function(worker) {
		worker.port.on('is_engine_allowed', function(hostname) {
			if (Core.sPrefs.prefs['embedded_' + hostname] === true) {
				worker.port.emit('engine_allowed', null);
			}
		});
		worker.port.on('search', function(data) {
			qwtEmbed = new QwantEmbed(data);

			if (Core.sPrefs.prefs.save_last === true) {
				Core.sStorage.storage.qwantQuery = data.query;
				Interface.qwantPopup.port.emit('storage', Core.sStorage.storage.qwantQuery);
			}

			Core.request.Request({
				url: 'https://www.qwant.com/search/smart/?q=' + data.query + '&locale=' + qwtEmbed.getLocale() + '&client=firefox-ext',
				anonymous: true,
				onComplete: function(response) {
					worker.port.emit('data', response.json.result);
				}
			}).get();
		});
		worker.port.on('options', function() {
			Interface.displayOptions();
		});
		worker.port.on('date', function(time) {
			if (typeof qwtEmbed.timeAgo === 'function') {
				worker.port.emit('date', qwtEmbed.timeAgo(time));
			} else {
				worker.port.emit('date', null);
			}
		});
		worker.port.on('trad', function(msg){
			worker.port.emit('trad', Core._.get(msg));
		});
		worker.port.on('img', function(img){
			worker.port.emit('img', Core.self.data.url(img));
		});
	};
// Bing
	Core.pageMod.PageMod({
		include: [ 'http://www.bing.com/search*',
				 'https://www.bing.com/search*'
				 ],
		contentScriptWhen: 'end',
		contentScriptFile: Core.self.data.url('js/engines.js'),
		contentStyleFile: [
			Core.self.data.url('css/engines/common.css'),
			Core.self.data.url('css/engines/bing.css')
		],
		onAttach: function(worker) {
			var bingWorker = worker;
			qwantForFirefox(bingWorker);
		}
	});
// Google
	Core.pageMod.PageMod({
		include:['http://www.google.com/*', 'http://www.google.ad/*', 'http://www.google.ae/*', 'http://www.google.com.af/*', 'http://www.google.com.ag/*', 'http://www.google.com.ai/*','http://www.google.am/*', 'http://www.google.co.ao/*', 'http://www.google.com.ar/*', 'http://www.google.as/*', 'http://www.google.at/*', 'http://www.google.com.au/*', 'http://www.google.az/*', 'http://www.google.ba/*', 'http://www.google.com.bd/*', 'http://www.google.be/*', 'http://www.google.bf/*', 'http://www.google.bg/*', 'http://www.google.com.bh/*', 'http://www.google.bi/*', 'http://www.google.bj/*', 'http://www.google.com.bn/*', 'http://www.google.com.bo/*', 'http://www.google.com.br/*', 'http://www.google.bs/*', 'http://www.google.co.bw/*', 'http://www.google.by/*', 'http://www.google.com.bz/*', 'http://www.google.ca/*', 'http://www.google.cd/*', 'http://www.google.cf/*', 'http://www.google.cg/*', 'http://www.google.ch/*', 'http://www.google.ci/*', 'http://www.google.co.ck/*', 'http://www.google.cl/*', 'http://www.google.cm/*', 'http://www.google.cn/*', 'http://www.google.com.co/*', 'http://www.google.co.cr/*', 'http://www.google.com.cu/*', 'http://www.google.cv/*', 'http://www.google.cz/*', 'http://www.google.de/*', 'http://www.google.dj/*', 'http://www.google.dk/*', 'http://www.google.dm/*', 'http://www.google.com.do/*', 'http://www.google.dz/*', 'http://www.google.com.ec/*', 'http://www.google.ee/*', 'http://www.google.com.eg/*', 'http://www.google.es/*', 'http://www.google.com.et/*', 'http://www.google.fi/*', 'http://www.google.com.fj/*', 'http://www.google.fm/*', 'http://www.google.fr/*', 'http://www.google.ga/*', 'http://www.google.ge/*', 'http://www.google.gg/*', 'http://www.google.com.gh/*', 'http://www.google.com.gi/*', 'http://www.google.gl/*', 'http://www.google.gm/*', 'http://www.google.gp/*', 'http://www.google.gr/*', 'http://www.google.com.gt/*', 'http://www.google.gy/*', 'http://www.google.com.hk/*', 'http://www.google.hn/*', 'http://www.google.hr/*', 'http://www.google.ht/*', 'http://www.google.hu/*', 'http://www.google.co.id/*', 'http://www.google.ie/*', 'http://www.google.co.il/*', 'http://www.google.im/*', 'http://www.google.co.in/*', 'http://www.google.iq/*', 'http://www.google.is/*', 'http://www.google.it/*', 'http://www.google.je/*', 'http://www.google.com.jm/*', 'http://www.google.jo/*', 'http://www.google.co.jp/*', 'http://www.google.co.ke/*', 'http://www.google.com.kh/*', 'http://www.google.ki/*', 'http://www.google.kg/*', 'http://www.google.co.kr/*', 'http://www.google.com.kw/*', 'http://www.google.kz/*', 'http://www.google.la/*', 'http://www.google.com.lb/*', 'http://www.google.li/*', 'http://www.google.lk/*', 'http://www.google.co.ls/*', 'http://www.google.lt/*', 'http://www.google.lu/*', 'http://www.google.lv/*', 'http://www.google.com.ly/*', 'http://www.google.co.ma/*', 'http://www.google.md/*', 'http://www.google.me/*', 'http://www.google.mg/*', 'http://www.google.mk/*', 'http://www.google.ml/*', 'http://www.google.mn/*', 'http://www.google.ms/*', 'http://www.google.com.mt/*', 'http://www.google.mu/*', 'http://www.google.mv/*', 'http://www.google.mw/*', 'http://www.google.com.mx/*', 'http://www.google.com.my/*', 'http://www.google.co.mz/*', 'http://www.google.com.na/*', 'http://www.google.com.nf/*', 'http://www.google.com.ng/*', 'http://www.google.com.ni/*', 'http://www.google.ne/*', 'http://www.google.nl/*', 'http://www.google.no/*', 'http://www.google.com.np/*', 'http://www.google.nr/*', 'http://www.google.nu/*', 'http://www.google.co.nz/*', 'http://www.google.com.om/*', 'http://www.google.com.pa/*', 'http://www.google.com.pe/*', 'http://www.google.com.ph/*', 'http://www.google.com.pk/*', 'http://www.google.pl/*', 'http://www.google.pn/*', 'http://www.google.com.pr/*', 'http://www.google.ps/*', 'http://www.google.pt/*', 'http://www.google.com.py/*', 'http://www.google.com.qa/*', 'http://www.google.ro/*', 'http://www.google.ru/*', 'http://www.google.rw/*', 'http://www.google.com.sa/*', 'http://www.google.com.sb/*', 'http://www.google.sc/*', 'http://www.google.se/*', 'http://www.google.com.sg/*', 'http://www.google.sh/*', 'http://www.google.si/*', 'http://www.google.sk/*', 'http://www.google.com.sl/*', 'http://www.google.sn/*', 'http://www.google.so/*', 'http://www.google.sm/*', 'http://www.google.st/*', 'http://www.google.com.sv/*', 'http://www.google.td/*', 'http://www.google.tg/*', 'http://www.google.co.th/*', 'http://www.google.com.tj/*', 'http://www.google.tk/*', 'http://www.google.tl/*', 'http://www.google.tm/*', 'http://www.google.tn/*', 'http://www.google.to/*', 'http://www.google.com.tr/*', 'http://www.google.tt/*', 'http://www.google.com.tw/*', 'http://www.google.co.tz/*', 'http://www.google.com.ua/*', 'http://www.google.co.ug/*', 'http://www.google.co.uk/*', 'http://www.google.com.uy/*', 'http://www.google.co.uz/*', 'http://www.google.com.vc/*', 'http://www.google.co.ve/*', 'http://www.google.vg/*', 'http://www.google.co.vi/*', 'http://www.google.com.vn/*', 'http://www.google.vu/*', 'http://www.google.ws/*', 'http://www.google.rs/*', 'http://www.google.co.za/*', 'http://www.google.co.zm/*', 'http://www.google.co.zw/*', 'http://www.google.cat/*', 'https://www.google.com/*', 'https://www.google.ad/*', 'https://www.google.ae/*', 'https://www.google.com.af/*', 'https://www.google.com.ag/*', 'https://www.google.com.ai/*', 'https://www.google.am/*', 'https://www.google.co.ao/*', 'https://www.google.com.ar/*', 'https://www.google.as/*', 'https://www.google.at/*', 'https://www.google.com.au/*', 'https://www.google.az/*', 'https://www.google.ba/*', 'https://www.google.com.bd/*', 'https://www.google.be/*', 'https://www.google.bf/*', 'https://www.google.bg/*', 'https://www.google.com.bh/*', 'https://www.google.bi/*', 'https://www.google.bj/*', 'https://www.google.com.bn/*', 'https://www.google.com.bo/*', 'https://www.google.com.br/*', 'https://www.google.bs/*', 'https://www.google.co.bw/*', 'https://www.google.by/*', 'https://www.google.com.bz/*', 'https://www.google.ca/*', 'https://www.google.cd/*', 'https://www.google.cf/*', 'https://www.google.cg/*', 'https://www.google.ch/*', 'https://www.google.ci/*', 'https://www.google.co.ck/*', 'https://www.google.cl/*', 'https://www.google.cm/*', 'https://www.google.cn/*', 'https://www.google.com.co/*', 'https://www.google.co.cr/*', 'https://www.google.com.cu/*', 'https://www.google.cv/*', 'https://www.google.cz/*', 'https://www.google.de/*', 'https://www.google.dj/*', 'https://www.google.dk/*', 'https://www.google.dm/*', 'https://www.google.com.do/*', 'https://www.google.dz/*', 'https://www.google.com.ec/*', 'https://www.google.ee/*', 'https://www.google.com.eg/*', 'https://www.google.es/*', 'https://www.google.com.et/*', 'https://www.google.fi/*', 'https://www.google.com.fj/*', 'https://www.google.fm/*', 'https://www.google.fr/*', 'https://www.google.ga/*', 'https://www.google.ge/*', 'https://www.google.gg/*', 'https://www.google.com.gh/*', 'https://www.google.com.gi/*', 'https://www.google.gl/*', 'https://www.google.gm/*', 'https://www.google.gp/*', 'https://www.google.gr/*', 'https://www.google.com.gt/*', 'https://www.google.gy/*', 'https://www.google.com.hk/*', 'https://www.google.hn/*', 'https://www.google.hr/*', 'https://www.google.ht/*', 'https://www.google.hu/*', 'https://www.google.co.id/*', 'https://www.google.ie/*', 'https://www.google.co.il/*', 'https://www.google.im/*', 'https://www.google.co.in/*', 'https://www.google.iq/*', 'https://www.google.is/*', 'https://www.google.it/*', 'https://www.google.je/*', 'https://www.google.com.jm/*', 'https://www.google.jo/*', 'https://www.google.co.jp/*', 'https://www.google.co.ke/*', 'https://www.google.com.kh/*', 'https://www.google.ki/*', 'https://www.google.kg/*', 'https://www.google.co.kr/*', 'https://www.google.com.kw/*', 'https://www.google.kz/*', 'https://www.google.la/*', 'https://www.google.com.lb/*', 'https://www.google.li/*', 'https://www.google.lk/*', 'https://www.google.co.ls/*', 'https://www.google.lt/*', 'https://www.google.lu/*', 'https://www.google.lv/*', 'https://www.google.com.ly/*', 'https://www.google.co.ma/*', 'https://www.google.md/*', 'https://www.google.me/*', 'https://www.google.mg/*', 'https://www.google.mk/*', 'https://www.google.ml/*', 'https://www.google.mn/*', 'https://www.google.ms/*', 'https://www.google.com.mt/*', 'https://www.google.mu/*', 'https://www.google.mv/*', 'https://www.google.mw/*', 'https://www.google.com.mx/*', 'https://www.google.com.my/*', 'https://www.google.co.mz/*', 'https://www.google.com.na/*', 'https://www.google.com.nf/*', 'https://www.google.com.ng/*', 'https://www.google.com.ni/*', 'https://www.google.ne/*', 'https://www.google.nl/*', 'https://www.google.no/*', 'https://www.google.com.np/*', 'https://www.google.nr/*', 'https://www.google.nu/*', 'https://www.google.co.nz/*', 'https://www.google.com.om/*', 'https://www.google.com.pa/*', 'https://www.google.com.pe/*', 'https://www.google.com.ph/*', 'https://www.google.com.pk/*', 'https://www.google.pl/*', 'https://www.google.pn/*', 'https://www.google.com.pr/*', 'https://www.google.ps/*', 'https://www.google.pt/*', 'https://www.google.com.py/*', 'https://www.google.com.qa/*', 'https://www.google.ro/*', 'https://www.google.ru/*', 'https://www.google.rw/*', 'https://www.google.com.sa/*', 'https://www.google.com.sb/*', 'https://www.google.sc/*', 'https://www.google.se/*', 'https://www.google.com.sg/*', 'https://www.google.sh/*', 'https://www.google.si/*', 'https://www.google.sk/*', 'https://www.google.com.sl/*', 'https://www.google.sn/*', 'https://www.google.so/*', 'https://www.google.sm/*', 'https://www.google.st/*', 'https://www.google.com.sv/*', 'https://www.google.td/*', 'https://www.google.tg/*', 'https://www.google.co.th/*', 'https://www.google.com.tj/*', 'https://www.google.tk/*', 'https://www.google.tl/*', 'https://www.google.tm/*', 'https://www.google.tn/*', 'https://www.google.to/*', 'https://www.google.com.tr/*', 'https://www.google.tt/*', 'https://www.google.com.tw/*', 'https://www.google.co.tz/*', 'https://www.google.com.ua/*', 'https://www.google.co.ug/*', 'https://www.google.co.uk/*', 'https://www.google.com.uy/*', 'https://www.google.co.uz/*', 'https://www.google.com.vc/*', 'https://www.google.co.ve/*', 'https://www.google.vg/*', 'https://www.google.co.vi/*', 'https://www.google.com.vn/*', 'https://www.google.vu/*', 'https://www.google.ws/*', 'https://www.google.rs/*', 'https://www.google.co.za/*', 'https://www.google.co.zm/*', 'https://www.google.co.zw/*', 'https://www.google.cat/*', 'https://encrypted.google.com/*'],
		contentScriptWhen: 'end',
		contentScriptFile: Core.self.data.url('js/engines.js'),
		contentStyleFile: [
			Core.self.data.url('css/engines/common.css'),
			Core.self.data.url('css/engines/google.css')
		],
		onAttach: function(worker) {
			var googleWorker = worker;
			qwantForFirefox(googleWorker);
		}
	});
// MailRu
	Core.pageMod.PageMod({
		include: 'http://go.mail.ru/search*',
		contentScriptWhen: 'end',
		contentScriptFile: Core.self.data.url('js/engines.js'),
		contentStyleFile: [
			Core.self.data.url('css/engines/common.css'),
			Core.self.data.url('css/engines/mailru.css')
		],
		onAttach: function(worker) {
			var mailruWorker = worker;
			qwantForFirefox(mailruWorker);
		}
	});
// Yahoo
	Core.pageMod.PageMod({
		include: ['http://au.search.yahoo.com/*', 'http://hk.search.yahoo.com/*', 'http://in.search.yahoo.com/*', 'http://id.search.yahoo.com/*', 'http://nz.search.yahoo.com/*', 'http://ph.search.yahoo.com/*', 'http://sg.search.yahoo.com/*', 'http://malaysia.search.yahoo.com/*', 'http://tw.search.yahoo.com/*', 'http://vn.search.yahoo.com/*', 'http://be.search.yahoo.com/*', 'http://fr-be.search.yahoo.com/*', 'http://de.search.yahoo.com/*', 'http://fr.search.yahoo.com/*', 'http://gr.search.yahoo.com/*', 'http://ie.search.yahoo.com/*', 'http://it.search.yahoo.com/*', 'http://ro.search.yahoo.com/*', 'http://es.search.yahoo.com/*', 'http://se.search.yahoo.com/*', 'http://uk.search.yahoo.com/*', 'http://en-maktoob.search.yahoo.com/*', 'http://maktoob.search.yahoo.com/*', 'http://za.search.yahoo.com/*', 'http://ca.search.yahoo.com/*', 'http://qc.search.yahoo.com/*', 'http://mx.search.yahoo.com/*', 'http:/search.yahoo.com/*', 'http://espanol.search.yahoo.com/*', 'http://br.search.yahoo.com/*', 'http://cl.search.yahoo.com/*', 'http://co.search.yahoo.com/*', 'http://pe.search.yahoo.com/*', 'http://ve.search.yahoo.com/*', 'https://au.search.yahoo.com/*', 'https://hk.search.yahoo.com/*', 'https://in.search.yahoo.com/*', 'https://id.search.yahoo.com/*', 'https://nz.search.yahoo.com/*', 'https://ph.search.yahoo.com/*', 'https://sg.search.yahoo.com/*', 'https://malaysia.search.yahoo.com/*', 'https://tw.search.yahoo.com/*', 'https://vn.search.yahoo.com/*', 'https://be.search.yahoo.com/*', 'https://fr-be.search.yahoo.com/*', 'https://de.search.yahoo.com/*', 'https://fr.search.yahoo.com/*', 'https://gr.search.yahoo.com/*', 'https://ie.search.yahoo.com/*', 'https://it.search.yahoo.com/*', 'https://ro.search.yahoo.com/*', 'https://es.search.yahoo.com/*', 'https://se.search.yahoo.com/*', 'https://uk.search.yahoo.com/*', 'https://en-maktoob.search.yahoo.com/*', 'https://maktoob.search.yahoo.com/*', 'https://za.search.yahoo.com/*', 'https://ca.search.yahoo.com/*', 'https://qc.search.yahoo.com/*', 'https://mx.search.yahoo.com/*', 'https:/search.yahoo.com/*', 'https://espanol.search.yahoo.com/*', 'https://br.search.yahoo.com/*', 'https://cl.search.yahoo.com/*', 'https://co.search.yahoo.com/*', 'https://pe.search.yahoo.com/*', 'https://ve.search.yahoo.com/*'],
		contentScriptWhen: 'end',
		contentScriptFile: Core.self.data.url('js/engines.js'),
		contentStyleFile: [
			Core.self.data.url('css/engines/common.css'),
			Core.self.data.url('css/engines/yahoo.css')
		],
		onAttach: function(worker) {
			var yahooWorker = worker;
			qwantForFirefox(yahooWorker);
		}
	});
// Yandex
	Core.pageMod.PageMod({
		include: ['http://yandex.ru/yandsearch*', 'https://yandex.ru/yandsearch*', 'https://www.yandex.com/yandsearch*',
                    'https://yandex.com/yandsearch*'],
		contentScriptWhen: 'end',
		contentScriptFile: Core.self.data.url('js/engines.js'),
		contentStyleFile: [
			Core.self.data.url('css/engines/common.css'),
			Core.self.data.url('css/engines/yandex.css')
		],
		onAttach: function(worker) {
			var yandexWorker = worker;
			qwantForFirefox(yandexWorker);
		}
	});
// Qwant
	Core.pageMod.PageMod({
		include: 'https://www.qwant.com/',
		contentScriptWhen: 'ready',
		contentScript: '\'use strict\';var qwtExt=document.createElement(\'meta\');qwtExt.setAttribute(\'property\',\'qwantExtension\');qwtExt.setAttribute(\'content\',\'true\');document.head.appendChild(qwtExt);'
	});
};

module.exports = Engines;