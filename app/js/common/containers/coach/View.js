import React from 'react'
import {connect} from 'react-redux'
import {ContentLoader, Dialog, Table} from '@xanda/react-components'
import {fn, api} from 'app/utils'
import {url} from 'app/constants'
import {fetchData} from 'app/actions'
import {Edit, UploadFile} from './index'
import {
    Badge,
    Block,
    ButtonStandard,
    ConfirmDialog,
    FileIcon,
    Link,
    Meta,
    PageTitle,
    MetaSection,
    FormSection,
    HeaderLogo
} from 'app/components'

@connect((store, ownProps) => {
    return {
        statement: store.statement,
        collection: store.coach,
        coach: store.coach.collection[ownProps.params.userId] || {},
        availabilities: store.availability,
    };
})
export default class View extends React.PureComponent {

    constructor(props) {
        super(props);

        this.userId = this.props.params.userId;
        this.state = {
            currentPage: 1,
            filters: '',
            stmtCurrentPage: 1,
            selectedStatementId: null
        }
    }

    componentWillMount() {
        this.fetchCoach()
        this.fetchAvailabilityData()
        this.fetchStatement()
    }

    fetchCoach = () => {
        this.props.dispatch(fetchData({
            type: 'COACH',
            url: `/coaches/${this.userId}`,
        }))
    }

    fetchStatement = (currentPage = 1, newFilters) => {
        this.setState({
            currentPage,
            filters: newFilters || this.state.filters,
        });
        const filters = newFilters === undefined ? this.state.filters : newFilters
        const userArg = this.userId ? `?user_id=${this.userId}&` : '?'

        this.props.dispatch(fetchData({
            type: 'STATEMENT',
            url: `/statements${userArg}statement_type=coach&page=${currentPage}${filters}`,
            page: currentPage,
        }));
    }

    fetchAvailabilityData = (currentPage = 1, newFilters) => {
        this.setState({
            currentPage,
            filters: newFilters || this.state.filters,
        });
        const filters = newFilters === undefined ? this.state.filters : newFilters;
        this.props.dispatch(fetchData({
            type: 'AVAILABILITY',
            url: `/availabilities?page=${currentPage}${filters}&coach_id=${this.userId}`,
            page: currentPage,
        }))
    }

    deleteAvailabilityData = async (id) => {
        const response = await api.delete(`/availabilities/${id}`)

        if (!api.error(response)) {
            fn.showAlert('Availability has been deleted!', 'success')
            this.fetchAvailabilityData()
        }
    }

    handlePayCoach = async (statement) => {

        const coachId = this.props.params.userId
        let formData = {...statement, coach_id: coachId}
        const requestUrl = `${url.coach}/${coachId}/payments`
        const response = await api.post(requestUrl, formData)

        if (!api.error(response)) {
            this.fetchStatement()
        }
    }

    handleEditStatement = (e, statement) => {
        const {params} = this.props
        e.preventDefault();

        let link = '';
        if (statement.invoice_id) {
            link += '?invoice_id=' + statement.invoice_id;
        }

        if (statement.transaction_id) {
            link += '?transaction_id=' + statement.transaction_id;
        }

        fn.navigate(`${url.coach}/${params.userId}/${url.statement}/edit${link}`);
    }

    handleStatementDelete = (e, statement) => {
        e.preventDefault()
        this.setState({
            deleteStatement: {...statement}
        });

        this.refDeleteDialog.open()
    }

    confirmDeleteStatement = async () => {
        const {deleteStatement} = this.state
        let url = ''
        if (deleteStatement.invoice_id) {
            url += 'invoices/' + deleteStatement.invoice_id
        }

        if (deleteStatement.transaction_id) {
            url += 'transactions/' + deleteStatement.transaction_id
        }

        const response = await api.delete(url)

        if (!api.error(response)) {
            this.fetchStatement()
            this.refDeleteDialog.close()
        }
    }

    renderUploadFile = (doc) => {
        return (
            <UploadFile doc={doc}
                        {...this.props}
                        fetchCoach={this.fetchCoach}/>
        )
    }

    render() {
        const {
            statement,
            availabilities,
            collection,
            coach,
        } = this.props
        const {
            currentPage,
            stmtCurrentPage,
            selectedStatementId
        } = this.state
        const docType = ''

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value={coach.display_name || 'Coach'} img={coach.pic}/>
                <Edit {...this.props} subComponent={true}/>
                <ContentLoader
                    data={coach.user_id}
                    forceRefresh
                    isLoading={collection.isLoading}
                    notFound="No Data"
                >
                    <FormSection>
                        <Block title="Mandatory documents" className="mt-40">
                            <Table
                                className="header-transparent"
                                headers={['', 'Expiry', 'Option']}
                                icon="ion-document"
                            >
                                {coach.documents && _.map(coach.documents, (doc, index) => (
                                    <tr key={index}>
                                        <td>
                                            <FileIcon title={`${doc.title}`}
                                                      url={doc.file_url}
                                                      showIcon={true}/>
                                        </td>
                                        <td className="nowrap">
                                            {fn.formatDate(doc.expire) ? fn.formatDate(doc.expire) : ''}
                                        </td>
                                        <td className="short table-options">
                                            {this.renderUploadFile(doc)}
                                        </td>
                                    </tr>
                                ))}
                            </Table>
                        </Block>
                        {coach.qualifications && coach.qualifications.length > 0 &&
                        <Block title="Other qualifications">
                            {coach.qualifications.map(qualification => (
                                <FileIcon
                                    key={`qualification${qualification.qualification_id}`}
                                    url={qualification.file_url}
                                    title={qualification.title}
                                />
                            ))}
                        </Block>
                        }
                    </FormSection>
                    {coach.teams && coach.teams.length > 0 &&
                    <Block title="Teams & Skill groups">
                        {coach.teams.map(team => (
                            <Badge
                                img={team.logo_url}
                                key={`team${team.team_id}`}
                                link={`${url.team}/${team.team_id}`}
                                title={team.title}
                                defaultImg={true}
                            />
                        ))}
                    </Block>
                    }
                    {availabilities.collection && availabilities.count > 0 &&
                    <FormSection>
                        <Block title="availability"><ContentLoader
                            filter={{
                                filters: availabilities.filters,
                                onUpdate: this.fetchAvailabilityData,
                            }}
                            pagination={{
                                currentPage,
                                onPageChange: this.fetchAvailabilityData,
                                total: availabilities.count,
                            }}
                            data={availabilities.currentCollection}
                            forceRefresh
                            isLoading={availabilities.isLoading}
                            notFound="No skill availabilities"
                        >
                            <Table headers={['', 'Period', 'Option']}
                                   className="header-transparent"
                                   icon="ion-android-calendar">
                                {_.map(availabilities.currentCollection, (id, index) => {
                                    const availability = availabilities.collection[id]
                                    return (
                                        <tr key={index}>
                                            <td>{availability.type}</td>

                                            <td>{`${fn.formatDate(availability.start_date)} - ${fn.formatDate(availability.end_date)}`}</td>

                                            <td className="short table-options">
                                                <Link to={`${url.availability}/${availability.availability_id}/edit`}
                                                      className="button icon"><i title="Edit" className="ion-edit"/>
                                                </Link>

                                                <ConfirmDialog
                                                    onConfirm={() => this.deleteAvailabilityData(availability.availability_id)}
                                                    title="Are you sure you want to delete?">
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
                        </Block>
                    </FormSection>
                    }
                </ContentLoader>


                <Block title="Statement" className="mt-60">
                    <MetaSection title="">
                        <p><strong>Total
                            Fee: </strong>{fn.formatPrice(statement.misc.total_invoiced && statement.misc.total_invoiced)}
                        </p>
                        <p><strong>Total
                            Received: </strong> {fn.formatPrice(statement.misc.total_paid && statement.misc.total_paid)}
                        </p>
                        <p><strong>Balance: </strong>{fn.formatPrice(statement.misc.balance && statement.misc.balance)}
                        </p>
                        <p><strong>Total: </strong>{statement.count && statement.count}</p>
                    </MetaSection>

                    <ButtonStandard
                        className={"mt-35 mb-35"}
                        icon={<i className="ion-edit"/>}
                        to={`${url.coach}/${coach.user_id}/${url.statement}/add`}>
                        <span className="button-standard">Add Transaction</span>
                    </ButtonStandard>

                    <ContentLoader
                        pagination={{
                            stmtCurrentPage,
                            onPageChange: this.fetchStatement,
                            total: statement.count,
                        }}

                        data={statement.currentCollection}
                        forceRefresh
                        isLoading={statement.isLoading}
                        noResults="No statement found">
                        <Table
                            className={"stmt-table header-transparent"}
                            total={statement.total}
                            headers={['Date', 'Description', 'Amount', 'Coach Attended', 'Option']}
                            icon="ion-pound"
                        >
                            {_.map(statement.currentCollection, (stmtcol, index) => {
                                const stmt = statement.collection[stmtcol]
                                return (
                                    <tr key={index}>
                                        <td>{fn.formatDate(stmt.date, 'D MMM YYYY')}</td>

                                        <td>
                                            {
                                                stmt.transaction_id ? stmt.note : stmt.description
                                            }
                                        </td>

                                        <td className={"amount"}>
                                            {
                                                stmt.transaction_id ? `-£${stmt.amount}` : stmt.register_type === 'credit' ? `-£${_.replace(stmt.amount, '-', '')}` : `£${stmt.amount}`
                                            }
                                        </td>

                                        <td>
                                            {
                                                stmt.transaction_id ? '-' : stmt.is_attended === 1 ? 'Yes' : stmt.is_attended === null ? '-' : 'No'
                                            }
                                        </td>

                                        <td className="short table-options">
                                            <div>
                                                <a href="#"
                                                   onClick={(e) => this.handleEditStatement(e, stmt)}>
                                                    <span className="icon">
                                                        <i className="ion-edit"></i>
                                                    </span>
                                                </a>

                                                <a href="#"
                                                   onClick={(e) => this.handleStatementDelete(e, stmt)}>
                                                    <span className="icon">
                                                        <i title="" className="ion-android-delete"></i>
                                                    </span>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </Table>
                    </ContentLoader>
                </Block>

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
                                <h3>Delete Statement</h3>
                                <p>Are you sure you want to delete this row</p>
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
        )
    }

}