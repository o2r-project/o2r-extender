// content.js
alert("Welcome to Google Scholar! Press the O2R icon to assess which of these researches are Peer-Reviewed!")
//var firstHref = $("a[href^='http']").eq(0).attr("href"); /*Return first link */
//console.log(firstHref); /*Write first link of page in console log */

chrome.runtime.onMessage.addListener( /*Listen to JSON response from background.js */
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
    	//Need to insert the evaluation (by checking title of every research) here! 
    	$( "#gs_qsuggest" ).removeClass( "gs_ri" ); /*To remove badge from suggested result div */
        //$(".gs_ri").css("border","3px solid red"); /*Useful just to show which DIVS it selects */
      $( '<img id="peer-review" src='+chrome.extension.getURL("peer-review.png")+' />' ).insertAfter( ".gs_ri" ); 
    }
  }
);