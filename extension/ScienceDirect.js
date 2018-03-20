function ServiceProvider() {
	
	this.name = "ScienceDirect";
	this.retry = 0;
	this.delay = (ExtendedView ? 1000 : 0);
	this.hasFilterBar = false;
	
	this.getArticleElements = function() {
		if (ExtendedView) {
			return $('#centerInner');
		}
		else {
			return $('.articleList .detail');
		}
	};
	
	this.getFilterHtml = function(page) {
        if (!this.hasFilterBar) {
            // do not add filter
        } else {
            var html = '<fieldset><legend class="secTitles">Badge Types</legend><ol>';
            for(var i = 0; i < BadgeTypes.length; i++) {
                html += '<li>' + page.getSelectBoxHtml(BadgeTypes[i]) + ' ' + page.getSelectLabelHtml(BadgeTypes[i]) + '</li>';
            }
            html += '</ol></fieldset>';
            html += '<fieldset><legend class="secTitles">Badge Value Filter</legend><ol>';
            for(var i = 0; i < BadgeTypes.length; i++) {
                html += '<li class="' + page.getFilterContainerClass(BadgeTypes[i].key) + '">' + page.getFilterLabelHtml(BadgeTypes[i]) + '<br />' + page.getFilterBoxHtml(BadgeTypes[i]) + '</li>';
            }
            html += '</ol></fieldset>';
            return html;
        }
	};
	
	this.insertFilter = function(page, html) {
        if (!this.hasFilterBar) {
            // do not add filter
        } else {
            $('#navBox_pubyear').before(html);
        }
	};
	
	this.getDoi = function(article) {
		if (ExtendedView) {
			var href = article.getContainerElement().find('#ddDoi').attr('href');
			if (href.indexOf('doi.org') > -1) {
				var doi = href.replace('https://doi.org/', '');
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
			return article.getContainerElement().find('.svTitle').text();
		}
		else {
			return article.getContainerElement().find('.title').find('h2').text();
		}
	};
	
	this.insertBadgeContainer = function(article) {
		if (ExtendedView) {
			var elem = article.getContainerElement().find('#refersToAndreferredToBy');
			$('<div class="ce_bigbadge_container"><h2>Badges</h2><div id="'+ article.getBadgesContainerName() +'"></div></div>').insertAfter(elem);
		}
		else {
			var elem = article.getContainerElement().find('li.external');
			$('<div id="'+ article.getBadgesContainerName() +'"></div>').insertAfter(elem);
		}
	};
		
}