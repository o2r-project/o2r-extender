function ServiceProvider() {
	
	this.name = "Mendeley";
	this.retry = 0;
	this.delay = 0;
	this.hasFilterBar = false;
	
	this.getArticleElements = function() {
		if (ExtendedView) {
			return $('#main-content');
		}
		else {
			return $('.document');
		}
	};

	this.getFilterHtml = function(page) {
		var html = '<div class="padding"><h2 class="heading-line"><span>Badge Types</span></h2><div class="extra-facet-filter">';
		for(var i = 0; i < BadgeTypes.length; i++) {
			html += '<div>' + page.getSelectBoxHtml(BadgeTypes[i]) + ' ' + page.getSelectLabelHtml(BadgeTypes[i]) + '</div>';
		}
		html += '</div></div>';
		html += '<div class="padding"><div class="extra-facet-filter">';
		html += '<h2 class="heading-line"><span>Badge Value Filter</span></h2><div class="extra-facet-filter">';
		for(var i = 0; i < BadgeTypes.length; i++) {
			html += '<div class="' + page.getFilterContainerClass(BadgeTypes[i].key) + '" style="padding-top: 0.5em;">' + page.getFilterLabelHtml(BadgeTypes[i]) + '<br />' + page.getFilterBoxHtml(BadgeTypes[i]) + '</div>';
		}
		html += '</div></div>';
		return html;
	};
	
	this.insertFilter = function(page, html) {
		$('.column-b').each(function() {
			var elem = $(this);
			if (elem.find('#search-facets').length > 0) {
				elem.append(html);
			}
		});
	};
	
	this.getDoi = function(article) {
		if (ExtendedView) {
			var href = article.getContainerElement().find('.doi').text().trim();
			if (href.indexOf('dx.doi.org') > -1) {
				var doi = href.replace('http://dx.doi.org/', '');
				console.log("Found doi: " + doi);
				return doi;
			}
			return null;
		}
		else {
			return null;
		}
	};
	
	this.getTitle = function(article) {
		if (ExtendedView) {
			return article.getContainerElement().find('h1').text();
		}
		else {
			return article.getContainerElement().find('.title').text();
		}
	};
	
	this.insertBadgeContainer = function(article) {
		if (ExtendedView) {
			var elem = article.getContainerElement().find('#abstract-container');
			$('<div class="ce_bigbadge_container"><h4 class="underlined margin-top">Badges</h4><div id="'+ article.getBadgesContainerName() +'"></div></div>').insertAfter(elem);
			
		}
		else {
			var elem = article.getContainerElement().find('.metadata');
			$('<div id="'+ article.getBadgesContainerName() +'"></div>').insertAfter(elem);
		}
	};
		
}