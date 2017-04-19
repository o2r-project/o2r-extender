// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var list;

var extVars = getVariables(["oc_requesttoken"]);

function addButton() {

  var menu = document.getElementsByClassName("fileActionsMenu popovermenu bubble open menu")[0];
  list = menu.getElementsByTagName("UL")[0];

  var node = document.createElement("LI");

  var link = document.createElement('a');
  link.setAttribute('href', "#");
  link.className = "menuitem action action-download permanent";

  var imageSpan = document.createElement("SPAN");
  imageSpan.className = "icon icon-download";

  var textSpan = document.createElement("SPAN");
  textSpan.innerHTML = "Open as ERC";

  link.appendChild(imageSpan);
  link.appendChild(textSpan);
  node.appendChild(link); 
  list.appendChild(node);

  link.addEventListener("click", function(event) {
    getPublicShare();
    event.preventDefault();
  });
}

function findParentNodeWithName(name, node) {
    if (node.parentNode.nodeName === "BODY")
        console.log("Did not find parent node with name " + name);
    if (node.parentNode.nodeName === name){
        return node.parentNode;
    } else {
        return findParentNodeWithName(name, node.parentNode);
    }
}

function getPublicShare() {
    // 1st, get clicked folder name:
    //var x = document.getElementById("myLI").parentNode.nodeName;
    var tempURL = window.location.href;

    var folder = findParentNodeWithName('TR', list);
    var folderName = folder.getAttribute('data-file');
    var fPath = decodeURIComponent(window.location.href.split("dir=")[1]);
    var folderPath = '';
    if (fPath === '/' || fPath === undefined || fPath === "undefined" ) { // if currently in base direcotry you just need the filename
        folderPath = folderName;
    } else { //otherwise you need the full path of that folder
        folderPath = fPath + '/' + folderName;
    }
    
    //console.log("folderpath: " + folderPath);
    
    // get other attributes such as id, size, type, shareType, ... here
    // throw error if share type is wrong

    // 2nd, do http request to get the shareURL and path:
    var requestURL = "https://uni-muenster.sciebo.de/ocs/v2.php/apps/files_sharing/api/v1/shares?format=json&path=" + encodeURIComponent("/" + folderPath);
    requestURL += "&reshares=true";
  
    var xhr = new XMLHttpRequest();


    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var result = JSON.parse(xhr.responseText);
            if (result.ocs.data.length === 0) {
                alert('Could not get public share for this folder, please make sure to enable sharing ("Share link")');
                throw new Error('Could not get public share for this folder, please make sure to enable sharing ("Share link")');
            }
            
            var shareURL = result.ocs.data[0].url;
            var path = '/'; //clicking on a 
            var finalURL = "https://o2r.uni-muenster.de/#!/home?shareURL=" + shareURL + "&path=" + path;
            openO2RPage(finalURL);
        }
    };
    xhr.open('GET', requestURL, true);
    xhr.setRequestHeader('requesttoken', extVars.oc_requesttoken);
    xhr.setRequestHeader('accept', '*/*');
    xhr.setRequestHeader('OCS-APIREQUEST', true);
    xhr.send(null);


}

function openO2RPage(url) {
    
    window.open(url);
  //window.location.href = url;
    
}

function addClickEvent() {
    var anchors = document.getElementsByClassName("action action-menu permanent");
    for(var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        anchor.onclick = function() {
            addButton();
        };
    }
}

window.addEventListener('load', function() {
    addClickEvent();
}, false);

// wait for async elements to load
setTimeout(addClickEvent, 1000);

function getVariables(variables) {
    var ret = {};

    var scriptContent = "";
    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        scriptContent += "if (typeof " + currVariable + " !== 'undefined') $('body').attr('tmp_" + currVariable + "', " + currVariable + ");\n"
    }

    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        ret[currVariable] = $("body").attr("tmp_" + currVariable);
        $("body").removeAttr("tmp_" + currVariable);
    }

    $("#tmpScript").remove();

    return ret;
}
