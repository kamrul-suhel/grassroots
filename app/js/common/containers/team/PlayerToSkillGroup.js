import React from 'react';
import { PageDescription, PageTitle, Back } from 'app/components';

import PlayerAssignToTeam from './PlayerAssignToTeam'

export default class PlayerToSkillGroup extends React.PureComponent {

	constructor(props) {
		super(props);
		this.teamId = this.props.params.teamId;
	}

	render() {
		const { team } = this.props;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value={`${team.title} Players` || 'Team'}  subHeading={team.agegroup}/>
				<PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.</PageDescription>

				<PlayerAssignToTeam {...this.props} {...this.state}/>

				<div className="form-actions">
					<Back className="button">Back</Back>
				</div>
			</div>
		);
	}
}