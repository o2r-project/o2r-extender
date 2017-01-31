function ServiceProvider() {
	
	this.name = "ScienceDirect";
	this.articleContainerQuery = '.articleList .detail';
	this.retry = 0;
	this.hasFilterBar = true;
	
	this.getFilterHtml = function(page) {
		var html = '<fieldset><legend class="secTitles">Badge Types</legend><ol>';
		for(var i = 0; i < BadgeTypes.length; i++) {
			html += '<li>' + page.getSelectBoxHtml(BadgeTypes[i]) + ' ' + page.getSelectLabelHtml(BadgeTypes[i]) + '</li>';
		}
		html += '</ol></fieldset>';
		html += '<fieldset><legend class="secTitles">Badge Value Filter</legend><ol>';
		for(var i = 0; i < BadgeTypes.length; i++) {
			html += '<li>' + page.getFilterLabelHtml(BadgeTypes[i]) + '<br />' + page.getFilterBoxHtml(BadgeTypes[i]) + '</li>';
		}
		html += '</ol></fieldset>';
		return html;
	};
	
	this.insertFilter = function(page, html) {
		$('#navBox_pubyear').before(html);
	};
	
	this.getDoi = function(article) {
		return null;
	};
	
	this.getTitle = function(article) {
		return article.getContainerElement().find('.title').find('h2').text().trim();
	};
	
	this.insertBadgeContainer = function(article) {
		var elem = article.getContainerElement().find('li.external');
		$('<div id="'+ article.getBadgesContainerName() +'" style="min-height: 1.5em; vertical-align: middle;"></div>').insertAfter(elem);
	};
		
}