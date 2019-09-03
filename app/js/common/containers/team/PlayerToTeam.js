import React from 'react';
import {Form, MultiSelect} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {fetchData} from 'app/actions';
import {url} from 'app/constants';
import {FormButton, PageDescription, PageTitle, Back} from 'app/components';
import FormSection from "../../components/FormSection";
import {AddPlayerToTeam} from "./index";

export default class PlayerToTeam extends React.PureComponent {

    constructor(props) {
        super(props);

        this.teamId = this.props.params.teamId;

        this.state = {
            unassignedList: [],
        };
    }

    componentWillMount = async () => {
        await this.fetchData()
    }

    fetchData = async () => {
        const {params} = this.props;
        const playerList = await api.get(`/dropdown/team-players?team_id=${params.teamId}`);

        // add trial rating to players on waiting list
        const unassignedList = playerList.data.map((player) => {
            return {
                ...player,
                title: <span>{player.title} ({player.team_name})</span>
            };
        });

        this.props.dispatch(fetchData({
            type: 'TEAM',
            url: `/teams/${params.teamId}`,
        }));

        this.setState({
            unassignedList
        });
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value})
    }

    handleSubmit = async () => {
        const players = [];

        // loop through trialist players and push to new players array
        this.state.players.map((player) => {
            if (!player.new) {
                return false;
            }
            players.push({
                player_id: player.id,
                session_id: player.session_id,
                status: 'assigned', // now the status changed from trial to trialist
            });
        });

        const formData = {
            players
        };

        const response = await api.update(`/teams/${this.teamId}/assign-players`, formData);

        if (!api.error(response)) {
            fn.navigate(url.team);
            fn.showAlert('Player has been added to team successfully!', 'success');
        } else {
            this.refForm && this.refForm.hideLoader();
        }
    }

    handleUpdateData = async () => {
        await this.fetchData()
    }

    render() {
        const {team} = this.props;
        const {unassignedList} = this.state;

        let assignPlayer = []
        _.map(team.players, (player) => {
            assignPlayer.push({
                id: player.value,
                title: `${player.display_name} (${team.title})`
            })
        })

        return (
            <div id="content" className="site-content-inner">
                <section className={"container"}>
                    <div className={"row small"}>
                        <PageTitle value={`${team.title} Players` || 'Team'}
                                   subHeading={team.agegroup}/>
                        <PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia
                            odio sem nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus
                            porttitor. Donec id elit non mi porta gravida at eget metus.</PageDescription>

                        <AddPlayerToTeam status={"assigned"}
                                         fetchData={this.handleUpdateData}
                                         {...this.props}/>
                    </div>
                </section>

                <Form loader
                      wide
                      onSubmit={this.handleSubmit}
                      ref={ref => this.refForm = ref}>
                    <FormSection>
                        <MultiSelect
                            clearable={false}
                            label={['Unassigned players from connected skill groups', 'Team players']}
                            name="players"
                            onChange={this.handleInputChange}
                            options={unassignedList}
                            value={assignPlayer}
                            wide
                        />

                        <div className={"form-actions"}>
                            <Back className={"button"}>Cancel</Back>
                            <FormButton label="Save"/>
                        </div>

                        <div className="form-actions">
                            <Back className="button" confirm>Back</Back>
                        </div>
                    </FormSection>
                </Form>
            </div>
        );
    }

}
