export default function reducer(state = { data: [], count: null, fetching: false, fetched: false, error: null }, action) {
	switch	(action.type) {
		case 'ME_PENDING': {
			return {
				...state,
				fetching: true,
			};
		}
		case 'ME_REJECTED': {
			return {
				...state,
				fetching: false,
				fetched: true,
				error: action.payload.data,
			};
		}
		case 'ME_FULFILLED': {
			return {
				...state,
				fetching: false,
				fetched: true,
				data: _.assign({}, state.data, action.payload.data),
			};
		}
		case 'ME_UPDATE': {
			return {
				...state,
				data: _.assign({}, state.data, action.payload),
			};
		}
		case 'ME_UPDATE_WELCOME': {
			return {
				...state,
				data: {
					...state.data,
					welcome: action.payload,
				},
			};
		}
		case 'STORE_TOKEN': {
			return {
				...state,
				data: action.payload,
			};
		}
		default: {
			return state;
		}
	}
}
