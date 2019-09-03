import React from 'react'
import {connect} from 'react-redux'
import {
    Checkbox,
    Dialog,
    FileUpload,
    Form,
    Select,
    TextInput
} from '@xanda/react-components'
import { fetchData } from 'app/actions'
import {
    api,
    fn
} from 'app/utils'
import {url} from 'app/constants'
import {
    Back,
    ConfirmDialog,
    FormButton,
    PageDescription,
    PageTitle
} from 'app/components';

@connect((store, ownProps) =>{
    return{
        club:store.myClub.data && store.myClub.data || null,
        clubSetup: store.clubSetup && store.clubSetup || null,
    }
})

export default class AcademySetup extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            selectedAgegroup: {},
            coachList: [],
            teamId: 1,
            teamGenderList: [
                {id: 'boy', title: 'Boys'},
                {id: 'girl', title: 'Girls'},
                {id: 'mixed', title: 'Mixed'},
            ],
            teamRankList: [],
            errorMessage: '',
            isGroupActive: false
        };

        this.refDialog = [];
        this.refDeleteDialog = [];
    }

    componentWillMount = async () => {
        const teamRankList = await api.get('/dropdown/team-ranks');
        const teamSponsorList = await api.get('/sponsors');
        const coachList = await api.get('/dropdown/coaches');

        this.setState({
            teamRankList: teamRankList.data,
            coachList: coachList.data
        })

        await this.fetchData()
    }

    fetchData = async () => {
        const {
            subComponent,
            club
        }
            = this.props

        // If sub component then we need top update our store, because HOC note called Wrapper.js
        if(subComponent){
            await this.props.dispatch(fetchData({
                type: 'CLUB',
                url: `/clubs/${club.club_id}`,
            }));

            await this.props.dispatch(fetchData({
                type: 'CLUBADMIN',
                url: `/clubs/${club.club_id}/admins`,
            }))

            await this.props.dispatch(fetchData({
                type: 'ASSESSMENT_TEMPLATE',
                url: `/assessments/templates`,
            }));
        }
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    deleteData = async (id) => {
        const response = await api.delete(`/teams/${id}`);

        if (!api.error(response)) {
            this.props.fetchData();
            fn.showAlert('Team has been deleted!', 'success');
        }
    }

    confirmTeamDeleteHandler = async (teamId) => {
        const deleteString = this.state.deleteText.toLowerCase();

        if (deleteString === 'delete') {
            const response = await api.delete(`/teams/${teamId}`);

            if (!api.error(response)) {
                this.props.fetchData();
                this.props.dispatch({
                    type: 'OPEN_SNACKBAR_MESSAGE',
                    option: {
                        message: `Team has been deleted!`,
                        color: 'dark'
                    }
                })

                this.refDeleteDialog.close();
            } else {
                const errorMessage = api.getErrorsHtml(response.data);
                this.setState({
                    errorMessage: errorMessage,
                    isGroupActive: true
                });
            }
        }
    }

    resetTeamDeleteHandler = () => {
        this.setState({
            errorMessage: '',
            isGroupActive: false
        });
    }

    getGenderImage = (team) => {
        switch (team.gender) {
            case 'boy':
                return <span className="gender"><i className="icon ion-male"></i></span>
                break;

            case 'girl':
                return <span className="gender"><i className="icon ion-female"></i></span>
                break;

            case 'mixed':
                return <span className="gender"><i className="icon ion-transgender"></i></span>
                break;
        }
    }

    handleSubmit = async (teamId = null) => {
        const {
            teamName,
            teamSize,
            teamRank,
            teamGender,
            coach,
            teamLogo
        } = this.state

        const {
            subComponent,
            club,
            params
        } = this.props

        // If sub component then load club_id from store
        const clubId = subComponent ? club.club_id : params.clubId

        const formData = new FormData()
        formData.append('agegroup_id', this.state.selectedAgegroup.agegroup_id)
        teamName && formData.append('title', teamName)
        formData.append('type', 'skill-group')
        teamSize && formData.append('max_size', teamSize)
        teamRank && formData.append('rank', teamRank)
        formData.append('club_id', clubId)
        teamGender && formData.append('gender', teamGender)
        coach && formData.append('coach_id', coach)
        teamLogo && formData.append('team_logo', teamLogo)

        const response = teamId ? await api.update(`/teams/${teamId}`, formData) : await api.post('/teams', formData)

        if (!api.error(response, false)) {

            if (teamId) {
                this.refDialog[teamId] && this.refDialog[teamId].close()
            } else {
                this.refTeamName && this.refTeamName.clear()
                this.refTeamRank && this.refTeamRank.clear()
                this.refTeamSize && this.refTeamSize.clear()
                this.refTeamCoach && this.refTeamCoach.clear()
                this.refTeamLogo && this.refTeamLogo.clear()
            }

            // If sub component then return response to programme component
            if(subComponent && !teamId){
                this.props.onAddTeam(response.data)
                return
            }

            this.props.fetchData()
        } else {
            const errorMessage = api.getErrorsHtml(response.data)
            this.setState({
                errorMessage: errorMessage,
                isGroupActive: true
            });
        }
    }

    //Using for sub component to close, currently using add programme component to create team
    handleCloseSubComponent = () =>{
        this.props.closeAddTeamComponent()
    }

    selectAgegroup = (agegroup) => {
        this.setState({selectedAgegroup: agegroup})
    }

    close = (teamId) => {
        this.refDialog[teamId] && this.refDialog[teamId].close()
    }

    renderAgegroups(agegroups) {
        const {club} = this.props

        if (!club.agegroups || club.agegroups.length === 0) {
            return null
        }

        const ageGroups = _.orderBy(club.agegroups, ['max_age'])

        const renderedAgegroups = ageGroups.map((agegroup) => {
            const teams = _.filter(this.props.clubSetup.skillGroups, {agegroup_id: agegroup.agegroup_id})
            const selectedClass = agegroup.agegroup_id === this.state.selectedAgegroup.agegroup_id ? 'is-selected' : ''
            const hasTeamClass = teams.length > 0 ? 'has-teams' : ''

            return (
                <div key={`agegroup${agegroup.agegroup_id}`}
                     className={`item-agegroup ${hasTeamClass} ${selectedClass}`}>
                    <div className="agegroup" onClick={() => this.selectAgegroup(agegroup)}>
                        <span>{agegroup.title}</span>
                        <div className="toggle"/>
                    </div>
                    <span className="teams">{teams.length} {teams.length === 1 ? 'Group' : 'Groups'}</span>
                </div>
            );
        });

        return (
            <div className="agegroup-selector-wrapper">
                <h4><span className={"text-primary"}>Step 1 : </span>Select an age group</h4>
                <div className="agegroup-selector">
                    {renderedAgegroups}
                </div>
            </div>
        );
    }

    renderTeams = () => {
        const {
            selectedAgegroup,
            teamRankList,
            teamGenderList,
            coachList
        } = this.state

        const {
            subComponent
        } = this.props

        if (!selectedAgegroup.agegroup_id) {
            return null;
        }

        this.setState({open: true})

        const teams = _.filter(this.props.clubSetup.skillGroups, {agegroup_id: selectedAgegroup.agegroup_id})
        const teamsOrdered = _.orderBy(teams, ['rank'], ['asc'])
        const teamLength = _.size(teams)

        return (
            <div className="club-team-wrapper">
                <div className="club-team-inner">
                    <Form onSubmit={this.handleSubmit}>
                        <div className="create-team">
                            <h4><span className={"text-primary"}>Step 2 : </span>Create an {selectedAgegroup.title} groups</h4>

                            <div className="form-inner">
                                <TextInput
                                    className="tooltips"
                                    placeholder="Name"
                                    label="Name"
                                    name="teamName"
                                    onChange={this.handleInputChange}
                                    ref={ref => this.refTeamName = ref}
                                    validation="required|min:3"
                                />
                                <Select
                                    className="tooltips"
                                    placeholder="Gender"
                                    label="Gender"
                                    name="teamGender"
                                    onChange={this.handleInputChange}
                                    options={teamGenderList}
                                    ref={ref => this.refTeamGender = ref}
                                    validation="required"
                                />
                                <TextInput
                                    className="tooltips"
                                    placeholder="Max no. of players"
                                    label="Max no. of players"
                                    name="teamSize"
                                    onChange={this.handleInputChange}
                                    ref={ref => this.refTeamSize = ref}
                                    validation="required|integer|min:1|max:100"
                                />
                                <Select
                                    className="tooltips"
                                    placeholder="Ability level"
                                    label="Ability Level"
                                    name="teamRank"
                                    onChange={this.handleInputChange}
                                    options={teamRankList}
                                    ref={ref => this.refTeamRank = ref}
                                    validation="required"
                                />

                                {/*<Select*/}
                                {/*    className="tooltips"*/}
                                {/*    placeholder="Coach"*/}
                                {/*    label="Coach"*/}
                                {/*    ref={ref => this.refTeamCoach = ref}*/}
                                {/*    name="coach"*/}
                                {/*    validation="required"*/}
                                {/*    onChange={this.handleInputChange}*/}
                                {/*    options={coachList}*/}
                                {/*/>*/}

                                <FileUpload
                                    className="tooltips"
                                    accept=".jpg,.jpeg,.png,.gif"
                                    label="Team logo"
                                    name="teamLogo"
                                    placeholder="Select team logo"
                                    onChange={this.handleInputChange}
                                />

                                <div className="form-actions">
                                    { subComponent && <a className="button"
                                                         onClick={this.handleCloseSubComponent}>Cancel</a>}
                                    <FormButton label="Create"/>
                                </div>
                            </div>
                        </div>
                    </Form>

                    {!subComponent ? <div className="assigned-teams">
                        <h4>Groups Created</h4>

                        {teamLength > 0 &&
                        <div className="team-wrapper mt-0">
                            {_.map(teamsOrdered, (team, index) => {
                                const editContent = (
                                    <Form>
                                        <div className="form-inner">
                                            <TextInput
                                                className="tooltips"
                                                label="Name"
                                                name="teamName"
                                                onChange={this.handleInputChange}
                                                validation="required|min:3"
                                                value={team.title}
                                                prepend={<i className="ion-person"/>}
                                            />
                                            <div className="form-input-line">
                                                <Select
                                                    className="tooltips"
                                                    label="Gender"
                                                    name="teamGender"
                                                    onChange={this.handleInputChange}
                                                    options={teamGenderList}
                                                    value={team.gender}
                                                    ref={ref => this.refTeamGender = ref}
                                                    validation="required"
                                                    prepend={<i className="ion-male"/>}
                                                />
                                                <TextInput
                                                    className="tooltips"
                                                    label="Number of spaces"
                                                    name="teamSize"
                                                    onChange={this.handleInputChange}
                                                    validation="required|integer|min:1|max:100"
                                                    value={team.max_size}
                                                    prepend={<i className="ion-checkmark-circled"/>}
                                                />
                                            </div>

                                            <Select
                                                className="tooltips"
                                                label="Ability Level"
                                                name="teamRank"
                                                onChange={this.handleInputChange}
                                                options={teamRankList}
                                                ref={ref => this.refTeamRank = ref}
                                                validation="required"
                                                value={team.rank}
                                                prepend={<i className="ion-stats-bars"/>}
                                            />

                                            <div className="upload-team-logo"
                                                 style={{width:'100%'}}>
                                                <FileUpload
                                                    ref={ref => this.refTeamLogo = ref}
                                                    className="tooltips"
                                                    accept=".jpg,.jpeg,.png,.gif"
                                                    label="Team logo"
                                                    name="teamLogo"
                                                    placeholder="Select team logo"
                                                    onChange={this.handleInputChange}
                                                    prepend={<i className="icon ion-android-upload"></i>}
                                                />
                                                <div className="team-logo">
                                                    {!_.isEmpty(team.logo_url) && team.logo_url && <div style={{backgroundImage:`url('${team.logo_url}')`}}></div> }
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                );

                                const deleteTeamConfirm = (
                                    <div className="confirm-delete-dialog-content">
                                        <TextInput
                                            className="text-danger"
                                            name="deleteText"
                                            onChange={this.handleInputChange}
                                            label="Type “DELETE” to confirm you wish to delete this team."/>
                                        {(this.state.isGroupActive ? this.state.errorMessage : '')}
                                    </div>
                                )

                                return (
                                    <div key={`team${team.title}-${index}`}
                                         className="team">
                                        <span
                                            className="title">{`${team.title} - ${this.state.teamRankList.find(rank => rank.id === team.rank).title}`}</span>
                                        <span className="players">{team.max_size} players</span>
                                        {this.getGenderImage(team)}

                                        <Dialog
                                            key={`team${team.title}-${index}`}
                                            showCloseButton={false}
                                            title=""
                                            content={
                                                <div className="dialog-body-inner direction-column">
                                                    <h3>Edit team</h3>
                                                    {editContent}
                                                </div>
                                            }
                                            buttons={[
                                                <button key="cancel"
                                                        className="button"
                                                        onClick={() => this.close(team.team_id)}>Cancel
                                                </button>,
                                                <button key="save"
                                                        className="button hover-blue"
                                                        onClick={() => this.handleSubmit(team.team_id)}>Save
                                                </button>
                                            ]}
                                            onClose={this.close}
                                            ref={ref => this.refDialog[team.team_id] = ref}>
                                            <span className="delete"><i className="ion-edit"/></span>
                                        </Dialog>

                                        <ConfirmDialog
                                            key={`team${team.title}`}
                                            showCloseButton={false}
                                            title=""
                                            body={
                                                <React.Fragment>
                                                    <h3>Are you sure you want to remove this team?</h3>
                                                    { deleteTeamConfirm }
                                                </React.Fragment>
                                            }
                                            close={false}
                                            onClose={this.resetTeamDeleteHandler}
                                            onConfirm={() => this.confirmTeamDeleteHandler(team.team_id)}
                                            ref={ref => this.refDeleteDialog = ref}>
                                            <span className="delete"><i className="ion-trash-b"/></span>
                                        </ConfirmDialog>
                                    </div>
                                );
                            })}
                        </div>
                        }

                        {teamLength === 0 && <span>There are no teams assigned to this age group.</span>}
                    </div> : null}
                </div>
            </div>
        )
    }

    render() {
        const {
            subComponent
        } =this.props

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Soccer school setup"/>
                <PageDescription>Select an age group from the table below then create the groups that you have in your
                    soccer school. You can edit or delete a group during the set up process or you can make changes
                    later on in the main system.</PageDescription>
                <div>
                    {this.renderAgegroups()}
                    {this.renderTeams()}

                    {
                        !subComponent ?
                            <div className="age-group-buttons">
                                <Back className="button">Back</Back>
                                <Back className="button">Complete</Back>
                            </div>
                        : (!this.state.open && <div><a className="button"
                        onClick={this.handleCloseSubComponent}>Cancel</a></div>)
                    }
                </div>
            </div>
        )
    }
}
