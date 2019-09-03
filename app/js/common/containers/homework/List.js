import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, Table } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ButtonStandard, ConfirmDialog, Link, PageDescription, PageTitle } from 'app/components';

@connect((store) => {
	return {
		homeworks: store.homework,
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
			type: 'HOMEWORK',
			url: `/homeworks?page=${currentPage}${filters}`,
			page: currentPage,
		}));
	}

	deleteData = async (id) => {
		const response = await api.delete(`/homeworks/${id}`);

		if (!api.error(response)) {
			fn.showAlert('Homework has been deleted!', 'success');
			this.fetchData();
		}
	}

	render() {
		const { homeworks, params } = this.props;
		const { currentPage } = this.state;
		const type = fn.getFaqType('Homework')
		const tableHeader = fn.isGuardian() ? ['', 'Date', 'Kid', 'Options'] : ['', 'Date', 'Team', 'Options'];

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Homework"
						   faq={true}
						   faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}/>

				<PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.</PageDescription>

				{fn.isCoach() &&
					<div className="page-actions">
						<ButtonStandard to={`${url.homework}/add`} icon={<i className="ion-edit" />}>Add homework</ButtonStandard>
					</div>
				}

				<ContentLoader
					filter={{
						filters: homeworks.filters,
						onUpdate: this.fetchData,
					}}
					pagination={{
						currentPage,
						onPageChange: this.fetchData,
						total: homeworks.count,
					}}
					data={homeworks.currentCollection}
					forceRefresh
					isLoading={homeworks.isLoading}
					notFound="No homeworks"
				>
					<Table
						total={homeworks.count}
						headers={tableHeader}
						icon="ion-edit"
					>
						{_.map(homeworks.currentCollection, (id) => {
							const homework = homeworks.collection[id];
							const urlPlayerArg = fn.isGuardian() ? `/player/${homework.player_id}` : '';

							return (
								<tr key={`homework_${homework.id}`}>
									<td><Link to={`${url.homework}/${homework.homework_id}${urlPlayerArg}`}>{homework.title}</Link></td>
									<td>{fn.formatDate(homework.created_at)}</td>
									{fn.isCoach() && <td>{homework.team_name}</td>}
									{fn.isGuardian() && <td>{homework.player_name}</td>}
									<td className="table-options">
										<Link to={`${url.homework}/${homework.homework_id}${urlPlayerArg}`} className="button icon"><i title="View" className="ion-search" /></Link>
										{(fn.isAdmin() || fn.isCoach()) &&
											<ConfirmDialog
												onConfirm={() => this.deleteData(homework.homework_id)}
												title=""
												body={
													<h3>Are you sure you want to delete?</h3>
												}
											>
												<span className="button icon"><i title="Delete" className="ion-trash-b" /></span>
											</ConfirmDialog>
										}
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
