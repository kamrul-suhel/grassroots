import React from 'react';
import { connect } from 'react-redux';
import { DatePicker, ContentLoader, Select, Slider, Table, TextInput, Tooltip } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Article, Meta, PageTitle } from 'app/components';
import Back from "../../components/Back";

@connect((store, ownProps) => {
	return {
		collection: store.player,
		player: store.player.collection[ownProps.params.playerId] || {},
	};
})
export default class AllAssessment extends React.PureComponent {

	constructor(props) {
		super(props);

		this.playerId = this.props.params.playerId;

		this.state = {
			gradeList: _.map(_.rangeRight(1, 11), (num) => { return { id: num, title: num }; }),
			skillList: [],
			addingNew: false,
			teams: [],
		};
	}

	componentWillMount = async () => {
		this.props.dispatch({ type: 'PLAYER_CLEAR' });
		await this.props.dispatch(fetchData({
			type: 'PLAYER',
			url: `/players/${this.playerId}`,
		}));

		const firstTeamId = this.props.player.teams[0] ? this.props.player.teams[0].team_id : 0;
		this.setState({
			teams: this.props.player.teams,
			selectedTeamId: firstTeamId,
		})

		if(firstTeamId !== 0){
            this.props.dispatch(fetchData({
                type: 'PLAYER',
                url: `/players/${this.playerId}/skill-assessments?team_id=${firstTeamId}`,
            }));
		}
		
		const skillList = await api.get('/skills');
		this.setState({
			skillList: skillList.data.entities,
		});
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
		console.log(name, value)
		if (name === 'selectedTeamId' && value) this.handleTeamChange();
	}

	handleTeamChange = (waste, value) => {
		if (value == null) return;

		this.setState({ selectedTeamId: value });
		this.props.dispatch(fetchData({
			type: 'PLAYER',
			url: `/players/${this.playerId}/skill-assessments?team_id=${value}`,
		}));
	}

	handleSubmit = async () => {
		const skills = [];

		_.map(this.state, (value, key) => {
			if (key.indexOf('skill_') === -1) {
				return false;
			}

			return skills.push({
				skill_id: key.replace('skill_', ''),
				grade: value,
			});
		});

		const formData = {
			skills,
			date: this.state.date,
			note: this.state.note,
			player_id: this.playerId,
			team_id: this.teamId,
		};

		const response = await api.post('/skill-assessments', formData);

		if (!api.error(response)) {
			fn.navigate(url.skillAssessment);
			fn.showAlert('Player has been assessed successfully!', 'success');
		}
	}

	renderTable = () => {
		const { gradeList, skillList, teams } = this.state;
		const { player } = this.props;
		const header = [''
		];
		let datePushedToHeader = false;
		let skillCategory;
		let cachedEmptyTds = [];
		let cachedNotes = [];

		const content = skillList.map((skill) => {
			let skillCategoryHeading = null;
			const emptyTds = [];
			const notes = [];

			const dates = _.map(player.assessment_dates, (skills, date) => {
				if (!datePushedToHeader) {
					header.push(fn.formatDate(date, 'Do MMMM'));
				}

				if (cachedEmptyTds.length === 0) {
					emptyTds.push(<td key={`skillAssessmentTd${date}${skill.skill_id}`} />);
				}

				if (cachedNotes.length === 0) {
					notes.push(<td key={`skillAssessment${date}Note`}><Tooltip icon={<i className="ion-chatbox-working" />} message={skills.note && skills.note.note} /></td>);
				}

				if (skills[skill.skill_id]) {
					return <td key={`skillAssessment${date}${skill.skill_id}`}>{skills[skill.skill_id].grade}</td>;
				} else {
					return <td />
				}

				return null;
			});

			if (cachedEmptyTds.length === 0) {
				cachedEmptyTds = emptyTds;
			}

			if (cachedNotes.length === 0) {
				cachedNotes = notes;
			}

			// render the skill header if it is the first occurrence
			if (skillCategory !== skill.category) {
				skillCategory = skill.category;
				skillCategoryHeading = (
					<tr className="header-row" key={`skillcategory${skill.skill_id}`}>
						<th data-th={skill.category}>{skill.category}</th>
						{/* <td /> */}
						{cachedEmptyTds}
					</tr>
				);
			}

			datePushedToHeader = true;

			return [
				skillCategoryHeading,
				<tr key={`skill_${skill.skill_id}`}>
					<th data-th={skill.title}>{skill.title}</th>

					{this.state.addingNew &&	<td>
						<Slider wide name={`skill_${skill.skill_id}`} min={1} max={10} value={1} onChange={this.handleInputChange}>
							<div className="">{this.state[`skill_${skill.skill_id}`]}</div>
						</Slider>
					</td>}
					{dates}
				</tr>,
			];
		});

		content.push(
			<tr key="note" className="header-row row-note">
				<th data-th="Note">Note</th>
				{this.state.addingNew && <td className="td-note"><TextInput textarea wide name="note" placeholder="Enter note here" onChange={this.handleInputChange} /></td>}
				{cachedNotes}
			</tr>
		);

		return {
			header,
			content,
		};
	}

	render() {
		const {
			collection,
			player,
		} = this.props;
		const table = this.renderTable();

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Skill assessment" />

				{this.state.selectedTeamId === 0 ? <p>You do not have any team please assign team first.</p> :
					<React.Fragment>
                        <Select
                            label='Select Team'
                            name='selectedTeamId'
                            value={this.state.selectedTeamId}
                            onChange={this.handleTeamChange}
                            options={this.state.teams.map( team => ({id: team.team_id, title: team.title}))}
                        />
                        <ContentLoader
                            className="player-skill-assessment"
                            data={player.player_id}
                            forceRefresh
                            isLoading={collection.isLoading}
                            notFound="No players"
                        >
                            <Table headers={table.header} freezeHeaderColumn>
                                {table.content}
                                <tr>
                                    <th />
                                    {this.state.addingNew && <td className="td-submit">
										<span className="button"
											  onClick={this.handleSubmit}>Save</span>
                                    </td>}
                                </tr>
                            </Table>
                        </ContentLoader>
					</React.Fragment>
				}

				<div className="footer-actions">
					<Back className="button">Back</Back>
				</div>
			</div>
		);
	}

}
