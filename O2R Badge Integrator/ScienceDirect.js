// content.js
alert("Welcome to ScienceDirect! Press the green icon to assess which of these researches are Peer-Reviewed!")

chrome.runtime.onMessage.addListener(/*Listen to JSON response from background.js */
		function (request, sender, sendResponse) {
			if (request.message === "everything_ready") {
				//$( "#gs_qsuggest" ).removeClass( "gs_ri" ); /*To remove badge from suggested result div */
				$('<img id="peer-review" src=' + chrome.extension.getURL("peer-review.png") + ' />').insertAfter(".article"); //add badge
				$('<img id="peer-review" src=' + chrome.extension.getURL("peer-review.png") + ' />').insertAfter(".publicationHead"); //add badge

				$('.title').each(function (i, obj) {
					if (obj.childNodes[0].text != undefined) { // Evaluation 
						console.log(obj.childNodes[0].text); //Title of research to be passed to API to check if peer reviewed/reproducible
					} else {
						console.log(obj.childNodes[2].text); //Title of research to be passed to API to check if peer reviewed/reproducible
					}
				});
			}
		}
);