function save_options() {
	var executable = document.getElementById('executable').checked;
	var peerreview = document.getElementById('peerreview').checked;
	var licence = document.getElementById('licence').checked;
	var transparent = document.getElementById('transparent').checked;
	var spatial = document.getElementById('spatial').checked;
	var releasetime = document.getElementById('releasetime').checked;
	var hideNotAvailable = document.getElementById('hideNotAvailable').checked;

	chrome.storage.sync.set({
		executableBadge: executable,
		peerreviewBadge: peerreview,
		licenceBadge: licence,
		spatialBadge: spatial,
		releasetimeBadge: releasetime,
        transparentArticles: transparent,
        hideNotAvailable: hideNotAvailable
	}, function () {
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
	chrome.storage.sync.get({
		executableBadge: true,
		peerreviewBadge: true,
		licenceBadge: true,
		spatialBadge: true,
		releasetimeBadge: true,
        transparentArticles: true,
        hideNotAvailable: false
	}, function (items) {
		document.getElementById('executable').checked = items.executableBadge;
		document.getElementById('peerreview').checked = items.peerreviewBadge;
		document.getElementById('licence').checked = items.licenceBadge;
		document.getElementById('spatial').checked = items.spatialBadge;
		document.getElementById('releasetime').checked = items.releasetimeBadge;		
		document.getElementById('transparent').checked = items.transparentArticles;
		document.getElementById('hideNotAvailable').checked = items.hideNotAvailable;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);