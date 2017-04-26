var img;
var infoBadges;
var ercInfoBadge;

chrome.storage.sync.get(['zenodoRepository'], function(items) {
    if (items.zenodoRepository) {
        addButton();
    }
});

function addButton() {

    var entry = document.createElement('DT');
    var txt = document.createElement('DD');
    var span = document.createElement('SPAN');
    img = document.createElement('IMG');

    entry.innerText = 'ERC:';
    txt.setAttribute('itemprop', 'ERC');
    span.className = 'get-badge';
    span.setAttribute('data-toogle', 'tooltip');
    span.setAttribute('data-placement', 'bottom');
    span.setAttribute('title', '');
    span.setAttribute('data-original-title', 'Open as ERC on o2r.uni-muenster.de');

    img.setAttribute('data-toogle','modal');
    img.setAttribute('src','https://img.shields.io/badge/ERC-not available-lightgrey.svg');

    //small erc info button on the top:
    ercInfoBadge = document.createElement('SPAN');
    ercInfoBadge.className = 'label label-info';
    ercInfoBadge.innerText = 'ERC';
    infoBadges = document.getElementsByClassName('pull-right')[0];

    setBadge();

    var metadata = document.getElementsByClassName('well metadata')[0];
    list = metadata.getElementsByTagName('DL')[0];
    subjectElement = list.getElementsByTagName('DT')[2];

    span.appendChild(img);
    txt.appendChild(span);

    //Insert nodes at the correct position (4*2 nodes)
    list.insertBefore(txt, list.childNodes[8]);
    list.insertBefore(entry, list.childNodes[8]);  
 
    // get filename from html
    var collapse = document.getElementById('collapseTwo');
    var frwrap = collapse.getElementsByClassName('forcewrap')[0];
    var filename = frwrap.innerText;

    var zenodoURL = window.location.href;
    var finalURL = 'https://o2r.uni-muenster.de/#!/home?shareURL=' + zenodoURL + '&filename=' + filename;

    img.setAttribute('style', 'cursor: pointer');
    img.onclick = function() {
        window.open(finalURL);
    };
}

function openO2RPage(url) {
    //window.open uses default browser behavior (-> new tab) but is considered a popup and may be blocked
    window.open(url);
    //window.location.href = url;
}

function setBadge() {
    // get filename from html
    var collapse = document.getElementById('collapseTwo');
    // get first file
    var frwrap = collapse.getElementsByClassName('forcewrap')[0];
    var filename = frwrap.innerText;

    if (!filename.endsWith('.zip')) {
        return;
    }

    var splitURL = window.location.href.split('/');
    var recordID = splitURL[splitURL.length - 1];

    var requestURL = 'https://sandbox.zenodo.org/record/' + recordID + '/preview/' + filename;

    var xhr = new XMLHttpRequest();

    // inspect if the zip file has a folder 'data' with a file 'bagtainer.yml'
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var el = document.createElement('html');
            el.innerHTML = xhr.responseText;

            var files = el.getElementsByClassName('fa fa-file-o');

            for (var i = 0; i < files.length; i++) {
                let file = files[i];
                if (file.parentNode.innerText.endsWith('bagtainer.yml')) {
                    if (file.parentNode.parentNode.parentNode.id.startsWith('tree_item')) {
                        // show the "erc-inspect" button
                        img.setAttribute('src','https://img.shields.io/badge/ERC-inspect-0D7EBE.svg');
                        //additionally, show the erc info badge
                        infoBadges.insertBefore(ercInfoBadge, infoBadges.childNodes[0] );
                    }
                }
            }
        }
    };
    xhr.open('GET', requestURL, true);
    xhr.setRequestHeader('accept', '*/*');
    xhr.send(null);

}
