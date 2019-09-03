const defaultState = {
	account: {},
	siblings: [],
	playerCount: 1,
	playerId: 1,
	players: {
		player1: {
			dob: '',
			editable: true,
			firstName: '',
			id: 1,
			lastName: '',
			programmes: [],
			programmesFetched: false,
			programmesFetching: false,
		},
	},
	selectedProgrammes: {},
};

export default function reducer(state = defaultState, action) {
	switch	(action.type) {
		case 'REGISTERACCOUNTS': {
			return {
				...state,
				...action.payload,
			};
		}

		case 'REGISTERACCOUNTS_UPDATE_ACCOUNT_INFO': {
			return {
				...state,
				account: {
					...state.account,
					[action.payload.name]: action.payload.value || '',
				},
			};
		}

		case 'REGISTERACCOUNTS_ADD_PLAYER': {
			const playerId = state.playerId + 1;
			const playerCount = state.playerCount + 1;
			return {
				...state,
				playerCount,
				playerId,
				players: {
					...state.players,
					[`player${playerId}`]: {
						dob: '',
						editable: true,
						firstName: '',
						id: playerId,
						lastName: '',
						programmes: [],
						programmesFetched: false,
						programmesFetching: false,
					},
				},
			};
		}

		case 'REGISTERACCOUNTS_UPDATE_PLAYER_INFO': {
			const playerId = `player${action.payload.playerId}`;

			return {
				...state,
				players: {
					...state.players,
					[playerId]: {
						...state.players[playerId],
						[action.payload.name]: action.payload.value || '',
					},
				},
			};
		}

		case 'REGISTERACCOUNTS_EDIT_PLAYER': {
			const playerId = `player${action.payload.playerId}`;
			return {
				...state,
				players: {
					...state.players,
					[playerId]: {
						...state.players[playerId],
						editable: true,
					},
				},
			};
		}

		case 'REGISTERACCOUNTS_PROGRAMME_PENDING': {
			const playerId = `player${action.payload.playerId}`;

			return {
				...state,
				players: {
					...state.players,
					[playerId]: {
						...state.players[playerId],
						editable: false,
						programmes: [],
						programmesFetching: true,
						programmesFetched: false,
					},
				},
			};
		}

		case 'REGISTERACCOUNTS_PROGRAMME_SUCCESS': {
			const playerId = `player${action.payload.playerId}`;
			const programmes = !_.isEmpty(action.payload.response.data) ? action.payload.response.data : [];
			return {
				...state,
				players: {
					...state.players,
					[playerId]: {
						...state.players[playerId],
						programmes,
						programmesFetching: false,
						programmesFetched: true,
					},
				},
			};
		}

		case 'REGISTERACCOUNTS_ADD_PROGRAMME': {
			const siblings = [];

			const selectedProgrammes = {
				...state.selectedProgrammes,
				[`${action.payload.programmeId}_${action.payload.playerId}`]: {
					...action.payload,
				},
			};

			_.map(selectedProgrammes, (programme) => {
				if (programme.isTrial === 1) {
					return false;
				}

				return siblings.push(programme.playerId);
			});

			return {
				...state,
				selectedProgrammes,
				siblings: _.uniq(siblings),
			};
		}

		case 'REGISTERACCOUNTS_REMOVE_PROGRAMME': {
			const siblings = [];
			const selectedProgrammes = _.filter(state.selectedProgrammes, (o, k) => k !== action.payload);

			_.map(selectedProgrammes, (programme) => {
				if (programme.isTrial === 1) {
					return false;
				}

				return siblings.push(programme.playerId);
			});

			return {
				...state,
				selectedProgrammes,
				siblings: _.uniq(siblings),
			};
		}
		default: {
			return state;
		}
	}
}
