import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Table, TextInput, Tooltip} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ButtonStandard, ConfirmDialog, Link, PageDescription, PageTitle} from 'app/components';

@connect((store, ownProps) => {
    return {
        bankAccounts: store.bankAccount,
    };
})
export default class List extends React.PureComponent {

    constructor(props) {
        super(props);

        this.clubId = this.props.params.clubId;

        this.state = {
            currentPage: 1,
            filters: '',
        };
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData = async (currentPage) => {
        await this.props.dispatch(fetchData({
            type: 'BANKACCOUNT',
            url: `/accounts?club_id=${this.clubId}`,
            page: currentPage,
        }));
        _.forEach(this.props.bankAccounts.collection, (account) => {
            if (account.type_id === 1) {
                this.props.dispatch(fetchData({
                    type: 'BANKACCOUNT',
                    url: `/accounts/${account.id}?club_id=${this.props.params.clubId}`,
                }));
            }
        });
    }

    isAccountComplete = (account) => {
        return !!(account && account.bank_name && account.sort_code && account.account_number);
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    handleDelete = async (id) => {
        const formData = new FormData();
        formData.append('confirmation', this.state.confirmation);

        const response = await api.delete(`/accounts/${id}`, formData);

        if (!api.error(response)) {
            this.props.dispatch({
                type: 'OPEN_SNACKBAR_MESSAGE',
                option: {
                    message: 'Account has been deleted',
                    color: 'dark'
                }
            })
            this.fetchData();
        }
    }

    render() {
        const {bankAccounts} = this.props;
        const {currentPage} = this.state;

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Financial Accounts"/>

                <PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem
                    nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit
                    non mi porta gravida at eget metus.</PageDescription>

                <div className="page-actions">
                    <ButtonStandard to={`clubs/${this.clubId}/bank-accounts/add`} icon={<i className="ion-plus"/>}>Add
                        account</ButtonStandard>
                </div>

                <ContentLoader
                    data={bankAccounts.currentCollection}
                    forceRefresh
                    isLoading={bankAccounts.isLoading}
                    notFound="No financial account added to your club"
                >
                    <Table
                        headers={['', 'Account Type', 'Bank Name', 'Balance', 'Options']}
                        icon="ion-card"
                    >
                        {_.map(bankAccounts.currentCollection, (id) => {
                            const account = bankAccounts.collection[id];
                            return (
                                <tr key={`account${account.id}`}>
                                    <td>
                                        <Link
                                            to={`${url.club}/${this.clubId}/${url.bankAccount}/${account.id}/edit`}>{account.title}
                                        </Link>

                                        {(account && account.type_id === 1 && !this.isAccountComplete(account)) ?
                                            <Tooltip icon={<span className="ion-android-alert button-alert-icon"/>}
                                                     message="Account details required"/> :
                                            ''
                                        }
                                    </td>
                                    <td>{account.type}</td>
                                    <td>{account.bank_name}</td>
                                    <td>{account.balance != 0 ? fn.formatPrice(account.balance) : '-'}</td>
                                    <td className="short table-options">
                                        <Link to={`${url.club}/${this.clubId}/${url.bankAccount}/${account.id}/edit`}
                                              className="button icon">
                                            <i title="Edit" className="ion-edit"/>
                                        </Link>

                                        <ConfirmDialog
                                            showCloseButton={false}
                                            title=""
                                            body={
                                                <React.Fragment>
                                                    <h3>Are you sure you want to delete?</h3>
                                                    <TextInput wide
                                                               name="confirmation"
                                                               className="text-danger"
                                                               label="Type 'DELETE' to confirm deletion"
                                                               onChange={this.handleInputChange}/>
                                                </React.Fragment>
                                                }
                                            onConfirm={() => this.handleDelete(account.id)}
                                        >
											<span className="button icon">
												<i title="Delete" className="ion-trash-b"/>
											</span>
                                        </ConfirmDialog>
                                    </td>
                                </tr>
                            );
                        })}
                    </Table>
                </ContentLoader>

                <div className="page-bottom-actions">
                    <Link to={`${url.club}/${this.clubId}`} className="button">Back</Link>
                    <Link to={`${url.club}/${this.clubId}`} className="button">Done</Link>
                </div>
            </div>
        );
    }

}
