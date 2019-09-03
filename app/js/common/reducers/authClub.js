export default function reducer(state = { data: {}, count: null, fetching: false, fetched: false, error: null }, action) {
	switch	(action.type) {
		case 'AUTHCLUB_PENDING': {
			return {
				...state,
				fetching: true,
			};
		}
		case 'AUTHCLUB_REJECTED': {
			return {
				...state,
				fetching: false,
				fetched: true,
				error: action.payload.data,
			};
		}
		case 'AUTHCLUB_FULFILLED': {
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
