function save_options() {
	var transparentArticles = document.getElementById('transparentArticles').checked;
	var hideNotAvailable = document.getElementById('hideNotAvailable').checked;
	var badgerEndpoint = document.getElementById('badgerEndpoint').value;
	var enabled = document.getElementById('globalEnable').checked;
	var opts = {
        transparentArticles: transparentArticles,
        hideNotAvailable: hideNotAvailable,
		badgerEndpoint: badgerEndpoint,
		enabled: enabled
	};
	for(var i = 0; i < BadgeTypes.length; i++) {
		var key = BadgeTypes[i].key;
		opts[key + 'Badge'] = document.getElementById(key).checked;
	}
	for(var i = 0; i < RepositoryTypes.length; i++) {
		var key = RepositoryTypes[i].key;
		opts[key + 'Repository'] = document.getElementById(key).checked;
	}

	if (enabled) {
        chrome.browserAction.setIcon({path: "icons/icon.png"});
    } else {
        chrome.browserAction.setIcon({path: "icons/icon_disabled.png"});
    }

	chrome.storage.sync.set(opts, function () {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function () {
			status.textContent = '';
		}, 1000);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	//var badgerEndpoint = document.getElementById('badgerEndpoint');
	var opts = {
        transparentArticles: true,
        hideNotAvailable: false,
		badgerEndpoint: 'https://o2r.uni-muenster.de/api/1.0/badge/',
        enabled: true
	};
	//Restore badge settings
	for(var i = 0; i < BadgeTypes.length; i++) {
		var key = BadgeTypes[i].key;
		
		opts[key + 'Badge'] = true;
		
		var checkboxes = document.getElementById('checkboxes');
		checkboxes.innerHTML += '<input type="checkbox" id="' + key + '" name="' + key + '" /> <label for="' + key + '">' + BadgeTypes[i].value + '</label><br>';
	}
	//Restore ERC button settings
	for(var i = 0; i < RepositoryTypes.length; i++) {
		var key = RepositoryTypes[i].key;
		
		opts[key + 'Repository'] = true;
		
		var ercCheckboxes = document.getElementById('ercCheckboxes');
		ercCheckboxes.innerHTML += '<input type="checkbox" id="' + key + '" name="' + key + '" /> <label for="' + key + '">' + RepositoryTypes[i].value + '</label><br>';
	}
	chrome.storage.sync.get(opts, function (items) {
		for(var i = 0; i < BadgeTypes.length; i++) { //Badges
			var key = BadgeTypes[i].key;
			document.getElementById(key).checked = items[key + 'Badge'];
		}	
		for(var i = 0; i < RepositoryTypes.length; i++) { //Repositories
			var key = RepositoryTypes[i].key;
			document.getElementById(key).checked = items[key + 'Repository'];
		}
		document.getElementById('transparentArticles').checked = items.transparentArticles;
		document.getElementById('hideNotAvailable').checked = items.hideNotAvailable;
		document.getElementById('badgerEndpoint').value = items.badgerEndpoint;
		document.getElementById('globalEnable').checked = items.enabled;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);