import React from 'react'
import {Select, Tooltip, Dialog, Table} from "@xanda/react-components"
import {api, fn} from 'app/utils'
import {url} from 'app/constants'
import {ConfirmDialog} from "../../components"
import {AddPlayerToTeam} from "./index"

export default class PlayerAssignToTeam extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            trialList: [],
            triaListList: [],
            waitingList: [],
            assignedList: [],
            selectedTrialDate: '',
            trialDateList: [],
            programmes: [],
            selectedPlayer: {},
            selectedPlayerTeam: {},
            confirmDialog: false,
            acceptedProgramme: [],
        };
    }

    componentWillMount = async () => {
        this.fetchData();
    }

    async fetchData() {
        const {params} = this.props
        const teamId = params.teamId

        const playerList = await api.get(`/dropdown/team-players?team_id=${teamId}`)
        const trialDateList = await api.get(`/dropdown/trial-dates?team_id=${teamId}`)

        const programmes = [
            ...trialDateList.data
        ]

        // add trial rating to players on waiting list
        const waitingList = playerList.data.waiting.map((player) => {
            return {
                ...player,
                title:
                    <span>{player.title} (Trial Score {player.trial_rating}) ({fn.diffDate(player.date, 'days')} days)</span>,
            };
        });

        // add trial date to players on trailist list
        const triaListList = playerList.data.trialist.map((player) => {
            return {
                ...player
            }
        })

        this.setState({
            triaListList,
            waitingList,
            assignedList: playerList.data.assigned,
            trialList: playerList.data.trial,
            programmes: programmes
        });
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value})
    }

    handleProgrammeChange = (name, value) => {
        const trailDates = value && [...value.existing_sessions] || []
        this.setState({
            trialDateList: trailDates
        })
    }


    handleConfirmDialogClose = () => {
        this.setState({
            confirmDialog: false
        })
    }

    handleUpdateData = async () => {
        this.fetchData()
    }

    onOpenDialog = (list) => {
        this.setState({
            selectedPlayer: {...list}
        })
        this.refConfirmDialog.refDialog.open()
    }

    confirm = async () => {
        const {selectedTrialDate, selectedPlayer} = this.state
        const {params} = this.props
        const teamId = params.teamId

        // return if trial date is not selected
        if (!selectedTrialDate.id) {
            return false
        }

        this.setState({trialDateConfirmation: null})

        // get the first option of array
        const firstOption = {...selectedPlayer}

        // merge the title and the date as a new title
        const optionValue = {
            title: <span>{`${firstOption.title} (${selectedTrialDate.title})`}</span>,
            session_id: selectedTrialDate.id
        };

        // const newOption = _.merge({}, firstOption, optionValue);
        const newOption = {
            ...selectedPlayer,
            date: selectedTrialDate.title,
            session_id: selectedTrialDate.id,
            player_id: selectedPlayer.id,
            status: 'trialist'
        }

        let players = []
        players.push(newOption)

        const formData = {
            players
        }

        this.setState({selectedPlayer: {}})
        const response = await api.update(`/teams/${teamId}/assign-players`, formData)

        if (!api.error(response)) {
            this.fetchData()
        }
    }

    cancel = () => {
        this.setState({
            trialDateConfirmation: null, selectedPlayer: {}
        })
    }

    handleStatusChange = async (relTeamPlayer, status) => {
        const {params} = this.props
        const teamId = params.teamId

        // Check status, if current status is 'assigned' and changing status with waiting then do alert
        if (relTeamPlayer.status === "assigned") {
            let updateUrl = `${url.player}/${relTeamPlayer.id}/check_sessions?team_id=${teamId}`
            const response = await api.get(updateUrl)

            //  Check is any session exists
            if (!_.isEmpty(response.data)) {
                this.setState({
                    confirmDialog: true,
                    acceptedProgramme: [...response.data],
                    selectedPlayerTeam: relTeamPlayer
                })
                return
            }
        }

        let formData = {
            ...relTeamPlayer,
            status: status
        }

        const response = await api.update('teams/update-status', formData)
        if (!api.error(response)) {
            this.fetchData()
        }
    }

    handleGotoParent = () => {
        const {acceptedProgramme} = this.state
        const redirectUrl = `${url.guardian}/${acceptedProgramme[0].user_id}`
        fn.navigate(redirectUrl)
    }

    handleRemovePlayerFromTeam = async () => {
        const {params} = this.props
        const teamId = params.teamId
        const {selectedPlayerTeam} = this.state
        const postUrl = `${url.player}/${selectedPlayerTeam.id}/remove_sessions_programmes?team_id=${teamId}`

        const response = await api.get(postUrl)

        if (!api.error(response)) {
            this.setState({
                confirmDialog: false
            })
            this.fetchData()
        }
    }

    renderBody = () => {
        const {acceptedProgramme} = this.state
        return (
            <div>
                The Parent has already accepted programme fees associated with this skill group / team. If you would
                like to issue a full or partial credit on account of these fees you can do so from the Parent Stement
                page by clicking Add Transaction.
                <button key={'gotoparent'}
                        className="button mt-20"
                        onClick={this.handleGotoParent}>Go to Parent Statement Page now
                </button>

                <Table className="table dialog-table mt-30"
                       headers={[
                           'Accepted Programme',
                           'Accepted Team'
                       ]}>
                    {_.map(acceptedProgramme, (programme, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    {programme.programme_title}
                                </td>
                                <td>
                                    {programme.team_title}
                                </td>
                            </tr>
                        )
                    })}
                </Table>

                <button key={'gotoparent'}
                        className="button"
                        onClick={this.handleRemovePlayerFromTeam}>Acknowledge
                </button>

            </div>
        )
    }

    render() {
        const {team} = this.props
        const {
            trialList,
            trialDateList,
            triaListList,
            waitingList,
            assignedList,
            programmes,
            confirmDialog
        } = this.state

        return (
            <div className="player-assign-to-team">

                <AddPlayerToTeam fetchData={this.handleUpdateData} {...this.props}/>

                <div className="awaiting-trialists">
                    <div className="trial-content">
                        <h4>Awaiting Trial</h4>
                        <ul>
                            {_.map(trialList, (list, index) => {
                                return (
                                    <li key={index}>
                                        <div className={"player-content-title"}>
                                            {list.title}
                                        </div>

                                        <div className={"player-content-actions"}>
                                            <button onClick={() => this.onOpenDialog(list)}>
                                                <Tooltip
                                                    icon={<i className="icon ion-ios-play"></i>}
                                                    message="Proceed to trialists"
                                                />
                                            </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="trial-content trial-list-list">
                        <h4>Trialists</h4>
                        <ul>
                            {_.map(triaListList, (list, index) => {
                                return (
                                    <li key={index}>
                                        <div className={"player-content-title"}>
                                            {list.title}({fn.formatDate(list.trial_date)})
                                        </div>

                                        <div className={"player-content-actions"}>
                                            <button onClick={() => this.handleStatusChange(list, 'trial')}>
                                                <Tooltip
                                                    icon={<i className="icon ion-arrow-left-b"></i>}
                                                    message="Assign to trial"
                                                />
                                            </button>

                                            {list.session_status === 0 ?

                                                <Tooltip
                                                    icon={<i className="icon ion-ios-personadd"></i>}
                                                    message="Waiting for parent approval."
                                                />
                                                :
                                                <Tooltip
                                                    icon={<i className="icon ion-checkmark"></i>}
                                                    message="Parent approved."
                                                />
                                            }

                                            <button onClick={() => this.handleStatusChange(list, 'waiting')}>
                                                <Tooltip
                                                    icon={<i className="icon ion-ios-play"></i>}
                                                    message="Proceed to waiting list"
                                                />
                                            </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>

                <div className="awaiting-trialists">
                    <div className="trial-content trial-list-list">
                        <h4>Waiting List</h4>
                        <ul>
                            {_.map(waitingList, (list, index) => {
                                return (
                                    <li key={index}>
                                        <div className={"player-content-title"}>
                                            {list.title}({fn.formatDate(list.trial_date)})
                                        </div>

                                        <div className={"player-content-actions"}>
                                            <button onClick={() => this.handleStatusChange(list, 'trialist')}>
                                                <Tooltip
                                                    icon={<i className="icon ion-arrow-left-b"></i>}
                                                    message="Assign to trialist"
                                                />
                                            </button>

                                            <button onClick={() => this.handleStatusChange(list, 'assigned')}>
                                                <Tooltip
                                                    icon={<i className="icon ion-ios-play"></i>}
                                                    message="Assign to team"
                                                />
                                            </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="trial-content trial-list-list">
                        <h4>Currently Assigned</h4>
                        <ul>
                            {_.map(assignedList, (list, index) => {

                                return (
                                    <li key={index}>
                                        <div className={"player-content-title"}>
                                            {list.title}
                                        </div>

                                        <div className={"player-content-actions"}>
                                            <button onClick={() => this.handleStatusChange(list, 'waiting')}>
                                                <Tooltip
                                                    icon={<i className="icon ion-arrow-left-b"></i>}
                                                    message="Assign to waiting list"
                                                />
                                            </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>

                <ConfirmDialog
                    ref={ref => this.refConfirmDialog = ref}
                    title=""
                    body={
                        <React.Fragment>
                            <h3>Choose a programme & trial date</h3>
                            <Select wide
                                    className="mb-30"
                                    placeholder="Select a programme"
                                    name="selectedProgramme"
                                    options={programmes}
                                    returnFields="all"
                                    validation="required"
                                    onChange={this.handleProgrammeChange}
                            />

                            <Select wide
                                    placeholder="Select a trial date"
                                    name="selectedTrialDate"
                                    options={trialDateList}
                                    returnFields="all"
                                    validation="required"
                                    onChange={this.handleInputChange}
                            />
                        </React.Fragment>
                    }
                    onClose={this.cancel}
                    onConfirm={this.confirm}>
                    <button className="hidden">On add</button>
                </ConfirmDialog>

                {
                    confirmDialog && <Dialog
                        showCloseButton={false}
                        onClose={this.handleConfirmDialogClose}
                        title="Please note!"
                        content={this.renderBody()}
                    >
                    </Dialog>
                }
            </div>
        )
    }
}