import React from 'react';
import { connect } from 'react-redux';
import {ContentLoader, Table, Select, DatePicker} from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Link, PageTitle } from 'app/components';

@connect((store) => {

	return {
		coaches: store.coach.collection || {},
		schedules: store.schedule,
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
		if (fn.isAdmin()) {
			this.fetchCoachData();
			this.fetchData();
		} else {
			this.fetchData();
		}
	}


	fetchCoachData = () => {
		this.props.dispatch(fetchData({
			type: 'COACH',
			url: '/coaches',
		}));
	}

	handleInputChange = (name, value) => this.setState({ [name]: value }, this.fetchData);

	fetchData = (currentPage = 1, newFilters) => {

		this.setState({
			currentPage,
			filters: newFilters || this.state.filters,
		});
		const filters = newFilters === undefined ? this.state.filters : newFilters;

		const coachId = this.state.coach;

		const coachParam = fn.isAdmin() ? `&coach_id=${coachId}` : '';

		this.props.dispatch(fetchData({
			type: 'SCHEDULE',
			url: `/sessions?page=${currentPage}${filters}${coachParam}`,
			page: currentPage,
		}));
	}

	deleteData = async (id) => {
		const response = await api.delete(`/sessions/${id}`);

		if (!api.error(response)) {
			fn.showAlert('Schedule has been deleted!', 'success');
			this.fetchData();
		}
	}

	render() {
		const { schedules, coaches, params } = this.props;
		const { currentPage } = this.state;
		const type = fn.getFaqType('Schedule')
		const scheduleOptions = Object.values(coaches) || [];
		console.log("Schedules is: ", schedules)
		
		return (
			<div id="content" className="site-content-inner coach-schedule">
				<PageTitle value={`${fn.isAdmin() ? 'Coach ' : ''}schedule`}
						   faq={true}
						   faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}/>

				{fn.isAdmin() &&
					<Select
						className="tooltips coach"
						placeholder="Coach"
						name="coach"
						label="Coach"
						valueKey="user_id"
						labelKey="display_name"
						options={scheduleOptions}
						onChange={this.handleInputChange}
						skipInitialOnChangeCall
						prepend={<i className="ion-person" />}
					/>
				}

				<ContentLoader
					filter={{
						filters: schedules.filters,
						onUpdate: this.fetchData,
					}}
					pagination={{
						currentPage,
						onPageChange: this.fetchData,
						total: schedules.count,
					}}
					data={schedules.currentCollection}
					forceRefresh
					isLoading={schedules.isLoading}
					notFound="No schedules"
				>
					<Table
						className={"header-transparent"}
						headers={[...(fn.isAdmin() ? ['Coach'] : []), 'Date', 'Session', 'Venue', 'Time', 'Options']}
						icon="ion-clock"
					>
						{_.map(schedules.currentCollection, (id) => {
							const session = schedules.collection[id];
							return (
								<tr key={`session_${session.session_id}`}>
									{fn.isAdmin() && <td>{this.props.coaches[session.coach_id] && this.props.coaches[session.coach_id].display_name}</td>}
									<td><Link to={`${url.session}/${session.session_id}`}>{fn.formatDate(session.start_time)}</Link></td>
									<td>{session.programme.teams && !_.isEmpty(session.programme.teams) && session.programme.teams[0].title}</td>
									<td>{session.address.title && session.address.title}</td>
									<td>{fn.formatDate(session.start_time, 'HH:mm')} - {fn.formatDate(session.end_time, 'HH:mm')}</td>

									<td className="table-options">
										<Link to={`${url.session}/${session.session_id}`}
											  className="button icon">
											<i title="View" className="ion-search" />
										</Link>
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
