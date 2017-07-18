function openPage(e) {
    // open new tab with selected page
    var site = 'help/' +  e.target.id + '.html';
    chrome.tabs.create({url: chrome.extension.getURL(site)}, function (tab) {
    });
    window.close();
}


function switchExtension(e) {
    var button = document.getElementById("enableButton");
    if (button.innerText === 'Enable') {
        button.innerText = 'Disable';
        chrome.storage.sync.set({enabled : true});
        chrome.browserAction.setIcon({path: "icons/icon.png"});
    } else {
        button.innerText = 'Enable';
        chrome.storage.sync.set({enabled : false});
        chrome.browserAction.setIcon({path: "icons/icon_disabled.png"});
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var helpPage = document.getElementById('index');
    var aboutPage = document.getElementById('about');
    var button = document.getElementById('enableButton');
    helpPage.addEventListener('click', openPage);
    aboutPage.addEventListener('click', openPage);
    button.addEventListener('click', switchExtension);
    console.log("added eventListeners");

    //restore state:
    chrome.storage.sync.get(['enabled'], function (items) {
        if (items.enabled === false ) {
            button.innerText = 'Enable';

        } else {
            button.innerText = 'Disable';
        }
    });
});



