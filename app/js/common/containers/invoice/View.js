import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, GoogleMap, Table, Tooltip } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Article, Link, Meta, MetaSection, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		collection: store.invoice,
		invoice: store.invoice.collection[ownProps.params.invoiceId] || {},
	};
})
export default class View extends React.PureComponent {

	constructor(props) {
		super(props);

		this.invoiceId = this.props.params.invoiceId;
	}

	componentWillMount() {
		this.props.dispatch(fetchData({
			type: 'INVOICE',
			url: `/invoices/${this.invoiceId}`,
		}));
	}

	render() {
		const {
			collection,
			invoice,
		} = this.props;
		const pageTitle = `${invoice.id} Invoice`;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value={pageTitle} />

				<ContentLoader
					data={invoice.id}
					forceRefresh
					isLoading={collection.isLoading}
					notFound="No Data"
				>
					<Article>
						<Meta label="Date" value={fn.formatDate(invoice.date)} />
						<Meta label="Description" value={invoice.description} />
					</Article>

					<Table
						headers={['', 'VAT Rate', 'Amount']}
						footer={<Meta key="balace" label="Balance" value={fn.formatPrice(invoice.amount)} />}
					>
						{invoice.lines && invoice.lines.map(line => (
							<tr key={`invoiceLine${line.id}`}>
								<td>{line.title}</td>
								<td>{`${invoice.vat_rate}%`}</td>
								<td>{fn.formatPrice(line.amount)}</td>
							</tr>
						))}
					</Table>
				</ContentLoader>
			</div>
		);
	}

}
