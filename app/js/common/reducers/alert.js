export default function reducer(state = {alerts: null, type: null, show: false}, action) {
	switch	(action.type) {
		case "SHOW_ALERT": {
			return {
				...state,
				alerts: action.payload.alerts,
				type: action.payload.type,
				show: true,
			};
		}
		case "HIDE_ALERT": {
			return {
				...state,
				alerts: null,
				type: null,
				show: false,
			};
		}
	}

	return state;
}
