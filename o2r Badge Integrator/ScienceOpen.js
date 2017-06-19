function ServiceProvider() {
	
	this.name = "ScienceOpen";
	this.retry = 1000;
	this.delay = 0;
	this.hasFilterBar = true;
	
	this.getArticleElements = function() {
		if (ExtendedView) {
			return $('.so-main-section');
		}
		else {
			return $('.so-article-list-item');
		}
	};
	
	this.getFilterHtml = function(page) {
		var html = '<div class="so-layout-section">';
		html += '<h4><span>Badge Types</span></h4><ul>';
		for(var i = 0; i < BadgeTypes.length; i++) {
			html += '<li>' + page.getSelectBoxHtml(BadgeTypes[i]) + ' ' + page.getSelectLabelHtml(BadgeTypes[i]) + '</li>';
		}
		html += '</ul></div>';
		html += '<div class="so-layout-section">';
		html += '<h4><span>Badge Value Filter</span></h4><ul>';
		for(var i = 0; i < BadgeTypes.length; i++) {
			html += '<li class="' + page.getFilterContainerClass(BadgeTypes[i].key) + '">' + page.getFilterLabelHtml(BadgeTypes[i]) + page.getFilterBoxHtml(BadgeTypes[i]) + '</li>';
		}
		html += '</ul></div>';
		return html;
	};
	
	this.insertFilter = function(page, html) {
		$('.so-m-y-20').prepend(html);
	};
	
	this.getDoi = function(article) {
		if (ExtendedView) {
			var href = article.getContainerElement().find("[itemprop='sameAs']").attr('href');
			if (href.indexOf('dx.doi.org') > -1) {
				return href.replace('http://dx.doi.org/', '');
			}
		} else {	
			var dataDoi = article.getContainerElement().find("[data-badge-type='4']").attr('data-doi');
			if (dataDoi.indexOf('dx.doi.org') > -1) {
				return dataDoi;
			}
		}
	};
	
	this.getTitle = function(article) {
		var query = ExtendedView ? '.so-article-header-title' : '.so-article-list-item-title';
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
			var elem = article.getContainerElement().find('.so-article-list-item-text');
			$('<div id="'+ article.getBadgesContainerName() +'"></div>').insertAfter(elem);
		}
	};
		
}