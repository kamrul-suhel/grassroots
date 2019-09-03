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
		case 'CLUB_FULFILLED': {
			let teams = {};
			let skillGroups = {};
			action.payload.data.teams.map((team) => {
				if (team.type === 'skill-group') {
					skillGroups = {
						...skillGroups,
						[`#${team.team_id}`]: team,
					};
				} else {
					teams = {
						...teams,
						[`#${team.team_id}`]: team,
					};
				}
			});

			return {
				...state,
				teams,
				skillGroups,
			};
		}
		case 'CLUBSETUP_ADD_TEAM': {
			const newTeam = {
				[`#new${action.payload.teamId}`]: {
					agegroup_id: action.payload.agegroupId,
					id: action.payload.teamId,
					max_size: action.payload.teamSize,
					rank: action.payload.teamRank,
					title: action.payload.teamName,
					new: true,
				},
			};

			if (action.payload.type === 'skill-group') {
				return {
					...state,
					skillGroups: {
						...state.skillGroups,
						...newTeam,
					},
				};
			}

			return {
				...state,
				teams: {
					...state.teams,
					...newTeam,
				},
			};
		}
		default: {
			return state;
		}
	}
}
