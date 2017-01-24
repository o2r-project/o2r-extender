chrome.webNavigation.onDOMContentLoaded.addListener(function (tab) {
	chrome.tabs.sendMessage(tab.tabId, {"message": "dom_ready"});
});

chrome.webNavigation.onCompleted.addListener(function (tab) {
	chrome.tabs.sendMessage(tab.tabId, {"message": "everything_ready"});
});