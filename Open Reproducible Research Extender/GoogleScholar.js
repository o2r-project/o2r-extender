function ServiceProvider() {
	
	this.name = "Google Scholar";
	this.retry = 0;
	this.delay = 0;
	this.hasFilterBar = true;

    this.getArticleElements = function() {
		if (ExtendedView) {
			return []; // Not supported
		}
		else {
			return $('.gs_r');
		}
	};
	
	this.getFilterHtml = function(page) {
		var html = '<ul id="gs_lnv_bad" class="gs_pad">';
		html += '<li class="gs_sel"><a href="#">Badge Types</a></li>';
		for(var i = 0; i < BadgeTypes.length; i++) {
			html += '<li class="gs_ind"><a href="#">' + page.getSelectBoxHtml(BadgeTypes[i]) + ' ' + page.getSelectLabelHtml(BadgeTypes[i]) + '</a></li>';
		}
		html += '</ul>';
		html += '<div class="gs_pad"><div class="gs_hr"></div></div>';
		html += '<ul id="gs_lnv_bad" class="gs_pad">';
		html += '<li class="gs_sel"><a href="#">Badge Value Filter</a></li>';
		for(var i = 0; i < BadgeTypes.length; i++) {
			html += '<li class="gs_ind ' + page.getFilterContainerClass(BadgeTypes[i].key) + '">' + page.getFilterLabelHtml(BadgeTypes[i]) + '</li>';
			html += '<li class="gs_ind ' + page.getFilterContainerClass(BadgeTypes[i].key) + '">' + page.getFilterBoxHtml(BadgeTypes[i]) + '</li>';
		}
		html += '</ul>';
		html += '<div class="gs_pad"><div class="gs_hr"></div></div>';
		return html;
	};
	
	this.insertFilter = function(page, html) {
		$('#gs_lnv').prepend(html);
	};
	
	this.getDoi = function(article) {
		return null;
	};
	
	this.getTitle = function(article) {
		var titleElement = this._getTitleContainer(article);
		if (titleElement.find('.cti').length > 0) {
			// Citation
			return null;
		}
		return titleElement.text().replace(/\[[^\]]+\]/g, "");
	};
	
	this.insertBadgeContainer = function(article) {
		$('<div id="'+ article.getBadgesContainerName() +'"></div>').insertAfter(this._getTitleContainer(article));
	};
	
	this._getTitleContainer = function(article) {
		return article.getContainerElement().find('.gs_rt');
	};
		
}