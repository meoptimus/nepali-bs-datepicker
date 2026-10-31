/*!
 * Nepali Datepicker v2.0.0 — Bikram Sambat (BS) datepicker for jQuery
 * https://github.com/meoptimus/nepali-bs-datepicker
 *
 * Derived from Datepicker for Bootstrap v1.10.1
 * (https://github.com/uxsolutions/bootstrap-datepicker),
 * Copyright 2012 Stefan Petre, improvements by Andrew Rowls + contributors.
 * Modified to work in the Bikram Sambat calendar; see NOTICE and CHANGELOG.md.
 *
 * Licensed under the Apache License v2.0 (https://www.apache.org/licenses/LICENSE-2.0)
 */

(function(factory){
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		factory(require('jquery'));
	} else {
		factory(jQuery);
	}
}(function($, undefined){

	/* BIKRAM SAMBAT CALENDAR DATA
	 * ===========================
	 * Number of days in each month of every BS year this picker supports.
	 * Edit this table when the Nepal Panchanga Nirnayak Samiti publishes a new
	 * or corrected calendar:
	 *   - to fix a year, change its row;
	 *   - to add a year, append a row after the last one (years must be contiguous);
	 *   - run `npm run check-calendar` to validate the table.
	 * `epoch` is the AD date of 1 Baisakh of the first year in the table. Only
	 * change it if you add years *before* the first row.
	 * At runtime, data can also be patched without editing this file:
	 *   $.fn.npdatepicker.calendar.setYear(2100, [31, 31, 32, ...]);
	 */
	var BS_CALENDAR = {
		epoch: { year: 1970, ad: [1913, 4, 13] },
		years: {
			// Year: [Bai, Jes, Asa, Shr, Bha, Ash, Kar, Man, Pou, Mag, Fal, Cha]
			1970: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			1971: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
			1972: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			1973: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
			1974: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			1975: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			1976: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			1977: [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
			1978: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			1979: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			1980: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			1981: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
			1982: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			1983: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			1984: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			1985: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
			1986: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			1987: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			1988: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			1989: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
			1990: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			1991: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
			1992: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
			1993: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
			1994: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			1995: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
			1996: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
			1997: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			1998: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			1999: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2000: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
			2001: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2002: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			2003: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2004: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
			2005: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2006: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			2007: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2008: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
			2009: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2010: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			2011: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2012: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
			2013: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2014: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			2015: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2016: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
			2017: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2018: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			2019: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
			2020: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
			2021: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2022: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
			2023: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
			2024: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
			2025: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2026: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2027: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
			2028: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2029: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
			2030: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2031: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
			2032: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2033: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			2034: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2035: [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
			2036: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2037: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			2038: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2039: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
			2040: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2041: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			2042: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2043: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
			2044: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2045: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			2046: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2047: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
			2048: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2049: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
			2050: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
			2051: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
			2052: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2053: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
			2054: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
			2055: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2056: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
			2057: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2058: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
			2059: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2060: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			2061: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2062: [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
			2063: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2064: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			2065: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2066: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
			2067: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2068: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			2069: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2070: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
			2071: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2072: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			2073: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
			2074: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
			2075: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
			2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
			2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
			2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
			2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
			2081: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
			2082: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
			2083: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
			2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
			2085: [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
			2086: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
			2087: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
			2088: [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
			2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
			2090: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
			2091: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
			2092: [30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
			2093: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
			2094: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
			2095: [31, 31, 32, 31, 31, 31, 30, 29, 30, 30, 30, 30],
			2096: [30, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
			2097: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
			2098: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
			2099: [31, 31, 32, 31, 31, 31, 30, 29, 29, 30, 30, 30]
		}
	};

	var DAY_MS = 864e5;
	var DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

	var NepaliCalendar = (function(){
		var years = BS_CALENDAR.years,
			epochMs, minYear, maxYear, totalDays,
			yearStart = {};

		function sum(arr){
			var total = 0;
			for (var i = 0; i < arr.length; i++)
				total += arr[i];
			return total;
		}

		function validateYear(year, months){
			if (Math.floor(year) !== year)
				throw new Error('Nepali calendar: year must be an integer, got ' + year);
			if (!Array.isArray(months) || months.length !== 12)
				throw new Error('Nepali calendar: year ' + year + ' must have 12 months');
			for (var i = 0; i < 12; i++){
				if (Math.floor(months[i]) !== months[i] || months[i] < 29 || months[i] > 32)
					throw new Error('Nepali calendar: month ' + (i + 1) + ' of ' + year + ' has invalid length ' + months[i]);
			}
		}

		function rebuild(){
			var keys = $.map(Object.keys(years), Number).sort(function(a, b){ return a - b; });
			minYear = keys[0];
			maxYear = keys[keys.length - 1];
			if (BS_CALENDAR.epoch.year !== minYear)
				throw new Error('Nepali calendar: epoch year ' + BS_CALENDAR.epoch.year + ' must be the first year in the table (' + minYear + ')');
			var ad = BS_CALENDAR.epoch.ad;
			epochMs = Date.UTC(ad[0], ad[1] - 1, ad[2]);
			var offset = 0;
			for (var y = minYear; y <= maxYear; y++){
				if (!years[y])
					throw new Error('Nepali calendar: data for year ' + y + ' is missing');
				validateYear(y, years[y]);
				yearStart[y] = offset;
				offset += sum(years[y]);
			}
			totalDays = offset;
		}

		function isValid(year, month, day){
			return !!years[year] && month >= 1 && month <= 12 && day >= 1 && day <= years[year][month - 1];
		}

		// BS -> AD, as a UTC-midnight Date (the picker's internal representation)
		function toUTC(year, month, day){
			year = Number(year);
			month = Number(month);
			day = Number(day);
			if (!isValid(year, month, day))
				return null;
			var offset = yearStart[year] + day - 1;
			for (var i = 0; i < month - 1; i++)
				offset += years[year][i];
			return new Date(epochMs + offset * DAY_MS);
		}

		// AD (read from the Date's UTC fields) -> BS
		function fromUTC(date){
			if (!date || isNaN(date.getTime()))
				return null;
			var offset = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - epochMs) / DAY_MS);
			if (offset < 0 || offset >= totalDays)
				return null;
			var year = minYear + Math.floor(offset / 366);
			while (year < maxYear && yearStart[year + 1] <= offset)
				year++;
			offset -= yearStart[year];
			var month = 0;
			while (offset >= years[year][month]){
				offset -= years[year][month];
				month++;
			}
			return {year: year, month: month + 1, day: offset + 1};
		}

		rebuild();

		return {
			_toUTC: toUTC,
			_fromUTC: fromUTC,
			_minDate: function(){ return new Date(epochMs); },
			_maxDate: function(){ return new Date(epochMs + (totalDays - 1) * DAY_MS); },

			/**
			 * Convert an AD date to BS. Reads the local calendar date of `date`.
			 * Returns {year, month (1-12), day} or null when outside the data range.
			 */
			toBS: function(date){
				if (!isDate(date))
					date = new Date(date);
				if (isNaN(date.getTime()))
					return null;
				return fromUTC(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())));
			},
			/**
			 * Convert a BS date (month 1-12) to AD. Returns a local-midnight Date
			 * or null when the BS date is invalid.
			 */
			toAD: function(year, month, day){
				var utc = toUTC(year, month, day);
				return utc && new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
			},
			today: function(){
				return this.toBS(new Date());
			},
			isValid: function(year, month, day){
				return isValid(Number(year), Number(month), Number(day));
			},
			daysInMonth: function(year, month){
				var y = years[Number(year)];
				return y ? y[Number(month) - 1] : undefined;
			},
			daysInYear: function(year){
				var y = years[Number(year)];
				return y ? sum(y) : undefined;
			},
			range: function(){
				return {minYear: minYear, maxYear: maxYear};
			},
			getYear: function(year){
				var y = years[Number(year)];
				return y ? y.slice() : undefined;
			},
			/**
			 * Replace the month lengths of an existing year, or append the year
			 * right after the last supported one.
			 */
			setYear: function(year, months){
				year = Number(year);
				validateYear(year, months);
				if (!years[year] && year !== maxYear + 1)
					throw new Error('Nepali calendar: can only replace an existing year or append ' + (maxYear + 1));
				years[year] = months.slice();
				rebuild();
				return this;
			},
			/** Apply several years at once: {2100: [...], 2101: [...]} */
			extend: function(data){
				var keys = $.map(Object.keys(data), Number).sort(function(a, b){ return a - b; });
				for (var i = 0; i < keys.length; i++)
					this.setYear(keys[i], data[keys[i]]);
				return this;
			}
		};
	})();

	function bsOf(date){
		return NepaliCalendar._fromUTC(date);
	}
	function bsDate(year, month, day){
		return NepaliCalendar._toUTC(year, month, day);
	}
	function clampToCalendar(date){
		var min = NepaliCalendar._minDate(),
			max = NepaliCalendar._maxDate();
		if (!isValidDate(date))
			return date;
		if (date < min)
			return min;
		if (date > max)
			return max;
		return date;
	}
	function toLatinDigits(str){
		return String(str).replace(/[०-९]/g, function(c){
			return String(c.charCodeAt(0) - 0x0966);
		});
	}
	function toNativeDigits(str, digits){
		return String(str).replace(/[0-9]/g, function(c){
			return digits[Number(c)];
		});
	}
	function escapeAttr(str){
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
	}
	function isUTCEquals(date1, date2) {
		return (
			date1.getUTCFullYear() === date2.getUTCFullYear() &&
			date1.getUTCMonth() === date2.getUTCMonth() &&
			date1.getUTCDate() === date2.getUTCDate()
		);
	}
	function alias(method, deprecationMsg){
		return function(){
			if (deprecationMsg !== undefined) {
				$.fn.npdatepicker.deprecated(deprecationMsg);
			}

			return this[method].apply(this, arguments);
		};
	}
	// Realm-safe (works for Dates created in iframes or other windows)
	function isDate(d){
		return Object.prototype.toString.call(d) === '[object Date]';
	}
	function isValidDate(d) {
		return !!d && typeof d.getTime === 'function' && !isNaN(d.getTime());
	}

	var DateArray = (function(){
		var extras = {
			get: function(i){
				return this.slice(i)[0];
			},
			contains: function(d){
				// Array.indexOf is not cross-browser;
				// $.inArray doesn't work with Dates
				var val = d && d.valueOf();
				for (var i=0, l=this.length; i < l; i++)
					// Use date arithmetic to allow dates with different times to match
					if (0 <= this[i].valueOf() - val && this[i].valueOf() - val < 1000*60*60*24)
						return i;
				return -1;
			},
			remove: function(i){
				this.splice(i,1);
			},
			replace: function(new_array){
				if (!new_array)
					return;
				if (!Array.isArray(new_array))
					new_array = [new_array];
				this.clear();
				this.push.apply(this, new_array);
			},
			clear: function(){
				this.length = 0;
			},
			copy: function(){
				var a = new DateArray();
				a.replace(this);
				return a;
			}
		};

		return function(){
			var a = [];
			a.push.apply(a, arguments);
			$.extend(a, extras);
			return a;
		};
	})();


	// Picker object

	var Datepicker = function(element, options){
		$.data(element, 'npdatepicker', this);

		this._events = [];
		this._secondaryEvents = [];

		this._process_options(options);

		this.dates = new DateArray();
		this.viewDate = this.o.defaultViewDate;
		this.focusDate = null;

		this.element = $(element);
		this.isInput = this.element.is('input');
		this.inputField = this.isInput ? this.element : this.element.find('input');
		this.component = this.element.hasClass('date') ? this.element.find('.add-on, .input-group-addon, .input-group-append, .input-group-prepend, .btn') : false;
		if (this.component && this.component.length === 0){
			this.component = false;
		}

		if (this.o.isInline === null){
			this.isInline = !this.component && !this.isInput;
		} else {
			this.isInline = this.o.isInline;
		}

		this.picker = $(DPGlobal.template);
		this.picker.addClass('npdatepicker');
		if (this.o.pickerClass)
			this.picker.addClass(this.o.pickerClass);
		this.setTheme(this.o.theme);

		// Checking templates and inserting
		if (this._check_template(this.o.templates.leftArrow)) {
			this.picker.find('.prev').html(this.o.templates.leftArrow);
		}

		if (this._check_template(this.o.templates.rightArrow)) {
			this.picker.find('.next').html(this.o.templates.rightArrow);
		}

		this._buildEvents();
		this._attachEvents();

		if (this.isInline){
			this.picker.addClass('datepicker-inline').appendTo(this.element);
		}
		else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}

		if (this.o.rtl){
			this.picker.addClass('datepicker-rtl');
		}

		if (this.o.calendarWeeks) {
			this.picker.find('.datepicker-days .datepicker-switch, thead .datepicker-title, tfoot .today, tfoot .clear')
				.attr('colspan', function(i, val){
					return Number(val) + 1;
				});
		}

		this._process_options({
			startDate: this._o.startDate,
			endDate: this._o.endDate,
			daysOfWeekDisabled: this.o.daysOfWeekDisabled,
			daysOfWeekHighlighted: this.o.daysOfWeekHighlighted,
			datesDisabled: this.o.datesDisabled
		});

		this._allow_update = false;
		this.setViewMode(this.o.startView);
		this._allow_update = true;

		this.fillDow();
		this.fillMonths();

		this.update();

		if (this.isInline){
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_resolveViewName: function(view){
			$.each(DPGlobal.viewModes, function(i, viewMode){
				if (view === i || $.inArray(view, viewMode.names) !== -1){
					view = i;
					return false;
				}
			});

			return view;
		},

		_resolveDaysOfWeek: function(daysOfWeek){
			if (!Array.isArray(daysOfWeek))
				daysOfWeek = daysOfWeek.split(/[,\s]*/);
			return $.map(daysOfWeek, Number);
		},

		_check_template: function(tmp){
			try {
				// If empty
				if (tmp === undefined || tmp === "") {
					return false;
				}
				// If no html, everything ok
				if ((tmp.match(/[<>]/g) || []).length <= 0) {
					return true;
				}
				// Checking if html is fine
				var jDom = $(tmp);
				return jDom.length > 0;
			}
			catch (ex) {
				return false;
			}
		},

		_process_options: function(opts){
			// Store raw options for reference
			this._o = $.extend({}, this._o, opts);
			// Processed options
			var o = this.o = $.extend({}, this._o);

			// Check if "de-DE" style date is available, if not language should
			// fallback to 2 letter code eg "de"
			var lang = o.language;
			if (!dates[lang]){
				lang = lang.split('-')[0];
				if (!dates[lang])
					lang = defaults.language;
			}
			o.language = lang;

			// Retrieve view index from any aliases
			o.startView = this._resolveViewName(o.startView);
			o.minViewMode = this._resolveViewName(o.minViewMode);
			o.maxViewMode = this._resolveViewName(o.maxViewMode);

			// Check view is between min and max
			o.startView = Math.max(this.o.minViewMode, Math.min(this.o.maxViewMode, o.startView));

			// true, false, or Number > 0
			if (o.multidate !== true){
				o.multidate = Number(o.multidate) || false;
				if (o.multidate !== false)
					o.multidate = Math.max(0, o.multidate);
			}
			o.multidateSeparator = String(o.multidateSeparator);

			o.unicodeDigits = o.unicodeDigits !== false && o.unicodeDigits !== 'false';

			o.weekStart %= 7;
			o.weekEnd = (o.weekStart + 6) % 7;

			// Strings are BS dates in `format`; Date objects are AD dates.
			// Both bounds are clamped to the range covered by the calendar data.
			var format = DPGlobal.parseFormat(o.format),
				calMin = NepaliCalendar._minDate(),
				calMax = NepaliCalendar._maxDate();
			if (isDate(o.startDate))
				o.startDate = this._local_to_utc(this._zero_time(o.startDate));
			else if (o.startDate && o.startDate !== -Infinity)
				o.startDate = DPGlobal.parseDate(o.startDate, format, o.language, o.assumeNearbyYear);
			if (!isValidDate(o.startDate) || o.startDate < calMin)
				o.startDate = calMin;

			if (isDate(o.endDate))
				o.endDate = this._local_to_utc(this._zero_time(o.endDate));
			else if (o.endDate && o.endDate !== Infinity)
				o.endDate = DPGlobal.parseDate(o.endDate, format, o.language, o.assumeNearbyYear);
			if (!isValidDate(o.endDate) || o.endDate > calMax)
				o.endDate = calMax;

			o.daysOfWeekDisabled = this._resolveDaysOfWeek(o.daysOfWeekDisabled||[]);
			o.daysOfWeekHighlighted = this._resolveDaysOfWeek(o.daysOfWeekHighlighted||[]);

			o.datesDisabled = o.datesDisabled||[];
			if (!Array.isArray(o.datesDisabled)) {
				o.datesDisabled = o.datesDisabled.split(',');
			}
			o.datesDisabled = $.grep($.map(o.datesDisabled, function(d){
				return DPGlobal.parseDate(d, format, o.language, o.assumeNearbyYear);
			}), isValidDate);

			var plc = String(o.orientation).toLowerCase().split(/\s+/g),
				_plc = o.orientation.toLowerCase();
			plc = $.grep(plc, function(word){
				return /^auto|left|right|top|bottom$/.test(word);
			});
			o.orientation = {x: 'auto', y: 'auto'};
			if (!_plc || _plc === 'auto')
				; // no action
			else if (plc.length === 1){
				switch (plc[0]){
					case 'top':
					case 'bottom':
						o.orientation.y = plc[0];
						break;
					case 'left':
					case 'right':
						o.orientation.x = plc[0];
						break;
				}
			}
			else {
				_plc = $.grep(plc, function(word){
					return /^left|right$/.test(word);
				});
				o.orientation.x = _plc[0] || 'auto';

				_plc = $.grep(plc, function(word){
					return /^top|bottom$/.test(word);
				});
				o.orientation.y = _plc[0] || 'auto';
			}
			if (isDate(o.defaultViewDate)) {
				o.defaultViewDate = this._local_to_utc(this._zero_time(o.defaultViewDate));
			} else if (typeof o.defaultViewDate === 'string') {
				o.defaultViewDate = DPGlobal.parseDate(o.defaultViewDate, format, o.language, o.assumeNearbyYear);
			} else if (o.defaultViewDate) {
				// {year, month, day} in BS; month is 0-based like bootstrap-datepicker
				var today = bsOf(clampToCalendar(UTCToday())),
					year = o.defaultViewDate.year || today.year,
					month = (o.defaultViewDate.month || 0) + 1,
					day = Math.min(o.defaultViewDate.day || 1, NepaliCalendar.daysInMonth(year, month) || 1);
				o.defaultViewDate = bsDate(year, month, day);
			}
			if (!isValidDate(o.defaultViewDate))
				o.defaultViewDate = UTCToday();
			o.defaultViewDate = clampToCalendar(o.defaultViewDate);
		},
		_applyEvents: function(evs){
			for (var i=0, el, ch, ev; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				} else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.on(ev, ch);
			}
		},
		_unapplyEvents: function(evs){
			for (var i=0, el, ev, ch; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				} else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.off(ev, ch);
			}
		},
		_buildEvents: function(){
			var events = {
				keyup: $.proxy(function(e){
					if ($.inArray(e.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1)
						this.update();
				}, this),
				keydown: $.proxy(this.keydown, this),
				paste: $.proxy(this.paste, this)
			};

			if (this.o.showOnFocus === true) {
				events.focus = $.proxy(this.show, this);
			}

			if (this.isInput) { // single input
				this._events = [
					[this.element, events]
				];
			}
			// component: input + button
			else if (this.component && this.inputField.length) {
				this._events = [
					// For components that are not readonly, allow keyboard nav
					[this.inputField, events],
					[this.component, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this),
						keydown: $.proxy(this.keydown, this)
					}]
				];
			}
			this._events.push(
				// Component: listen for blur on element descendants
				[this.element, '*', {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}],
				// Input: listen for blur on element
				[this.element, {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}]
			);

			if (this.o.immediateUpdates) {
				// Trigger input updates immediately on changed year/month
				this._events.push([this.element, {
					'changeYear changeMonth': $.proxy(function(e){
						this.update(e.date);
					}, this)
				}]);
			}

			this._secondaryEvents = [
				[this.picker, {
					click: $.proxy(this.click, this)
				}],
				[this.picker, '.prev, .next', {
					click: $.proxy(this.navArrowsClick, this)
				}],
				[this.picker, '.day:not(.disabled)', {
					click: $.proxy(this.dayCellClick, this)
				}],
				[$(window), {
					resize: $.proxy(this.place, this)
				}],
				[$(document), {
					'mousedown touchstart': $.proxy(function(e){
						// Clicked outside the datepicker, hide it
						if (!(
							this.element.is(e.target) ||
							this.element.find(e.target).length ||
							this.picker.is(e.target) ||
							this.picker.find(e.target).length ||
							this.isInline
						)){
							this.hide();
						}
					}, this)
				}]
			];
		},
		_attachEvents: function(){
			this._detachEvents();
			this._applyEvents(this._events);
		},
		_detachEvents: function(){
			this._unapplyEvents(this._events);
		},
		_attachSecondaryEvents: function(){
			this._detachSecondaryEvents();
			this._applyEvents(this._secondaryEvents);
		},
		_detachSecondaryEvents: function(){
			this._unapplyEvents(this._secondaryEvents);
		},
		_trigger: function(event, altdate){
			var date = altdate || this.dates.get(-1),
				local_date = this._utc_to_local(date);

			this.element.trigger({
				type: event,
				date: local_date,
				bsDate: date ? bsOf(date) : null,
				viewMode: this.viewMode,
				dates: $.map(this.dates, this._utc_to_local),
				bsDates: $.map(this.dates, bsOf),
				format: $.proxy(function(ix, format){
					if (arguments.length === 0){
						ix = this.dates.length - 1;
						format = this.o.format;
					} else if (typeof ix === 'string'){
						format = ix;
						ix = this.dates.length - 1;
					}
					format = format || this.o.format;
					var date = this.dates.get(ix);
					return DPGlobal.formatDate(date, format, this.o.language);
				}, this)
			});
		},

		show: function(){
			if (this.inputField.is(':disabled') || (this.inputField.prop('readonly') && this.o.enableOnReadonly === false))
				return;
			if (!this.isInline)
				this.picker.appendTo(this.o.container);
			this.place();
			this.picker.show();
			this._attachSecondaryEvents();
			this._trigger('show');
			if ((window.navigator.msMaxTouchPoints || 'ontouchstart' in document) && this.o.disableTouchKeyboard) {
				$(this.element).blur();
			}
			return this;
		},

		hide: function(){
			if (this.isInline || !this.picker.is(':visible'))
				return this;
			this.focusDate = null;
			this.picker.hide().detach();
			this._detachSecondaryEvents();
			this.setViewMode(this.o.startView);

			if (this.o.forceParse && this.inputField.val())
				this.setValue();
			this._trigger('hide');
			return this;
		},

		destroy: function(){
			this.hide();
			this._detachEvents();
			this._detachSecondaryEvents();
			this.picker.remove();
			delete this.element.data().npdatepicker;
			if (!this.isInput){
				delete this.element.data().date;
			}
			return this;
		},

		paste: function(e){
			var dateString;
			if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.types
				&& $.inArray('text/plain', e.originalEvent.clipboardData.types) !== -1) {
				dateString = e.originalEvent.clipboardData.getData('text/plain');
			} else if (window.clipboardData) {
				dateString = window.clipboardData.getData('Text');
			} else {
				return;
			}
			this.setDate(dateString);
			this.update();
			e.preventDefault();
		},

		_utc_to_local: function(utc){
			if (!utc) {
				return utc;
			}

			var local = new Date(utc.getTime() + (utc.getTimezoneOffset() * 60000));

			if (local.getTimezoneOffset() !== utc.getTimezoneOffset()) {
				local = new Date(utc.getTime() + (local.getTimezoneOffset() * 60000));
			}

			return local;
		},
		_local_to_utc: function(local){
			return local && new Date(local.getTime() - (local.getTimezoneOffset()*60000));
		},
		_zero_time: function(local){
			return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
		},
		_zero_utc_time: function(utc){
			return utc && UTCDate(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
		},
		// Number in the locale's digits, for display inside the picker
		_num: function(n){
			var digits = dates[this.o.language].digits;
			return digits && this.o.unicodeDigits ? toNativeDigits(n, digits) : String(n);
		},
		_bsToLocal: function(year, month, day){
			return this._utc_to_local(bsDate(year, month, day));
		},

		getDates: function(){
			return $.map(this.dates, this._utc_to_local);
		},

		getUTCDates: function(){
			return $.map(this.dates, function(d){
				return new Date(d);
			});
		},

		getDate: function(){
			return this._utc_to_local(this.getUTCDate());
		},

		getUTCDate: function(){
			var selected_date = this.dates.get(-1);
			if (selected_date !== undefined) {
				return new Date(selected_date);
			} else {
				return null;
			}
		},

		// Selected date as {year, month (1-12), day} in BS, or null
		getBsDate: function(){
			var selected_date = this.dates.get(-1);
			return selected_date !== undefined ? bsOf(selected_date) : null;
		},

		getBsDates: function(){
			return $.map(this.dates, bsOf);
		},

		clearDates: function(){
			this.inputField.val('');
			this._trigger('changeDate');
			this.update();
			if (this.o.autoclose) {
				this.hide();
			}
		},

		setDates: function(){
			var args = Array.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, args);
			this._trigger('changeDate');
			this.setValue();
			return this;
		},

		setUTCDates: function(){
			var args = Array.isArray(arguments[0]) ? arguments[0] : arguments;
			this.setDates.apply(this, $.map(args, this._utc_to_local));
			return this;
		},

		setDate: alias('setDates'),
		setUTCDate: alias('setUTCDates'),
		remove: alias('destroy', 'Method `remove` is deprecated and will be removed in version 3.0. Use `destroy` instead'),

		setValue: function(){
			var formatted = this.getFormattedDate();
			this.inputField.val(formatted);
			return this;
		},

		getFormattedDate: function(format){
			if (format === undefined)
				format = this.o.format;

			var lang = this.o.language;
			return $.map(this.dates, function(d){
				return DPGlobal.formatDate(d, format, lang);
			}).join(this.o.multidateSeparator);
		},

		getStartDate: function(){
			return this.o.startDate;
		},

		setStartDate: function(startDate){
			this._process_options({startDate: startDate});
			this.update();
			this.updateNavArrows();
			return this;
		},

		getEndDate: function(){
			return this.o.endDate;
		},

		setEndDate: function(endDate){
			this._process_options({endDate: endDate});
			this.update();
			this.updateNavArrows();
			return this;
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
			this.update();
			return this;
		},

		setDaysOfWeekHighlighted: function(daysOfWeekHighlighted){
			this._process_options({daysOfWeekHighlighted: daysOfWeekHighlighted});
			this.update();
			return this;
		},

		setDatesDisabled: function(datesDisabled){
			this._process_options({datesDisabled: datesDisabled});
			this.update();
			return this;
		},

		// Switches the `npdatepicker-theme-*` class; '' or null removes the theme
		setTheme: function(theme){
			this.picker.removeClass(function(i, cls){
				return $.grep(cls.split(/\s+/), function(c){
					return c.indexOf('npdatepicker-theme-') === 0;
				}).join(' ');
			});
			if (theme)
				this.picker.addClass('npdatepicker-theme-' + theme);
			this.o.theme = this._o.theme = theme || '';
			return this;
		},

		// Show the calendar in the locale's digits (true) or 0-9 (false).
		// The input value always uses 0-9.
		setUnicodeDigits: function(value){
			this._process_options({unicodeDigits: value});
			this.fill();
			return this;
		},

		place: function(){
			if (this.isInline)
				return this;
			var calendarWidth = this.picker.outerWidth(),
				calendarHeight = this.picker.outerHeight(),
				visualPadding = 10,
				container = $(this.o.container),
				windowWidth = container.width(),
				scrollTop = this.o.container === 'body' ? $(document).scrollTop() : container.scrollTop(),
				appendOffset = container.offset();

			var parentsZindex = [0];
			this.element.parents().each(function(){
				var itemZIndex = $(this).css('z-index');
				if (itemZIndex !== 'auto' && Number(itemZIndex) !== 0) parentsZindex.push(Number(itemZIndex));
			});
			var zIndex = Math.max.apply(Math, parentsZindex) + this.o.zIndexOffset;
			var offset = this.component ? this.component.parent().offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
			var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
			var left = offset.left - appendOffset.left;
			var top = offset.top - appendOffset.top;

			if (this.o.container !== 'body') {
				top += scrollTop;
			}

			this.picker.removeClass(
				'datepicker-orient-top datepicker-orient-bottom '+
				'datepicker-orient-right datepicker-orient-left'
			);

			if (this.o.orientation.x !== 'auto'){
				this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
				if (this.o.orientation.x === 'right')
					left -= calendarWidth - width;
			}
			// auto x orientation is best-placement: if it crosses a window
			// edge, fudge it sideways
			else {
				if (offset.left < 0) {
					// component is outside the window on the left side. Move it into visible range
					this.picker.addClass('datepicker-orient-left');
					left -= offset.left - visualPadding;
				} else if (left + calendarWidth > windowWidth) {
					// the calendar passes the widow right edge. Align it to component right side
					this.picker.addClass('datepicker-orient-right');
					left += width - calendarWidth;
				} else {
					if (this.o.rtl) {
						// Default to right
						this.picker.addClass('datepicker-orient-right');
					} else {
						// Default to left
						this.picker.addClass('datepicker-orient-left');
					}
				}
			}

			// auto y orientation is best-situation: top or bottom, no fudging,
			// decision based on which shows more of the calendar
			var yorient = this.o.orientation.y,
				top_overflow;
			if (yorient === 'auto'){
				top_overflow = -scrollTop + top - calendarHeight;
				yorient = top_overflow < 0 ? 'bottom' : 'top';
			}

			this.picker.addClass('datepicker-orient-' + yorient);
			if (yorient === 'top')
				top -= calendarHeight + parseInt(this.picker.css('padding-top'));
			else
				top += height;

			if (this.o.rtl) {
				var right = windowWidth - (left + width);
				this.picker.css({
					top: top,
					right: right,
					zIndex: zIndex
				});
			} else {
				this.picker.css({
					top: top,
					left: left,
					zIndex: zIndex
				});
			}
			return this;
		},

		_allow_update: true,
		update: function(){
			if (!this._allow_update)
				return this;

			var oldDates = this.dates.copy(),
				dates = [],
				fromArgs = false;
			if (arguments.length){
				$.each(arguments, $.proxy(function(i, date){
					if (isDate(date))
						date = this._local_to_utc(date);
					dates.push(date);
				}, this));
				fromArgs = true;
			} else {
				dates = this.isInput
						? this.element.val()
						: this.element.data('date') || this.inputField.val();
				if (dates && this.o.multidate)
					dates = dates.split(this.o.multidateSeparator);
				else
					dates = [dates];
				delete this.element.data().date;
			}

			dates = $.map(dates, $.proxy(function(date){
				return DPGlobal.parseDate(date, this.o.format, this.o.language, this.o.assumeNearbyYear);
			}, this));
			dates = $.grep(dates, $.proxy(function(date){
				return (
					!this.dateWithinRange(date) ||
					!date
				);
			}, this), true);
			this.dates.replace(dates);

			if (this.o.updateViewDate) {
				if (this.dates.length)
					this.viewDate = new Date(this.dates.get(-1));
				else if (this.viewDate < this.o.startDate)
					this.viewDate = new Date(this.o.startDate);
				else if (this.viewDate > this.o.endDate)
					this.viewDate = new Date(this.o.endDate);
				else
					this.viewDate = this.o.defaultViewDate;
			}

			if (fromArgs){
				// setting date by clicking
				this.setValue();
				this.element.change();
			}
			else if (this.dates.length){
				// setting date by typing
				if (String(oldDates) !== String(this.dates)) {
					this._trigger('changeDate');
				}
			}
			if (!this.dates.length && oldDates.length) {
				this._trigger('clearDate');
				this.element.change();
			}

			this.fill();
			return this;
		},

		fillDow: function(){
			if (this.o.showWeekDays) {
				var dowCnt = this.o.weekStart,
					html = '<tr>';
				if (this.o.calendarWeeks){
					html += '<th class="cw">&#160;</th>';
				}
				while (dowCnt < this.o.weekStart + 7){
					html += '<th class="dow';
					if ($.inArray(dowCnt, this.o.daysOfWeekDisabled) !== -1)
						html += ' disabled';
					html += '">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
				}
				html += '</tr>';
				this.picker.find('.datepicker-days thead').append(html);
			}
		},

		fillMonths: function(){
			var view = bsOf(this.viewDate);
			var html = '';
			var focused;
			for (var i = 0; i < 12; i++){
				focused = view && view.month - 1 === i ? ' focused' : '';
				html += '<span class="month' + focused + '">' + dates[this.o.language].monthsShort[i] + '</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		setRange: function(range){
			if (!range || !range.length)
				delete this.range;
			else
				this.range = $.map(range, function(d){
					return d.valueOf();
				});
			this.fill();
		},

		getClassNames: function(date){
			var cls = [],
				view = bsOf(this.viewDate),
				bs = bsOf(date),
				today = UTCToday();
			if (!bs)
				return ['disabled'];
			var viewKey = view.year * 12 + view.month,
				dateKey = bs.year * 12 + bs.month;
			if (dateKey < viewKey){
				cls.push('old');
			} else if (dateKey > viewKey){
				cls.push('new');
			}
			if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
				cls.push('focused');
			// Compare internal UTC date with UTC today, not local today
			if (this.o.todayHighlight && isUTCEquals(date, today)) {
				cls.push('today');
			}
			if (this.dates.contains(date) !== -1)
				cls.push('active');
			if (!this.dateWithinRange(date)){
				cls.push('disabled');
			}
			if (this.dateIsDisabled(date)){
				cls.push('disabled', 'disabled-date');
			}
			if ($.inArray(date.getUTCDay(), this.o.daysOfWeekHighlighted) !== -1){
				cls.push('highlighted');
			}

			if (this.range){
				if (date > this.range[0] && date < this.range[this.range.length-1]){
					cls.push('range');
				}
				if ($.inArray(date.valueOf(), this.range) !== -1){
					cls.push('selected');
				}
				if (date.valueOf() === this.range[0]){
					cls.push('range-start');
				}
				if (date.valueOf() === this.range[this.range.length-1]){
					cls.push('range-end');
				}
			}
			return cls;
		},

		_fill_yearsView: function(selector, cssClass, factor, year, startYear, endYear, beforeFn){
			var html = '';
			var step = factor / 10;
			var view = this.picker.find(selector);
			var startVal = Math.floor(year / factor) * factor;
			var endVal = startVal + step * 9;
			var focusedVal = Math.floor(bsOf(this.viewDate).year / step) * step;
			var selected = $.map(this.dates, function(d){
				return Math.floor(bsOf(d).year / step) * step;
			});

			var classes, tooltip, before;
			for (var currVal = startVal - step; currVal <= endVal + step; currVal += step) {
				classes = [cssClass];
				tooltip = null;

				if (currVal === startVal - step) {
					classes.push('old');
				} else if (currVal === endVal + step) {
					classes.push('new');
				}
				if ($.inArray(currVal, selected) !== -1) {
					classes.push('active');
				}
				// A decade/century is selectable if any of its years is in range
				if (currVal + step - 1 < startYear || currVal > endYear) {
					classes.push('disabled');
				}
				if (currVal === focusedVal) {
					classes.push('focused');
				}

				if (beforeFn !== $.noop) {
					before = beforeFn(this._bsToLocal(currVal, 1, 1), currVal);
					if (before === undefined) {
						before = {};
					} else if (typeof before === 'boolean') {
						before = {enabled: before};
					} else if (typeof before === 'string') {
						before = {classes: before};
					}
					if (before.enabled === false) {
						classes.push('disabled');
					}
					if (before.classes) {
						classes = classes.concat(before.classes.split(/\s+/));
					}
					if (before.tooltip) {
						tooltip = before.tooltip;
					}
				}

				html += '<span class="' + escapeAttr(classes.join(' ')) + '"' + (tooltip ? ' title="' + escapeAttr(tooltip) + '"' : '') + ' data-year="' + currVal + '">' + this._num(currVal) + '</span>';
			}

			view.find('.datepicker-switch').text(this._num(startVal) + '-' + this._num(endVal));
			view.find('td').html(html);
		},

		fill: function(){
			this.viewDate = clampToCalendar(this.viewDate);
			var d = new Date(this.viewDate),
				view = bsOf(d),
				start = bsOf(this.o.startDate),
				end = bsOf(this.o.endDate),
				todaytxt = dates[this.o.language].today || dates['en'].today || '',
				cleartxt = dates[this.o.language].clear || dates['en'].clear || '',
				titleFormat = dates[this.o.language].titleFormat || dates['en'].titleFormat,
				todayDate = UTCToday(),
				titleBtnVisible = (this.o.todayBtn === true || this.o.todayBtn === 'linked') && todayDate >= this.o.startDate && todayDate <= this.o.endDate && !this.weekOfDateIsDisabled(todayDate),
				tooltip,
				before;
			if (!view)
				return;
			var year = view.year,
				month = view.month,
				startYear = start.year,
				startMonth = start.month - 1,
				endYear = end.year,
				endMonth = end.month - 1;
			this.picker.find('.datepicker-days .datepicker-switch')
						.text(DPGlobal.formatDate(d, titleFormat, this.o.language, this.o.unicodeDigits));
			this.picker.find('tfoot .today')
						.text(todaytxt)
						.css('display', titleBtnVisible ? 'table-cell' : 'none');
			this.picker.find('tfoot .clear')
						.text(cleartxt)
						.css('display', this.o.clearBtn === true ? 'table-cell' : 'none');
			this.picker.find('thead .datepicker-title')
						.text(this.o.title)
						.css('display', typeof this.o.title === 'string' && this.o.title !== '' ? 'table-cell' : 'none');
			this.updateNavArrows();
			this.fillMonths();
			// Last day of the previous BS month, moved back to the start of its week
			var prevMonth = bsDate(year, month, 1);
			prevMonth.setUTCDate(prevMonth.getUTCDate() - 1);
			prevMonth.setUTCDate(prevMonth.getUTCDate() - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var weekDay, clsName, bs;
			while (prevMonth.valueOf() < nextMonth){
				weekDay = prevMonth.getUTCDay();
				if (weekDay === this.o.weekStart){
					html.push('<tr>');
					if (this.o.calendarWeeks){
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.o.weekStart - weekDay - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay()) % 7 * 864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek = (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">'+ this._num(calWeek) +'</td>');
					}
				}
				bs = bsOf(prevMonth);
				clsName = this.getClassNames(prevMonth);
				clsName.push('day');

				var content = bs ? this._num(bs.day) : '';

				if (bs && this.o.beforeShowDay !== $.noop){
					before = this.o.beforeShowDay(this._utc_to_local(prevMonth), bs);
					if (before === undefined)
						before = {};
					else if (typeof before === 'boolean')
						before = {enabled: before};
					else if (typeof before === 'string')
						before = {classes: before};
					if (before.enabled === false)
						clsName.push('disabled');
					if (before.classes)
						clsName = clsName.concat(before.classes.split(/\s+/));
					if (before.tooltip)
						tooltip = before.tooltip;
					if (before.content)
						content = before.content;
				}

				//Check if uniqueSort exists (supported by jquery >=1.12 and >=2.2)
				//Fallback to unique function for older jquery versions
				if (typeof $.uniqueSort === "function") {
					clsName = $.uniqueSort(clsName);
				} else {
					clsName = $.unique(clsName);
				}

				html.push('<td class="'+escapeAttr(clsName.join(' '))+'"' + (tooltip ? ' title="'+escapeAttr(tooltip)+'"' : '') + ' data-date="' + prevMonth.getTime().toString() + '">' + content + '</td>');
				tooltip = null;
				if (weekDay === this.o.weekEnd){
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
			}
			this.picker.find('.datepicker-days tbody').html(html.join(''));

			var monthsTitle = dates[this.o.language].monthsTitle || dates['en'].monthsTitle || 'Months';
			var months = this.picker.find('.datepicker-months')
						.find('.datepicker-switch')
							.text(this.o.maxViewMode < 2 ? monthsTitle : this._num(year))
							.end()
						.find('tbody span').removeClass('active');

			$.each(this.dates, function(i, d){
				var b = bsOf(d);
				if (b && b.year === year)
					months.eq(b.month - 1).addClass('active');
			});

			if (year < startYear || year > endYear){
				months.addClass('disabled');
			}
			if (year === startYear){
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year === endYear){
				months.slice(endMonth+1).addClass('disabled');
			}

			if (this.o.beforeShowMonth !== $.noop){
				var that = this;
				$.each(months, function(i, month){
					var moDate = that._bsToLocal(year, i + 1, 1);
					var before = that.o.beforeShowMonth(moDate, {year: year, month: i + 1, day: 1});
					if (before === undefined)
						before = {};
					else if (typeof before === 'boolean')
						before = {enabled: before};
					else if (typeof before === 'string')
						before = {classes: before};
					if (before.enabled === false && !$(month).hasClass('disabled'))
						$(month).addClass('disabled');
					if (before.classes)
						$(month).addClass(before.classes);
					if (before.tooltip)
						$(month).prop('title', before.tooltip);
				});
			}

			// Generating decade/years picker
			this._fill_yearsView(
				'.datepicker-years',
				'year',
				10,
				year,
				startYear,
				endYear,
				this.o.beforeShowYear
			);

			// Generating century/decades picker
			this._fill_yearsView(
				'.datepicker-decades',
				'decade',
				100,
				year,
				startYear,
				endYear,
				this.o.beforeShowDecade
			);

			// Generating millennium/centuries picker
			this._fill_yearsView(
				'.datepicker-centuries',
				'century',
				1000,
				year,
				startYear,
				endYear,
				this.o.beforeShowCentury
			);
		},

		updateNavArrows: function(){
			if (!this._allow_update)
				return;

			var view = bsOf(clampToCalendar(this.viewDate)),
				start = bsOf(this.o.startDate),
				end = bsOf(this.o.endDate);
			if (!view || !start || !end)
				return;
			var year = view.year,
				month = view.month,
				startYear = start.year,
				startMonth = start.month,
				endYear = end.year,
				endMonth = end.month,
				prevIsDisabled,
				nextIsDisabled,
				factor = 1;
			switch (this.viewMode){
				case 4:
					factor *= 10;
					/* falls through */
				case 3:
					factor *= 10;
					/* falls through */
				case 2:
					factor *= 10;
					/* falls through */
				case 1:
					prevIsDisabled = Math.floor(year / factor) * factor <= startYear;
					nextIsDisabled = Math.floor(year / factor) * factor + factor > endYear;
					break;
				case 0:
					prevIsDisabled = year < startYear || (year === startYear && month <= startMonth);
					nextIsDisabled = year > endYear || (year === endYear && month >= endMonth);
					break;
			}

			this.picker.find('.prev').toggleClass('disabled', prevIsDisabled);
			this.picker.find('.next').toggleClass('disabled', nextIsDisabled);
		},

		click: function(e){
			e.preventDefault();
			e.stopPropagation();

			var target, day, year, month, view;
			target = $(e.target);

			// Clicked on the switch
			if (target.hasClass('datepicker-switch') && this.viewMode !== this.o.maxViewMode){
				this.setViewMode(this.viewMode + 1);
			}

			// Clicked on today button
			if (target.hasClass('today') && !target.hasClass('day')){
				this.setViewMode(0);
				this._setDate(UTCToday(), this.o.todayBtn === 'linked' ? null : 'view');
			}

			// Clicked on clear button
			if (target.hasClass('clear')){
				this.clearDates();
			}

			if (!target.hasClass('disabled')){
				// Clicked on a month, year, decade, century
				if (target.hasClass('month')
						|| target.hasClass('year')
						|| target.hasClass('decade')
						|| target.hasClass('century')) {
					view = bsOf(this.viewDate);
					day = 1;
					if (this.viewMode === 1){
						month = target.parent().find('span').index(target);
						year = view.year;
						this.viewDate = bsDate(year, month + 1, 1);
					} else {
						month = 0;
						year = Number(target.data('year'));
						this.viewDate = clampToCalendar(bsDate(year, view.month, 1) || bsDate(year, 1, 1) || this.viewDate);
					}

					this._trigger(DPGlobal.viewModes[this.viewMode - 1].e, this.viewDate);

					if (this.viewMode === this.o.minViewMode){
						this._setDate(bsDate(year, month + 1, day));
					} else {
						this.setViewMode(this.viewMode - 1);
						this.fill();
					}
				}
			}

			if (this.picker.is(':visible') && this._focused_from){
				this._focused_from.focus();
			}
			delete this._focused_from;
		},

		dayCellClick: function(e){
			var $target = $(e.currentTarget);
			var timestamp = $target.data('date');
			var date = new Date(timestamp);

			if (this.o.updateViewDate) {
				var bs = bsOf(date),
					view = bsOf(this.viewDate);
				if (bs.year !== view.year) {
					this._trigger('changeYear', this.viewDate);
				}

				if (bs.month !== view.month) {
					this._trigger('changeMonth', this.viewDate);
				}
			}
			this._setDate(date);
		},

		// Clicked on prev or next
		navArrowsClick: function(e){
			var $target = $(e.currentTarget);
			var dir = $target.hasClass('prev') ? -1 : 1;
			if (this.viewMode !== 0){
				dir *= DPGlobal.viewModes[this.viewMode].navStep * 12;
			}
			this.viewDate = this.moveMonth(this.viewDate, dir);
			this._trigger(DPGlobal.viewModes[this.viewMode].e, this.viewDate);
			this.fill();
		},

		_toggle_multidate: function(date){
			var ix = this.dates.contains(date);
			if (!date){
				this.dates.clear();
			}

			if (ix !== -1){
				if (this.o.multidate === true || this.o.multidate > 1 || this.o.toggleActive){
					this.dates.remove(ix);
				}
			} else if (this.o.multidate === false) {
				this.dates.clear();
				this.dates.push(date);
			}
			else {
				this.dates.push(date);
			}

			if (typeof this.o.multidate === 'number')
				while (this.dates.length > this.o.multidate)
					this.dates.remove(0);
		},

		_setDate: function(date, which){
			if (!which || which === 'date')
				this._toggle_multidate(date && new Date(date));
			if ((!which && this.o.updateViewDate) || which === 'view')
				this.viewDate = date && new Date(date);

			this.fill();
			this.setValue();
			if (!which || which !== 'view') {
				this._trigger('changeDate');
			}
			this.inputField.trigger('change');
			if (this.o.autoclose && (!which || which === 'date')){
				this.hide();
			}
		},

		moveDay: function(date, dir){
			var newDate = new Date(date);
			newDate.setUTCDate(date.getUTCDate() + dir);

			return newDate;
		},

		moveWeek: function(date, dir){
			return this.moveDay(date, dir * 7);
		},

		// Moves by BS months, keeping the day of month when possible
		// (eg, 32 Asar -> 31 Shrawan). Stops at the ends of the calendar data.
		moveMonth: function(date, dir){
			if (!isValidDate(date))
				return this.o ? this.o.defaultViewDate : UTCToday();
			if (!dir)
				return date;
			var bs = bsOf(date);
			if (!bs)
				return clampToCalendar(date);
			var total = bs.year * 12 + (bs.month - 1) + dir,
				year = Math.floor(total / 12),
				month = total - year * 12 + 1,
				range = NepaliCalendar.range();
			if (year < range.minYear)
				return NepaliCalendar._minDate();
			if (year > range.maxYear)
				return NepaliCalendar._maxDate();
			return bsDate(year, month, Math.min(bs.day, NepaliCalendar.daysInMonth(year, month)));
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		moveAvailableDate: function(date, dir, fn){
			do {
				date = this[fn](date, dir);

				if (!this.dateWithinRange(date))
					return false;

				fn = 'moveDay';
			}
			while (this.dateIsDisabled(date));

			return date;
		},

		weekOfDateIsDisabled: function(date){
			return $.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1;
		},

		dateIsDisabled: function(date){
			return (
				this.weekOfDateIsDisabled(date) ||
				$.grep(this.o.datesDisabled, function(d){
					return isUTCEquals(date, d);
				}).length > 0
			);
		},

		dateWithinRange: function(date){
			return date >= this.o.startDate && date <= this.o.endDate;
		},

		keydown: function(e){
			if (!this.picker.is(':visible')){
				if (e.keyCode === 40 || e.keyCode === 27) { // allow down to re-show picker
					this.show();
					e.stopPropagation();
				}
				return;
			}
			var dateChanged = false,
				dir, newViewDate,
				focusDate = this.focusDate || this.viewDate;
			switch (e.keyCode){
				case 27: // escape
					if (this.focusDate){
						this.focusDate = null;
						this.viewDate = this.dates.get(-1) || this.viewDate;
						this.fill();
					}
					else
						this.hide();
					e.preventDefault();
					e.stopPropagation();
					break;
				case 37: // left
				case 38: // up
				case 39: // right
				case 40: // down
					if (!this.o.keyboardNavigation || this.o.daysOfWeekDisabled.length === 7)
						break;
					dir = e.keyCode === 37 || e.keyCode === 38 ? -1 : 1;
					if (this.viewMode === 0) {
						if (e.ctrlKey){
							newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');

							if (newViewDate)
								this._trigger('changeYear', this.viewDate);
						} else if (e.shiftKey){
							newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');

							if (newViewDate)
								this._trigger('changeMonth', this.viewDate);
						} else if (e.keyCode === 37 || e.keyCode === 39){
							newViewDate = this.moveAvailableDate(focusDate, dir, 'moveDay');
						} else if (!this.weekOfDateIsDisabled(focusDate)){
							newViewDate = this.moveAvailableDate(focusDate, dir, 'moveWeek');
						}
					} else if (this.viewMode === 1) {
						if (e.keyCode === 38 || e.keyCode === 40) {
							dir = dir * 4;
						}
						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');
					} else if (this.viewMode === 2) {
						if (e.keyCode === 38 || e.keyCode === 40) {
							dir = dir * 4;
						}
						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');
					}
					if (newViewDate){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 13: // enter
					if (!this.o.forceParse)
						break;
					focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
					if (this.o.keyboardNavigation) {
						this._toggle_multidate(focusDate);
						dateChanged = true;
					}
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.setValue();
					this.fill();
					if (this.picker.is(':visible')){
						e.preventDefault();
						e.stopPropagation();
						if (this.o.autoclose)
							this.hide();
					}
					break;
				case 9: // tab
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.fill();
					this.hide();
					break;
			}
			if (dateChanged){
				if (this.dates.length)
					this._trigger('changeDate');
				else
					this._trigger('clearDate');
				this.inputField.trigger('change');
			}
		},

		setViewMode: function(viewMode){
			this.viewMode = viewMode;
			this.picker
				.children('div')
				.hide()
				.filter('.datepicker-' + DPGlobal.viewModes[this.viewMode].clsName)
					.show();
			this.updateNavArrows();
			this._trigger('changeViewMode', new Date(this.viewDate));
		}
	};

	var DateRangePicker = function(element, options){
		$.data(element, 'npdatepicker', this);
		this.element = $(element);
		this.inputs = $.map(options.inputs, function(i){
			return i.jquery ? i[0] : i;
		});
		delete options.inputs;

		this.keepEmptyValues = options.keepEmptyValues;
		delete options.keepEmptyValues;

		datepickerPlugin.call($(this.inputs), options)
			.on('changeDate', $.proxy(this.dateUpdated, this));

		this.pickers = $.map(this.inputs, function(i){
			return $.data(i, 'npdatepicker');
		});
		this.updateDates();
	};
	DateRangePicker.prototype = {
		updateDates: function(){
			this.dates = $.map(this.pickers, function(i){
				return i.getUTCDate();
			});
			this.updateRanges();
		},
		updateRanges: function(){
			var range = $.map(this.dates, function(d){
				return d.valueOf();
			});
			$.each(this.pickers, function(i, p){
				p.setRange(range);
			});
		},
		clearDates: function(){
			$.each(this.pickers, function(i, p){
				p.clearDates();
			});
		},
		setTheme: function(theme){
			$.each(this.pickers, function(i, p){
				p.setTheme(theme);
			});
		},
		setUnicodeDigits: function(value){
			$.each(this.pickers, function(i, p){
				p.setUnicodeDigits(value);
			});
		},
		dateUpdated: function(e){
			// `this.updating` is a workaround for preventing infinite recursion
			// between `changeDate` triggering and `setUTCDate` calling.  Until
			// there is a better mechanism.
			if (this.updating)
				return;
			this.updating = true;

			var dp = $.data(e.target, 'npdatepicker');

			if (dp === undefined) {
				delete this.updating;
				return;
			}

			var new_date = dp.getUTCDate(),
				keep_empty_values = this.keepEmptyValues,
				i = $.inArray(e.target, this.inputs),
				j = i - 1,
				k = i + 1,
				l = this.inputs.length;
			if (i === -1){
				delete this.updating;
				return;
			}

			$.each(this.pickers, function(i, p){
				if (!p.getUTCDate() && (p === dp || !keep_empty_values))
					p.setUTCDate(new_date);
			});

			if (new_date < this.dates[j]){
				// Date being moved earlier/left
				while (j >= 0 && new_date < this.dates[j] && (this.pickers[j].element.val() || "").length > 0) {
					this.pickers[j--].setUTCDate(new_date);
				}
			} else if (new_date > this.dates[k]){
				// Date being moved later/right
				while (k < l && new_date > this.dates[k] && (this.pickers[k].element.val() || "").length > 0) {
					this.pickers[k++].setUTCDate(new_date);
				}
			}
			this.updateDates();

			delete this.updating;
		},
		destroy: function(){
			$.map(this.pickers, function(p){ p.destroy(); });
			$(this.inputs).off('changeDate', this.dateUpdated);
			delete this.element.data().npdatepicker;
		},
		remove: alias('destroy', 'Method `remove` is deprecated and will be removed in version 3.0. Use `destroy` instead')
	};

	function opts_from_el(el, prefix){
		// Derive options from element data-attrs
		var data = $(el).data(),
			out = {}, inkey,
			replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
		prefix = new RegExp('^' + prefix.toLowerCase());
		function re_lower(_,a){
			return a.toLowerCase();
		}
		for (var key in data)
			if (prefix.test(key)){
				inkey = key.replace(replace, re_lower);
				out[inkey] = data[key];
			}
		return out;
	}

	function opts_from_locale(lang){
		// Derive options from locale plugins
		var out = {};
		// Check if "de-DE" style date is available, if not language should
		// fallback to 2 letter code eg "de"
		if (!dates[lang]){
			lang = lang.split('-')[0];
			if (!dates[lang])
				return;
		}
		var d = dates[lang];
		$.each(locale_opts, function(i,k){
			if (k in d)
				out[k] = d[k];
		});
		return out;
	}

	var old = $.fn.npdatepicker;
	var datepickerPlugin = function(option){
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function(){
			var $this = $(this),
				data = $this.data('npdatepicker'),
				options = typeof option === 'object' && option;
			if (!data){
				var elopts = opts_from_el(this, 'date'),
					// Preliminary otions
					xopts = $.extend({}, defaults, elopts, options),
					locopts = opts_from_locale(xopts.language),
					// Options priority: js args, data-attrs, locales, defaults
					opts = $.extend({}, defaults, locopts, elopts, options);
				// Picking several dates needs the picker to stay open, so multidate
				// turns autoclose off unless it was set explicitly
				if (opts.multidate && opts.multidate !== 1 && !('autoclose' in elopts) && !(options && 'autoclose' in options))
					opts.autoclose = false;
				if ($this.hasClass('input-daterange') || opts.inputs){
					$.extend(opts, {
						inputs: opts.inputs || $this.find('input').toArray()
					});
					data = new DateRangePicker(this, opts);
				}
				else {
					data = new Datepicker(this, opts);
				}
				$this.data('npdatepicker', data);
			}
			if (typeof option === 'string' && typeof data[option] === 'function'){
				internal_return = data[option].apply(data, args);
			}
		});

		if (
			internal_return === undefined ||
			internal_return instanceof Datepicker ||
			internal_return instanceof DateRangePicker
		)
			return this;

		if (this.length > 1)
			throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
		else
			return internal_return;
	};
	$.fn.npdatepicker = datepickerPlugin;

	var defaults = $.fn.npdatepicker.defaults = {
		assumeNearbyYear: false,
		autoclose: true,
		beforeShowDay: $.noop,
		beforeShowMonth: $.noop,
		beforeShowYear: $.noop,
		beforeShowDecade: $.noop,
		beforeShowCentury: $.noop,
		calendarWeeks: false,
		clearBtn: false,
		toggleActive: false,
		daysOfWeekDisabled: [],
		daysOfWeekHighlighted: [],
		datesDisabled: [],
		endDate: Infinity,
		forceParse: true,
		format: 'yyyy-mm-dd',
		isInline: null,
		keepEmptyValues: false,
		keyboardNavigation: true,
		language: 'np',
		minViewMode: 0,
		maxViewMode: 4,
		multidate: false,
		multidateSeparator: ',',
		orientation: "auto",
		pickerClass: '',
		rtl: false,
		startDate: -Infinity,
		startView: 0,
		todayBtn: false,
		todayHighlight: true,
		updateViewDate: true,
		weekStart: 0,
		disableTouchKeyboard: false,
		enableOnReadonly: true,
		showOnFocus: true,
		zIndexOffset: 10,
		container: 'body',
		immediateUpdates: false,
		title: '',
		templates: {
			leftArrow: '&#x00AB;',
			rightArrow: '&#x00BB;'
		},
		theme: '',
		// Show the calendar in the locale's digits (Devanagari for 'np').
		// The input value and formatted output always use 0-9.
		unicodeDigits: true,
		showWeekDays: true
	};
	var locale_opts = $.fn.npdatepicker.locale_opts = [
		'format',
		'rtl',
		'weekStart'
	];
	$.fn.npdatepicker.Constructor = Datepicker;
	var dates = $.fn.npdatepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
			months: ["Baisakh", "Jestha", "Asar", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"],
			monthsShort: ["Bai", "Jes", "Asa", "Shr", "Bha", "Ash", "Kar", "Man", "Pou", "Mag", "Fal", "Cha"],
			today: "Today",
			clear: "Clear",
			titleFormat: "MM yyyy"
		},
		np: {
			days: ["आइतबार", "सोमबार", "मङ्गलबार", "बुधबार", "बिहिबार", "शुक्रबार", "शनिबार"],
			daysShort: ["आइत", "सोम", "मङ्गल", "बुध", "बिहि", "शुक्र", "शनि"],
			daysMin: ["आ", "सो", "मं", "बु", "बि", "शु", "श"],
			months: ["बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कार्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"],
			monthsShort: ["बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कार्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"],
			monthsTitle: "महिनाहरू",
			today: "आज",
			clear: "हटाउनुहोस्",
			titleFormat: "MM yyyy",
			digits: DEVANAGARI_DIGITS
		}
	};
	// ISO 639-1 code for Nepali
	dates.ne = dates.np;

	var DPGlobal = {
		viewModes: [
			{
				names: ['days', 'month'],
				clsName: 'days',
				e: 'changeMonth'
			},
			{
				names: ['months', 'year'],
				clsName: 'months',
				e: 'changeYear',
				navStep: 1
			},
			{
				names: ['years', 'decade'],
				clsName: 'years',
				e: 'changeDecade',
				navStep: 10
			},
			{
				names: ['decades', 'century'],
				clsName: 'decades',
				e: 'changeCentury',
				navStep: 100
			},
			{
				names: ['centuries', 'millennium'],
				clsName: 'centuries',
				e: 'changeMillennium',
				navStep: 1000
			}
		],
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@年月日\[-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			if (typeof format.toValue === 'function' && typeof format.toDisplay === 'function')
				return format;
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		// Parses a BS date string (Latin or Devanagari digits) into a UTC-midnight AD Date
		parseDate: function(date, format, language, assumeNearby){
			if (!date)
				return undefined;
			if (isDate(date))
				return date;
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			if (format.toValue)
				return format.toValue(date, format, language);
			var fn_map = {
					d: 'moveDay',
					m: 'moveMonth',
					w: 'moveWeek',
					y: 'moveYear'
				},
				dateAliases = {
					yesterday: '-1d',
					today: '+0d',
					tomorrow: '+1d'
				},
				locale = dates[language] || dates.en,
				parts, part, dir, i, fn;
			date = toLatinDigits(date);
			if (date in dateAliases){
				date = dateAliases[date];
			}
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/i.test(date)){
				parts = date.match(/([\-+]\d+)([dmwy])/gi);
				date = UTCToday();
				for (i=0; i < parts.length; i++){
					part = parts[i].match(/([\-+]\d+)([dmwy])/i);
					dir = Number(part[1]);
					fn = fn_map[part[2].toLowerCase()];
					date = Datepicker.prototype[fn](date, dir);
				}
				return Datepicker.prototype._zero_utc_time(date);
			}

			parts = date && date.match(this.nonpunctuation) || [];

			var today = bsOf(clampToCalendar(UTCToday()));

			function applyNearbyYear(year, threshold){
				if (threshold === true)
					threshold = 10;

				// if year is 2 digits or less, than the user most likely is trying to get a recent century
				if (year < 100){
					year += 2000;
					// if the new year is more than threshold years in advance, use last century
					if (year > (today.year + threshold)){
						year -= 100;
					}
				}

				return year;
			}

			var parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){
						v = assumeNearby ? applyNearbyYear(v, assumeNearby) : v;
						if (NepaliCalendar.daysInMonth(v, 1))
							d.year = v;
					},
					m: function(d,v){
						v -= 1;
						while (v < 0) v += 12;
						d.month = v % 12 + 1;
					},
					d: function(d,v){
						if (v >= 1)
							d.day = v;
					}
				},
				val, filtered;
			setters_map['yy'] = setters_map['yyyy'];
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			var bs = {year: today.year, month: today.month, day: today.day};
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length !== fparts.length){
				fparts = $(fparts).filter(function(i,p){
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			function match_part(){
				var m = this.slice(0, parts[i].length),
					p = parts[i].slice(0, m.length);
				return m.toLowerCase() === p.toLowerCase();
			}
			if (parts.length === fparts.length){
				var cnt;
				for (i=0, cnt = fparts.length; i < cnt; i++){
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)){
						switch (part){
							case 'MM':
								filtered = $(locale.months).filter(match_part);
								val = $.inArray(filtered[0], locale.months) + 1;
								break;
							case 'M':
								filtered = $(locale.monthsShort).filter(match_part);
								val = $.inArray(filtered[0], locale.monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				var s;
				for (i=0; i < setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s]) && parsed[s] > 0)
						setters_map[s](bs, parsed[s]);
				}
			}
			// Clamp the day to the length of the BS month (eg, 32 Shrawan -> 31 Shrawan)
			bs.day = Math.min(bs.day, NepaliCalendar.daysInMonth(bs.year, bs.month));
			return bsDate(bs.year, bs.month, bs.day);
		},
		// `localeDigits` is used for text inside the picker; public output stays 0-9
		formatDate: function(date, format, language, localeDigits){
			if (!date)
				return '';
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			if (format.toDisplay)
				return format.toDisplay(date, format, language);
			var bs = bsOf(date);
			if (!bs)
				return '';
			var locale = dates[language] || dates.en;
			var val = {
				d: bs.day,
				D: locale.daysShort[date.getUTCDay()],
				DD: locale.days[date.getUTCDay()],
				m: bs.month,
				M: locale.monthsShort[bs.month - 1],
				MM: locale.months[bs.month - 1],
				yy: bs.year.toString().substring(2),
				yyyy: bs.year
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			date = [];
			var seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i <= cnt; i++){
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			date = date.join('');
			return localeDigits && locale.digits ? toNativeDigits(date, locale.digits) : date;
		},
		headTemplate: '<thead>'+
						'<tr>'+
							'<th colspan="7" class="datepicker-title"></th>'+
						'</tr>'+
						'<tr>'+
							'<th class="prev">'+defaults.templates.leftArrow+'</th>'+
							'<th colspan="5" class="datepicker-switch"></th>'+
							'<th class="next">'+defaults.templates.rightArrow+'</th>'+
						'</tr>'+
					'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot>'+
						'<tr>'+
							'<th colspan="7" class="today"></th>'+
						'</tr>'+
						'<tr>'+
							'<th colspan="7" class="clear"></th>'+
						'</tr>'+
					'</tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">'+
							'<div class="datepicker-days">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-decades">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-centuries">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.npdatepicker.DPGlobal = DPGlobal;
	$.fn.npdatepicker.calendar = NepaliCalendar;


	/* DATEPICKER NO CONFLICT
	* =================== */

	$.fn.npdatepicker.noConflict = function(){
		$.fn.npdatepicker = old;
		return this;
	};

	/* DATEPICKER VERSION
	 * =================== */
	$.fn.npdatepicker.version = '2.0.0';

	$.fn.npdatepicker.deprecated = function(msg){
		var console = window.console;
		if (console && console.warn) {
			console.warn('DEPRECATED: ' + msg);
		}
	};


	/* DATEPICKER DATA-API
	* ================== */

	$(document).on(
		'focus.npdatepicker.data-api click.npdatepicker.data-api',
		'[data-provide="npdatepicker"]',
		function(e){
			var $this = $(this);
			if ($this.data('npdatepicker'))
				return;
			e.preventDefault();
			// component click requires us to explicitly show it
			datepickerPlugin.call($this, 'show');
		}
	);
	$(function(){
		datepickerPlugin.call($('[data-provide="npdatepicker-inline"]'));
	});

}));
