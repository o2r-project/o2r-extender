function ServiceProvider() {
	
	this.name = "Mendeley";
	this.retry = 0;
	this.delay = 0;
	this.hasFilterBar = true;
	
	this.getArticleElements = function() {
		if (ExtendedView) {
			return []; // Not supported
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
		return null;
	};
	
	this.getTitle = function(article) {
		return article.getContainerElement().find('.title').text();
	};
	
	this.insertBadgeContainer = function(article) {
		var elem = article.getContainerElement().find('.metadata');
		$('<div id="'+ article.getBadgesContainerName() +'"></div>').insertAfter(elem);
	};
		
}