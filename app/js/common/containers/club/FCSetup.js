import React from 'react'
import {
    Checkbox,
    Dialog,
    Form,
    MultiSelect,
    Select,
    TextInput,
    FileUpload
} from '@xanda/react-components'
import {api, fn} from 'app/utils';
import { fetchData } from 'app/actions'
import {url} from 'app/constants'
import {Back, ConfirmDialog, FormButton, PageDescription, PageTitle} from 'app/components'
import {connect} from "react-redux"

@connect((store, ownProps) => {
    return {
        club: store.myClub.data && store.myClub.data || null,
        clubSetup: store.clubSetup && store.clubSetup || null,
    };
})

export default class FCSetup extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            selectedAgegroup: {},
            skillGroupList: [],
            teamSponsor: null,
            teamRankList: [],
            teamGenderList: [
                {id: 'boy', title: 'Boys'},
                {id: 'girl', title: 'Girls'},
                {id: 'mixed', title: 'Mixed'},
            ],
            teamSponsorList: [],
            teamId: 1,
            deleteTeamId: null,
        };

        this.refDialog = [];

        this.refDeleteDialog = [];
    }

    componentWillMount = async () => {
        const {
            subComponent,
            club
        } = this.props
        let clubId = null

        // If sub component then get clubId from store club
        if(subComponent){
            clubId = club.club_id
        }else{
            clubId = this.props.params.clubId
        }

        await this.fetchData()

        const skillGroupList = await api.get(`/clubs/${clubId}/teams?type=skill-group`);
        const teamRankList = await api.get('/dropdown/team-ranks');
        const teamSponsorList = await api.get('/sponsors');

        const newSponsor = {sponsor_id: 'add_sponsor', title: 'Add new sponsor'};
        let updateTeamSponsorList = [newSponsor];
        updateTeamSponsorList.push(...teamSponsorList.data.entities);

        // format skill groups
        const formattedskillGroupList = skillGroupList.data.map((skillGroup) => {
            return {
                ...skillGroup,
                title: `${skillGroup.agegroup_title} - ${skillGroup.title}`,
            };
        });
        this.setState({
            skillGroupList: formattedskillGroupList,
            teamRankList: teamRankList.data,
            teamSponsorList: updateTeamSponsorList,
        });
    }

    fetchData = async () => {
        const {
            subComponent,
            club
        }
        = this.props

        // If sub component then we need top update our store
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

    refreshSponsorList = async () => {
        const sponsors = await api.get('/sponsors');
        const newSponsor = {sponsor_id: 'add_sponsor', title: 'Add new sponsor'};
        let updateTeamSponsorList = [newSponsor];
        updateTeamSponsorList.push(...sponsors.data.entities);

        this.setState({
            teamSponsorList: updateTeamSponsorList,
        });
    }

    handleInputChange = (name, value) => {

        if (name === 'sponsor' && value === 'add_sponsor') {
            this.refSponsorDialog.open();
            return;
        }

        this.setState({[name]: value});
    }

    handleSponsorSubmit = async () => {
        const formData = new FormData();
        formData.append('title', this.state.sponsorName);
        formData.append('url', this.state.sponsorURL);
        formData.append('logo_url', this.state.sponsorUpload);
        const response = await api.post('/sponsors', formData);

        if (!api.error(response)) {
            this.props.fetchData();
            this.refSponsorDialog && this.refSponsorDialog.close();
            this.refreshSponsorList();
        }

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
        }
    }

    handleSubmit = async (teamId = null) => {
        const {
            subComponent,
            club,
            params
        } = this.props

        let clubId = null
        subComponent ? clubId = club.club_id : clubId = params.clubId

        const formData = new FormData();
        formData.append('agegroup_id', this.state.selectedAgegroup.agegroup_id);
        formData.append('title', this.state.teamName);
        formData.append('type', 'team');
        formData.append('max_size', this.state.teamSize);
        formData.append('rank', this.state.teamRank);
        formData.append('gender', this.state.teamGender);

        this.state.sponsor && formData.append('sponsor', this.state.sponsor);

        formData.append('club_id', clubId);
        this.state.assignedSkillGroups && this.state.assignedSkillGroups.map(skillGroup => formData.append('skill_groups[]', skillGroup.id));

        const response = teamId ? await api.update(`/teams/${teamId}`, formData) : await api.post('/teams', formData);

        if (!api.error(response)) {
            // If sub component then return response to programme component
            if(subComponent && !teamId){
                this.props.onAddTeam(response.data)
                return
            }

            if (teamId) {
                this.refDialog[teamId] && this.refDialog[teamId].close();
            } else {
                this.refTeamName && this.refTeamName.clear();
                this.refTeamRank && this.refTeamRank.clear();
                this.refTeamSize && this.refTeamSize.clear();
                this.refTeamGender && this.refTeamGender.clear();
                this.refSkillGroup && this.refSkillGroup.clear();
            }

            if(subComponent){
                this.fetchData()
            }else{
                this.props.fetchData();
            }
        }
    }

    //Using for sub component to close, currentlly it is using add programme component
    handleCloseSubComponent = () =>{
        this.props.closeAddTeamComponent()
    }

    deleteData = async (id) => {
        const response = await api.delete(`/teams/${id}`);

        if (!api.error(response)) {
            this.props.fetchData();
        }
    }

    confirmTeamDeleteHandler = async (teamId) => {
        const deleteString = this.state.deleteText.toLowerCase();

        if (deleteString === 'delete') {
            const response = await api.delete(`/teams/${teamId}`);

            if (!api.error(response)) {
                this.props.fetchData();
            }

            this.refDeleteDialog[teamId].close();
        }
    }

    closeConfirmTeamDelete = (teamId) => {
        this.refDeleteDialog[teamId] && this.refDeleteDialog[teamId].close()
    }

    handleCloseTeamDialog = (teamId) => {
        this.refDialog[teamId] && this.refDialog[teamId].close();
    }

    handleSponsorCloseDialog = () => {
        this.refSponsorDialog.close();
    }

    selectAgegroup = (agegroup) => {
        this.setState({selectedAgegroup: agegroup});
    }

    renderAgegroups() {
        const {club} = this.props;

        if (!club.agegroups || club.agegroups.length === 0) {
            return null;
        }

        const ageGroups = _.orderBy(club.agegroups, ['max_age']);

        const renderedAgegroups = ageGroups.map((agegroup) => {
            const teams = _.filter(this.props.clubSetup.teams, {agegroup_id: agegroup.agegroup_id});
            const selectedClass = agegroup.agegroup_id === this.state.selectedAgegroup.agegroup_id ? 'is-selected' : '';
            const hasTeamClass = teams.length > 0 ? 'has-teams' : '';

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
            skillGroupList,
            teamGenderList,
            teamRankList,
            teamSponsorList,
        } = this.state;
        const {
            subComponent
        } = this.props

        if (!selectedAgegroup.agegroup_id) {
            return null;
        }
        const addSponsorForm = (
            <Form>
                <div className="form-inner">
                    <TextInput
                        autoComplete="off"
                        className="tooltips"
                        label="Sponsor Name"
                        placeholder="Sponsor Name"
                        name="sponsorName"
                        onChange={this.handleInputChange}
                        validation="required|min:3"
                        wide
                    />
                    <TextInput
                        autoComplete="off"
                        className="tooltips"
                        label="Sponsor URL"
                        placeholder="Sponsor Website URL"
                        name="sponsorURL"
                        onChange={this.handleInputChange}
                        validation="required|min:7"
                        wide
                    />
                    <FileUpload
                        className="tooltips"
                        accept=".jpg,.jpeg,.png,.gif"
                        label="Sponsor Logo"
                        name="sponsorUpload"
                        placeholder="Select File"
                        onChange={this.handleInputChange}
                        wid
                    />
                </div>
            </Form>
        );
        const teams = _.filter(this.props.clubSetup.teams, {agegroup_id: selectedAgegroup.agegroup_id});
        const teamLength = _.size(teams);
        const teamsOrdered = _.orderBy(teams, ['rank'], ['asc']);
        const availableSkillGroups = _.filter(skillGroupList, skillGroup => selectedAgegroup.max_age >= skillGroup.max_age);

        this.setState({open: true})

        return (
            <div className="club-team-wrapper">
                <h4><span className={"text-primary"}>Step 2 : </span>Create an {selectedAgegroup.title} teams</h4>

                <div className="club-team-inner sponsor-container">
                    <Form onSubmit={this.handleSubmit}>
                        <div className="create-team">
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
                                    placeholder="Max spaces"
                                    label="Max spaces"
                                    name="teamSize"
                                    onChange={this.handleInputChange}
                                    ref={ref => this.refTeamSize = ref}
                                    validation="required|integer|min:1|max:100"
                                />
                                <Select
                                    className="tooltips"
                                    placeholder="Ability Level"
                                    label="Ability Level"
                                    name="teamRank"
                                    onChange={this.handleInputChange}
                                    options={teamRankList}
                                    ref={ref => this.refTeamRank = ref}
                                    validation="required"
                                />
                                <div>
                                    <br/>
                                    <h3>LINK SOCCER SCHOOL GROUPS WITH FOOTBALL TEAMS</h3>
                                    <p>If you run a soccer school and your soccer school groups are also football teams
                                        in your football club you can link the two below.</p>
                                    <br/>
                                    {this.props.club.type === 'both' &&
                                    <MultiSelect
                                        label={['Available skill groups', 'Connected skill groups']}
                                        name="assignedSkillGroups"
                                        onChange={this.handleInputChange}
                                        options={availableSkillGroups}
                                        ref={ref => this.refSkillGroup = ref}
                                        wide
                                    />
                                    }
                                    <Select
                                        className="tooltips"
                                        placeholder="Sponsor..."
                                        label="Sponsor"
                                        name="sponsor"
                                        onChange={this.handleInputChange}
                                        options={teamSponsorList}
                                        ref={ref => this.refTeamSponsor = ref}
                                        valueKey="sponsor_id"
                                    />
                                    <div className="form-actions">
                                        { subComponent && <a className="button" 
                                                             onClick={this.handleCloseSubComponent}>Cancel</a>}
                                        <FormButton label="Create"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>

                    {!subComponent ? <div className="assigned-teams">
                        <h3>Teams Created</h3>

                        {teamLength > 0 &&
                        <div className="team-wrapper mt-0">
                            {_.map(teamsOrdered, (team) => {
                                const teamSponsor = team.sponsors.length > 0 ? team.sponsors[0].sponsor_id : '';

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
                                                    label="Max spaces"
                                                    name="teamSize"
                                                    onChange={this.handleInputChange}
                                                    validation="required|integer|min:1|max:100"
                                                    value={team.max_size}
                                                    prepend={<i className="ion-checkmark-circled"/>}
                                                    wide
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
                                                wide
                                            />
                                            {this.props.club.type === 'both' &&
                                            <MultiSelect
                                                className="tooltips"
                                                label={['Available soccer school groups', 'Connected soccer school groups']}
                                                name="assignedSkillGroups"
                                                onChange={this.handleInputChange}
                                                options={availableSkillGroups}
                                                value={team.skillgroups}
                                                wide
                                            />
                                            }

                                            <Select
                                                className="tooltips"
                                                skipInitialOnChangeCall
                                                label="Sponsor"
                                                name="sponsor"
                                                onChange={this.handleInputChange}
                                                options={teamSponsorList}
                                                ref={ref => this.refTeamSponsor = ref}
                                                valueKey="sponsor_id"
                                                value={teamSponsor}
                                            />
                                        </div>
                                    </Form>
                                );

                                const deleteTeamConfirm = (
                                    <div className="confirm-delete-dialog-content">
                                        <TextInput
                                            className="text-danger"
                                            name="deleteText"
                                            onChange={this.handleInputChange}
                                            label="Type “DELETE” to confirm the cancellation of this package."/>
                                    </div>
                                )

                                return (
                                    <div key={`team${team.team_id || team.id}`} className="team">
                                        {_.map(team.sponsors, (sponsor) => {
                                            return (
                                                <div key={sponsor.sponsor_id} className="sponsor"
                                                     style={{backgroundImage: `url('${sponsor.logo_url}')`}}></div>
                                            )
                                        })}
                                        <span
                                            className="title">{`${team.title} - ${this.state.teamRankList.find(rank => rank.id === team.rank).title}`}</span>
                                        <span className="players">{team.max_size} players</span>

                                        {this.getGenderImage(team)}

                                        <Dialog
                                            showCloseButton={false}
                                            title=""
                                            content={
                                                <div className="dialog-body-inner direction-column">
                                                    <div className="header">
                                                        <h3>Edit team</h3>
                                                    </div>
                                                    {editContent}
                                                </div>
                                            }
                                            buttons={[
                                                <button
                                                    className="button"
                                                    onClick={() => this.handleCloseTeamDialog(team.team_id)}>
                                                    Cancel
                                                </button>,

                                                <button
                                                    className="button hover-blue"
                                                    onClick={() => this.handleSubmit(team.team_id)}
                                                >Save</button>
                                            ]}
                                            ref={ref => this.refDialog[team.team_id] = ref}>
												<span className="delete">
													<i className="ion-edit"/>
												</span>
                                        </Dialog>

                                        <Dialog
                                            showCloseButton={false}
                                            title=""
                                            content={
                                                <div className="dialog-body-inner">
                                                    <div className={"dialog-left-sidebar"}>
                                                        <img src={'/images/ball-soccer.png'}/>
                                                    </div>
                                                    <div className={"dialog-right-side"}>
                                                        <h3>Are you sure you want to remove this team?</h3>
                                                        {deleteTeamConfirm}
                                                    </div>
                                                </div>
                                            }
                                            buttons={[
                                                <button className="button"
                                                        onClick={() => this.closeConfirmTeamDelete(team.team_id)}>Cancel
                                                </button>,

                                                <button className="button hover-blue"
                                                        onClick={() => this.confirmTeamDeleteHandler(team.team_id)}>Confirm
                                                </button>
                                            ]}
                                            ref={ref => this.refDeleteDialog[team.team_id] = ref}>
                                            <span className="delete"><i className="ion-trash-b"/></span>
                                        </Dialog>
                                    </div>
                                );
                            })}
                        </div>
                        }

                        {teamLength === 0 && <span>There are no teams assigned to this age group.</span>}
                    </div>: null}


                    <Dialog
                        showCloseButton={false}
                        title=""
                        content={
                            <div className="dialog-body-inner direction-column">
                                <h3>Add Sponsor</h3>
                                {addSponsorForm}
                            </div>

                        }
                        buttons={[
                            <button className="button"
                                    onClick={this.handleSponsorCloseDialog}>
                                Cancel
                            </button>,

                            <button className="button hover-blue"
                                    onClick={this.handleSponsorSubmit}>
                                Add Sponsor
                            </button>
                        ]}
                        name="sponsorDialog"
                        className="add_sponsor"
                        ref={ref => this.refSponsorDialog = ref}>
                        <button className="button-standard add-sponsor hidden">
                            Add Sponsor <i className="ion-plus"></i>
                        </button>
                    </Dialog>
                </div>
            </div>
        );
    }

    render() {
        const {
            subComponent
        } = this.props

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Football Club setup"/>
                <PageDescription>Select an age group from the table below then create the teams that you have in your
                    football club. You can edit or delete a team during the set up process or you can make changes later
                    on in the main system.</PageDescription>
                <div>
                    {this.renderAgegroups()}

                    {this.renderTeams()}

                    {!subComponent ?
                        <div className="age-group-buttons">
                            <Back className="button">Back</Back>
                            <Back className="button">Complete</Back>
                        </div>
                        : (!this.state.open && <div><a className="button" 
                        onClick={this.handleCloseSubComponent}>Cancel</a></div>)}
                </div>
            </div>
        );
    }
}