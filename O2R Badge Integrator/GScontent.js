// content.js
var title = "";
var infoURL = "http://giv-project6.uni-muenster.de";
alert("Welcome to Google Scholar! Please wait while these search results are being assessed for peer-review & executability...")

chrome.runtime.onMessage.addListener(/*Listen to JSON response from background.js */
		function (request, sender, sendResponse) {
			if (request.message === "clicked_browser_action") {
				$("#gs_qsuggest").removeClass("gs_ri"); /*To remove badge from 'Suggested Result' div */
				$('.gs_rt').each(function (i, obj) {
					getTitle(obj);
					if (title != "NONE") { //If NOT a citation, but an actual link to research, run the DOI check
						getDOI(title, obj);
					} else {
						markUninteresting(obj);
						console.log(" Found citation, not a research link");
					}
				});
			}

			function processDOI(doi) {
				var doiFormatted = doi.replace("/", "%2F");
				return doiFormatted;
			}

			/*
			 * Extract research title from each search result
			 */
			function getTitle(obj) {
				if (obj.childNodes[0].text != undefined) {
					title = (obj.childNodes[0].text); // Take 1st argument in title (In case it's e.g. Environmental quality...)
				} else if (obj.childNodes[2].text != undefined) {
					title = (obj.childNodes[2].text);  //Take 3rd argument (In case it's e.g. [CITATION] Air Quality...)
				} else {
					title = "NONE"; //It's a citation, not a link to a research
				}
				return title;
			}
			
			function markUninteresting(obj) {
				$(obj).parents('.gs_r').css('opacity', 0.5);
			}

			/*
			 * Get DOI from each research title using Crossrefs API
			 */

			function getDOI(title, obj) {
				$.ajax({
					'async': true,
					'global': false,
					'url': "https://api.crossref.org/works?query=" + title,
					'dataType': "json",
					'success': function (data) {
						if (title.toLowerCase() == data.message.items[0].title.toString().toLowerCase()) {  //title matches EXACTLY to Crossrefs first search result
							doi = data.message.items[0].DOI;
							console.log(doi);
							$('<a href = "' + infoURL + '" target="_blank"><img id="peer-review" src=http://giv-project6.uni-muenster.de:3000/api/1.0/badge/peerreview/doaj/doi:' + doi + ' /> </a>').insertAfter(obj);
							$('<a href = "' + infoURL + '" target="_blank"><img id="license" src=http://giv-project6.uni-muenster.de:3000/api/1.0/badge/licence/o2r/doi:' + processDOI(doi) + ' /> </a>').insertAfter(obj);
							$('<a href = "' + infoURL + '" target="_blank"><img id="executability" src=http://giv-project6.uni-muenster.de:3000/api/1.0/badge/executable/o2r/1' + ' /> </a>').insertAfter(obj);
							
						} else { //title doesn't match EXACTLY, rejected 
							markUninteresting(obj);
							console.log("No result found for " + title); //No valid title found, input NONE string
							return ("No Match");
						}
					}
				});
			}

		}
);