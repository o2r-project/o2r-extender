function ServiceProvider() {
	
	this.name = "Microsoft Academic";
	this.articleContainerQuery = '.paper-tile2';
	this.retry = 1000;
	this.hasFilterBar = true;
	
	this.getFilterHtml = function(page) {
		var html = '<div class="filter-group">';
		html += '<h4><span>Badge Types</span></h4><ul>';
		for(var i = 0; i < page.types.length; i++) {
			html += '<li>' + page.getSelectBoxHtml(page.types[i]) + ' ' + page.getSelectLabelHtml(page.types[i]) + '</li>';
		}
		html += '</ul></div>';
		html += '<div class="filter-group">';
		html += '<h4><span>Badge Value Filter</span></h4><ul>';
		for(var i = 0; i < page.types.length; i++) {
			html += '<li>' + page.getFilterLabelHtml(page.types[i]) + page.getFilterBoxHtml(page.types[i]) + '</li>';
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
		return titleElement.text().trim();
	};
	
	this.insertBadgeContainer = function(article) {
		var elem = article.getContainerElement().find('.paper-meta');
		$('<div id="'+ article.getBadgesContainerName() +'" style="min-height: 1.5em; vertical-align: middle;"></div>').insertAfter(elem);
	};
		
}