import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Table} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ButtonStandard, Link, PageDescription, PageTitle} from 'app/components';

@connect((store) => {
    return {
        fixtures: store.fixture,
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
            type: 'FIXTURE',
            url: `/fixtures?page=${currentPage}${filters}`,
            page: currentPage,
        }));
    }

    downloadFixtureImage = async (fixture) => {

        // const linkUrl = window.URL.createObjectURL(fixture.image_path);
        const link = document.createElement('a');
        link.href = fixture.image_path;
        link.setAttribute('download', `image-${Date.now()}.${fixture.image_type}`);
        link.setAttribute('target', `_blank`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    render() {
        const {fixtures, params} = this.props;
        const {currentPage} = this.state;

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Fixtures"
                           faq={true}
                           faqLink={fn.getFaqLink(`caFixtures`, `/${params.clubSlug}/`)}/>

                <PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem
                    nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit
                    non mi porta gravida at eget metus.</PageDescription>

                {fn.isAdmin() &&
                <div className="page-actions">
                    <ButtonStandard
                        to={`${url.fixture}/add`}
                        icon={<i className="ion-plus"/>}>
                        Create new fixture
                    </ButtonStandard>
                </div>
                }

                <ContentLoader
                    filter={{
                        filters: fixtures.filters,
                        onUpdate: this.fetchData,
                    }}
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchData,
                        total: fixtures.count,
                    }}
                    data={fixtures.currentCollection}
                    forceRefresh
                    isLoading={fixtures.isLoading}
                    notFound="No fixtures"
                >
                    <Table
                        className={"header-transparent"}
                        total={fixtures.count}
                        headers={['Fixture', 'Venue', 'Date', 'Time', 'Options']}
                        icon="ion-ios-football"
                    >
                        {_.map(fixtures.currentCollection, (id) => {
                            const fixture = fixtures.collection[id];
                            return (
                                <tr key={`fixture_${fixture.fixture_id}`}>
                                    <td className="short"><Link
                                        to={`${url.fixture}/${fixture.fixture_id}`}>{fixture.title}</Link>
                                    </td>

                                    <td><Link to={`${url.contact}/${fixture.venue_id}`}>{fixture.venue}</Link></td>

                                    <td>{fn.formatDate(fixture.start_time)}</td>

                                    <td>{fn.formatDate(fixture.start_time, 'HH:mm')}</td>

                                    <td className="short">
                                        <Link to={`${url.fixture}/${fixture.fixture_id}`}
                                              className="button icon">
                                            <i title="View" className="ion-search"/>
                                        </Link>

                                        {fixture.image_path && fixture.image_path ?
                                            <button className="button icon transparent"
                                                    onClick={() => this.downloadFixtureImage(fixture)}>
                                                <i className="icon ion-android-download"></i>
                                            </button> : ''
                                        }
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
