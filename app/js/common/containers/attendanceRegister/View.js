import React from 'react';
import {connect} from 'react-redux';
import {fetchData} from 'app/actions';
import {
    ContentLoader,
    Table
} from '@xanda/react-components'
import {
    PageTitle,
    Back
} from 'app/components'

import {fn} from 'app/utils'

const percent = (val = 0, max = 1, format = false) => format ? `${~~((val / max) * 100)}%` : (val / max)

@connect((store) => ({
        players: store.player.collection,
    })
)

export default class List extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            currentPage: 1,
            filters: '',
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = (currentPage = 1, newFilters) => {
        this.setState({
            currentPage,
            filters: newFilters || this.state.filters,
        });
        const filters = newFilters === undefined ? this.state.filters : newFilters;
        this.props.dispatch(fetchData({
            type: 'PLAYER',
            url: `/players/${this.props.params.playerId}`,
        }));
    }

    renderPlayerSession = (player) => {
        if (_.isEmpty(player.sessions)) {
            return (
                <div>{player.display_name} has no session.</div>
            )
        } else {
            return (
                <Table
                    className="header-transparent"
                    headers={['Programme', 'Type', 'Venue', 'Time', 'Price']}
                    icon="ion-clock"
                >
                    {_.map(player.sessions, (session, index) => {
                        return (
                            <tr key={index}>
                                <td>{session.programme_name}</td>
                                <td>{session.programme_type}</td>
                                <td>{session.address}</td>
                                <td>{fn.formatDate(session.start_time)}</td>
                                <td>{session.is_trial === 1 ? 'Trial' : fn.formatPrice(session.session_price)}</td>
                            </tr>
                        );
                    })}
                </Table>
            )
        }
    }

    render() {
        const {currentPage, filters} = this.state;
        const {players, params} = this.props;
        const player = {...players[params.playerId]}

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value={`${player.display_name} sessions`}/>
                {this.renderPlayerSession(player)}

                <div className="form-actions">
                    <Back className="button">Go back</Back>
                </div>
            </div>
        )
    }
}
