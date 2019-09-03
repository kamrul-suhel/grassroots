import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Table} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ButtonStandard, Link, PageDescription, PageTitle} from 'app/components';

@connect((store) => {
    return {
        consents: store.consent,
    };
})
export default class List extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
        };
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData = (currentPage) => {

        this.setState({currentPage});
        this.props.dispatch(fetchData({
            type: 'CONSENT',
            url: `/consents?page=${currentPage}`,
            page: currentPage,
        }));
    }

    render() {
        const {consents, params} = this.props;
        const {currentPage} = this.state;
        const tableIconClass = consents.count <= 1 ? 'one' : ''

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Consent"
                           faq={true}
                           faqLink={fn.getFaqLink(`caConsent`, `/${params.clubSlug}/`)}/>

                <PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem
                    nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit
                    non mi porta gravida at eget metus.</PageDescription>

                {fn.isAdmin() &&
                <div className="page-actions">
                    <ButtonStandard to={`${url.consent}/add`}
                                    icon={<i className="ion-edit"/>}>Create new consent form
                    </ButtonStandard>
                </div>
                }

                <ContentLoader
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchData,
                        total: consents.count,
                    }}
                    data={consents.currentCollection}
                    forceRefresh
                    isLoading={consents.isLoading}
                    notFound="No consents"
                >
                    <Table headers={['', 'Date', 'Actions']}
                           icon="ion-android-checkbox-outline"
                           className={`header-transparent ${tableIconClass}`}>
                        {_.map(consents.currentCollection, (id) => {
                            const consent = consents.collection[id];
                            return (
                                <tr key={`consent_${consent.consent_id}`}>
                                    <td><Link to={`${url.consent}/${consent.consent_id}`}>{consent.title}</Link></td>
                                    <td>{fn.formatDate(consent.created_at)}</td>
                                    <td className="short table-options">
                                        {status === 'Pending' ? (
                                            <Link to={`${url.consent}/${consent.consent_id}`}
                                                  className="button button-green icon"><i title="View"
                                                                                          className="ion-search"/></Link>
                                        ) : (
                                            <Link to={`${url.consent}/${consent.consent_id}`} className="button icon"><i
                                                title="View" className="ion-search"/></Link>
                                        )}
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
