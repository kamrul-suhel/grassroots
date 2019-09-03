export default function reducer(state = { data: [], count: null, fetching: false, fetched: false, error: null }, action) {
	switch	(action.type) {
		case 'MYCLUB_PENDING': {
			return {
				...state,
				fetching: true,
			};
		}
		case 'MYCLUB_REJECTED': {
			return {
				...state,
				fetching: false,
				fetched: true,
				error: action.payload.data,
			};
		}
		case 'MYCLUB_FULFILLED': {
			return {
				...state,
				fetching: false,
				fetched: true,
				data: _.assign({}, state.data, action.payload.data),
			};
		}
		case 'MYCLUB_UPDATE': {
			return {
				...state,
				data: _.assign({}, state.data, action.payload),
			};
		}
		default: {
			return state;
		}
	}
}
