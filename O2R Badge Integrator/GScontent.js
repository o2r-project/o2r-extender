var infoURL = "http://giv-project6.uni-muenster.de";
var apiURL = "http://giv-project6.uni-muenster.de:3000/api/1.0/badge/";
var articles = new Array();

chrome.runtime.onMessage.addListener(/*Listen to JSON response from background.js */
	function (request, sender, sendResponse) {
		if (request.message === "everything_ready") {
			$('.gs_r').each(function (i, obj) {
				articles.push(new Article(obj));
			});
		}
	}
);

function Badge(type, article) {

	// Properties
	
	this.element = null;
	this.article = article;
	this.type = type;
	
	// Methods
	
	this.getApiUrl = function() {
		var doi = this.article.getDoi();
		switch(type) {
			case 'peerreview':
				return apiURL + 'peerreview/doaj/doi:' + doi;
			case 'licence':
				return apiURL + 'licence/o2r/doi:' + doi.replace("/", "%2F");
			case 'executable':
				return apiURL + 'executable/o2r/0';
			default: 
				return null;
		}
	};
	
	this.getImageElement = function() {
		return this.element.find('.o2r-badge');
	}
	
	this.getDocUrl = function() {
		return infoURL + '#' + this.type;
	};
	
	this.parseSvg = function(callback) {
		var image = this.getImageElement();
		// Hints:
		// 1. contents() only works for object, not for img tags.
		// 2. we will find the texts two times each due to the shadow effect.
		//    Foreground and background to provide shadow are individual texts.
		var texts = image.contents().find("text");
		if (texts.length >= 2) {
			var title = texts.first().text();
			var value = texts.last().text();
			if (title && value) {
				callback(title, value);
			}
		}
	}

	this.insert = function() {
		this.element = $(this.getHtml());
		this.article.getBadgeContainer().append(this.element);

		var that = this;
		chrome.storage.sync.get(this.type + "Badge", function (setting) {
			if (!setting) {
				that.element.hide();
			}
			else {
				that.element.show();
			}
		});
	}
	
	this.getContainerName = function() {
		return this.article.getBadgesContainerName() + '-' + this.type;
	}
	
	this.getHtml = function() {
		var html = '<span id="'+ this.getContainerName() +'">';
		html += '<a href= "' + this.getDocUrl() + '" target="_blank">';
		// html += '<object class="o2r-badge ' + this.type + '" data="' + this.getApiUrl() + '" type="image/svg+xml">Unsupported</object>';
		html += '<img class="o2r-badge ' + this.type + '" src="' + this.getApiUrl() + '" />';
		html += '</a>&nbsp;</span>';
		return html;
	}

	function filterBadges(title, text) {
		// TODO: Filter criteria
		
		var that = this;
		chrome.storage.sync.get({
			hideNotAvailable: false
		}, function (items) {
			if (text == 'n/a' && items.hideNotAvailable) {
				that.getImageElement().hide();
			}
		});
	}


	// "Constructing"
	
	this.insert();
	
}

function Article(container) {

	// Properties

	this.containerElement = $(container);
	this.doi = null;
	this.title = null;
	this.badges = new Array();
	

	// Methods

	this.markInteresting = function() {
		this.containerElement.css('opacity', 1);
	};
	
	this.markUninteresting = function() {
		var that = this;
		chrome.storage.sync.get({transparentArticles: true}, function (items) {
			if (items.transparentArticles) {
				that.containerElement.css('opacity', 0.5);
			}
		});
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
		var title = titleElement.text().replace(/\[[^\]]+\]/g, "").trim();
		console.log("Title: " + title);
		return title;
	};
	

	/*
	 * Get DOI from each research title using Crossrefs API
	 */
	this.createBadgesByTitle = function (success, failure) {
		var that = this;
		$.get({
			'url': "https://api.crossref.org/works?query=" + this.title,
			'dataType': "json",
			'success': function (data) {
				for (i in data.message.items) {
					//TODO: find better and unique attribute to compare instead of title
					if (that.title.toLowerCase() == data.message.items[i].title.toString().toLowerCase()) {
						that.doi = data.message.items[i].DOI;
						that.makeBadges();
						return;
					}
				}

				that.markUninteresting();
			}
		});
	};
	
	this.getTitleContainer = function() {
		return this.containerElement.find('.gs_rt');
	};
	
	this.makeBadges = function() {
		$('<div id="'+ this.getBadgesContainerName() +'" style="min-height: 1.5em; vertical-align: middle;"></div>').insertAfter(this.getTitleContainer());
		this.badges.push(new Badge("licence", this));
		this.badges.push(new Badge("executable", this));
		this.badges.push(new Badge("peerreview", this));
	}
	
	this.getBadgesContainerName =  function() {
		return "badges-" + this.doi.replace(/[^\w\d]/g, '');
	};
	
	this.getBadgeContainer =  function() {
		return $('#' + this.getBadgesContainerName());
	};


	// "Constructing"

	this.title = this.getTitle();
	this.createBadgesByTitle();

}