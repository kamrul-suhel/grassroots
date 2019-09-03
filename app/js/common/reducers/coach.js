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
		case 'COACH_PENDING': {
			return {
				...state,
				isLoading: true,
			};
		}
		case 'COACH_REJECTED': {
			return {
				...state,
				isLoading: false,
				error: action.payload.data,
			};
		}
		case 'COACH_FULFILLED': {
			const normalizedData = api.normalizeData(state, action, 'user_id');
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
