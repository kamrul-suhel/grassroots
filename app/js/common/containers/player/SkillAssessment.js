import React from 'react';
import {connect} from 'react-redux';
import {DatePicker, ContentLoader, Slider, Table, TextInput, Tooltip} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {Article, Meta, PageTitle} from 'app/components';

@connect((store, ownProps) => {
    return {
        collection: store.player,
        player: store.player.collection[ownProps.params.playerId] || {},
    };
})
export default class SkillAssessment extends React.PureComponent {

    constructor(props) {
        super(props);

        this.playerId = this.props.params.playerId;
        this.teamId = this.props.location.state ? this.props.location.state.team_id : null;

        this.state = {
            gradeList: _.map(_.rangeRight(1, 11), (num) => {
                return {id: num, title: num};
            }),
            skillList: [],
            addingNew: false,
        };
    }

    componentWillMount = async () => {
        this.props.dispatch({type: 'PLAYER_CLEAR'});
        this.props.dispatch(fetchData({
            type: 'PLAYER',
            url: `/players/${this.playerId}/skill-assessments?team_id=${this.teamId}`
        }));

        const skillList = await api.get('/skills')
        this.setState({
            skillList: skillList.data.entities,
        });
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value})
    }

    handleSubmit = async () => {
        const skills = []
        _.map(this.state, (value, key) => {
            if (key.indexOf('skill_') === -1) {
                return false
            }
            return skills.push({
                skill_id: key.replace('skill_', ''),
                grade: value,
            })
        })

        const formData = {
            skills,
            date: this.state.date,
            note: this.state.note,
            player_id: this.playerId,
            team_id: this.teamId,
        };

        const response = await api.post('/skill-assessments', formData)
        if (!api.error(response)) {
            fn.navigate(url.skillAssessment);
            fn.showAlert('Player has been assessed successfully!', 'success')
        }
    }

    renderTable = () => {
        const {
            gradeList,
            skillList
        } = this.state;
        const {
            player
        } = this.props;

        const header = [''];

        if (this.state.addingNew)
            header.push(<DatePicker name="date"
                                    wide
                                    pastOnly
                                    dateFormat="Do MMMM"
                                    placeholder="Select date"
                                    onChange={this.handleInputChange}/>);
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
                    emptyTds.push(<td key={`skillAssessmentTd${date}${skill.skill_id}`}/>);
                }

                if (cachedNotes.length === 0) {
                    notes.push(<td key={`skillAssessment${date}Note`}><Tooltip
                        icon={<i className="ion-chatbox-working"/>} message={skills.note && skills.note.note}/></td>);
                }

                if (skills[skill.skill_id]) {
                    return <td key={`skillAssessment${date}${skill.skill_id}`}>{skills[skill.skill_id].grade}</td>;
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
                    <tr className="header-row">
                        <th data-th={skill.category}>{skill.category}</th>
                        {cachedEmptyTds}
                    </tr>
                );
            }

            datePushedToHeader = true;

            return [
                skillCategoryHeading,
                <tr key={`skill_${skill.skill_id}`}>
                    <th data-th={skill.title}>{skill.title}</th>

                    {this.state.addingNew && <td>
                        <Slider wide name={`skill_${skill.skill_id}`} min={1} max={10} value={1}
                                onChange={this.handleInputChange}>
                            <div className="">{this.state[`skill_${skill.skill_id}`]}</div>
                        </Slider>
                    </td>}
                    {dates}
                </tr>,
            ];
        });

        content.push(
            <tr key="note"
                className="header-row row-note">
                <th data-th="Note">Note</th>
                {this.state.addingNew &&
                <td className="td-note">
                    <TextInput textarea
                               wide
                               name="note"
                               placeholder="Enter note here"
                               onChange={this.handleInputChange}/>
                </td>}
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
                <PageTitle value="Skill assessment"/>

                {!this.state.addingNew ?
                    <span role="button"
                          className="button white"
                          onClick={() => this.setState({addingNew: true})}>Add New Assessment
                    </span> : ''
                }

                <ContentLoader
                    className="player-skill-assessment"
                    data={player.player_id}
                    forceRefresh
                    isLoading={collection.isLoading}
                    notFound="No players"
                >
                    <Table headers={table.header}
                           className="header-transparent"
                           freezeHeaderColumn>
                        {table.content}
                        <tr>
                            <th/>
                            {
                                this.state.addingNew &&
                                <td className="td-submit">
                                    <span className="button"
                                          onClick={this.handleSubmit}>Save
                                    </span>
                                </td>
                            }
                        </tr>
                    </Table>
                </ContentLoader>
            </div>
        );
    }

}
