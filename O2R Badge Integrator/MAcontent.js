// content.js
alert("Welcome to Microsoft Academic Search! Press the O2R icon to assess which of these researches have a Source link!")
//var firstHref = $("a[href^='http']").eq(0).attr("href"); /*Return first link */
//console.log(firstHref); /*Write first link of page in console log */

chrome.runtime.onMessage.addListener( /*Listen to JSON response from background.js */
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
    	//Need to insert the evaluation (by checking if a source link is available) here! 
    if( $('.actions').length ) {
       	$('<img id="source" src='+chrome.extension.getURL("source.png")+' />' ).insertAfter( ".actions" );
    }
    if( $('.entity-news card').length ) {
      	$('<img id="source" src='+chrome.extension.getURL("nosource.png")+' />' ).insertAfter( ".entity-news card" );
    }

    
    	$('.blue-title').each(function(i, obj) {
      if (document.getElementsByClassName("blue-title").title != undefined) { // Evaluation 
   				var title= (document.getElementsByClassName("blue-title").title); //Create title of research to be passsed to CrossRefs API
          
   			} else  { 
   				var title= (document.getElementsByClassName("blue-title").title); //Create title of research to be passsed to CrossRefs API
   			}

      console.log(title); // Print Research Title

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

      if (title.toLowerCase()==json.message.items[0].title.toString().toLowerCase()) { 
          console.log("SUCCESS!: "+title+json.message.items[0].DOI); //title matches EXACTLY
      }
      else { 
          console.log("No exact match");
      }

    	}); 

    }
  }
);

