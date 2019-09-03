import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Table} from '@xanda/react-components';
import {fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ButtonStandard, Link, PageDescription, PageTitle} from 'app/components';

@connect((store) => {
    return {
        programmes: store.programme
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
            type: 'PROGRAMME',
            url: `/programmes?page=${currentPage}${filters}`,
            page: currentPage,
        }));
    }

    generateProgrammeLink = (programme) => {
        if (programme.is_trial) {
            return `${url.session}/${programme.session_id}`;
        }

        if (programme.type === 'Team Match') {
            return `${url.fixture}/${programme.fixture_id}`;
        }

        return `${url.programme}/${programme.programme_id}`;
    }

    renderTeams = programme => programme.teams.map((o, i) => [
        i > 0 && ', ',
        <Link key={`team${o.team_id}`} to={`${url.team}/${o.team_id}`}>{o.title}</Link>,
    ])

    render() {
        const {programmes, params, myClub} = this.props
        const {currentPage} = this.state
        const tableHeader = fn.isGuardian() ? ['Player', 'Status', 'Type', 'Programmes', 'Option'] : ['Name', 'Team / Skill Group', 'Type', 'End Date', 'Option']
        const club = myClub.data
        const type = fn.getFaqType('Programmes')

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Programmes"
                           faq={true}
                           faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}/>

                <PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem
                    nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit
                    non mi porta gravida at eget metus.</PageDescription>

                {
                    fn.isAdmin() &&
                    <div className="page-actions">
                        {
                            club.type === 'both' &&
                            <React.Fragment>
                                <ButtonStandard to={`${url.programme}/add-fc-programme`}
                                                className="extra-large"
                                                icon={<i className="ion-edit"/>}>Create New FC Programme
                                </ButtonStandard>

                                <ButtonStandard to={`${url.programme}/add-academy-programme`}
                                                className="extra-large"
                                                icon={<i className="ion-edit"/>}>Create Soccer School Programme
                                </ButtonStandard>
                            </React.Fragment>
                        }

                        {
                            club.type === 'fc' &&
                            <ButtonStandard to={`${url.programme}/add-fc-programme`}
                                            icon={<i className="ion-edit"/>}>Create New FC Programme
                            </ButtonStandard>
                        }

                        {
                            club.type === 'academy' &&
                            <ButtonStandard to={`${url.programme}/add-academy-programme`}
                                            className="extra-large"
                                            icon={<i className="ion-edit"/>}>Create Soccer School Programme
                            </ButtonStandard>
                        }
                    </div>
                }

                <ContentLoader
                    filter={{
                        filters: programmes.filters,
                        onUpdate: this.fetchData,
                    }}
                    data={programmes.currentCollection}
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchData,
                        total: programmes.count,
                    }}
                    forceRefresh
                    isLoading={programmes.isLoading}
                    notFound="No programmes"
                >
                    <Table
                        className={"header-transparent"}
                        total={programmes.count}
                        headers={tableHeader}
                        icon="ion-android-calendar"
                    >
                        {_.map(programmes.currentCollection, (id) => {
                            const programme = programmes.collection[id];
                            const link = this.generateProgrammeLink(programme);

                            if (fn.isGuardian()) {
                                return (
                                    <tr key={`programme${programme.id}`}>
                                        <td>
                                            <Link to={`${url.player}/${programme.player_id}`}>
                                                {programme.player_name}
                                            </Link>
                                        </td>

                                        <td>
                                            {fn.formatProgrammeStatus(programme.acceptance_status)}
                                            {programme.is_trial === 1 ? ` - Trial` : ` - In team`}
                                        </td>

                                        <td>
                                            {programme.type} - {programme.team_title}
                                        </td>

                                        <td>
                                            <Link to={`${link}/player/${programme.player_id}`}>
                                                {programme.is_trial === 1 ? `${programme.title}` : `${programme.title}`}
                                            </Link>
                                        </td>

                                        <td className="short">
                                            <Link to={`${link}/player/${programme.player_id}`}
                                                  className="button padding">
                                                View
                                            </Link>

                                            {/*{!programme.is_trial && programme.acceptance_status !== 1 &&*/}
                                            {/*<Link to={`${link}/player/${programme.player_id}`}*/}
                                            {/*      className="button">*/}
                                            {/*    Pay*/}
                                            {/*</Link>}*/}
                                        </td>
                                    </tr>
                                );
                            }

                            return (
                                <tr key={`programme${programme.programme_id}`}>
                                    <td><Link to={link}>{programme.title}</Link></td>
                                    <td>{this.renderTeams(programme)}</td>
                                    <td>{programme.type}</td>
                                    <td>{fn.formatDate(programme.programme_end)}</td>
                                    <td className="short">
                                        <Link to={link} className="button icon">
                                            <i title="View" className="ion-search"/>
                                        </Link>
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
