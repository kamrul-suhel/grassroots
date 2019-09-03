import { api } from 'app/utils';

const defaultState = {
	collection: {},
	count: null,
	currentCollection: [],
	error: null,
	filters: [],
	isLoading: true,
	misc: {},
	pager: {},
};

export default function reducer(state = defaultState, action) {
	switch	(action.type) {
		case 'CONSENT_PENDING': {
			return {
				...state,
				isLoading: true,
			};
		}
		case 'CONSENT_REJECTED': {
			return {
				...state,
				isLoading: false,
				error: action.payload.data,
			};
		}
		case 'CONSENT_FULFILLED': {
			const normalizedData = api.normalizeData(state, action, 'consent_id');
			return {
				...state,
				isLoading: false,
				...normalizedData,
			};
		}
		default: {
			return state;
		}
	}
}
