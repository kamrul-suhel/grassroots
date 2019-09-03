import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, Table } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ButtonStandard, Meta, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		transactions: store.transaction,
		account: store.account.collection[ownProps.params.accountId] || {},
	};
})
export default class Statement extends React.PureComponent {

	constructor(props) {
		super(props);

		this.accountId = this.props.params.accountId;

		this.state = {
			currentPage: 1,
			filters: '',
			transactionCodeList: [],
		};
	}

	componentWillMount = async () => {
		this.fetchData();

		this.props.dispatch(fetchData({
			type: 'ACCOUNT',
			url: `/accounts/${this.accountId}`,
		}));

		const transactionCodeList = await api.get('/transaction-codes');
		this.setState({
			transactionCodeList: transactionCodeList.data.entities,
		});
	}

	fetchData = (currentPage = 1, newFilters) => {

		this.setState({
			currentPage,
			filters: newFilters || this.state.filters,
		});
		const filters = newFilters === undefined ? this.state.filters : newFilters;
		this.props.dispatch(fetchData({
			type: 'TRANSACTION',
			url: `/transactions?account_id=${this.accountId}&page=${currentPage}${filters}`,
			page: currentPage,
		}));
	}

	render() {
		const { account, transactions } = this.props;
		const { currentPage } = this.state;
		const filters = [
			{ key: 'start_date', label: 'Start date', type: 'datepicker' },
			{ key: 'end_date', label: 'End date', type: 'datepicker' },
			{
				key: 'code_id', label: 'Transaction type', type: 'select', options: this.state.transactionCodeList,
			},
		];

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value={`${account.title || ''} Statement`} />

				<div className="page-actions">
					<ButtonStandard to={url.account}>Accounts</ButtonStandard>
					<ButtonStandard to={`${url.account}/add-payment`}>Payments / Receipts</ButtonStandard>
					<ButtonStandard to={`${url.invoice}`}>Invoices</ButtonStandard>
					<ButtonStandard to={url.coach}>Coaches</ButtonStandard>
					<ButtonStandard to={url.guardian}>Parents</ButtonStandard>
					<ButtonStandard to={`${url.account}/settings`}>Settings</ButtonStandard>
					<ButtonStandard to="">Reports</ButtonStandard>
				</div>

				<ContentLoader
					filter={{
						filters,
						onUpdate: this.fetchData,
					}}
					pagination={{
						currentPage,
						onPageChange: this.fetchData,
						total: transactions.count,
					}}
					data={transactions.currentCollection}
					forceRefresh
					isLoading={transactions.isLoading}
					notFound="No statement"
				>
					<Table
						total={transactions.count}
						footer={<Meta key="balace" label="Balance" value={fn.formatPrice(transactions.misc.balance, false)} />}
						headers={['', 'Amount', 'Type', 'Party']}
						icon="ion-card"
					>
				>
						{_.map(transactions.currentCollection, (id) => {
							const transaction = transactions.collection[id];
							return (
								<tr key={`transaction_${transaction.id}`}>
									<td>{fn.formatDate(transaction.date)}</td>
									<td>{fn.formatPrice(transaction.amount)}</td>
									<td>{transaction.code}</td>
									<td>{transaction.party}</td>
								</tr>
							);
						})}
					</Table>
				</ContentLoader>
			</div>
		);
	}

}
