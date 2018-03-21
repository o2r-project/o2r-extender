chrome.webNavigation.onDOMContentLoaded.addListener(function (tab) {
	if (tab.frameId === 0) { // FrameId == 0 means only the main page, not iframes or similar.
		chrome.tabs.sendMessage(tab.tabId, {"message": "dom_ready"});
	}
});

chrome.webNavigation.onCompleted.addListener(function (tab) {
	if (tab.frameId === 0) { // FrameId == 0 means only the main page, not iframes or similar.
		chrome.tabs.sendMessage(tab.tabId, {"message": "everything_ready"});
	}
});

chrome.extension.onMessage.addListener(function(message, sender, sendResponse){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, message);
	});
 });

chrome.extension.onMessage.addListener(function(message, sender, sendResponse){
	if (message.reason === 'openTab') {
        chrome.tabs.create({url: message.url}, function (tab) {
        });
	}
});

//restore "disabled" option
chrome.storage.sync.get(['enabled'], function (items) {
    if (items.enabled === false ) {
        chrome.browserAction.setIcon({path: "icons/icon_disabled.png"});
    } else {
        chrome.browserAction.setIcon({path: "icons/icon.png"});
    }
});