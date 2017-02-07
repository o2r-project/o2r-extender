var ExtendedView = false;
// TODO: When adding a new badge, apply this here
var BadgeTypes = [
	{
		key: 'executable', value: 'Executable',
		apiPath: 'executable/o2r/doi:', doiEncoded: true, extended: false,
		filter: {type: 'select', values: ['yes', 'running', 'no']}
	},{
		key: 'peerreview', value: 'Peer review',
		apiPath: 'peerreview/doaj/doi:', doiEncoded: false, extended: false,
		filter: {type: 'text'}
	},{
		key: 'spatial', value: 'Research location',
		apiPath: 'spatial/o2r/doi:', doiEncoded: true, extended: false,
		filter: {type: 'text'}
	},{
		key: 'licence', value: 'Licence',
		apiPath: 'licence/o2r/doi:', doiEncoded: true, extended: true,
		filter: {type: 'select', values: ['open', 'mostly open', 'partially open', 'closed']}
	},{
		key: 'release-date', value: 'Release date',
		apiPath: 'release-date/crossref/doi:', doiEncoded: true, extended: false,
		filter: {type: 'text'}
	}
];