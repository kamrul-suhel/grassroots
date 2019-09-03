import React from 'react';
import { connect } from 'react-redux';
import { fetchData } from 'app/actions';
import PlayerToSkillGroup from './PlayerToSkillGroup';
import PlayerToTeam from './PlayerToTeam';

@connect((store, ownProps) => {
	return {
		team: store.team.collection[ownProps.params.teamId] || {},
	};
})
export default class Players extends React.PureComponent {

	componentWillMount = async () => {
		this.props.dispatch(fetchData({
			type: 'TEAM',
			url: `/teams/${this.props.params.teamId}`,
		}));
	}

	render() {
		// wait until receives a team type
		if (!this.props.team.type) {
			return null;
		}

		if (this.props.team.type === 'team') {
			return <PlayerToTeam {...this.props} />;
		}

		return <PlayerToSkillGroup {...this.props} />;
	}
}
