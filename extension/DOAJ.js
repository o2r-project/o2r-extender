function ServiceProvider() {
	
	this.name = "DOAJ";
	this.retry = 1000;
	this.delay = 500;
	this.hasFilterBar = true;
	
	this.getArticleElements = function() {
		if (ExtendedView) {
			return $('.content').find('.span9');
		}
		else {
			return $('#facetview_results tr');
		}
	};

	this.getFilterHtml = function(page) {
		var html = '<table class="facetview_filters table table-bordered table-condensed table-striped no-bottom" style="display: table;"><tbody>';
		html += '<tr><td><span class="facetview_filtershow filterheader">Badge Types</span></td></tr>';
		for(var i = 0; i < BadgeTypes.length; i++) {
			html += '<tr class="facetview_filtervalue"><td>' + page.getSelectBoxHtml(BadgeTypes[i]) + ' ' + page.getSelectLabelHtml(BadgeTypes[i]) + '</td></tr>';
		}
		html += '</tbody></table>';
		html += '<table class="facetview_filters table table-bordered table-condensed table-striped no-bottom" style="display: table;"><tbody>';
		html += '<tr><td><span class="facetview_filtershow filterheader">Badge Value Filter</span></td></tr>';
		for(var i = 0; i < BadgeTypes.length; i++) {
			html += '<tr class="facetview_filtervalue ' + page.getFilterContainerClass(BadgeTypes[i].key) + '"><td>' + page.getFilterLabelHtml(BadgeTypes[i]) + page.getFilterBoxHtml(BadgeTypes[i]) + '</td></tr>';
		}
		html += '</tbody></table>';
		return html;
	};
	
	this.insertFilter = function(page, html) {
		$('#facetview_filters').prepend(html);
	};
	
	this.getDoi = function(article) {
		var aElement = article.getContainerElement().find('a');
		for(var i = 0; i < aElement.length; i++) {
			var elem = $(aElement[i]);
			var href = elem.attr('href');
			if (href.indexOf('doi.org') > -1) {
				console.log("Found doi: " + elem.text());
				return elem.text();
			}
		}
		return null;
	};
	
	this.getTitle = function(article) {
		return null;
	};
	
	this.insertBadgeContainer = function(article) {
		if (ExtendedView) {
			article.getContainerElement().append('<div class="ce_bigbadge_container row-fluid" style="margin-top: 30px"><div class="span1">&nbsp;</div><div class="span10"><p><strong>Badges</strong></p><div id="'+ article.getBadgesContainerName() +'"></div></div></div>');
		}
		else {
			var elem = article.getContainerElement().find('.abstract_text');
			$('<div id="'+ article.getBadgesContainerName() +'"></div>').insertAfter(elem);
		}
	};
	
	this._getParameterFromUrl = function (url, variable) {
		var parts = url.split('?');
		if (parts.length === 2) {
			var query = parts[1];
			var vars = query.split("&");
			for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split("=");
				if (pair[0]===variable) {
					return pair[1];
				}
			}
		}
		return null;
	};
		
}