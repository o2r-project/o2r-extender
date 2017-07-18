function ServiceProvider() {
	
	this.name = "Microsoft Academic";
	this.retry = 1000;
	this.delay = 0;
	this.hasFilterBar = true;
	
	// The anchors (#) in the url don't allow proper matching in the manifest.json
	// Therefore we detect it here manually
	if (location.hash.indexOf('#/detail/') > -1) {
		ExtendedView = true;
	}
	
	this.getArticleElements = function() {
		if (ExtendedView) {
			return $('.full-page-entity');
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
		var query = ExtendedView ? '.entity-header' : '.title-bar';
		var titleElement = article.getContainerElement().find(query).first();
		return titleElement.text();
	};
	
	this.insertBadgeContainer = function(article) {
		if (ExtendedView) {
			var html = '<br /><div class="column-header"><h2 class="grey-title">Badges</h2></div><div class="ce_bigbadge_container card column-content entity-section" id="'+ article.getBadgesContainerName() +'"></div>';
			article.getContainerElement().find('div.column-header').each(function() {
				if ($(this).text().trim()==='Abstract') {
					$(this).next().after(html);
				}
			});
		}
		else {
			var elem = article.getContainerElement().find('.paper-meta');
			$('<div id="'+ article.getBadgesContainerName() +'"></div>').insertAfter(elem);
		}
	};
		
}