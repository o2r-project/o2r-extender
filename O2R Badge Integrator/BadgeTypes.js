// TODO: When adding a new badge, apply this here
var ExtendedView = false;
var BadgeTypes = [
	{
		key: 'executable', value: 'Executable',
		apiPath: 'executable/o2r/doi:', doiEncoded: true, extended: true,
		filter: {type: 'select', values: ['yes', 'running', 'no']}
	},{
		key: 'licence', value: 'Licence',
		apiPath: 'licence/o2r/doi:', doiEncoded: true, extended: true,
		filter: {type: 'select', values: ['open', 'mostly open', 'partially open', 'closed']}
	},{
		key: 'peerreview', value: 'Peer review',
		apiPath: 'peerreview/doaj/doi:', doiEncoded: false, extended: false,
		filter: {type: 'text'}
	},{
		key: 'spatial', value: 'Research location',
		apiPath: 'spatial/o2r/doi:', doiEncoded: true, extended: false,
		filter: {type: 'text'}
	}/*,{
		key: 'releasetime', value: 'Release time',
		apiPath: 'releasetime/o2r/doi:', doiEncoded: true, extended: false,
		filter: {type: 'text'}
	}*/
];