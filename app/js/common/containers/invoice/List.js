import React from 'react';
import { connect } from 'react-redux';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ContentLoader, Table } from '@xanda/react-components';
import { ButtonStandard, ConfirmDialog, Item, Link, Meta, PageDescription, PageTitle } from 'app/components';

@connect((store) => {
	return {
		invoices: store.invoice,
	};
})
export default class List extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
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
			type: 'INVOICE',
			url: `/invoices?page=${currentPage}${filters}`,
			page: currentPage,
		}));
	}

	render() {
		const { invoices } = this.props;
		const { currentPage } = this.state;
		const filters = [
			{ key: 'search', label: 'Search', type: 'input' },
			{ key: 'start_date', label: 'Start date', type: 'datepicker' },
			{ key: 'end_date', label: 'End date', type: 'datepicker' },
		];

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Invoices" />

				<PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.</PageDescription>

				<div className="page-actions">
					<ButtonStandard to={`${url.invoice}/add`} icon={<i className="ion-plus" />}>Create invoice</ButtonStandard>
				</div>

				<ContentLoader
					filter={{
						filters,
						onUpdate: this.fetchData,
					}}
					data={invoices.currentCollection}
					forceRefresh
					isLoading={invoices.isLoading}
					notFound="No invoices"
				>
					<Table
						total={invoices.count}
						headers={['', 'Id', 'Party', 'Amount', 'Options']}
						icon="ion-android-contact"
					>
						{_.map(invoices.currentCollection, (id) => {
							const invoice = invoices.collection[id];
							return (
								<tr key={`invoice${invoice.id}`}>
									<td><Link to={`${url.invoice}/${invoice.id}`}>{fn.formatDate(invoice.date)}</Link></td>
									<td>{invoice.id}</td>
									<td>{invoice.party_name}</td>
									<td>{fn.formatPrice(invoice.amount)}</td>
									<td className="short table-options">
										<Link to={`${url.invoice}/${invoice.id}`} className="button icon"><i title="View" className="ion-search" /></Link>
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
