// content.js
var title = "";
alert("Welcome to Micrsoft Academic Search! Please wait while these search results are being assessed for peer-review & executability...")

chrome.runtime.onMessage.addListener(/*Listen to JSON response from background.js */
		function (request, sender, sendResponse) {
			if (request.message === "everything_ready") {

				$('.story-title').each(function (i, obj) {
					var title = document.getElementsByClassName('story-title').getElementsByTagName('a')[0].innerHTML;
					console.log(title);
					return title;
					if (getDOI(title) != "No Match") { //If research has a doi, add badge
						$('<img id="peer-review" src=' + chrome.extension.getURL("peer-review.png") + ' />').insertAfter(obj);
						if (checkExe(title) == true) {
							$('<img id="peer-review" src=' + chrome.extension.getURL("executability.png") + ' />').insertAfter(obj);
						}
					} else { //If research doesn't match a doi, print to console name of research
						console.log("No result found for " + title); //No valid title found, input NONE string
					}
				});

				$('#blue-title').each(function (i, obj) {
					var title = document.getElementsByClassName("blue-title").title;
					return title;
					console.log(title);
					if (getDOI(title) != "No Match") { //If research has a doi, add badge
						$('<img id="peer-review" src=' + chrome.extension.getURL("peer-review.png") + ' />').insertAfter(obj);
						if (checkExe(title) == true) {
							$('<img id="peer-review" src=' + chrome.extension.getURL("executability.png") + ' />').insertAfter(obj);
						}
					} else { //If research doesn't match a doi, print to console name of research
						console.log("No result found for " + title); //No valid title found, input NONE string
					}
				});
			}

			/*
			 * Future APIs will go here (Executability, Reproducibility). Peer Review can be integrated in getDOI function
			 */

			function checkExe(title) {
				return true;
			}

			/*
			 * Get DOI from each research title using Crossrefs API
			 */

			function getDOI(title) {

				var json = (function () { //Send research title to get DOI 
					var json = null;
					$.ajax({
						'async': false,
						'global': false,
						'url': "https://api.crossref.org/works?query=" + title,
						'dataType': "json",
						'success': function (data) {
							json = data;
						}
					});
					return json;
				})();

				if (title.toLowerCase() == json.message.items[0].title.toString().toLowerCase()) {  //title matches EXACTLY to Crossrefs first search result
					return (json.message.items[0].DOI); //return DOI of research from search results
				} else { //title doesn't match EXACTLY, rejected 
					return ("No Match");
				}
			}

			/* FOR TESTING ONLY
			 console.log("TITLE:"+title.toLowerCase()+"END"); // Print Research Title
			 console.log("RESULT:"+json.message.items[0].title.toString().toLowerCase()+"END"); 
			 */

		}
);


