var infoURL = "http://giv-project6.uni-muenster.de";
var apiURL = "http://giv-project6.uni-muenster.de:3000/api/1.0/badge/";
var page = null;

chrome.runtime.onMessage.addListener(/*Listen to JSON response from background.js */
	function (request, sender, sendResponse) {
		if (request.message === "everything_ready") {
			chrome.storage.sync.get({
				executableBadge: true,
				peerreviewBadge: true,
				licenceBadge: true,
				transparentArticles: true,
				hideNotAvailable: false
			}, function (items) {
				page = new Page(items);
				page.insertFilter();
				$('.gs_r').each(function (i, obj) {
					page.addArticleByElement(obj);
				});
			});
		}
		if (request.message === "update") {
			page.update();
		}
	}
);

function sendUpdateMessage() {
	chrome.extension.sendMessage({"message": "update"});
}

function Page(settings) {
	
	this.articles = new Array();
	this.settings = settings;
	this.types = [
		{key: 'executable', value: 'Executable'}
		,{key: 'licence', value: 'Licence'}
		,{key: 'peerreview', value: 'Peer review'}
		,{key: 'spatial', value: 'Research location'}
//		,{key: 'releasetime', value: 'Release time'}
	];
		
	
	this.addArticleByElement = function(obj) {
		this.articles.push(new Article(obj, this, this.articles.length));
	};

	this.update = function() {
		for(var i = 0; i < this.articles.length; i++) {
			this.articles[i].update();
		}
	};
	
	this.getTypes = function() {
		return this.types;
	};
	
	this.getSetting = function(key) {
		if (this.settings !== null && typeof this.settings[key] !== undefined) {
			return this.settings[key];
		}
		else {
			return null;
		}
	};
	
	this.getTypeVisibilityFromSettings = function(type) {
		return this.getSetting(type + "Badge");
	};
	
	this.getTypeVisibilityFromPage = function(type) {
		return $('#select_' + type).is(':checked');
	};
	
	this.getPreselection = function(type) {
		var value = this.getTypeVisibilityFromSettings(type);
		if (value === true) {
			return ' checked="checked"';
		}
		else {
			return '';
		}
	};
	
	this.hasFilterSet = function() {
		var hasFilter = false;
		for(var i = 0; i < this.types.length; i++) {
			if (this.getFilterValueFromPage(this.types[i].key)) {
				hasFilter = true;
			}
		}
		return hasFilter;
	};
	
	this.getFilterValueFromPage = function(type) {
		var str = $('#filter_' + type).val();
		if (typeof str === 'string' && str.length > 0) {
			return str;
		}
		else {
			return null;
		}
	};
	
	this.insertFilter = function() {
		var html = '<ul id="gs_lnv_bad" class="gs_pad">';
		html += '<li class="gs_sel"><a href="#">Badge Types</a></li>\n';
		for(var i = 0; i < this.types.length; i++) {
			html += '<li class="gs_ind"><a href="#"><input type="checkbox" class="updateOnChange" id="select_' + this.types[i].key + '"' + this.getPreselection(this.types[i].key) + ' /> <label for="select_' + this.types[i].key + '">' + this.types[i].value + '</label></a></li>';
		}
		html += '</ul>';
		html += '<div class="gs_pad"><div class="gs_hr"></div></div>';
		html += '<ul id="gs_lnv_bad" class="gs_pad">';
		html += '<li class="gs_sel"><a href="#">Badge Value Filter</a></li>\n';
		for(var i = 0; i < this.types.length; i++) {
			html += '<li class="gs_ind"><label for="filter_' + this.types[i].key + '">' + this.types[i].value + ':</label></li>';
			html += '<li class="gs_ind"><input type="text" id="filter_' + this.types[i].key + '" class="updateOnBlur" style="width: 100%;" /></li>';
		}
		html += '</ul>';
		html += '<div class="gs_pad"><div class="gs_hr"></div></div>';
		$('#gs_lnv').prepend(html);
		
		$('.updateOnChange').on('change', sendUpdateMessage);
		$('.updateOnBlur').on('blur', sendUpdateMessage);
	};

}

function Badge(type, article) {

	// Properties

	this.article = article; // Article this badge belongs to
	this.type = type; // Type of badge, e.g. peerreview, licence, ...
	this.title = null; // Title of Badge from SVG
	this.value = null; // Value of Badge from SVG
	
	// Methods
	
	this.getApiUrl = function() {
		var doi = this.article.getDoi();
		var urlEncodedDoi = doi.replace("/", "%2F");
		// TODO: Move to Page.types
		switch(type) {
			case 'peerreview':
				return apiURL + 'peerreview/doaj/doi:' + doi;
			case 'licence':
				return apiURL + 'licence/o2r/doi:' + urlEncodedDoi;
			case 'executable':
				return apiURL + 'executable/o2r/doi:' + urlEncodedDoi;
			case 'spatial':
				return apiURL + 'spatial/o2r/doi:' + urlEncodedDoi;
			case 'releasetime':
				return apiURL + 'releasetime/o2r/doi:' + urlEncodedDoi;
			default: 
				return null;
		}
	};
	
	this.getContainerElement = function() {
		return $('#' + this.getContainerName());
	};
	
	this.getImageElement = function() {
		return this.getContainerElement().find('svg');
	};
	
	this.getDocUrl = function() {
		return infoURL + '#' + this.type;
	};

	this.insertContainerElement = function() {
		var element = $('<span id="'+ this.getContainerName() +'">&nbsp;</span>');
		this.article.getBadgeContainer().append(element);
	};

	this.insert = function() {
		this.insertContainerElement();
		
		var that = this;
		$.ajax({
			url:  this.getApiUrl(),
			dataType: "image/svg+xml"
		}).always(function(data) {
			if (typeof data.responseText === 'undefined' || data.responseText.substr(0, 4) !== "<svg") {
				return;
			}

			var html = '<a href= "' + that.getDocUrl() + '" target="_blank">';
			html += data.responseText;
			html += '</a>';

			var container = that.getContainerElement();
			container.prepend(html);
			
			that.parseSvg(data.responseText);
		});
	};
	
	this.getPage = function() {
		return this.article.getPage();
	};
	
	this.update = function() {
		if (this.getImageElement().length === 0) {
			return;
		}
		
		this.filter();
	};
	
	this.getContainerName = function() {
		return this.article.getBadgesContainerName() + '-' + this.type;
	};
	
	this.parseSvg = function(svg) {
		// Hints:
		// 1. contents() only works for object, not for img tags.
		// 2. we will find the texts two times each due to the shadow effect.
		//    Foreground and background to provide shadow are individual texts.
		var texts = $(svg).find("text");
		if (texts.length >= 2) {
			var title = texts.first().text();
			var value = texts.last().text();
			if (title && value) {
				this.title = title;
				this.value = value;
				this.update();
			}
		}
	};

	this.filter = function() {
		var page = this.getPage();

		var showImage = page.getTypeVisibilityFromPage(this.type);
		if (showImage && page.getSetting('hideNotAvailable') && this.value === 'n/a') {
			showImage = false;
		}
		
		var image = this.getImageElement();
		if (showImage) {
			image.show();
		}
		else {
			image.hide();
		}
		
		var filter = page.getFilterValueFromPage(this.type);
		if (filter && this.value.indexOf(filter.toLowerCase()) !== -1) {
			this.article.markInteresting();
		}
	};


	// "Constructing"
	
	this.insert();
	
}

function Article(container, page, id) {

	// Properties

	this.id = id;
	this.page = page;
	this.containerElement = $(container);
	this.doi = null;
	this.title = null;
	this.badges = new Array();
	

	// Methods
	
	this.getPage = function() {
		return this.page;
	};

	this.markInteresting = function() {
		this.containerElement.css('opacity', 1);
	};
	
	this.markUninteresting = function() {
		this.containerElement.css('opacity', 0.5);
	};
	
	this.getDoi = function() {
		return this.doi;
	};
	
	/*
	 * Extract research title from each search result
	 */
	this.getTitle = function () {
		var titleElement = this.getTitleContainer();
		if (titleElement.find('.cti').length > 0) {
			// Citation
			return null;
		}
		return titleElement.text().replace(/\[[^\]]+\]/g, "").trim();
	};
	

	/*
	 * Get DOI from each research title using Crossrefs API
	 */
	this.createBadgesByTitle = function (success, failure) {
		var that = this;
		$.ajax({
			url: "https://api.crossref.org/works?query=" + this.title,
			dataType: "json"
		}).done(function (data) {
			for (var i in data.message.items) {
				var cmpTitle = data.message.items[i].title.toString();
				if (that.levenshteinDistance(that.title.toLowerCase(), cmpTitle.toLowerCase()) <= 4) {
					that.doi = data.message.items[i].DOI;
					that.makeBadges();
					break;
				}
			}
		}).always(function() {
			that.update();
		});
	};
	
	/*
	 Copyright (c) 2011 Andrei Mackenzie
	 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
	 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	 */

	// Compute the edit distance between the two given strings
	this.levenshteinDistance = function (a, b) {
		if (a.length == 0)
			return b.length;
		if (b.length == 0)
			return a.length;

		var matrix = [];

		// increment along the first column of each row
		var i;
		for (i = 0; i <= b.length; i++) {
			matrix[i] = [i];
		}

		// increment each column in the first row
		var j;
		for (j = 0; j <= a.length; j++) {
			matrix[0][j] = j;
		}

		// Fill in the rest of the matrix
		for (i = 1; i <= b.length; i++) {
			for (j = 1; j <= a.length; j++) {
				if (b.charAt(i - 1) == a.charAt(j - 1)) {
					matrix[i][j] = matrix[i - 1][j - 1];
				} else {
					matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
							Math.min(matrix[i][j - 1] + 1, // insertion
									matrix[i - 1][j] + 1)); // deletion
				}
			}
		}

		return matrix[b.length][a.length];
	};
	
	this.getTitleContainer = function() {
		return this.containerElement.find('.gs_rt');
	};
	
	this.makeBadges = function() {
		$('<div id="'+ this.getBadgesContainerName() +'" style="min-height: 1.5em; vertical-align: middle;"></div>').insertAfter(this.getTitleContainer());
		var types = this.page.getTypes();
		for(var i = 0; i < types.length; i++) {
			this.badges.push(new Badge(types[i].key, this));
		}
	};
	
	this.getBadgesContainerName =  function() {
		return "badges-" + this.id;
	};
	
	this.getBadgeContainer =  function() {
		return $('#' + this.getBadgesContainerName());
	};
	
	this.update = function() {
		if (this.page.hasFilterSet()) {
			// When there is a filter mark uninteresting by default - the badges will mark as interesting if needed.
			this.markUninteresting();
		}
		else {
			this.markInteresting();
		}
		
		if (this.badges.length === 0 && this.page.getSetting('transparentArticles')) {
			this.markUninteresting();
		}
		
		for(var i = 0; i < this.badges.length; i++) {
			this.badges[i].update();
		}
	};


	// "Constructing"

	this.title = this.getTitle();
	this.createBadgesByTitle();

}