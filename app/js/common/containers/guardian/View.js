import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Dialog, Table} from '@xanda/react-components';
import {url} from 'app/constants';
import {fn, api} from 'app/utils';
import {fetchData} from 'app/actions';
import {Article, ButtonStandard, Link, Meta, MetaSection, PageTitle, Item} from 'app/components';
import { Edit as ParentEdit } from './index'
import moment from 'moment';

@connect((store, ownProps) => {
    const userId = ownProps.params ? ownProps.params.userId : null
    const userObject = store[userRole] ? store[userRole].collection[userId] : {}
    const userRole = ownProps.route.type || ''
    return {
        statement: store.statement,
        user: userObject,
        collection: store.guardian,
        guardian: store.guardian.collection[ownProps.params.userId] || {},
    };
})
export default class View extends React.PureComponent {

    constructor(props) {
        super(props);

        this.userId = this.props.params.userId;

        this.state = {
            stmtCurrentPage: 1,
            filters: '',
            selectedStatementId: null
        };
    }

    componentWillMount() {
        this.fetchData();
        this.props.dispatch(fetchData({
            type: 'GUARDIAN',
            url: `/users/${this.userId}`,
        }));
    }

    fetchData = (currentPage = 1, newFilters) => {
        this.setState({
            currentPage,
            filters: newFilters || this.state.filters,
        });
        const filters = newFilters === undefined ? this.state.filters : newFilters;
        const userArg = this.userId ? `?user_id=${this.userId}&` : '?';

        this.props.dispatch(fetchData({
            type: 'STATEMENT',
            url: `/statements${userArg}statement_type=parent&page=${currentPage}${filters}`,
            page: currentPage,
        }));
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

        fn.navigate(`${url.guardian}/${params.userId}/${url.statement}/edit${link}`);
    }

    handleStatementDialogOpen = (e, statement) => {
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
            this.fetchData();
            this.refDeleteDialog.close();
        }
    }

    render() {
        const {
            statement,
            user,
            params,
            collection,
            guardian
        } = this.props;
        const parentId = this.props.params && this.props.params.userId
        const {stmtCurrentPage, selectedStatementId} = this.state;
        const tableHeader = ['', 'Description', 'Amount']

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value={guardian.display_name || 'guardian'}/>

                <div className="page-actions">
                    <ParentEdit {...this.props} subComponent={true}/>
                </div>

                <PageTitle value="Children" subTitle/>

                <ButtonStandard to={`${url.guardian}/${guardian.user_id}/add-player`}
                                icon={<i className="ion-plus"/>}>Add new player
                </ButtonStandard>

                <section className="mt-40 mb-40">
                    <div className="grid">
                        {_.map(guardian.players, (player, index) => {
                            const icon = player.gender === 'male' ? 'ion-male' : 'ion-female';
                            const content = (
                                <div>
                                    <Meta aligned={false}
                                          label="Age"
                                          value={`${moment().diff(moment(player.birthday, 'YYYY-MM-DD hh:mm:ss'), 'years')} years old`}/>
                                    <Meta aligned={false}
                                          label="Gender"
                                          value={_.startCase(player.gender)}/>
                                    {'teams' in player && player.teams.length > 0 && player.teams.map(team => <Meta
                                        aligned={false} key={`team_${team.team_id}`} label="Team" value={team.title}/>)}
                                </div>
                            );

                            return (
                                <Item
                                    key={index}
                                    background={player.pic}
                                    backgroundOverlay
                                    content={content}
                                    icon={<i className={icon}/>}
                                    itemClass="item-player"
                                    link={`${url.player}/${player.player_id}/edit`}
                                    title={player.display_name}
                                    wrapperClass="grid-xs-12 grid-s-4"
                                />
                            );
                        })}
                    </div>
                </section>

                <PageTitle value="Statement" subTitle/>

                <MetaSection title="">
                    <Meta label="Total Fee"
                          value={fn.formatPrice(statement.misc.total_invoiced && statement.misc.total_invoiced)}/>
                    <Meta label="Total Received"
                          value={fn.formatPrice(statement.misc.total_paid && statement.misc.total_paid)}/>
                    <Meta label="Balance"
                          value={fn.formatPrice(statement.misc.balance && statement.misc.balance)}/>
                    <Meta label="Total: "
                          value={statement.count && statement.count}/>
                </MetaSection>

                <ButtonStandard
                    className={"mt-35 mb-35"}
                    icon={<i className="ion-edit"/>}
                    to={`${url.guardian}/${parentId}/${url.statement}/add`}>
                    <span className="button-standard">Add Transaction</span>
                </ButtonStandard>

                <ContentLoader
                    pagination={{
                        stmtCurrentPage,
                        onPageChange: this.fetchData,
                        total: statement.count,
                    }}

                    data={statement.currentCollection}
                    forceRefresh
                    isLoading={statement.isLoading}
                    noResults="No statement found">
                    <Table
                        className={"stmt-table header-transparent"}
                        total={statement.total}
                        headers={['Date', 'Description', 'Amount', 'Option']}
                        icon="ion-pound"
                    >
                        {_.map(statement.currentCollection, (stmtcol, id) => {
                            const stmt = statement.collection[stmtcol];
                            return (
                                <React.Fragment>
                                    <tr key={`licence${id}`}
                                        onClick={() => this.handleStatementDescription(stmt)}>
                                        <td className={"date"}>{fn.formatDate(stmt.date, 'D MMM YYYY')}</td>
                                        <td>
                                            {
                                                stmt.lines && _.size(stmt.lines) > 0 ?
                                                    selectedStatementId && selectedStatementId === stmt._id ?
                                                        <i className="ion ion-minus"/> : <i className="ion ion-plus"/>
                                                        :
                                                    ''
                                            }

                                            {
                                                stmt.transaction_id ? stmt.note : stmt.description
                                            }
                                        </td>
                                        <td className={"amount"}>
                                            {stmt.transaction_id ? `-£${stmt.amount}` : stmt.register_type === 'credit' ? `-£${_.replace(stmt.amount, '-', '')}` : `£${stmt.amount}`}
                                        </td>

                                        <td className="short table-options">
                                            {
                                                !_.isEmpty(stmt.register_type) ?
                                                    <div>
                                                        <a onClick={(e) => this.handleEditStatement(e, stmt)}>
                                                            <span className="icon">
                                                                <i className="ion-edit"></i>
                                                            </span>
                                                        </a>

                                                        <a href="#"
                                                           onClick={(e) => this.handleStatementDialogOpen(e, stmt)}>
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
                                                    _.map(stmt.lines, (line, id) => {
                                                        return (
                                                            <tr key={`licence${id}`} className="stmt-detail">
                                                                <td className={"date"}></td>
                                                                <td>
                                                                    <div className={"description"}>
                                                                        {line.line_title}
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
                                                        <tr className="stmt-detail" key={id}>
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
                    </Table>
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
