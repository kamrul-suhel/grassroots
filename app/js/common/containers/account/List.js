import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Table, TextInput, Dialog} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ButtonStandard, ConfirmDialog, Link, PageTitle} from 'app/components';

@connect((store, ownProps) => {
    return {
        accounts: store.account,
    };
})
export default class View extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            filters: '',
            isRegistered: false,
            errorMessage: ''
        };
    }

    componentWillMount() {
        this.fetchData();
    }

    handleInputChange = (name, value) => this.setState({[name]: value});

    fetchData = (currentPage = 1, newFilters) => {

        this.setState({
            currentPage,
            filters: newFilters || this.state.filters,
        });
        const filters = newFilters === undefined ? this.state.filters : newFilters;
        this.props.dispatch(fetchData({
            type: 'ACCOUNT',
            url: `/accounts?page=${currentPage}${filters}`,
            page: currentPage,
        }));
    }

    handleDelete = async (id) => {
        const formData = new FormData();
        formData.append('confirmation', this.state.confirmation);

        const response = await api.delete(`/accounts/${id}`, formData);

        if (!api.error(response, false)) {
            this.refDialog.close();
            this.fetchData();
        } else {
            const errorMessage = api.getErrorsHtml(response.data);
            this.setState({
                errorMessage: errorMessage,
                isRegistered: true
            });

        }
    }

    closeBox = () => {
        this.setState({
            isRegistered: false,
            errorMessage: ''
        })
    }

    render() {
        const {accounts, params} = this.props;
        const {currentPage} = this.state;
        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Accounts"
                           faq={true}
                           faqLink={fn.getFaqLink(`caAccount`, `/${params.clubSlug}/`)}/>

                <div className="page-actions">
                    <ButtonStandard to={url.account}>Accounts</ButtonStandard>
                    <ButtonStandard to={`${url.account}/add`}>Add Account</ButtonStandard>
                    <ButtonStandard to={`${url.account}/add-payment`}>Payments / Receipts</ButtonStandard>
                    <ButtonStandard to={`${url.invoice}`}>Invoices</ButtonStandard>
                    <ButtonStandard to={url.coach}>Coaches</ButtonStandard>
                    <ButtonStandard to={url.guardian}>Parents</ButtonStandard>
                    <ButtonStandard to={`${url.account}/settings`}>Settings</ButtonStandard>
                    <ButtonStandard to="">Reports</ButtonStandard>
                </div>

                <ContentLoader
                    filter={{
                        filters: accounts.filters,
                        onUpdate: this.fetchData,
                    }}
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchData,
                        total: accounts.count,
                    }}
                    data={accounts.currentCollection}
                    forceRefresh
                    isLoading={accounts.isLoading}
                    notFound="No accounts"
                >
                    <Table
                        className={"header-transparent"}
                        total={accounts.count}
                        headers={['Account', 'Type', 'Bank Name', 'Balance', 'Options']}
                        icon="ion-card">
                        {_.map(accounts.currentCollection, (id) => {
                            const account = accounts.collection[id];
                            return (
                                <tr key={`account${account.id}`}>
                                    <td><Link to={`${url.account}/${account.id}`}>{account.title}</Link></td>
                                    <td>{account.type}</td>
                                    <td>{account.bank_name}</td>
                                    <td>{account.balance != 0 ? fn.formatPrice(account.balance) : '-'}</td>
                                    <td className="short table-options">
                                        <Link to={`${url.account}/${account.id}`} className="button icon">
                                            <i title="View Statement" className="ion-briefcase"/>
                                        </Link>
                                        <Link to={`${url.account}/${account.id}/edit`} className="button icon">
                                            <i title="Edit" className="ion-edit"/>
                                        </Link>
                                        <ConfirmDialog
                                            showCloseButton={false}
                                            ref={ref => this.refDialog = ref}
                                            close={false}
                                            onClose={this.closeBox}
                                            title=""
                                            body={
                                                <React.Fragment>
                                                    <h3>Are you sure you want to delete?</h3>
                                                    <TextInput
                                                        wide
                                                        name="confirmation"
                                                        label="Type 'DELETE' to confirm deletion"
                                                        onChange={this.handleInputChange}/>
                                                    {this.state.isRegistered ? this.state.errorMessage : ''}
                                                </React.Fragment>
                                            }
                                            onConfirm={() => this.handleDelete(account.id)}
                                        >
                                            <span className="button icon">
                                                <i title="Delete" className="ion-trash-b"/></span>
                                        </ConfirmDialog>
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
