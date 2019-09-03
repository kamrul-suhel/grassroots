import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, Table } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ButtonStandard, ConfirmDialog, Link, PageDescription, PageTitle } from 'app/components';

@connect((store) => {
	return {
		assessments: store.coachAssessment,
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
			type: 'COACH_ASSESSMENT',
			url: `/assessments?page=${currentPage}${filters}`,
			page: currentPage,
		}));
	}

	deleteData = async (id) => {
		const response = await api.delete(`/assessments/${id}`);

		if (!api.error(response)) {
			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option: {
					message:'Coach assessment has been deleted!',
					color:'dark'
				}
			})
			this.fetchData();
		}
	}

	render() {
		const { assessments, params } = this.props;
		const { currentPage } = this.state;
		return (
			<div id="content" className="site-content-inner coach-assessment">
				<PageTitle value="Coach assesments"
						   faq={true}
						   faqLink={fn.getFaqLink(`caCoachAssessments`, `/${params.clubSlug}/`)}/>

				<PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.</PageDescription>

				{fn.isAdmin() &&
					<div className="page-actions">
						<ButtonStandard to={`${url.coachAssessment}/add`}
										className="medium"
										icon={<i className="ion-checkmark" />}>Assess A Coach
						</ButtonStandard>

						<ButtonStandard to={`${url.assessmentTemplate}/add`}
										className="large"
										icon={<i className="ion-edit" />}>Create New Assessment Form
						</ButtonStandard>

						<ButtonStandard to={url.assessmentTemplate}
										className="large"
										icon={<i className="ion-folder" />}>View Existing Assessment Form
						</ButtonStandard>
					</div>
				}

				<ContentLoader
					filter={{
						filters: assessments.filters,
						onUpdate: this.fetchData,
					}}
					pagination={{
						currentPage,
						onPageChange: this.fetchData,
						total: assessments.count,
					}}
					data={assessments.currentCollection}
					forceRefresh
					isLoading={assessments.isLoading}
					notFound="No assessment"
				>
					<Table
						className={"header-transparent"}
						total={assessments.count}
						headers={['Title', 'Assessment Form', 'Date Created', 'Completed', 'Options']}
						icon="ion-android-clipboard"
					>
						{_.map(assessments.currentCollection, (id) => {
							const assessment = assessments.collection[id]
							const coachLink = (assessment.status === 1 ? <td><Link to={`${url.coachAssessment}/${assessment.id}`}>{assessment.coach_name}</Link></td> : <td><Link to={`${url.coachAssessment}/${assessment.id}/edit`}>{assessment.coach_name}</Link></td>)
							const complete = (assessment.status === 1 ? <i className="ion-checkmark" /> : <i className="ion-close" />);
							return (
								<tr key={`assessment_${assessment.id}`}>
									{coachLink}
									<td>{assessment.title}</td>
									<td>{fn.formatDate(assessment.created_at)}</td>
									<td className="table-options">{complete}</td>
									<td className="short table-options">
										<ConfirmDialog
											showCloseButton={false}
											onConfirm={() => this.deleteData(assessment.id)}
											title=""
											body={
												<React.Fragment>
													<h3>Confirm</h3>
													<p>Are you sure you want to delete?</p>
												</React.Fragment>
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
