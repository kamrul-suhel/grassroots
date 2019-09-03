import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Table, Tooltip} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ButtonStandard, Link, PageDescription, PageTitle} from 'app/components';

@connect((store) => {
    return {
        coaches: store.coach,
    };
})
export default class List extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            filters: '',
        };
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData = (currentPage = 1, newFilters) => {

        this.setState({
            currentPage,
            filters: newFilters || this.state.filters,
        });
        const filters = newFilters === undefined ? this.state.filters : newFilters;
        this.props.dispatch(fetchData({
            type: 'COACH',
            url: `/coaches?page=${currentPage}${filters}`,
            page: currentPage,
        }));
    }

    renderTeams = coach => coach.teams && coach.teams.map((o, i) => [
        i > 0 && ', ',
        <Link key={`team${o.team_id}`} to={`${url.team}/${o.team_id}`}>{o.title}</Link>,
    ])

    render() {
        const {coaches, params} = this.props;
        const {currentPage} = this.state;

        return (
            <div id="content"
                 className="site-content-inner coach">
                <PageTitle value="Coaches"
                           faq={true}
                           faqLink={fn.getFaqLink(`caCoaches`, `/${params.clubSlug}/`)}/>

                <PageDescription>View all Coaches in the system. Start typing in the Search field to find a specific
                    Coach by their name. Use the filters narrow your selection. View a Coach for Coach
                    options.</PageDescription>

                <div className="page-actions">
                    <ButtonStandard to={`${url.coach}/add`}
                                    icon={<i className="ion-plus"/>}>Add new coach
                    </ButtonStandard>
                </div>

                <ContentLoader
                    filter={{
                        filters: coaches.filters,
                        onUpdate: this.fetchData,
                    }}
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchData,
                        total: coaches.count,
                    }}
                    data={coaches.currentCollection}
                    forceRefresh
                    isLoading={coaches.isLoading}
                    notFound="No coaches"
                >
                    <Table
                        className="coach-component-table header-transparent"
                        headers={['Coach', 'Team / Skill group', 'Options']}
                        icon="ion-speakerphone"
                    >
                        {_.map(coaches.currentCollection, (id, index) => {
                            const coach = coaches.collection[id];
                            const docDueToExpire = coach.due_to_expire > 0 ?
                                <Tooltip icon={<i className="ion-alert-circled"/>}
                                         message={`Documents expiring soon: ${coach.due_to_expire}`}/> : '';
                            const docExpired = coach.expired > 0 ? <Tooltip icon={<i className="ion-alert"/>}
                                                                            message={`Documents have expired: ${coach.expired}`}/> : '';

                            return (
                                <tr key={index}>
                                    <td>
                                        {docDueToExpire} {docExpired}
                                        <Link to={`${url.coach}/${coach.user_id}`}>{coach.display_name}</Link>
                                    </td>

                                    <td>
                                        {this.renderTeams(coach)}
                                    </td>

                                    <td className="short">
                                        <a href={`tel:${coach.telephone}`} className="icon icon-size-md">
                                            <Tooltip icon={<i className="ion-ios-telephone"></i>} message="Call"/>
                                        </a>

                                        <a href={`mailto:${coach.email}`} className="icon icon-size-md">
                                            <Tooltip icon={<i className="ion-email"></i>} message="Email"/>
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </Table>
                </ContentLoader>
            </div>
        );
    }

}
