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
		case 'FAQ_PENDING': {
			return {
				...state,
				isLoading: true,
			};
		}
		case 'FAQ_REJECTED': {
			return {
				...state,
				isLoading: false,
				error: action.payload.data,
			};
		}
		case 'FAQ_FULFILLED': {
			const normalizedData = api.normalizeData(state, action);
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
