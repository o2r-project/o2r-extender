// content.js
alert("Welcome to Mendeley! Press the O2R icon to assess which of these researches are Peer-Reviewed!")

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

    		$('#publication-details').each(function(i, obj) {
      if (obj.$('#publication-details').closest('a').attr('href').text != undefined) { // Evaluation 
   				var title= (obj.$('#publication-details').closest('a').attr('href').text); //Create title of research to be passsed to CrossRefs API
          
   			} else  { 
   				var title= (obj.$('#publication-details').closest('a').attr('href').text); //Create title of research to be passsed to CrossRefs API
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