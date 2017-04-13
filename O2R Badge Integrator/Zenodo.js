addButton();

function addButton() {
  
  var btn = document.createElement('BUTTON');
  var t = document.createTextNode(' Open as Executable Research Compendium');
  var frm = document.createElement('FORM');
  var icn = document.createElement('I');


  icn.setAttribute('class', "fa fa-external-link");
  btn.setAttribute('class', "btn btn-primary btn-block");
  btn.appendChild(icn);
  btn.appendChild(t);
  frm.appendChild(btn);
  //frm.setAttribute('action', "http://www.o2r.info");
  
  frm.addEventListener("click", function(event) {
    
    var collapse = document.getElementById('collapseTwo');
    var frwrap = collapse.getElementsByClassName('forcewrap')[0];
    var filename = frwrap.innerText;
    
    var zenodoURL = window.location.href;
    var finalURL = "https://o2r.uni-muenster.de/#!/home?shareURL=" + zenodoURL + "&filename=" + filename;

    openO2RPage(finalURL);
    event.preventDefault();
  });

  var menu = document.getElementsByClassName("col-sm-4 col-md-4 col-right")[0];
  var metadata = document.getElementsByClassName("well metadata")[0];
  menu.insertBefore(frm, metadata);

}

function openO2RPage(url) {
  //window.open uses default browser behavior (-> new tab) but is considered a popup and may be blocked
  window.open(url);
  //window.location.href = url;
}

// wait for async elements to load
//setTimeout(addButton, 1000);
