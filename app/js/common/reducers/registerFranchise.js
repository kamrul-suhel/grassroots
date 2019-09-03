const defaultState = {
	account: {},
	packages: {}
};

export default function reducer(state = defaultState, action) {
	switch	(action.type) {
		case 'REGISTERFRANCHISE_UPDATE_ACCOUNT_INFO': {
			return {
				...state,
				account: {
					...state.account,
					[action.payload.name]: action.payload.value || '',
				},
			};
		}
		case 'REGISTERFRANCHISE_ADDTOBASKET': {
			const id = action.payload.id;
			return {
				...state,
				packages: {
					...state.packages,
					[`package${id}`]: {
						...action.payload
					}
				}
			};
		}
		case 'REGISTERFRANCHISE_REMOVE_PACKAGE': {
			const packages = _.pickBy(state.packages, o => o.id != action.payload);

			return {
				...state,
				packages,
			};
		}

		case 'REGISTERFRANCHISE_UPDATE_PACKAGE': {
            const updatePackageId = action.payload.id;
            return {
                ...state,
                packages: {
                    ...state.packages,
                    [`package${updatePackageId}`]: {
                        ...action.payload
                    }
                }
            };
		}

		default: {
			return state;
		}
	}
}
