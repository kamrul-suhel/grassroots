import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Form, Select, Table, TextInput} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {Block, ButtonStandard, Link, Meta, PageTitle, FormButton, ConfirmDialog} from 'app/components';

@connect((store, ownProps) => {
    return {
        collection: store.player,
        player: store.player.collection[ownProps.params.playerId] || {},
        skills: store.skill,
    };
})
export default class View extends React.PureComponent {

    constructor(props) {
        super(props);

        this.playerId = this.props.params.playerId;

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
            type: 'PLAYER',
            url: `/players/${this.playerId}`,
        }));
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value})
    }

    saveSize = async (kit) => {
        const size = this.state[`size${kit.id}`]

        if (!size) {
            return false
        }

        const formData = {
            size
        };

        const response = await api.update(`/kit_users/${kit.id}`, formData)

        if (!api.error(response)) {
            fn.showAlert('Size has been selected!', 'success');
            this.fetchData()
        }
    }

    saveStatus = async (kitItem) => {
        const id = kitItem.id;
        const status = kitItem.status === 1 ? 0 : 1;
        const formData = {
            type: 'status',
            status: status
        };

        const response = await api.update(`/kit_users/${id}`, formData)

        if (!api.error(response)) {
            this.fetchData()
        }
    }

    renderKitSize = (kit) => {
        let size = kit.size

        if (!kit.size) {
            let saveButton = null

            // check if size is set for that id
            if (this.state[`size${kit.id}`]) {
                saveButton = <span key="saveSize"
                                   className="button"
                                   onClick={() => this.saveSize(kit)}>
                                <img className="icon-save" src={"/images/icon/save.png"}/>
                            </span>
            }

            size = (
                <div className="flex">
                    <Select name={`size${kit.id}`}
                            valueKey="value"
                            options={kit.kit && kit.kit.available_sizes}
                            onChange={this.handleInputChange}/>{saveButton}
                </div>
            );
        }

        return <td className="kit-size-select">{size}</td>
    }

    handleSubmitPlayerNote = async () => {
        const {playerNotes} = this.state
        const {player} = this.props

        let formData = new FormData()
        playerNotes && formData.append('note', playerNotes)
        const response = await api.update(`${url.player}/${player.player_id}/notes`, formData)
        this.refNoteForm.hideLoader()
        if (!api.error(response)) {
            this.fetchData()

            if (!this.props.skills.fetched) {
                this.props.dispatch(fetchData({
                    type: 'SKILL',
                    url: '/skills',
                }));
            }
        }
    }

    /**
     *
     * Remove kit item from player base on rel_kit_user.id
     *
     */
    handleDeleteKitItem = async (relKitUser) => {
        const deleteUrl = `kit_users/${relKitUser.id}`

        const response = await api.delete(deleteUrl)
        if (!api.error(response)) {
            this.fetchData()
        }
    }

    renderPlayerStatus = (team) => {
        switch (team.player_status) {
            case 'trial':
                return 'Awaiting Trial'

            case 'trialist':
                return 'Trialists'

            case 'waiting':
                return 'Waiting List'

            case 'assigned':
                return 'Currently Assigned'

            default:
                return ''
        }
    }

    render() {
        const {
            collection,
            player,
            skills,
        } = this.props;

        console.log("skills: ", skills);
        console.log("player: ",player)

        const sessionDates = _(player.sessions).map('start_time').value();
        const {sessionsOnDate} = this.state;
        const billingGuardian = _.find(player.guardians, guardian => guardian.user_id === player.billing_guardian) || {};
        const livingGuardian = _.find(player.guardians, guardian => guardian.user_id === player.living_guardian) || {};
        return (
            <div id="content" className="site-content-inner">
                <ContentLoader
                    data={player.player_id}
                    forceRefresh
                    isLoading={collection.isLoading}
                    notFound="No Data"
                >
                    {/* Teams & skill groups section */}
                    <Block title="Teams & Skill groups">
                        {fn.isAdmin() &&
                        <ButtonStandard to={`${url.player}/${this.playerId}/skill-group`}
                                        icon={<i className="ion-ios-people"/>}
                                        className="mb-30">Assign to skill group
                        </ButtonStandard>
                        }

                        {'teams' in player && player.teams.length > 0 ? (
                            <div className="grid">
                                {player.teams.map((team, teamIndex) => {
                                    const teamSkills = player.skills && player.skills[team.team_id] ? player.skills[team.team_id] : {};
                                    const teamLogoUrlClass = _.isEmpty(team.logo_url) ? ' no-badge' : ''

                                    return (
                                        <div className={`grid-xs-12 grid-m-4`}
                                             key={`team_${team.team_id}`}>
                                            <div className="grid-inner">
                                                <div className={`player-skill-wrapper${teamLogoUrlClass}`}>
                                                    <div className="player-team">
														<span className="icon-legend team-badge"
                                                              style={{backgroundImage: `url(${team.logo_url})`}}/>
                                                        {fn.isAdmin() ?
                                                            <React.Fragment>
                                                                <div className={"player-team-title"}>
                                                                    <Link to={`${url.team}/${team.team_id}/players`}>
                                                                        <h5 className="team-name text-primary">
                                                                            {team.type === 'skill-group' ? 'Soccer school: ' : 'Football club: '}
                                                                            {team.title}
                                                                            <i className="icon ion-edit"></i>
                                                                        </h5>
                                                                    </Link>

                                                                    <div>
                                                                        <div>Status: {this.renderPlayerStatus(team)}</div>
                                                                        <div>Age group: {team.agegroup_title}</div>
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                            :
                                                            <h5 className="team-name text-primary">{team.title}</h5>
                                                        }
                                                    </div>

                                                    {/* Skills here */}
                                                        <div className="player-skills">
                                                        {skills.currentCollection && _.map(skills.currentCollection, (skillId) => {
                                                            const skill = skills.collection[skillId];
                                                            const grade = teamSkills[skill.skill_id] ? teamSkills[skill.skill_id].grade : 0;
                                                            return (
                                                                grade > 0 && (<div className="player-skill"
                                                                key={`skill_${skill.skill_id}`}>
                                                               <span className="skill-name">
                                                                   {skill.title}
                                                                   {grade > 0 && <span
                                                                       className="grade">{Math.round(grade * 10) / 10}</span>}
                                                               </span>
                                                               <div className="skill-bar-wrapper">
                                                                   <div className="skill-bar"
                                                                        style={{width: `${grade * 10}%`}}/>
                                                               </div>
                                                           </div>)
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

                    {/* Timetable section */}
                    <Block title="Timetable">
                        {player.sessions && player.sessions.length > 0 ? (
                            <Table className="header-transparent"
                                   headers={['', 'Time', 'Venue', 'Programme']}
                                   icon="ion-clock">
                                {player.sessions.map(session => (
                                    <tr key={`sessions_${session.session_id}`}>
                                        <td><Link
                                            to={`${url.session}/${session.session_id}/player/${player.player_id}`}>{fn.formatDate(session.start_time)}</Link>
                                        </td>
                                        <td>{`${fn.formatDate(session.start_time, 'HH:mm')} - ${fn.formatDate(session.end_time, 'HH:mm')}`}</td>
                                        <td><Link
                                            to={`${url.session}/${session.session_id}/player/${player.player_id}`}>{session.address}</Link>
                                        </td>
                                        <td>{session.is_trial ? `${session.programme_name} - Trial` : session.programme_name}, {session.programme_type}</td>
                                    </tr>
                                ))}
                            </Table>
                        ) : (
                            <p>{player.display_name} has no sessions</p>
                        )}
                    </Block>

                    {/* Home works secion */}
                    <Block title="Homeworks">
                        {player.homeworks && player.homeworks.length > 0 ? (
                            <Table headers={['', 'Date', 'Coach']}>
                                {player.homeworks.map(homework => (
                                    <tr key={`homework_${homework.homework_id}`}>
                                        <td><Link to={`${url.homework}/${homework.homework_id}`}>{homework.title}</Link>
                                        </td>
                                        <td>{fn.formatDate(homework.homework_date)}</td>
                                        <td>{homework.coach_name}</td>
                                    </tr>
                                ))}
                            </Table>
                        ) : (
                            <p>{player.display_name} has no homeworks</p>
                        )}
                    </Block>

                    {/* Kit item section */}
                    <Block title="Kit items">
                        {
                            fn.isAdmin() &&
                            <ButtonStandard to={`${url.player}/${this.playerId}/kit-assignment`}
                                            className="mb-25"
                                            icon={<i className="ion-tshirt"/>}>Assign kit
                            </ButtonStandard>
                        }

                        {player.kits && player.kits.length > 0 ? (
                            <Table headers={['Name', 'Team', 'Type', 'Size', 'Given']}
                                   className="header-transparent table-kit-item"
                                   icon="ion-tshirt">
                                {player.kits.map(kit => {
                                        return <tr key={`kit_${kit.id}`}>
                                            <td className="td-large">
                                                <Link to={`${url.kit}/${kit.kit_id}`}>{kit.kit && kit.kit.title}</Link>
                                            </td>

                                            <td>
                                                {
                                                    kit.team && kit.team.title
                                                }
                                            </td>

                                            <td>{kit.kit && kit.kit.type && kit.kit.type.title}</td>
                                            {this.renderKitSize(kit)}
                                            <td className={"td-small"}>
                                                {kit.status === 1 ?
                                                    <button className={"button no-padding"} disabled>
                                                        <i className="icon ion-checkmark-round"></i>
                                                    </button>
                                                    :
                                                    <button className={"button no-padding"}
                                                            onClick={() => this.saveStatus(kit)}>
                                                        <i title="Not Assign" className="ion-android-expand"/>
                                                    </button>
                                                }

                                                {!kit.size && <ConfirmDialog
                                                    onlyContent={true}
                                                    body={<div>You want to delete this kit item.</div>}
                                                    onConfirm={() => this.handleDeleteKitItem(kit)}>
                                                    <button className="button">
                                                        <i className="ion ion-android-delete"></i>
                                                    </button>
                                                </ConfirmDialog>
                                                }

                                            </td>
                                        </tr>
                                    }
                                )
                                }
                            </Table>
                        ) : (
                            <p>{player.display_name} has no assigned kit items</p>
                        )}
                    </Block>
                    {fn.isAdmin() &&
                    <Block title="Player Consent">
                        {player.consents && player.consents.length > 0 ? (
                            <Table headers={['Type', 'Agreed by', 'Date']}>
                                {player.consents.map(consent => (
                                    <tr key={consent.consent_id}>
                                        <td>{consent.title}</td>
                                        <td>{consent.agreed_by}</td>
                                        <td>{fn.formatDate(consent.agreed_at, 'DD MMM YYYY')}</td>
                                    </tr>
                                ))}
                            </Table>
                        ) : (
                            <p>{player.display_name} has no consent</p>
                        )}
                    </Block>
                    }
                    {fn.isAdmin() &&
                    <Block title="Player Notes">
                        <Form
                            loader
                            wide
                            className="form-section"
                            onSubmit={this.handleSubmitPlayerNote}
                            ref={ref => this.refNoteForm = ref}
                        >
                            <TextInput
                                wide
                                textarea
                                name="playerNotes"
                                label="Notes"
                                value={player.note}
                                onChange={this.handleInputChange}
                            />
                            <div className="form-actions">
                                <FormButton label="Save Player Notes"/>
                            </div>
                        </Form>

                        {/*{player.notes && player.notes.length > 0 ? (*/}
                        {/*	<Table headers={['Note', 'Coach', 'Date']}>*/}

                        {/*		{player.notes.map(note => (*/}
                        {/*			<tr key={note.note_id}>*/}
                        {/*				<td>{note.note}</td>*/}
                        {/*				<td>{note.coach_name}</td>*/}
                        {/*				<td>{fn.formatDate(note.created_at, 'DD MMM YYYY')}</td>*/}
                        {/*			</tr>*/}
                        {/*		))}*/}
                        {/*	</Table>*/}
                        {/*) : (*/}
                        {/*	<p>{player.display_name} has no notes</p>*/}
                        {/*)}*/}
                    </Block>
                    }
                </ContentLoader>
            </div>
        );
    }

}
