// content.js
var doi;
alert("Welcome to PLOS! Please wait while these search results are being assessed for peer-review & executability...")

chrome.runtime.onMessage.addListener( /*Listen to JSON response from background.js */
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      //$('<img id="Executability Status" src='+chrome.extension.getURL("Executability-Yes-brightgreen.png")+' />').css('display', 'inline-block').insertAfter( ".gs-title>a" ); // add badge after each result with styling
      //$('<img id="Executability Status" src='+chrome.extension.getURL("executability.png")+' />').css('margin-left', '20px').insertAfter( ".gs-title>a" ); // add badge after each result with styling
    $('.gs-title>a').each(function(i, obj) {
      if (i%2!=0) { /*Return every second result, otherwise there is double duplicate results */

      /* Extract DOI From link URL*/
      var link = obj.href;
      var index = obj.href.indexOf("id")+3;
      var PDFindex = obj.href.indexOf("PDF");

      getDOI(link, index, PDFindex);
      
      if (doi!="NONE") { //A valid DOI
        console.log(doi)
        $('<img id="peer-review" src='+chrome.extension.getURL("peer-review.png")+' />' ).insertAfter(obj)
      } else { // no DOI found
        console.log("no DOI found for "+obj.childNodes[0].textContent+" "+obj.childNodes[1].textContent);
      }
     
    	}
      }); 
    }

    function getDOI (link, index, PDFindex) {
    if (index==-1) { //no id in result
        doi="NONE";
      } else if (PDFindex ==-1) { //no pdf in result
        doi=(link.substr(index));
      } else { //regular result
        doi=(link.substr(index,link.length-4));
        } 

    }


  }
);