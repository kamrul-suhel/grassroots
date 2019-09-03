import { api, fn } from 'app/utils';
import { url as urlConstant } from 'app/constants';

export const showAlert = (payload) => {
	return {
		type: 'SHOW_ALERT',
		payload,
	};
};

export const hideAlert = (payload) => {
	return {
		type: 'HIDE_ALERT',
	};
};

export const storeToken = (payload) => {
	return {
		type: 'STORE_TOKEN',
		payload,
	};
};

// custom middleware
export const rejectData = (type, response) => {
	return {
		type: `${type}_REJECTED`,
		payload: response,
	};
};

export const requestData = (type) => {
	return {
		type: `${type}_PENDING`,
	};
};

export const receiveData = (type, response, payload) => {
	const page = payload.page || 1;

	return {
		page,
		payload: response,
		receivedAt: Date.now(),
		type: `${type}_FULFILLED`,
	};
};

export const fetchData = payload => (dispatch, getState) => {
	dispatch(requestData(payload.type));
	return api.get(payload.url)
		.then((response) => {
			if (api.error(response)) {
				dispatch(rejectData(payload.type, response));

				if (response.status === 403 || response.status === 422) {
					return response;
				}

				if (response.status === 404) {
					return fn.navigate(urlConstant.notFound);
				}

				return fn.navigate({ pathname: urlConstant.logout, state: { showDefaultAlert: false } });
			}
			dispatch(receiveData(payload.type, response, payload));
			return response;
		});
};
