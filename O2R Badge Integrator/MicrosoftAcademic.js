function ServiceProvider() {
	
	this.name = "Microsoft Academic";
	this.retry = 1000;
	this.delay = 0;
	this.hasFilterBar = true;
	
	this.getArticleElements = function() {
		if (ExtendedView) {
			return []; // Not supported
		}
		else {
			return $('.paper-tile2');
		}
	};
	
	this.getFilterHtml = function(page) {
		var html = '<div class="filter-group">';
		html += '<h4><span>Badge Types</span></h4><ul>';
		for(var i = 0; i < BadgeTypes.length; i++) {
			html += '<li>' + page.getSelectBoxHtml(BadgeTypes[i]) + ' ' + page.getSelectLabelHtml(BadgeTypes[i]) + '</li>';
		}
		html += '</ul></div>';
		html += '<div class="filter-group">';
		html += '<h4><span>Badge Value Filter</span></h4><ul>';
		for(var i = 0; i < BadgeTypes.length; i++) {
			html += '<li class="' + page.getFilterContainerClass(BadgeTypes[i].key) + '">' + page.getFilterLabelHtml(BadgeTypes[i]) + page.getFilterBoxHtml(BadgeTypes[i]) + '</li>';
		}
		html += '</ul></div>';
		return html;
	};
	
	this.insertFilter = function(page, html) {
		$('.filter-content').prepend(html);
	};
	
	this.getDoi = function(article) {
		return null;
	};
	
	this.getTitle = function(article) {
		var titleElement = article.getContainerElement().find('.title-bar');
		return titleElement.text();
	};
	
	this.insertBadgeContainer = function(article) {
		var elem = article.getContainerElement().find('.paper-meta');
		$('<div id="'+ article.getBadgesContainerName() +'"></div>').insertAfter(elem);
	};
		
}