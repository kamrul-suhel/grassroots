export default function reducer(state = { data: [], count: null, fetching: false, fetched: false, error: null }, action) {
	switch	(action.type) {
		case 'MYCLUB_LICENCE_PENDING': {
			return {
				...state,
				fetching: true,
			};
		}
		case 'MYCLUB_LICENCE_REJECTED': {
			return {
				...state,
				fetching: false,
				fetched: true,
				error: action.payload.data,
			};
		}
		case 'MYCLUB_LICENCE_FULFILLED': {
			return {
				...state,
				fetching: false,
				fetched: true,
				data: _.assign({}, state.data, action.payload.data),
			};
		}
		default: {
			return state;
		}
	}
}
