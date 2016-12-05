// content.js
alert("Welcome to Google Scholar! Press the O2R icon to assess which of these researches are Peer-Reviewed!")

chrome.runtime.onMessage.addListener( /*Listen to JSON response from background.js */
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
    	if($( ".number" ).value == 0) {
      	$('<img id="peer-review" src='+chrome.extension.getURL("noreaders.png")+' />' ).insertAfter( ".publication-details" );
			} 
			else{
				$('<img id="peer-review" src='+chrome.extension.getURL("readers.png")+' />' ).insertAfter( ".publication-details" );
			}
			//add badge
      
    	$('.gs_rt').each(function(i, obj) {
      if (obj.childNodes[0].text != undefined) { // Evaluation 
   				console.log(obj.childNodes[0].text); //Title of research to be passed to API to check if peer reviewed/reproducible
   			} else  { 
   				console.log(obj.childNodes[2].text); //Title of research to be passed to API to check if peer reviewed/reproducible
   			}

    	//console.log(obj);

    	}); 
        //$(".gs_ri").css("border","3px solid red"); /*Useful just to show which DIVS it selects *
    }
  }
);