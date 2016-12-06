// content.js
alert("Welcome to PLOS! Press the O2R icon to assess which of these researches are executable!")

chrome.runtime.onMessage.addListener( /*Listen to JSON response from background.js */
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      //$('<img id="Executability Status" src='+chrome.extension.getURL("Executability-Yes-brightgreen.png")+' />').css('display', 'inline-block').insertAfter( ".gs-title>a" ); // add peer review badge
      $('<img id="Executability Status" src='+chrome.extension.getURL("Executability-Yes-brightgreen.png")+' />').css('margin-left', '20px').insertAfter( ".gs-title>a" ); // add peer review badge
      $('.gs-title>a').each(function(i, obj) {
      if (i%2!=0) {      
      console.log(obj.text);
    	}
      }); 
        //$(".gs_ri").css("border","3px solid red"); /*Useful just to show which DIVS it selects *
    }
  }
);