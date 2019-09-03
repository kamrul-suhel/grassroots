import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, Table } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ButtonStandard, ConfirmDialog, Link, PageDescription, PageTitle } from 'app/components';

@connect((store) => {
	return {
		requests: store.request,
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
			type: 'REQUEST',
			url: `/requests?page=${currentPage}${filters}`,
			page: currentPage,
		}));
	}

	deleteData = async (id) => {
		const response = await api.delete(`/requests/${id}`);

		if (!api.error(response)) {
			fn.showAlert('Request has been deleted!', 'success');
			this.fetchData();
		}
	}

	renderPageActions = () => {
		switch (fn.getUserRole()) {
			case 'guardian':
				return (
					<div className="page-actions">
						<ButtonStandard to={`${url.event}/add`} icon={<i className="ion-edit" />}>Book a party</ButtonStandard>
					</div>
				);
			// case 'admin':
			// 	return (
			// 		<div className="page-actions">
			// 			{/*<ButtonStandard to={`${url.event}/add-event`} icon={<i className="ion-edit" />}>Create new event</ButtonStandard>*/}
			// 		</div>
			// 	);
			default:
				return null;
		}
	}

	render() {
		const { requests, params } = this.props;
		const { currentPage } = this.state;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Events request"
						   faq={true}
						   faqLink={fn.getFaqLink(`caEvents`, `/${params.clubSlug}/`)}/>

				<PageDescription>This table shows all event requests made by your parents. You will be required to accept or reject requests. Accepted requests will appear in your calendar.</PageDescription>

				{this.renderPageActions()}

				<ContentLoader
					filter={{
						filters: requests.filters,
						onUpdate: this.fetchData,
					}}
					pagination={{
						currentPage,
						onPageChange: this.fetchData,
						total: requests.count,
					}}
					data={requests.currentCollection}
					forceRefresh
					isLoading={requests.isLoading}
					notFound="No requests"
				>
					<Table
						className={"header-transparent"}
						headers={['', 'Date', 'Time', 'Coach', 'Guardian', 'Status', 'Options']}
						icon="ion-ios-book">
						{_.map(requests.currentCollection, (id) => {
							const request = requests.collection[id];
							return (
								<tr key={`request_${request.request_id}`}>
									<td>
										<Link to={`${url.event}/${request.request_id}`}>{request.event_type}
										</Link>
									</td>

									<td>{fn.formatDate(request.start_time)}</td>

									<td>{`${fn.formatDate(request.start_time, 'HH:mm')} - ${fn.formatDate(request.end_time, 'HH:mm')}`}</td>

									<td>{request.is_coach_required === 1 ? 'Yes' : 'No'}</td>

									<td>{request.created_by}</td>

									<td>{fn.formatProgrammeStatus(request.status)}</td>

									<td className="short">
										<Link to={`${url.event}/${request.request_id}`}
											  className="button icon"><i title="View" className="ion-search" />
										</Link>

										<ConfirmDialog
											onConfirm={() => this.deleteData(request.request_id)}
											title="Are you sure you want to delete?">

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
