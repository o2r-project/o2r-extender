// content.js
alert("Welcome to Google Scholar! Press the O2R icon to assess which of these researches are Peer-Reviewed!")

chrome.runtime.onMessage.addListener( /*Listen to JSON response from background.js */
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
    	$( "#gs_qsuggest" ).removeClass( "gs_ri" ); /*To remove badge from suggested result div */
    	$('.gs_rt').each(function(i, obj) {

    	if (obj.childNodes[0].text != undefined) {
   				console.log(obj.childNodes[0].text); //Title of research to be passed to API to check if peer reviewed/reproducible
   			} else  { 
   				console.log(obj.childNodes[2].text); //Title of research to be passed to API to check if peer reviewed/reproducible
   			}

    	//console.log(obj);

    	}); 
        //$(".gs_ri").css("border","3px solid red"); /*Useful just to show which DIVS it selects */
        //$('<img id="peer-review" src='+chrome.extension.getURL("peer-review.png")+' />' ).insertAfter( ".gs_ri" ); 
    }
  }
);