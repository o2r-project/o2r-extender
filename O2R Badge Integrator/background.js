chrome.webNavigation.onDOMContentLoaded.addListener(function (tab) {
	chrome.tabs.sendMessage(tab.tabId, {"message": "dom_ready"});
});

chrome.webNavigation.onCompleted.addListener(function (tab) {
	chrome.tabs.sendMessage(tab.tabId, {"message": "everything_ready"});
});

chrome.extension.onMessage.addListener(function(message, sender, sendResponse){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, message);
	});
 });