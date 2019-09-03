import React from 'react';
import { connect } from 'react-redux';
import { DatePicker, Form, Radio, Select, TextInput, TimePicker } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import {
	Back,
	FormButton,
	PageTitle,
	FormSection
} from 'app/components';
import moment from 'moment';

@connect((store, ownProps) => {
	return {
		request: store.request.collection[ownProps.params.requestId] || {},
	};
})
export default class Edit extends React.PureComponent {

	constructor(props) {
		super(props);

		this.requestId = this.props.params.requestId;

		this.state = {
			programmeTypes: [],
			venueTypes: [],
			coaches: []
		};
	}

	componentWillMount = async () => {
		this.fetchDate()

		// Get coaches
		const coaches = await api.get('dropdown/coaches')

		this.setState({
			coaches:[...coaches.data]
		})
	}

	fetchDate = async () => {
		this.props.dispatch(fetchData({
			type: 'REQUEST',
			url: `/requests/${this.requestId}`,
		}));

		const programmeTypes = await api.get('/dropdown/programme-types/event');
		const venueTypes = await api.get('/dropdown/venues');
		this.setState({
			programmeTypes: programmeTypes.data,
			venueTypes: venueTypes.data,
		});
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const {
			coachId,
			requireCoach
		} = this.state


		let formData = {
			end_time: moment(`${this.state.date} ${this.state.endTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:SS'),
			event_type_id: this.state.type,
			max_size: this.state.maxSize,
			notes: this.state.notes,
			start_time: moment(`${this.state.date} ${this.state.startTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:SS'),
			venue: this.state.venue
		};
		if(coachId){
			formData = {
				...formData,
				coach_id: coachId
			}
		}

		if(requireCoach){
			formData = {
				...formData,
				is_coach_required: requireCoach
			}
		}

		const response = await api.update(`/requests/${this.requestId}`, formData);

		if (!api.error(response)) {
			fn.navigate(url.event);
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	renderAminContent = (isCoachRequire, request) => {
		const { coaches } = this.state
		if(isCoachRequire === 1){
			return (
				<Select
					label="Select a coach"
					placeholder="Select a coach"
					name="coachId"
					onChange={this.handleInputChange}
					options={coaches}
					value={request.coach_id}
					className="tooltips"
					prepend={<i className="ion-person"/>}
				/>
			)
		}else{
			return(
				<Radio
					label="Require a coach"
					name="requireCoach"
					onChange={this.handleInputChange}
					options={[{ id: 1, title: 'Yes' }, { id: 0, title: 'No' }]}
					styled
					disabled
					value={isCoachRequire}
				/>
				)
		}
	}

	handleFormDisabled = (request) => {
		// if request status is 0 and user is guardian then disabled form for guardian
		if(request.status === 0 && fn.isGuardian()){
			return true
		}

		return false
	}

	render() {
		const {
			programmeTypes,
			venueTypes,
		} = this.state

		const {
			request
		} = this.props

		const coachRequire = request.is_coach_required === null ? 0 : request.is_coach_required

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Edit event" />
				{this.handleFormDisabled(request) && <p className="text-error">Not been review.</p>}
				<Form loader
					  onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
					<FormSection>
						<Select
							label="Type"
							name="type"
							onChange={this.handleInputChange}
							options={programmeTypes}
							validation="required"
							value={request.event_type_id}
							className="tooltips"
							disabled={this.handleFormDisabled(request)}
							prepend={<i className="ion-ios-bookmarks-outline"/>}
						/>

						<TextInput
							className="tooltips"
							placeholder="No of players"
							label="No of players"
							name="maxSize"
							validation="required"
							prepend={<i className="ion-person-stalker"/>}
							onChange={this.handleInputChange}
							value={request.max_size}
							disabled={this.handleFormDisabled(request)}
						/>

						{fn.isAdmin() ? this.renderAminContent(coachRequire, request)
							:
							<Radio
								label="Require a coach"
								name="requireCoach"
								onChange={this.handleInputChange}
								options={[{ id: 1, title: 'Yes' }, { id: 0, title: 'No' }]}
								styled
								value={coachRequire}
								disabled={this.handleFormDisabled(request)}
							/>
						}

						<Select
							className="tooltips"
							placeholder="Venue"
							label="Venue"
							name="venue"
							onChange={this.handleInputChange}
							options={venueTypes}
							validation="required"
							prepend={<i className="ion-location"/> }
							value={request.venue}
							disabled={this.handleFormDisabled(request)}
						/>
						<DatePicker
							className="tooltips"
							placeholder="Date"
							futureOnly
							label="Date"
							name="date"
							onChange={this.handleInputChange}
							returnFormat="YYYY-MM-DD"
							validation="required"
							prepend={<i className="ion-ios-calendar-outline"/> }
							value={request.start_time}
							disabled={this.handleFormDisabled(request)}
						/>

						<div className="programme-time">
							<TimePicker
								className="tooltips"
								placeholder="Start time"
								prepend={<i className="ion-android-time"/> }
								label="Start time"
								name="startTime"
								onChange={this.handleInputChange}
								validation="required"
								value={fn.formatDate(request.start_time, 'HH:mm')}
								disabled={this.handleFormDisabled(request)}
							/>
							<TimePicker
								className="tooltips"
								placeholder="End time"
								prepend={<i className="ion-android-time"/> }
								label="End time"
								name="endTime"
								onChange={this.handleInputChange}
								validation="required"
								value={fn.formatDate(request.end_time, 'HH:mm')}
								disabled={this.handleFormDisabled(request)}
							/>
						</div>

						<TextInput
							label="Notes"
							name="notes"
							onChange={this.handleInputChange}
							textarea
							value={request.notes}
							wide
							disabled={this.handleFormDisabled(request)}
						/>

						<div className="form-actions">
							<Back className="button">Cancel</Back>
							<FormButton label="Save"
										disabled={this.handleFormDisabled(request)}/>
						</div>
					</FormSection>
				</Form>
			</div>
		);
	}

}
