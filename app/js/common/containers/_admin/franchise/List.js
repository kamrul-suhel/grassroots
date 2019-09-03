import React from 'react';
import {connect} from 'react-redux';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ContentLoader, Table, Tooltip} from '@xanda/react-components';
import {
    ConfirmDialog,
    Link,
    Meta,
    PageDescription,
    PageTitle,
    SendEmail
} from 'app/components';

@connect((store, ownProps) => {
    return {
        franchises: store.franchise,
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
            type: 'FRANCHISE',
            url: `/franchises?page=${currentPage}${filters}`,
            page: currentPage,
        }));
    }

    render() {
        const {franchises} = this.props;
        const {currentPage} = this.state;
        const tableFooter = [];

        return (
            <div id="content" className="site-content-inner customers-page">
                <PageTitle value="Customers"/>
                <ContentLoader
                    filter={{
                        filters: franchises.filters,
                        onUpdate: this.fetchData,
                    }}
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchData,
                        total: franchises.count,
                    }}
                    data={franchises.currentCollection}
                    forceRefresh
                    isLoading={franchises.isLoading}
                    notFound="No franchises"
                >
                    <Table
                        className={franchises.count <=1 ? 'one' : ''}
                        footer={tableFooter}
                        headers={['Organisation Name', 'Acc Manager', 'Purchased', 'Active', 'Monthly Fee', 'Balance', 'Contact']}
                        icon="ion-ios-people"
                    >
                        {_.map(franchises.currentCollection, (id) => {
                            const franchise = franchises.collection[id];
                            return (
                                <tr key={`franchise${franchise.franchise_id}`}>
                                    <td>
                                        <Link to={`${url.franchise}/${franchise.franchise_id}`}>
                                            {franchise.title}
                                        </Link>
                                    </td>

                                    <td>{franchise.manager_name}</td>

                                    <td>{franchise.packages_no}</td>

                                    <td>{franchise.clubs_no}</td>

                                    <td>{fn.formatPrice(franchise.subscription_fee)}</td>
                                    <td>{fn.formatPrice(franchise.invoice - franchise.transaction)}</td>

                                    <td className="short table-options">
                                        <a href={'tel:' + franchise.telephone}>
											<span className="icon">
                                                <Tooltip icon={<i className="ion-ios-telephone"></i>} message="Call"/>
											</span>
                                        </a>

                                        <a href={'mailto:' + franchise.email}>
                                            <span className="icon">
                                                <Tooltip icon={<i title="Send email" className="ion-ios-email"></i>}
                                                         message="Email"/>
                                            </span>
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}

                        <tr className="customer-table-footer">
                            <td>
                                <div className="customer-counter-title">Totals:</div>
                                <div className="customer-counter">{franchises.count} Customers</div>
                            </td>

                            <td></td>

                            <td>
                                <p><span>{franchises.misc.total_purchase_packages}</span></p>
                            </td>

                            <td>
                                <p><span>{franchises.misc.active_package}</span></p>
                            </td>

                            <td>
                                <p><span>{fn.formatPrice(franchises.misc.total_monthly_income)}</span></p>
                            </td>

                            <td></td>
                            <td></td>
                        </tr>
                    </Table>
                </ContentLoader>
            </div>
        );
    }

}
