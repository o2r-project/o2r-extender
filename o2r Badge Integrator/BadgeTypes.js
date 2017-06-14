var ExtendedView = false;
// TODO: When adding a new badge, apply this here
var BadgeTypes = [{
		key: 'licence', value: 'Licence',
		apiPath: 'licence/', doiEncoded: true, extended: true,
		filter: {type: 'select', values: ['open', 'mostly open', 'partially open', 'closed']}
	},{
		key: 'executable', value: 'Executable',
		apiPath: 'executable/', doiEncoded: true, extended: true,
		filter: {type: 'select', values: ['yes', 'running', 'no']}
	},{
		key: 'spatial', value: 'Research location',
		apiPath: 'spatial/', doiEncoded: true, extended: "iframe",
		filter: {type: 'text'}
	},{
		key: 'releasetime', value: 'Release time',
		apiPath: 'releasetime/', doiEncoded: true, extended: false,
		filter: {type: 'year_newer'}
	},{
		key: 'peerreview', value: 'Peer review',
		apiPath: 'peerreview/', doiEncoded: false, extended: false,
		filter: {type: 'text'}
	}
];

var RepositoryTypes = [{
		key: 'sciebo', value: 'Sciebo'
	},{
		key: 'zenodo', value: 'Zenodo'
	}
];

