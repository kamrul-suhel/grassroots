import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, Table } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ButtonStandard, ConfirmDialog, Link, PageDescription, PageTitle } from 'app/components';

@connect((store) => {
	return {
		availabilities: store.availability,
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
			type: 'AVAILABILITY',
			url: `/availabilities?page=${currentPage}${filters}`,
			page: currentPage,
		}));
	}

	deleteData = async (id) => {
		const response = await api.delete(`/availabilities/${id}`);

		if (!api.error(response)) {
			fn.showAlert('Availability has been deleted!', 'success');
			this.fetchData();
		}
	}

	render() {
		const { availabilities, params } = this.props;
		const { currentPage } = this.state;
		const type = fn.getFaqType('Availability')

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="My availability"
						   faq={true}
						   faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}/>

				<PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.</PageDescription>

				<div className="page-actions">
					<ButtonStandard to={`${url.availability}/add`} icon={<i className="ion-plus" />}>Register unavailability</ButtonStandard>
				</div>

				<ContentLoader
					filter={{
						filters: availabilities.filters,
						onUpdate: this.fetchData,
					}}
					pagination={{
						currentPage,
						onPageChange: this.fetchData,
						total: availabilities.count,
					}}
					data={availabilities.currentCollection}
					forceRefresh
					isLoading={availabilities.isLoading}
					notFound="No skill availabilities"
				>
					<Table headers={['', 'Period', 'Option']} icon="ion-android-calendar">
						{_.map(availabilities.currentCollection, (id) => {
							const availability = availabilities.collection[id];
							return (
								<tr key={`availability_${availability.availability_id}`}>
									<td>{availability.type}</td>
									<td>{`${fn.formatDate(availability.start_date)} - ${fn.formatDate(availability.end_date)}`}</td>
									<td className="table-options">
										<Link to={`${url.availability}/${availability.availability_id}/edit`} className="button icon"><i title="Edit" className="ion-edit" /></Link>
										<ConfirmDialog
											onConfirm={() => this.deleteData(availability.availability_id)}
											title=""
											body={
												<h3>Are you sure you want to delete?</h3>
											}
										>
											<span className="button icon"><i title="Delete" className="ion-trash-b" /></span>
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
