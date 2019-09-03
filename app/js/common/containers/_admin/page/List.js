import React from 'react';
import { connect } from 'react-redux';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ContentLoader, Table } from '@xanda/react-components';
import { ButtonStandard, Link, Meta, PageDescription, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		pages: store.page,
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
			type: 'PAGE',
			url: `/pages?page=${currentPage}${filters}`,
			page: currentPage,
		}));
	}

	render() {
		const { pages } = this.props;
		const { currentPage } = this.state;

		return (
			<div id="content" className="site-content-inner page-component">
				<PageTitle value="Legal & Content" />

				<ContentLoader
					filter={{
						filters: pages.filters,
						onUpdate: this.fetchData,
					}}
					pagination={{
						currentPage,
						onPageChange: this.fetchData,
						total: pages.count,
					}}
					data={pages.currentCollection}
					forceRefresh
					isLoading={pages.isLoading}
				>
					<Table
						headers={['Legal Documents', 'Edit']}
						icon="ion-document-text"
					>
						{_.map(pages.currentCollection, (slug) => {
							const page = pages.collection[slug];
							return (
								<tr key={`page${page.slug}`}>
									<td><Link to={`${url.page}/${page.slug}/edit`}>{page.title}</Link></td>
									<td className="short table-options">
										<Link to={`${url.page}/${page.slug}/edit`} className="button icon"><i title="Edit" className="ion-edit" /></Link>
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
