import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, Select, Table } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import {
	Block,
	ButtonStandard,
	Link,
	Meta,
	PageTitle,
	Back
} from 'app/components';

@connect((store, ownProps) => {
	return {
		collection: store.kid,
		player: store.kid.collection[ownProps.params.playerId] || {},
		skills: store.skill,
	};
})
export default class View extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {};
	}

	componentWillMount() {
		this.fetchData();

		if (!this.props.skills.fetched) {
			this.props.dispatch(fetchData({
				type: 'SKILL',
				url: '/skills',
			}));
		}
	}

	fetchData = () => {
		this.props.dispatch(fetchData({
			type: 'KID',
			url: `/players/${this.props.params.playerId}`,
		}));
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	saveSize = async (kitId) => {
		const size = this.state[`size${kitId}`];

		if (!size) {
			return false;
		}

		const formData = {
			size,
		};

		const response = await api.post(`/kits/${kitId}/select-size`, formData);

		if (!api.error(response)) {
			fn.showAlert('Size has been selected!', 'success');
			this.fetchData();
		}
	}

	renderKitSize = (kit) => {
		let size = kit.size;

		if (!kit.size) {
			let saveButton = null;

			// check if size is set for that id
			if (this.state[`size${kit.id}`]) {
				saveButton = <span key="saveSize" className="button" onClick={() => this.saveSize(kit.id)}>Save</span>;
			}

			size = (
				<div className="flex">
					<Select name={`size${kit.id}`} options={kit.available_sizes} onChange={this.handleInputChange} />
					{saveButton}
				</div>
			);
		}

		return <td className="kit-size-select">{size}</td>;
	}

	render() {
		const {
			collection,
			player,
			skills,
		} = this.props;
		const billingGuardian = _.find(player.guardians, guardian => guardian.user_id === player.billing_guardian) || {};
		const livingGuardian = _.find(player.guardians, guardian => guardian.user_id === player.living_guardian) || {};

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value={player.display_name} />

				<div className="page-actions">
					<ButtonStandard to={`${url.kid}/${player.player_id}/edit`} icon={<i className="ion-edit" />}>Edit child</ButtonStandard>
					<ButtonStandard to={`${url.player}/${player.player_id}/all-assessments`} icon={<i className="ion-ios-analytics" />}>View Skill Assessments</ButtonStandard>
				</div>

				<ContentLoader
					data={player.player_id}
					forceRefresh
					isLoading={collection.isLoading}
					notFound="No Data"
				>
					<Block title="Personal details" img={player.pic}>
						<Meta label="Name" value={player.display_name} />
						<Meta label="Age" value={`${fn.diffDate(player.birthday)} years old (${fn.formatDate(player.birthday, 'DD MMM YYYY')})`} />
						<Meta label="Gender" value={_.startCase(player.gender)} />
						<Meta label="Address" value={livingGuardian && livingGuardian.address} />
						<Meta label="Contact" value={livingGuardian && livingGuardian.telephone} />
						<Meta label="Living with" value={livingGuardian && livingGuardian.display_name} />
						<Meta label="Billing contact" value={billingGuardian && billingGuardian.display_name} />
						<Meta label="Medical notes" value={player.medical_conditions} />
					</Block>

					<Block title="Teams & Skill groups">
						{'teams' in player && player.teams.length > 0 ? (
							<div className="grid">
								{player.teams.map((team, teamIndex) => {
									const teamSkills = player.skills && player.skills[team.team_id] ? player.skills[team.team_id] : {};

									return (
										<div className="grid-xs-12 grid-m-3" key={`team_${team.team_id}`}>
											<div className="grid-inner">
												<div className="player-skill-wrapper">
													<div className="player-team">
														<span className="icon-legend team-badge" style={{ backgroundImage: `url(${team.logo_url})` }} />
														<p className="team-name">{team.title}</p>
													</div>
													<div className="player-skills">
														{skills.currentCollection && _.map(skills.currentCollection, (skillId) => {
															const skill = skills.collection[skillId];
															const grade = teamSkills[skill.skill_id] ? teamSkills[skill.skill_id].grade : 0;
															return (
																<div className="player-skill" key={`skill_${skill.skill_id}`}>
																	<span className="skill-name">
																		{skill.title}
																		{grade > 0 && <span className="grade">{Math.round(grade * 10) / 10}</span>}
																	</span>
																	<div className="skill-bar-wrapper">
																		<div className="skill-bar" style={{ width: `${grade * 10}%` }} />
																	</div>
																</div>
															);
														})}
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<p>{player.display_name} is not assigned to any teams or skill groups</p>
						)}
					</Block>

					<Block title="Timetable">
						{player.sessions && player.sessions.length > 0 ? (
							<Table className={"header-transparent"}
								   icon="ion-ios-time"
								   headers={['', 'Time', 'Venue', 'Programme']}>
								{player.sessions.map(session => (
									<tr key={`sessions_${session.session_id}`}>
										<td><Link to={`${url.session}/${session.session_id}/player/${player.player_id}`}>{fn.formatDate(session.start_time)}</Link></td>
										<td>{`${fn.formatDate(session.start_time, 'HH:mm')} - ${fn.formatDate(session.end_time, 'HH:mm')}`}</td>
										<td><Link to={`${url.session}/${session.session_id}/player/${player.player_id}`}>{session.address}</Link></td>
										<td>{session.is_trial ? `${session.programme_name} - Trial` : session.programme_name}, {session.programme_type}</td>
									</tr>
								))}
							</Table>
						) : (
							<p>{player.display_name} has no sessions</p>
						)}
					</Block>

					<Block title="Homeworks">
						{player.homeworks && player.homeworks.length > 0 ? (
							<Table className={"header-transparent"}
								   icon="ion-person-stalker"
								   headers={['', 'Date', 'Coach']}>
								{player.homeworks.map(homework => (
									<tr key={`homework_${homework.homework_id}`}>
										<td><Link to={`${url.homework}/${homework.homework_id}`}>{homework.title}</Link></td>
										<td>{fn.formatDate(homework.homework_date)}</td>
										<td>{homework.coach_name}</td>
									</tr>
								))}
							</Table>
						) : (
							<p>{player.display_name} has no homeworks</p>
						)}
					</Block>

					<Block title="Kit items">
						{player.kits && player.kits.length > 0 ? (
							<Table className={"header-transparent"}
								   icon="ion-tshirt"
								   headers={['Name', 'Team', 'Type', 'Size']}>
								{player.kits.map(kit => {
									return (
										<tr key={`kit_${kit.kit_id}`}>
											<td>
												<Link to={`${url.kit}/${kit.kit_id}`}>{kit.title || kit.kit.title}</Link>
											</td>

											<td>
												{kit.team && kit.team.title}
											</td>

											<td>
												{kit.kit && kit.kit.type.title}
											</td>
											{this.renderKitSize(kit)}
										</tr>
									)
								}
								)}
							</Table>
						) : (
							<p>{player.display_name} has no assigned kit items</p>
						)}
					</Block>
				</ContentLoader>

				<div className="form-actions">
					<Back className="button">Go Back</Back>
				</div>
			</div>
		);
	}

}
