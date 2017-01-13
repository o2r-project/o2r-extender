// content.js
var title = "";
alert("Welcome to Google Scholar! Please wait while these search results are being assessed for peer-review & executability...")

chrome.runtime.onMessage.addListener( /*Listen to JSON response from background.js */
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
    $( "#gs_qsuggest" ).removeClass( "gs_ri" ); /*To remove badge from 'Suggested Result' div */
      //$('<img id="peer-review" src='+chrome.extension.getURL("peer-review.png")+' />' ).insertAfter( ".gs_ri" ); //add badges after every result  
    $('.gs_rt').each(function(i, obj) {
    getTitle(obj);  
      if (title != "NONE") { //If NOT a citation, but an actual link to research, run the DOI check
        if (getDOI(title)!="No Match") { //If research has a doi, add badge
            console.log(getDOI(title));
            var doi = getDOI(title);
          $('<a href = "https://www.google.com"> <img id="peer-review" src=http://giv-project6.uni-muenster.de:3000/api/1.0/badge/peerreview/doaj/doi:'+doi+' /> </a>' ).insertAfter(obj);
          $('<a href = "https://www.google.com"> <img id="license" src=http://giv-project6.uni-muenster.de:3000/api/1.0/badge/licence/o2r/doi:'+processDOI(doi)+' /> </a>' ).insertAfter(obj);
          $('<a href = "https://www.google.com"> <img id="executability" src=http://giv-project6.uni-muenster.de:3000/api/1.0/badge/executable/o2r/1'+' /> </a>' ).insertAfter(obj);
          } else { //If research doesn't match a doi, print to console name of research
            console.log("No result found for "+title); //No valid title found, input NONE string
          }
      } else {
        console.log (" Found citation, not a research link");
      }         
      }); 
    }

function processDOI (doi) {
  var doiFormatted=doi.replace("/","%2F");
  return doiFormatted;
}

/*
* Extract research title from each search result
*/
function getTitle (obj) {
  if (obj.childNodes[0].text != undefined)  {
    title= (obj.childNodes[0].text); // Take 1st argument in title (In case it's e.g. Environmental quality...)
  } else if (obj.childNodes[2].text!=undefined) {
    title= (obj.childNodes[2].text);  //Take 3rd argument (In case it's e.g. [CITATION] Air Quality...)
  } else {
    title= "NONE"; //It's a citation, not a link to a research
  } return title;
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
        'url': "https://api.crossref.org/works?query="+title,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
      });
      return json;
      }) ();

      if (title.toLowerCase()==json.message.items[0].title.toString().toLowerCase()) {  //title matches EXACTLY to Crossrefs first search result
          return (json.message.items[0].DOI); //return DOI of research from search results
      }
      else { //title doesn't match EXACTLY, rejected 
          return ("No Match");
     } 
      }

     /* FOR TESTING ONLY
      console.log("TITLE:"+title.toLowerCase()+"END"); // Print Research Title
      console.log("RESULT:"+json.message.items[0].title.toString().toLowerCase()+"END"); 
      */   

  }
);