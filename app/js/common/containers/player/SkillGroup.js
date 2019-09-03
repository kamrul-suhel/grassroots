
import React from 'react';
import { connect } from 'react-redux';
import { Form, MultiSelect, Radio } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { FormButton, FormSection, Meta, PageDescription, PageTitle } from 'app/components';
import Back from "../../components/Back";
import moment from "./Edit";

@connect((store, ownProps) => {
	return {
		collection: store.player,
		player: store.player.collection[ownProps.params.playerId] || {},
		skills: store.skill
	};
})
export default class SkillGroup extends React.PureComponent {

	constructor(props) {
		super(props);

		this.playerId = this.props.params.playerId;

		this.state = {
			skillGroupList: [],
			combineTeam:true
		};
	}

	componentWillMount = async () => {
		this.props.dispatch(fetchData({
			type: 'PLAYER',
			url: `/players/${this.playerId}`,
		}));

		const skillGroupList = await api.get('/dropdown/teams/skill-group');

		// Modify title to show title & agegroup_title
		let skillGroups = _.map(skillGroupList.data, (list) => {
			return {
				...list,
				title : `${list.title} (${list.agegroup_title})`
			}
		})

		this.setState({
			skillGroupList: skillGroups,
		});
	}

	handleInputChange = async (name, value) => {
		this.setState({
			[name]: value
		});

		// If name = ageGroup then update skill group list
		if(name === 'ageGroup'){
			const skillGroupList = await api.get(`/dropdown/teams/skill-group?max_age=${value}`);
			// Modify title to show title & age group_title
			let skillGroups = _.map(skillGroupList.data, (list) => {
				return {
					...list,
					title : `${list.title} (${list.agegroup_title})`
				}
			})

			this.setState({
				skillGroupList: skillGroups,
			});
		}
	}

	handleClick = async () => {
		const {player} = this.props
		const teams = [];

		this.state.teams.map((team) => {
			teams.push({
				team_id: team.id,
				reason: '', // TODO: add reason if more than 1 team
				status: 'trial', // at this stage the status is always trial
			});
		});

		const formData = {
			teams
		};

		const response = await api.update(`/players/${player.player_id}/assign`, formData)

		if (!api.error(response)) {
			fn.navigate(`${url.player}/${player.player_id}/edit`)
		}
	}

	async removeAllTeam() {
		const { player } = this.props
		const response = await api.get(`/players/${this.props.player.player_id}/remove`)
		if(!api.error(response)){
			fn.navigate(`${url.player}/${player.player_id}/edit`)
		}
	}

	renderButtons() {
		const { teams } = this.state

		if(!_.isEmpty(teams)){
			return [
				<span key={`team`}
					  className="button"
					  onClick={() => this.handleClick()}>Update
				</span>
			];
		}else{
			return [
				<span
					className="button"
					onClick={() => this.removeAllTeam()}>Remove all
				</span>
				]
		}
	}

	getSelectedTeam(teams){
		let filterTeam = [];
		_.map(teams, (team) =>{
			filterTeam.push({
				agegroup_title: team.label,
				coach_id: null,
				coach_name: null,
				gender: null,
				id: team.team_id,
				max_size: 12,
				team_type: team.type,
				title: team.title
			})
		})

		return filterTeam;
	}

	suggestedSkillGroup = (player) => {

		let maxAge  = fn.diffDate(player.birthday)
		return [
			{
				id: 'all',
				title: 'Show all'
			},
			{
				id: `${maxAge+1}`,
				title: `Under ${maxAge+1}`
			}
		]
	}

	render() {
		const {
			player
		}
		= this.props;
		const { skillGroupList } = this.state;
		const selectedTeam = this.getSelectedTeam(player.teams);

		const suggestedSkillGroup = this.suggestedSkillGroup(player)

		return (
			<div id="content" className="site-content-inner component-skill-group">
				<PageTitle value="Skill group assignment" />
				<PageDescription short={true}>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.</PageDescription>

				<Form wide>
					<Meta label="Player" value={player.display_name} />
					<Meta label="Date of birth" value={`${fn.formatDate(player.birthday, 'DD MMM YYYY')} (${fn.diffDate(player.birthday)} years old)`} />
					<Meta label="Suggest age" value={`Under ${fn.diffDate(player.birthday)+1}`} />

					<FormSection title="Teams">
						<Radio
							name="ageGroup"
							label="Age group"
							value="all"
							options={suggestedSkillGroup}
							onChange={this.handleInputChange}
						/>

						<MultiSelect
							label={['', '']}
							name="teams"
							onChange={this.handleInputChange}
							options={skillGroupList}
							value={selectedTeam}
							wide
						/>

						<div className="form-actions">
							<Back className="button">Back</Back>

							{this.renderButtons()}
						</div>
					</FormSection>
				</Form>
			</div>
		);
	}

}
