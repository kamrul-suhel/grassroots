import React from 'react';
import {connect} from 'react-redux';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ContentLoader, Table} from '@xanda/react-components';
import {ConfirmDialog, Link, PageDescription, PageTitle} from 'app/components';

@connect((store) => {
    return {
        assessments: store.skillAssessment,
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
            type: 'SKILL_ASSESSMENT',
            url: `/skill-assessments/available-players?page=${currentPage}${filters}`,
            page: currentPage,
        }));
    }

    render() {
        const {assessments, params} = this.props;
        const {currentPage} = this.state;
        const type = fn.getFaqType('Assessments')

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Skill assesments"
                           faq={true}
                           faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}/>

                <PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem
                    nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit
                    non mi porta gravida at eget metus.</PageDescription>
                <ContentLoader
                    filter={{
                        filters: assessments.filters,
                        onUpdate: this.fetchData,
                    }}
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchData,
                        total: assessments.count,
                    }}
                    data={assessments.currentCollection}
                    forceRefresh
                    isLoading={assessments.isLoading}
                    notFound="No skill assessments"
                >
                    <Table headers={['', 'Team', 'Last assessed', 'Options']}
                           className="header-transparent"
                           icon="ion-ios-analytics">
                        {_.map(assessments.currentCollection, (id) => {
                            const assessment = assessments.collection[id];
                            return (
                                <tr key={`assessment_${assessment.id}`}>
                                    <td><Link
                                        to={`${url.player}/${assessment.player_id}`}>{assessment.player_name}</Link>
                                    </td>
                                    <td><Link to={`${url.team}/${assessment.team_id}`}>{assessment.team_name}</Link>
                                    </td>
                                    <td>{fn.formatDate(assessment.last_assessed)}</td>
                                    <td className="short table-options">
                                        <Link to={{
                                            pathname: `${url.player}/${assessment.player_id}/skill-assessments`,
                                            state: {team_id: assessment.team_id}
                                        }} className="button icon"><i title="View" className="ion-search"/></Link>
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
