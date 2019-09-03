import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, Table } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Link, PageDescription, PageTitle } from 'app/components';

@connect((store) => {
	return {
		sessions: store.timetable,
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
			type: 'TIMETABLE',
			url: `/timetable?page=${currentPage}${filters}`,
			page: currentPage,
		}));
	}

	render() {
		const { sessions, params } = this.props;
		const { currentPage } = this.state;
		const type = fn.getFaqType('Timetable')

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Timetable"
						   faq={true}
						   faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}/>

				<PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.</PageDescription>
				<ContentLoader
					filter={{
						filters: sessions.filters,
						onUpdate: this.fetchData,
					}}
					pagination={{
						currentPage,
						onPageChange: this.fetchData,
						total: sessions.count,
					}}
					data={sessions.currentCollection}
					forceRefresh
					isLoading={sessions.isLoading}
					notFound="No sessions"
				>
					<Table headers={['', 'Time', 'Venue', 'Programme', 'Child']} icon="ion-android-time">
						{_.map(sessions.currentCollection, (id) => {
							const session = sessions.collection[id];
							return (
								<tr key={`session_${session.id}`}>
									<td><Link to={`${url.session}/${session.session_id}/player/${session.player_id}`}>{fn.formatDate(session.start_time)}</Link></td>
									<td>{`${fn.formatDate(session.start_time, 'HH:mm')} - ${fn.formatDate(session.end_time, 'HH:mm')}`}</td>
									<td><Link to={`${url.session}/${session.session_id}/player/${session.player_id}`}>{session.address}</Link></td>
									<td>{session.is_trial ? `${session.programme_name} - Trial` : session.programme_name}, {session.programme_type}</td>
									<td>{session.display_name}</td>
								</tr>
							);
						})}
					</Table>
				</ContentLoader>
			</div>
		);
	}

}
