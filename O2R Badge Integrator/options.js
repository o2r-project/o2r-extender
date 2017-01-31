function save_options() {
	var transparentArticles = document.getElementById('transparentArticles').checked;
	var hideNotAvailable = document.getElementById('hideNotAvailable').checked;
	var opts = {
        transparentArticles: transparentArticles,
        hideNotAvailable: hideNotAvailable
	};
	for(var i = 0; i < BadgeTypes.length; i++) {
		var key = BadgeTypes[i].key;
		opts[key + 'Badge'] = document.getElementById(key).checked;
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
	var opts = {
        transparentArticles: true,
        hideNotAvailable: false
	};
	for(var i = 0; i < BadgeTypes.length; i++) {
		var key = BadgeTypes[i].key;
		
		opts[key + 'Badge'] = true;
		
		var checkboxes = document.getElementById('checkboxes');
		checkboxes.innerHTML += '<input type="checkbox" id="' + key + '" name="' + key + '" /> <label for="' + key + '">' + BadgeTypes[i].value + '</label><br>';
	}
	chrome.storage.sync.get(opts, function (items) {
		for(var i = 0; i < BadgeTypes.length; i++) {
			var key = BadgeTypes[i].key;
			document.getElementById(key).checked = items[key + 'Badge'];
		}	
		document.getElementById('transparentArticles').checked = items.transparentArticles;
		document.getElementById('hideNotAvailable').checked = items.hideNotAvailable;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);