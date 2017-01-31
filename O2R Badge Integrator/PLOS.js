function ServiceProvider() {
	
	this.name = "PLOS";
	this.articleContainerQuery = '.gsc-result';
	this.retry = 1000;
	this.hasFilterBar = false; // Filter not supported here, inserted elements get removed, probably by Ember.js or so
	
	this.getFilterHtml = function(page) {
		return '';
	};
	
	this.insertFilter = function(page, html) {
		return;
	};
	
	this.getDoi = function(article) {
		var aElement = article.getContainerElement().find('a.gs-title');
		var href = aElement.attr('href').toString();
		var doi = this._getParameterFromUrl(href, 'id');
		console.log("Found doi: " + doi);
		return doi;
	};
	
	this.getTitle = function(article) {
		var titleElement = article.getContainerElement().find('a.gs-title');
		return titleElement.text().trim();
	};
	
	this.insertBadgeContainer = function(article) {
		article.getContainerElement().find('.gs-per-result-labels').attr('id', article.getBadgesContainerName());
	};
	
	this._getParameterFromUrl = function (url, variable) {
		var parts = url.split('?');
		if (parts.length === 2) {
			var query = parts[1];
			var vars = query.split("&");
			for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split("=");
				if (pair[0] == variable) {
					return pair[1];
				}
			}
		}
		return null;
	};
		
}