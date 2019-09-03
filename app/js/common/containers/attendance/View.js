import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, GoogleMap, Radio, Select, Table, Tooltip, Slider, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Article, Link, Meta, MetaSection, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		collection: store.attendance,
		attendance: store.attendance.collection[ownProps.params.sessionId] || {},
		me: store.me
	};
})
export default class View extends React.PureComponent {

	constructor(props) {
		super(props);

		this.sessionId = this.props.params.sessionId;
		this.state = {
			inOutOptions: [
				{ id: 1, title: <span><i className="ion-checkmark" /></span> },
				{ id: 0, title: <span><i className="ion-close" /></span> },
			],
			players: {},
			trialScoreList: _.map(_.rangeRight(1, 11), (num) => { return { id: num, title: num }; }),
			rating: 1,
		};
	}

	componentWillMount() {
		this.props.dispatch({ type: 'ATTENDANCE_CLEAR' });
		this.props.dispatch(fetchData({
			type: 'ATTENDANCE',
			url: `/sessions/${this.sessionId}/players`,
		}));
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handlePlayerChange = (name, value, playerId) => {
		this.setState((prevState) => {
			return {

				players: {
					...prevState.players,
					[playerId]: {
						...prevState.players[playerId],
						[name]: value,
					},
				},
			};
		});
	}

	handleSubmit = async (event) => {
		event.preventDefault();
		const players = [];

		// loop through answers and create a preferred structure for API
		_.map(this.state.players, (value, key) => {

			const pod = value.attendance === 1 && this.state.pod == key ? 1 : 0;
			players.push({
				pod,
				player_id: key,
				trial_rating: value.trial_rating || null,
				status: value.attendance,
				reason: value.reason,
				rating: value.rating
			});
		});

		const formData = {
			players
		};
		const response = await api.update(`/sessions/${this.sessionId}/attendance`, formData);

		if (!api.error(response)) {
			fn.navigate(url.attendance);
			fn.showAlert('Attendance has been saved successfully!', 'success');
		}
	}

	render() {
		const {
			attendance,
			collection,
			rating,
		} = this.props;
		const { trialScoreList } = this.state;
		const isCompleted = attendance.attendance_completed === 1;

		return (
			<div id="content" className="site-content-inner attendance-component">
				<PageTitle value={attendance.programme_name || 'Take attendance'} />

				<ContentLoader
					data={attendance.session_id}
					forceRefresh
					isLoading={collection.isLoading}
					notFound="No Data"
				>
					<Article bg={<GoogleMap lat={attendance.lat} lng={attendance.lng} />}>
						<MetaSection title="Session">
							<p><strong>Name: </strong> {attendance.programme_name}</p>
							<p><strong>Type:</strong> {attendance.programme_type}</p>
							<p><strong>Date: </strong> {fn.formatDate(attendance.start_time)}</p>
							<p><strong>Time: </strong> {`${fn.formatDate(attendance.start_time, 'HH:mm')} - ${fn.formatDate(attendance.end_time, 'HH:mm')}`}</p>
						</MetaSection>
					</Article>

					<PageTitle value="Players" subTitle />

					<Table
						className="short-form-fields header-transparent"
						headers={['', 'In/Out', 'PoD', 'Player Rating' ,'Fees owed', 'Trial rating', 'Kit', 'Medical', 'Reason' ]}
						icon="ion-android-calendar"
						actions={!isCompleted && <span className="button" onClick={this.handleSubmit}>Save Attendance</span>}
					>
						{_.map(attendance.players, (player) => {
							const playerAttendance = isCompleted ? player.is_attended : 0;
							const pod = isCompleted ? attendance.pod_player_id : this.state.pod;
							const isAttended = this.state.players[player.player_id] && this.state.players[player.player_id].attendance == 1;
							const onChange = (k, v) => this.handlePlayerChange(k, v, player.player_id);
							const trialStatus = player.is_trial ? '- trialist' : '';
							const rating = player.rating;
							const trialRating = player.is_trial ? <Select wide disabled={isCompleted} className="short" name="trial_rating" value={player.trial_rating} options={trialScoreList} onChange={onChange} /> : `${player.trial_rating}/10`;
							const disabled = (!isAttended || isCompleted) ?  true :   false;
							return (
								<tr key={`player${player.player_id}`}>
									<td>
										<Link to={`${url.player}/${player.player_id}`}>{`${player.display_name} ${trialStatus}`}</Link>
									</td>

									<td>
										<Radio styled
											   disabled={isCompleted}
											   className="attendance-switch"
											   id={player.player_id}
											   name="attendance"
											   value={playerAttendance}
											   options={this.state.inOutOptions}
											   onChange={onChange} />
									</td>

									<td>
										<div className="pod-count">
											<Radio
												disabled={disabled}
												name="pod"
												value={pod}
												forcePropsToValue
												options={[{ id: player.player_id, title: player.pod_count }]}
												onChange={this.handleInputChange}
												styled
											/>
										</div>
									</td>

									<td>
										<div className="player-rating">
											<Slider
												disabled={disabled}
												onChange={onChange}
												wide={true}
												name="rating"
												value={rating}
											>
												<div>
													{rating}
												</div>
											</Slider>
										</div>
									</td>

									<td>No</td>

									<td>{trialRating}</td>

									<td>
										<div className="flex center">
											{player.missing_size && <Tooltip icon={<i className="ion-alert" />} message="Kit size not selected" />}
											<Link to={`${url.player}/${player.player_id}/kits`} className="button">{player.missing_size ? 'Set' : 'View'}</Link>
										</div>
									</td>

									<td>
										<Tooltip icon={<i className="ion-medkit" />} message={player.medical_conditions} />
									</td>

									<td>
										<TextInput
											name="reason"
											className="attendance_note"
											value={player.reason}
											onChange={onChange}
										/>
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
