function ServiceProvider() {
	
	this.name = "PLOS";
	this.retry = 1000;
	this.delay = 0;
	this.hasFilterBar = false; // Filter not supported here, inserted elements get removed, probably by Ember.js or so

	this.getArticleElements = function() {
		if (ExtendedView) {
			return $('main');
		}
		else {
			return $('.gsc-result');
		}
	};
	
	this.getFilterHtml = function(page) {
		return '';
	};
	
	this.insertFilter = function(page, html) {
		return;
	};
	
	this.getDoi = function(article) {
		if (ExtendedView) {
			var href = article.getContainerElement().find('#artDoi a').attr('href');
			if (href.indexOf('dx.doi.org') > -1) {
				return href.replace('http://dx.doi.org/', '');
			}
		}
		else {
			var href = article.getContainerElement().find('a.gs-title').attr('href');
			if (href) {
				return this._getParameterFromUrl(href, 'id');
			}
		}
		return null;
	};
	
	this.getTitle = function(article) {
		var query = ExtendedView ? '#artTitle' : 'a.gs-title';
		var titleElement = article.getContainerElement().find(query);
		return titleElement.text();
	};
	
	this.insertBadgeContainer = function(article) {
		if (ExtendedView) {
			var html = '<div class="ce_bigbadge_container"><h2>Badges</h2><div id="'+ article.getBadgesContainerName() +'"></div></div>';
			article.getContainerElement().find('#artText').prepend(html);
		}
		else {
			article.getContainerElement().find('.gs-per-result-labels').attr('id', article.getBadgesContainerName());
		}
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