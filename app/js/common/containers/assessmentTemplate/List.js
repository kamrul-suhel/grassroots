import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Table, Tooltip} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ButtonStandard, Link, PageDescription, PageTitle, Back} from 'app/components';

@connect((store) => {
    return {
        assessments: store.assessmentTemplate,
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
            type: 'ASSESSMENT_TEMPLATE',
            url: `/assessments/templates?page=${currentPage}${filters}`,
            page: currentPage,
        }));
    }

    render() {
        const {assessments} = this.props;
        const {currentPage} = this.state;

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Assesment Forms"/>

                <PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem
                    nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit
                    non mi porta gravida at eget metus.</PageDescription>

                {fn.isAdmin() &&
                <div className="page-actions">
                    <ButtonStandard to={`${url.assessmentTemplate}/add`}
                                    icon={<i className="ion-edit"/>}>Create New Form
                    </ButtonStandard>

                    <ButtonStandard to={`${url.coachAssessment}/add`}
                                    className="medium"
                                    icon={<i className="ion-checkmark" />}>Assess A Coach
                    </ButtonStandard>
                </div>
                }

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
                    notFound="No assessment"
                >
                    <Table
                        className="header-transparent"
                        total={assessments.count}
                        headers={['', 'Options']}
                        icon="ion-android-clipboard"
                    >
                        {_.map(assessments.currentCollection, (id) => {
                            const assessment = assessments.collection[id];
                            return (
                                <tr key={`assessment_${assessment.assessment_id}`}>
                                    <td><Link to={`${url.assessmentTemplate}/${assessment.assessment_id}`}>
                                        {assessment.title}</Link>
                                    </td>

                                    <td className="short">
                                        <Link to={`${url.assessmentTemplate}/${assessment.assessment_id}`}
                                              className="button no-border">
                                            <Tooltip icon={<i className="ion-search"></i>} message="View"/>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </Table>
                </ContentLoader>

                <div className="age-group-buttons">
                    <Back className="button">Back</Back>
                </div>
            </div>
        );
    }

}
