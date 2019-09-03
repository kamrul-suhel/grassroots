import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, Table } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ButtonStandard, Link, PageDescription, PageTitle } from 'app/components';

@connect((store) => {
	return {
		feedbacks: store.feedback,
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
			type: 'FEEDBACK',
			url: `/feedbacks?page=${currentPage}${filters}`,
			page: currentPage,
		}));
	}

	renderTable = () => {
		const { feedbacks } = this.props;
		const { currentPage } = this.state;

		switch (fn.getUserRole()) {
			case 'admin':
				return (
					<Table headers={['Feedback Form', 'Sent', 'Completed']}
						   total={feedbacks.count}
						   className={"header-transparent"}
						   icon="ion-android-clipboard">
						{_.map(feedbacks.currentCollection, (id) => {
							const feedback = feedbacks.collection[id];
							return (
								<tr key={`feedback_${feedback.feedback_id}`}>
									<td><Link to={`${url.feedback}/${feedback.feedback_id}`}>{feedback.title}</Link></td>
									<td className="text-right-align short short-form-fields">{feedback.sent_count}</td>
									<td className="text-right-align short short-form-fields">{feedback.completed_count}</td>
								</tr>
							);
						})}
					</Table>
				);
			default:
				return (
					<Table className="short-form-fields header-transparent"
						   total={feedbacks.count}
						   headers={['', 'Status', 'Options']}
						   icon="ion-android-clipboard">
						{_.map(feedbacks.currentCollection, (id) => {
							const feedback = feedbacks.collection[id];
							return (
								<tr key={`feedback_${feedback.feedback_id}`}>
									<td><Link to={`${url.feedback}/${feedback.feedback_id}`}>{feedback.title}</Link></td>
									<td>{feedback.completed === 1 ? 'Completed' : 'Pending'}</td>
									<td className="short">
										<Link to={`${url.feedback}/${feedback.feedback_id}`} className="button">
											{feedback.completed === 1 ? 'View answers' : 'Answer questions'}
										</Link>
									</td>
								</tr>
							);
						})}
					</Table>
				);
		}
	}

	render() {
		const { feedbacks, params } = this.props;
		const { currentPage } = this.state;
		const type = fn.getFaqType('Feedback')
		const noResult = fn.isGuardian() ? 'There are no feedback forms for you to complete at this time.' : 'No feedback';

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Feedback" faq={true}
						   faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}/>

				<PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.</PageDescription>

				{fn.isAdmin() &&
					<div className="page-actions">
						<ButtonStandard to={`${url.feedback}/add`}
										className="medium"
										icon={<i className="ion-edit" />}>Create feedback form
						</ButtonStandard>
					</div>
				}

				<ContentLoader
					collection={feedbacks}
					filter={{
						filters: feedbacks.filters,
						onUpdate: this.fetchData,
					}}
					pagination={{
						currentPage,
						perPage:feedbacks.misc.per_page,
						onPageChange: this.fetchData,
						total: feedbacks.count,
					}}
					data={feedbacks.currentCollection}
					forceRefresh
					isLoading={feedbacks.isLoading}
					noResults={noResult}
				>
					{this.renderTable()}
				</ContentLoader>
			</div>
		);
	}

}
