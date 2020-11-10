#!/usr/bin/env node

var fs = require('fs-extra');
var Table = require('cli-table');

var filepath = process.argv[2];
var query = process.argv[3];

if (!filepath || !fs.existsSync(filepath)) {
	throw Error('Can\'t find the file at: ' + filepath); 
}

var content = fs.readFileSync(filepath, 'utf8');

var SUM_REGEX = "([\\-\\+]?\\d*[\\.\\,]?\\d+)", // regex to match a floating point number
	CURRENCY_REGEX = '(lei|leu|eur|euro|usd|€|$|£|rol|ron|huf)', // regex to match a currency
	COMMENT_LINE_REGEX = /^\s*#\s*(.*)/, // regex to match a comment line (starting with the # character)
	TAG_REGEX = /@([^\s]+)/g, // regex to match tags, e.g. @mytag
	NEWLINE_REGEX = /\n+/,
	SECTION_SEPARATOR_REGEX = /\n\s*---*\s*\n/;

var EXPENSE_REGEX = new RegExp(
	CURRENCY_REGEX + '\\s*' + SUM_REGEX + '|' + // prefixed currency
	SUM_REGEX + '\\s*' + CURRENCY_REGEX,  // suffixed currency
	'i'
);

var query_filter = function() { return true; };
var totals_title = 'Total';

if (query) {
	query_filter = function(sum) {
		return sum.tags.indexOf(query) > -1;
	};
	totals_title = query;
}

var sections = content.split(SECTION_SEPARATOR_REGEX).map(function(section) {
	var sums = [], title;
	section.split(NEWLINE_REGEX).forEach(function(line) {
		if (line) {
			if(line.match(COMMENT_LINE_REGEX)) {
				if (!title) {
					var ret = COMMENT_LINE_REGEX.exec(line);
					if (ret && ret[1]) {
						title = ret[1];
					}
				}
			} else {
				var ret = EXPENSE_REGEX.exec(line);
				if (ret) {
					var sum = parseFloat(ret[3]),
						tags = [], 
						tag;
					TAG_REGEX.lastIndex = 0;
					while((tag = TAG_REGEX.exec(line)) !== null) {
						tags.push(tag[1]);
					}
					sums.push({
						sum: sum,
						tags: tags
					});
				}
			}
		}
	});
	return {
		title: title,
		sums: sums,
		total: sums.filter(query_filter).reduce(function(prev, cur) { return prev + cur.sum; }, 0)
	};
});

var interim_total = 0;
sections.forEach(function(section, idx) {
	interim_total += section.total;
	section.interim_total = interim_total;
	section.average = Math.floor(interim_total / (idx + 1));
});

var table = new Table({
	head: ['Section', totals_title, 'So far', 'Average']
});

table.push.apply(table, sections.map(function(section) {
	return [section.title, section.total, section.interim_total, section.average];
}));

var grand_total = sections.reduce(function(prev, cur) { return prev + cur.total; }, 0);

table.push(['Grand total', grand_total, '---', '---']);

console.log(table.toString());