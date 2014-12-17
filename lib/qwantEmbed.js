var Core 		= require('main');

/**
 * Qwant embedded main view
 * @file qwantEmbed.js
 * @author Qwant
 * @module QwantEmbed
 * @class QwantEmbed
 * @param data
 * @returns {{getLocale: Function, timeAgo: Function}}
 * @constructor
 */
var QwantEmbed = function(data) {
	var preferredLanguage	= data.preferredLanguage,
		search				= data.search,
		query				= data.query,
		disabledOn			= data.disabledOn,
		ext					= data.ext,
		handledLanguages	= {
			'en': 'en_US',
			'uk': 'en_GB',
			'us': 'en_US',
			'es': 'es_ES',
			'it': 'it_IT',
			'de': 'de_DE',
			'fr': 'fr_FR',
			'nl': 'nl_NL',
			'pt': 'pt_PT',
			'ru': 'ru_RU',
			'ja': 'ja_JP',
			'ar': 'ar_XA',
			'pl': 'pl_PL',
			'el': 'el_GR',
			'tr': 'tr_TR',
			'he': 'he_IL',
			'fi': 'fi_FI',
			'zh': 'zh_CN'
		},
/**
 * Returns user locale
 * @function getLocale
 * @returns {*}
 */
	getLocale				= function() {
		if (!(ext in handledLanguages)){
			if (!(preferredLanguage in handledLanguages)){
				return 'en_US';
			} else {
				return handledLanguages[preferredLanguage];
			}
		} else {
			return handledLanguages[ext];
		}
	},
/**
 * Returns time elapsed since result was posted.
 * @function timeAgo
 * @param time
 * @returns {*}
 */
	timeAgo					= function(time) {
		if (!time || time === null) {
			return '';
		}
		if(isNaN(time)) {
			var date = new Date(time.replace(/-/g,'/').replace(/[TZ]/g, ' '));
			time = date.getTime();
		}

		var diff = (((new Date()).getTime() - time) / 1000);
		var day_diff = Math.floor(diff / 86400);

		if ( isNaN(day_diff) || day_diff < 0 ) // || day_diff >= 31
			return '';

		return day_diff === 0 && (
				diff < 60		&& Core._.get('timeAgo_just_now')			||
				diff < 120		&& Core._.get('timeAgo_few_seconds_ago')	||
				diff < 3600		&& ((Core._.get('timeAgo_ago_prefix') === 'timeAgo_ago_prefix') ? '' : Core._.get('timeAgo_ago_prefix')) + ' ' + Math.floor( diff / 60 ) + ' ' + Core._.get('timeAgo_minutes_ago_suffix') ||
				diff < 7200		&& Core._.get('timeAgo_one_hour_ago')		||
				diff < 86400	&& ((Core._.get('timeAgo_ago_prefix') === 'timeAgo_ago_prefix') ? '' : Core._.get('timeAgo_ago_prefix')) + ' ' + Math.floor( diff / 3600 ) + ' ' + Core._.get('timeAgo_hours_ago_suffix')) ||
			day_diff == 1		&& Core._.get('timeAgo_yesterday')			||
			day_diff < 7		&& ((Core._.get('timeAgo_ago_prefix') === 'timeAgo_ago_prefix') ? '' : Core._.get('timeAgo_ago_prefix')) + ' ' + day_diff + ' ' + Core._.get('timeAgo_days_ago_suffix') ||
			day_diff < 31		&& ((Core._.get('timeAgo_ago_prefix') === 'timeAgo_ago_prefix') ? '' : Core._.get('timeAgo_ago_prefix')) + ' ' + Math.ceil( day_diff / 7 ) + ' ' + Core._.get('timeAgo_weeks_ago_suffix') ||
			day_diff < 365		&& ((Core._.get('timeAgo_ago_prefix') === 'timeAgo_ago_prefix') ? '' : Core._.get('timeAgo_ago_prefix')) + ' ' + Math.ceil( day_diff / 30 ) + ' ' + Core._.get('timeAgo_months_ago_suffix') ||
			((Core._.get('timeAgo_ago_prefix') === 'timeAgo_ago_prefix') ? '' : Core._.get('timeAgo_ago_prefix')) + ' ' + Math.ceil( day_diff / 30 ) + ' ' + Core._.get('timeAgo_years_ago_suffix');
	};

	return {
		getLocale	: getLocale,
		timeAgo		: timeAgo
	};
};

module.exports = QwantEmbed;
