import React from 'react';
import {connect} from 'react-redux';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ContentLoader, Table, Tooltip, Dialog, TextInput} from '@xanda/react-components';
import {Article, ConfirmDialog, Link, Meta, MetaSection, PageTitle, ButtonStandard} from 'app/components';

@connect((store, ownProps) => {
    return {
        collection: store.franchise,
        franchises: store.franchise,
        franchise: store.franchise.collection[ownProps.params.franchiseId] || {},
        licences: store.licence,
        statement: store.statement
    };
})
export default class View extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            stmtCurrentPage: 1,
            selectedRelCLubPackageId: null,
            selectedStatus: null,
            superAdminStatus: null,
            deleteStatement: {},
            selectedStatementId: null
        };
    }

    componentWillMount() {
        this.fetchFranchise();

        this.fetchLicences();
    }

    componentDidMount() {
        if (this.refDialog) {
            this.refDialog.close();
        }
    }

    fetchLicences = (currentPage = 1) => {
        this.setState({
            currentPage
        });

        this.props.dispatch(fetchData({
            type: 'LICENCE',
            url: `/franchises/packages?franchise_id=${this.props.params.franchiseId}&page=${currentPage}`,
            page: currentPage,
        }));

        this.props.dispatch(fetchData({
            type: 'STATEMENT',
            url: `/statements/franchises/${this.props.params.franchiseId}`,
            page: currentPage,
        }));
    }

    fetchFranchise = () => {
        this.props.dispatch(fetchData({
            type: 'FRANCHISE',
            url: `/franchises/${this.props.params.franchiseId}`,
        }));
    }

    fetchStatement = (currentPage = 1) => {
        this.setState({
            stmtCurrentPage: currentPage
        });

        this.props.dispatch(fetchData({
            type: 'STATEMENT',
            url: `/statements/franchises/${this.props.params.franchiseId}?page=${currentPage}`,
            page: currentPage,
        }));
    }

    openConfirmDialog = (relCLubPackageId, status, superAdminStatus) => {
        this.setState({
            selectedRelCLubPackageId: relCLubPackageId,
            selectedStatus: status,
            superAdminStatus: superAdminStatus
        });

        this.refDialog.refDialog.open();
    }

    suspendLicence = async () => {
        const {
            selectedStatus,
            selectedRelCLubPackageId
        } = this.state;

        const status = selectedStatus === 0 ? 1 : 0;

        const formData = new FormData();
        formData.append('status', status);
        formData.append('super_admin_status', status);
        const response = await api.update(`/clubs/${selectedRelCLubPackageId}/package-action`, formData);
        const statusLabel = status === 1 ? 'activated' : 'suspended';

        if (!api.error(response)) {
            this.refDialog.close();
            this.setState({
                selectedRelCLubPackageId: null,
                selectedStatus: null,
                superAdminStatus: null
            });

            this.props.dispatch({
                type: 'OPEN_SNACKBAR_MESSAGE',
                option: {
                    message: `Package has been ${statusLabel}`,
                    color: 'white'
                }
            })

            this.refForm && this.refForm.hideLoader();
            this.fetchLicences();
            this.fetchFranchise();
        }
    }

    handleEditStatement = (e, statement) => {
        e.preventDefault();
        let url = '';
        if (statement.invoice_id) {
            url += '?invoice_id=' + statement.invoice_id;
        }

        if (statement.transaction_id) {
            url += '?transaction_id=' + statement.transaction_id;
        }

        fn.navigate(`franchises/${this.props.routeParams.franchiseId}/edit-statement${url}`);
    }

    hendleStatementDialogOpen = (e, statement) => {
        e.preventDefault();
        this.setState({
            deleteStatement: {...statement}
        });

        this.refDeleteDialog.open();
    }

    confirmDeleteStatement = async () => {
        const {deleteStatement} = this.state;
        let url = '';
        if (deleteStatement.invoice_id) {
            url += 'invoices/' + deleteStatement.invoice_id;
        }

        if (deleteStatement.transaction_id) {
            url += 'transactions/' + deleteStatement.transaction_id;
        }

        const response = await api.delete(url);

        if (!api.error(response)) {
            this.fetchStatement();
            this.refDeleteDialog.close();
        }
    }

    handleStatementDescription = (stmt) => {
        const {selectedStatementId} = this.state
        if (stmt._id === selectedStatementId) {
            this.setState({
                selectedStatementId: null
            })
            return;
        }
        this.setState({
            selectedStatementId: stmt._id
        })
    }

    render() {
        const {
            collection,
            franchise,
            licences,
            statement
        } = this.props;

        const {
            currentPage,
            selectedStatus,
            superAdminStatus,
            selectedStatementId
        } = this.state;


        // Count active & inactive packages.
        let active = 0;
        let inactive = 0;
        franchise.packages && _.map(franchise.packages, (pckg) => {
            if (pckg.status === 0) {
                inactive = inactive + 1;
            } else {
                active = active + 1;
            }
        })

        const managerName = franchise.manager_name ? franchise.manager_name : null;
        const firstName = franchise.group_admin ? `${franchise.group_admin.first_name} ${franchise.group_admin.last_name}` : '';
        const groupAdminId = franchise.group_admin ? franchise.group_admin.user_id : 0;

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value={franchise.organisation_name || franchise.title}/>

                <ContentLoader
                    data={franchise.franchise_id}
                    forceRefresh
                    isLoading={collection.isLoading}
                    notFound="No Data"
                >
                    <Article>
                        <MetaSection title="Customer Details" className="hidden">
                            <div className="grid">
                                <div className="grid-xs-12 grid-6">
                                    <p className="meta aligned  ">
                                        <span className="label">Name:</span>
                                        <span className="value">{firstName}</span>
                                    </p>

                                    <p className="meta aligned ">
                                        <span className="label">Address:</span>
                                        <span className="value">
                                        {franchise.address}, {franchise.address2 && `${franchise.address2},`}
                                            {franchise.town && `${franchise.town}, `}{franchise.postcode}
                                    </span>
                                    </p>

                                    <p className="meta aligned  ">
                                        <span className="label">Telephone:</span>
                                        <span className="value"><a
                                            href={`tel:${franchise.telephone}`}>{franchise.telephone}</a></span>
                                    </p>

                                    <p className="meta aligned  ">
                                        <span className="label">Mobile:</span>
                                        <span className="value"><a
                                            href={`tel:${franchise.mobile}`}>{franchise.mobile}</a></span>
                                    </p>

                                    <p className="meta aligned  ">
                                        <span className="label">Email:</span>
                                        <span className="value"><a
                                            href={`mailto:${franchise.email}`}>{franchise.email}</a></span>
                                    </p>

                                    <div className="grid">
                                        <div className="grid-xs-12 grid-6">
                                            <p className="meta aligned  ">
                                                <span className="label">Account Manager:</span>
                                                <span className="value">{managerName}</span>
                                            </p>
                                        </div>
                                    </div>

                                </div>


                            </div>
                        </MetaSection>

                        <div style={{display: "flex", marginTop: '30px', marginBottom: '60px'}}>
                            {groupAdminId !== 0 ? <ButtonStandard
                                icon={<i className="ion-edit"/>}
                                to={`${url.franchise}/group_admin/${groupAdminId}/update-password`}>
                                <span className="button-standard">Update Password</span>
                            </ButtonStandard> : ''}

                            <ButtonStandard
                                icon={<i className="ion-edit"/>}
                                to={`${url.franchise}/${franchise.franchise_id}/set-account-manager`}>Set Account
                                Manager
                            </ButtonStandard>
                        </div>

                        <MetaSection title="Packages">
                            <Meta label="Purchased" value={franchise.packages_no}/>
                            <p className="meta aligned  ">
                                <span className="label">Active:</span>
                                <span className="value">{active}</span>
                            </p>

                            <p className="meta aligned  ">
                                <span className="label">Inactive:</span>
                                <span className="value">{inactive}</span>
                            </p>
                            <Meta label="Total Monthly Fee" value={fn.formatPrice(franchise.subscription_fee)}/>
                        </MetaSection>

                    </Article>
                </ContentLoader>

                <div className="section-space"></div>

                <ContentLoader
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchLicences,
                        total: licences.count,
                    }}

                    data={licences.currentCollection}
                    forceRefresh
                    isLoading={licences.isLoading}
                    notFound="No packages"
                >
                    <Table
                        headers={['Package Name', 'Club Name', 'Status', 'Monthly Fee', 'Option']}
                        icon="ion-pricetag"
                        className={(licences.currentCollection.length === 1 ? 'shrink' : '')}
                    >
                        {_.map(licences.currentCollection, (id) => {
                            const licence = licences.collection[id];

                            return (

                                <tr key={`licence${licence.id}`}>
                                    <td className={!licence.status && licence.club_id !== 0 ? 'text-danger' : ''}>{licence.package}</td>
                                    <td>{licence.club_name}</td>
                                    <td>{licence.status === 0 ? 'Inactive' : 'Active'}</td>
                                    <td>£{licence.amount}</td>
                                    <td className="short">
                                        {
                                            licence.club_id === 0 ?
                                                <button className="button disabled">Club not setup</button> :
                                                <button className="button padding"
                                                        onClick={() => this.openConfirmDialog(licence.id, licence.status, licence.super_admin_status)}>
                                                    {licence.super_admin_status === 0 ? 'Activate' : (licence.status ? 'Suspend' : 'Delete')}
                                                </button>
                                        }
                                    </td>
                                </tr>
                            );
                        })}
                    </Table>

                    <ConfirmDialog
                        ref={ref => this.refDialog = ref}
                        showCloseButton={false}
                        title=''
                        body={
                            <React.Fragment>
                                <h3 key={'heading'}>{selectedStatus ? `suspend package` : `activate package`}</h3>,
                                <span
                                    key={'des'}>{`Are you sure you want to ${selectedStatus ? 'suspend' : 'activate'} this package?`}</span>
                            </React.Fragment>
                        }
                        actions={[
                            <button key="cancel" className="button">Go Back</button>,

                            <button className="button"
                                    key="suspendActivate"
                                    onClick={() => this.suspendLicence()}>
                                {superAdminStatus === 0 ? 'Activate' : (selectedStatus ? 'Suspend' : 'Delete')}
                            </button>
                        ]}
                    >
                        <button className="hidden" key="hide"></button>
                    </ConfirmDialog>
                </ContentLoader>

                <PageTitle value="Statement" subTitle/>

                <MetaSection title="">
                    <Meta label="Total Package Fees"
                          value={fn.formatPrice(statement.misc.package_fee && statement.misc.package_fee)}/>
                    <Meta label="Total Received"
                          value={fn.formatPrice(statement.misc.total_paid && statement.misc.total_paid)}/>
                    <Meta label="Total Other Fees"
                          value={fn.formatPrice(statement.misc.other_fee && statement.misc.other_fee)}/>
                    <Meta label="Total Credits"
                          value={fn.formatPrice(statement.misc.total_credit && statement.misc.total_credit)}/>
                    <Meta label="Total GoCardless Fees"
                          value={fn.formatPrice(statement.misc.charge && statement.misc.charge)}/>
                </MetaSection>

                <ButtonStandard
                    className={"mt-35 mb-35"}
                    icon={<i className="ion-edit"/>}
                    to={`${url.franchise}/${franchise.franchise_id}/add-statement`}>
                    <span className="button-standard">Add Transaction</span>
                </ButtonStandard>

                <ContentLoader
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchStatement,
                        total: statement.count,
                    }}

                    data={statement.currentCollection}
                    forceRefresh
                    isLoading={statement.isLoading}
                    noResults="No statement found">
                    <Table
                        className={"stmt-table"}
                        total={statement.total}
                        headers={['Date', 'Description', 'Amount', 'Option']}
                        icon="ion-pound"
                    >
                        {_.map(statement.currentCollection, (stmtcol) => {
                            const stmt = statement.collection[stmtcol];
                            return (
                                <React.Fragment>
                                    <tr key={`licence${stmt._id}`}
                                        onClick={() => this.handleStatementDescription(stmt)}>
                                        <td className={"date"}>{fn.formatDate(stmt.date, 'D MMM YYYY')}</td>
                                        <td className={"description"}>
                                            {
                                                _.includes(['fee', 'credit', 'receipt'], stmt.register_type) ?
                                                    ''
                                                    : selectedStatementId && selectedStatementId === stmt._id ?
                                                    <i className="ion ion-minus"/> : <i className="ion ion-plus"/>
                                            }

                                            {
                                                stmt.invoice_id ? _.isEmpty(stmt.register_type) ? 'Package Fee' : !_.isEmpty(stmt.club_title) ? `${stmt.description} - ${stmt.club_title}` : `${stmt.description}` :
                                                    _.isEmpty(stmt.payment_id) ?
                                                        <span>{stmt.transaction_id ? stmt.description : null}{stmt.club_title ? ` - ${stmt.club_title}` : null}</span>
                                                        : <span>{stmt.description}</span>
                                            }
                                        </td>
                                        <td className={"amount"}>
                                            {stmt.transaction_id ? `- £${stmt.amount}` : stmt.register_type === 'credit' ? `- £${_.replace(stmt.amount, '-', '')}` : `£${stmt.amount}`}
                                        </td>

                                        <td className="short table-options">
                                            {
                                                !_.isEmpty(stmt.register_type) ?
                                                    <div>
                                                        <a href=""
                                                           onClick={(e) => this.handleEditStatement(e, stmt)}>
                                                            <span className="icon">
                                                                <i className="ion-edit"></i>
                                                            </span>
                                                        </a>

                                                        <a href=""
                                                           onClick={(e) => this.hendleStatementDialogOpen(e, stmt)}>
                                                            <span className="icon">
                                                                <i title="" className="ion-android-delete"></i>
                                                            </span>
                                                        </a>
                                                    </div>

                                                    : null
                                            }
                                        </td>
                                    </tr>
                                    {
                                        selectedStatementId && selectedStatementId === stmt._id ?
                                            <React.Fragment>
                                                {
                                                    _.map(stmt.lines, (line) => {
                                                        return (
                                                            <tr key={`licence${line.id}`} className="stmt-detail">
                                                                <td className={"date"}></td>
                                                                <td>
                                                                    <div className={"description"}>
                                                                        {stmt.invoice_id ? line.title : null}
                                                                        {line.package_title ? `${line.package_title}` : null}
                                                                        {line.club_title && ` - ${stmt.club_title}`}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span
                                                                        className="amount">{stmt.register_type && stmt.register_type !== 'fee' ? '-' : null}£{line.amount}</span>
                                                                </td>
                                                                <td></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                {
                                                    stmt.charge ?
                                                        <tr className="stmt-detail" key={stmt._id}>
                                                            <td></td>
                                                            <td>
                                                                <div className={"description"}>GoCardLess Charge</div>
                                                            </td>
                                                            <td>
                                                                <span className="amount">(£{stmt.charge.amount})</span>
                                                            </td>
                                                            <td></td>
                                                        </tr> : null
                                                }

                                            </React.Fragment>
                                            : null
                                    }
                                </React.Fragment>
                            );
                        })}

                        <tr className="statement-footer">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                <div className="stm-content last">
                                    <div className="balance">
                                        Balance {fn.formatPrice(statement.misc.balance && statement.misc.balance)}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </Table>

                    <div className="flex back-button">
                        <Link className="button"
                              to={url.franchise}>Back
                        </Link>
                    </div>
                </ContentLoader>

                <Dialog
                    ref={ref => this.refDeleteDialog = ref}
                    showCloseButton={false}
                    title=""
                    content={
                        <div className="dialog-body-inner">
                            <div className={"dialog-left-sidebar"}>
                                <img src={'/images/ball-soccer.png'}/>
                            </div>
                            <div className={"dialog-right-side"}>
                                <h3>Delete Transaction</h3>
                                <p>Are you sure you want to delete this transaction?</p>
                            </div>
                        </div>
                    }
                    buttons={[
                        <button key={'cancel'}
                                className={'button'}>Cancel
                        </button>,

                        <button key={'confirm'}
                                onClick={this.confirmDeleteStatement}
                                className={'button'}>Delete
                        </button>
                    ]}
                >
                    <button className={'hidden'}>
                        Click to open
                    </button>
                </Dialog>
            </div>
        );
    }

}
