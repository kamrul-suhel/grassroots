import React from 'react';
import { connect } from 'react-redux';
import { fetchData } from 'app/actions';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { ContentLoader, Table } from '@xanda/react-components';
import { Link, PageTitle } from 'app/components'

const percent = (val = 0, max = 1, format = false)=> format?`${~~((val/max)*100)}%`:(val/max)

@connect((store) => ({
        players: store.player,
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
			url: `/players?page=${currentPage}${filters}`,
			page: currentPage,
		}));
	}

    render() {
        const { currentPage, filters } = this.state;
        const { players, params } = this.props;
        const { collection, currentCollection, count, isLoading, misc } = players;
        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Attendance Registers"
                           faq={true}
                           faqLink={fn.getFaqLink(`caRegisters`, `/${params.clubSlug}/`)}/>

                <ContentLoader
                    className="site-content-inner"
                    data={currentCollection}
                    forceRefresh
                    isLoading={isLoading}
                    notFound="No players"
                    pagination={{
                        currentPage,
                        perPage:misc.per_page,
                        onPageChange: this.fetchData,
                        total: count,
                    }}
                    filter={{
                        filters: players.filters,
                        onUpdate: this.fetchData
                    }}
                >
                    <Table
                        className={"header-transparent"}
                        total={count}
                        headers={['Name', 'Attended Sessions', 'Total Sessions', 'Attendence']}
                        icon="icon ion-compose"
                    >
                        {_.map(currentCollection, (id) => {
                            const player = collection[id];
                            return (
                                <tr key={`player_${player.player_id}`}>
                                    <td><Link to={`${url.attendanceRegister}/${player.player_id}`}>{player.display_name}</Link></td>

                                    <td>{player.attended_sessions}</td>

                                    <td>{player.total_sessions}</td>

                                    <td>{percent(player.attended_sessions,player.total_sessions,true)}</td>
                                </tr>
                            );
                        })}
                    </Table>
                </ContentLoader>
            </div>
        )
    }
}
