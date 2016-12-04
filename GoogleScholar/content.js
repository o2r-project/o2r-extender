// content.js
alert("Hello from your Chrome extension!")

//var firstHref = $("a[href^='http']").eq(0).attr("href"); /*Return first link */
//console.log(firstHref); /*Write first link of page in console log */


chrome.runtime.onMessage.addListener( /*Listen to JSON response from background.js */
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      console.log(firstHref);
    }
  }
);