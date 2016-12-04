// content.js
alert("Welcome to Microsoft Academic Search! Press the O2R icon to assess which of these researches have a Source link!")
//var firstHref = $("a[href^='http']").eq(0).attr("href"); /*Return first link */
//console.log(firstHref); /*Write first link of page in console log */

chrome.runtime.onMessage.addListener( /*Listen to JSON response from background.js */
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
    	//Need to insert the evaluation (by checking if a source link is available) here! 
    if( $('.actions').is(':empty') ) {
    // delete div if empty
    $('.actions').remove();
    }
        $('.actions').css("border","3px solid red"); /*Useful just to show which DIVS it selects */
     $(".actions").append("<img id='source' src='source.png'/>");
    }
  }
);

