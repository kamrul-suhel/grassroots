import React, {PureComponent} from 'react'
import {Select} from "@xanda/react-components"
import {fn, api} from 'app/utils'

export default class AddPlayerToTeam extends PureComponent {
    constructor(props) {
        super(props);
    }

    handleAssignPlayerToTeam = async (name, value) => {
        const { team,status,me } = this.props
        const clubId = me.data && me.data.club_id

        const playerStatus = status ? status : 'trial'
        const formData = {
            'club_id': clubId,
            'team_id': team.team_id,
            'status' : playerStatus
        }

        const response = await api.update(`players/${value}/assign-single`, formData)
        if(!api.error(response)){
            this.props.fetchData()
        }
    }

    loadOptions = async (inputValue, callback) => {
        const { me, team }  = this.props
        // Check length of search string, if less then 3 then do nothing.
        if (inputValue && inputValue.length < 3 || inputValue === '' || inputValue.length > 10) {
            return;
        }
        const url = `/players/search/${me.data.club_id}?search=${inputValue}&team_id=${team.team_id}`
        const response = await api.get(url)

        if (!api.error(response)) {
            let newItems = [];
            _.map(response.data, (item, index) => {
                let maxAge  = fn.diffDate(item.birthday) + 1
                const newItem = {
                    id: item.id,
                    title: `${item.name} (Under ${maxAge})`,
                    index: index
                }
                newItems.push(newItem);
            })
            return {options: newItems};
        } else {
            return [];
        }
    }

    render() {
        const {team} = this.props

        const placeholder = `Add player to ${team.title}`
        return(
            <div className="assign-player-content">
                <Select
                    skipInitialOnChangeCall
                    name="playerAssignToTeam"
                    async={true}
                    className="multi-select document-search"
                    placeholder={placeholder}
                    onChange={this.handleAssignPlayerToTeam}
                    loadOptions={this.loadOptions}
                    noOptionsMessage={() => 'No players found'}
                    wide
                />
            </div>
        )
    }
}
