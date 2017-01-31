var infoURL = "http://giv-project6.uni-muenster.de";
var apiURL = "http://giv-project6.uni-muenster.de:3000/api/1.0/badge/";
var page = null;
var sp = null;

// Listen to JSON response from background.js
chrome.runtime.onMessage.addListener(/* */
	function (request, sender, sendResponse) {
		if (request.message === "everything_ready") {
			var opts = {
				transparentArticles: true,
				hideNotAvailable: false
			};
			for(var i = 0; i < BadgeTypes.length; i++) {
				opts[BadgeTypes[i].key + 'Badge'] = true;
			}
			chrome.storage.sync.get(opts, function (items) {
				sp = new ServiceProvider();
				console.log('Badge Integratior: Loaded ' + sp.name);
				page = new Page(items);
				page.bootstrap();
			});
		}
		if (request.message === "update") {
			page.update();
		}
	}
);


function init() {

}

function sendUpdateMessage() {
	chrome.extension.sendMessage({"message": "update"});
}

function Page(settings) {
	
	this.articles = new Array();
	this.settings = settings;

	this.bootstrap = function() {
		this.insertFilter();
		var articleElements = $(sp.articleContainerQuery);
		if (articleElements.length === 0 && sp.retry > 0) {
			// Some pages like Microsoft Academic load their content by AJAX requests
			// so on DOM ready the pages are not really ready and we need to wait
			// until we find actual content.
			console.log('Badge Integratior: Scheduled retry...');
			window.setTimeout(this.bootstrap, sp.retry);
		}
		else {
			var that = this;
			articleElements.each(function (i, obj) {
				that.addArticleByElement(obj);
			});
		}
	}
	
	this.addArticleByElement = function(obj) {
		this.articles.push(new Article(obj, this, this.articles.length));
	};

	this.update = function() {
		for(var i = 0; i < this.articles.length; i++) {
			this.articles[i].update();
		}
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
		if (!sp.hasFilterBar) {
			return this.getTypeVisibilityFromSettings(type);
		}
		return $('#' + this.getSelectBoxId(type)).is(':checked');
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
		for(var i = 0; i < BadgeTypes.length; i++) {
			if (this.getFilterValueFromPage(BadgeTypes[i].key)) {
				hasFilter = true;
			}
		}
		return hasFilter;
	};
	
	this.getFilterBoxId = function(type) {
		return 'filter_' + type;
	};
	
	this.getSelectBoxId = function(type) {
		return 'select_' + type;
	};
	
	this.getSelectBoxHtml = function(type) {
		return '<input type="checkbox" class="ce_selectbox updateOnChange" id="' + this.getSelectBoxId(type.key) + '"' + this.getPreselection(type.key) + ' />';
	};
	
	this.getSelectLabelHtml = function(type) {
		return '<label class="ce_selectlabel" for="' + this.getSelectBoxId(type.key) + '">' + type.value + '</label>';
	};
	
	this.getFilterBoxHtml = function(type) {
		switch(type.filter.type) {
			case 'select':
				var html = '<select id="' + this.getFilterBoxId(type.key) + '" class="ce_filterbox updateOnChange">';
				html += '<option value="" selected="selected"></option>';
				for(var i = 0; i < type.filter.values.length; i++) {
					var value = type.filter.values[i];
					html += '<option value="' + value + '">' + value + '</option>';
				}
				html += '</select>';
				return html;
			default: // text
				return '<input type="text" id="' + this.getFilterBoxId(type.key) + '" class="ce_filterbox updateOnBlur" />';
		}
	};
	
	this.getFilterLabelHtml = function(type) {
		return '<label class="ce_filterlabel" for="' + this.getFilterBoxId(type.key) + '">' + type.value + ':</label>';
	};
	
	this.getFilterValueFromPage = function(type) {
		var str = $('#' + this.getFilterBoxId(type)).val();
		if (typeof str === 'string' && str.length > 0) {
			return str;
		}
		else {
			return null;
		}
	};
	
	this.insertFilter = function() {
		sp.insertFilter(this, sp.getFilterHtml(this));
		
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

		for(var i = 0; i < BadgeTypes.length; i++) {
			if (BadgeTypes[i].key == type) {
				var url = apiURL + BadgeTypes[i].apiPath;
				if (BadgeTypes[i].doiEncoded) {
					url += urlEncodedDoi;
				}
				else {
					url += doi;
				}
				return url;
			}
		}
		return null;
	};
	
	this.getContainerElement = function() {
		return $('#' + this.getContainerName());
	};
	
	this.getImageElement = function() {
		return this.getContainerElement().find('svg');
	};
	
	this.getBadgeType = function() {
		for(var i = 0; i < BadgeTypes.length; i++) {
			if (this.type === BadgeTypes[i].key) {
				return BadgeTypes[i];
			}
		}
		return null;
	}
	
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
		if (filter) {
			var badgeValue = this.value.toLowerCase();
			var filterValue = filter.toLowerCase();
			var badgeType = this.getBadgeType();
			var found = false;
			if (badgeType.filter.type === 'select') {
				found = (badgeValue === filterValue);
			}
			else {
				found = (badgeValue.indexOf(filterValue) !== -1);
			}
			if (found) {
				this.article.markInteresting();
			}
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
	
	this.getContainerElement = function() {
		return this.containerElement;
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
		return sp.getTitle(this);
	};
	

	/*
	 * Get DOI from each research title using Crossrefs API
	 */
	this.createBadges = function () {
		this.doi = sp.getDoi(this);
		if (this.doi !== null) {
			// Create by DOI
			this.makeBadges();
			this.update();
		}
		else if (this.title !== null) {
			// Create by Title
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
		}
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
	
	this.makeBadges = function() {
		sp.insertBadgeContainer(this);
		for(var i = 0; i < BadgeTypes.length; i++) {
			this.badges.push(new Badge(BadgeTypes[i].key, this));
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
	this.createBadges();

}