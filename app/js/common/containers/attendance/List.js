import React from 'react';
import { connect } from 'react-redux';
import { fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ContentLoader, Table } from '@xanda/react-components';
import { Link, PageTitle } from 'app/components';

@connect((store) => {
	return {
		attendance: store.attendance,
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
			type: 'ATTENDANCE',
			url: `/sessions?past=true&page=${currentPage}${filters}`,
			page: currentPage,
		}));
	}

	render() {
		const { attendance, params } = this.props;
		const { currentPage } = this.state;
		const type = fn.getFaqType('Attendance')
		const userRole = fn.getUserRole();
		const accessRole = ['admin']
		const isUserCanUpdate = _.includes(accessRole, userRole) ? true : false

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Attendance"
						   faq={true}
						   faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}/>
				<ContentLoader
					filter={{
						filters: attendance.filters,
						onUpdate: this.fetchData,
					}}
					pagination={{
						currentPage,
						onPageChange: this.fetchData,
						total: attendance.count,
					}}
					data={attendance.currentCollection}
					forceRefresh
					isLoading={attendance.isLoading}
					notFound="No attendance"
				>
					<Table
						className="header-transparent"
						total={attendance.count}
						headers={['', 'Session', 'Venue', 'Time', 'Status', 'Options']}
						icon="ion-android-checkmark-circle"
					>
						{_.map(attendance.currentCollection, (id) => {
							const session = attendance.collection[id];
							const team = session.programme && session.programme.teams[0] ? session.programme.teams[0] : {};
							const takeAttendance = session.attendance_completed === 1 ? 'ion-search' : 'ion-edit';
							// const attendanceCompleted = session.attendance_completed === 1;
							return (
								<tr key={`session_${session.session_id}`}>
									<td>
										{fn.formatDate(session.start_time)}
									</td>

									<td>
										{isUserCanUpdate ? <Link to={`${url.team}/${team.team_id}`}>{team.title}</Link> : team.title}
									</td>

									<td>
										{isUserCanUpdate ?
											<Link to={`${url.contact}/${session.address && session.address.address_id}`}>
												{session.address && session.address.title}
											</Link> : session.address && session.address.title
										}
									</td>

									<td>
										{`${fn.formatDate(session.start_time, 'HH:mm')} - ${fn.formatDate(session.end_time, 'HH:mm')}`}
									</td>

									<td>
										{session.attendance_completed === 1 ? 'Completed' : 'Not completed'}
									</td>

									<td className="table-options">
										<Link to={`${url.attendance}/${session.session_id}`} className="button icon">
										<i title="Take Attendance" className={takeAttendance} />
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
