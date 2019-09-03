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
		case 'ASSESSMENT_TEMPLATE_PENDING': {
			return {
				...state,
				isLoading: true,
			};
		}
		case 'ASSESSMENT_TEMPLATE_REJECTED': {
			return {
				...state,
				isLoading: false,
				error: action.payload.data,
			};
		}
		case 'ASSESSMENT_TEMPLATE_FULFILLED': {
			const normalizedData = api.normalizeData(state, action, 'assessment_id');
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
