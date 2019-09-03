import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Table} from '@xanda/react-components';
import {fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {
    ButtonStandard,
    Meta,
    PageDescription,
    PageTitle,
    MetaSection
} from 'app/components';

@connect((store, ownProps) => {
    const userId = ownProps.params ? ownProps.params.userId : null;
    const userRole = ownProps.route.type || '';
    const userObject = store[userRole] ? store[userRole].collection[userId] : {};
    return {
        statements: store.statement,
        user: userObject,
        me: store.me
    };
})
export default class List extends React.PureComponent {

    constructor(props) {
        super(props);

        this.userId = this.props.params ? this.props.params.userId : null
        this.userRole = this.props.route.type || ''

        this.state = {
            currentPage: 1,
            filters: '',
        };
    }

    componentWillMount() {
        this.fetchData()

        if (this.userId) {
            this.props.dispatch(fetchData({
                type: `SINGLE_${this.userRole.toUpperCase()}`,
                url: `/users/${this.userId}`,
            }));
        }
    }

    fetchData = (currentPage = 1, newFilters) => {
        this.setState({
            currentPage,
            filters: newFilters || this.state.filters,
        });
        const filters = newFilters === undefined ? this.state.filters : newFilters;
        const userArg = this.userId ? `?user_id=${this.userId}&` : '?';

        // If user role is guardian then convert guardian to parent
        let userRole = this.userRole
        if (userRole === 'guardian') {
            userRole = 'parent'
        }

        this.props.dispatch(fetchData({
            type: 'STATEMENT',
            url: `/statements${userArg}statement_type=${userRole}&page=${currentPage}${filters}`,
            page: currentPage,
        }));
    }

    renderPageActions = () => {
        switch (this.userRole) {
            case 'coach':
                return (
                    <div className="page-actions">
                        <ButtonStandard icon={<i className="ion-plus"/>}>Send statement</ButtonStandard>
                        <ButtonStandard to={{
                            pathname: `${url.account}/add-payment`,
                            state: {userId: parseInt(this.userId), userRole: 'coach'}
                        }} icon={<i className="ion-plus"/>}>Make payment</ButtonStandard>
                        <ButtonStandard icon={<i className="ion-plus"/>}>Raise debit</ButtonStandard>
                    </div>
                );
            case 'guardian':
                return (
                    <div className="page-actions">
                        <ButtonStandard to={{
                            pathname: `${url.account}/add-payment`,
                            state: {userId: parseInt(this.userId), userRole: 'guardian'}
                        }} icon={<i className="ion-plus"/>}>
                            Register receipt
                        </ButtonStandard>
                    </div>
                );
        }
    }

    render() {
        const {statements, user, params, me} = this.props;
        const {currentPage} = this.state;
        let tableHeader = this.userRole === 'coach' ? ['', 'Description', 'Session fee'] : ['', 'Description', 'Inv', 'Rec', 'Method'];
        tableHeader = this.userRole === 'guardian' ? ['', 'Description', 'Fee'] : tableHeader
        const type = fn.getFaqType('Statements')
        const pageTitle = me.data && me.data.display_name ? `${me.data.display_name || ''}: Statements` : 'Statements';

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value={pageTitle}
                           faq={true}
                           faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}/>
                <PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem
                    nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit
                    non mi porta gravida at eget metus.</PageDescription>

                {/* Do we need this button to show */}
                {/*{this.renderPageActions()}*/}

                <MetaSection title="">
                    <Meta label="Total Fee"
                          value={fn.formatPrice(statements.misc.total_invoiced && statements.misc.total_invoiced)}/>
                    <Meta label="Total Received"
                          value={fn.formatPrice(statements.misc.total_paid && statements.misc.total_paid)}/>
                    <Meta label="Balance"
                          value={fn.formatPrice(statements.misc.balance && statements.misc.balance)}/>
                    <Meta label="Total: "
                          value={statements.count && statements.count}/>
                </MetaSection>

                <ContentLoader
                    filter={{
                        filters: statements.filters,
                        onUpdate: this.fetchData,
                    }}
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchData,
                        total: statements.count,
                    }}
                    data={statements.currentCollection}
                    forceRefresh
                    isLoading={statements.isLoading}
                    notFound="No statements"
                >
                    <Table
                        className="header-transparent"
                        total={statements.count}
                        headers={tableHeader}
                        icon="ion-briefcase"
                    >
                        {_.map(statements.currentCollection, (id) => {
                            const statement = statements.collection[id];
                            return (
                                <tr key={`statement${statement._id}`}>
                                    <td>{fn.formatDate(statement.date)}</td>
                                    <td>
                                        {
                                            statement.transaction_id ? statement.note : statement.description
                                        }
                                    </td>
                                    <td>{!statement.type && fn.formatPrice(statement.amount)}</td>
                                </tr>
                            );
                        })}
                    </Table>
                </ContentLoader>
            </div>
        );
    }

}
