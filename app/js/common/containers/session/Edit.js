import React from 'react';
import { connect } from 'react-redux';
import { Checkbox, DatePicker, Form, Radio, Select, TimePicker } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, FormButton, PageTitle } from 'app/components';
import moment from 'moment';

@connect((store, ownProps) => {
	return {
		session: store.session.collection[ownProps.params.sessionId] || {},
	};
})
export default class Edit extends React.PureComponent {

	constructor(props) {
		super(props);

		this.sessionId = this.props.params.sessionId;

		this.state = {
			coachList: [],
			venueTypes: [],
			invalidDate: false
		};
	}

	componentWillMount = async () => {
		this.props.dispatch(fetchData({
			type: 'SESSION',
			url: `/sessions/${this.sessionId}`,
		}));

		const coachList = await api.get('/dropdown/coaches');
		const venueTypes = await api.get('/dropdown/venues');
		this.setState({
			coachList: coachList.data,
			venueTypes: venueTypes.data,
		});
	}

	handleInputChange = (name, value) => {

		// Set default state if date, end time or start time has change
		if(
			name === 'startTime' ||
			name === 'endTime' ||
			name === 'date'
		){
			this.setState({
				invalidDate: false
			})
		}

		this.setState({ [name]: value });
	}

	handleSubmit = async () => {

		const { coach} = this.state

		const formData = {
			coach_id: coach,
			end_date_time: moment(`${this.state.date} ${this.state.endTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:SS'),
			end_time: moment(this.state.endTime, 'HH:mm').format('HH:mm:SS'),
			start_date_time: moment(`${this.state.date} ${this.state.startTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:SS'),
			start_time: moment(this.state.startTime, 'HH:mm').format('HH:mm:SS'),
			update_remaining: this.state.updateRemaining,
			venue_id: this.state.venue,
		}

		// Check start time greater then end time
		if(moment(formData.end_date_time).isBefore(formData.start_date_time)){
			this.setState({
				invalidDate: true
			})
			this.refForm && this.refForm.hideLoader()
			return
		}

		const response = await api.update(`/sessions/${this.sessionId}`, formData)

		if (!api.error(response)) {
			fn.navigate(`${url.programme}/${this.props.session.programme_id}`)
		} else {
			this.refForm && this.refForm.hideLoader()
		}
	}

	render() {
		const {
			coachList,
			venueTypes,
			invalidDate
		} = this.state
		const { session } = this.props
		const updateOptions = [
			{ id: 0, title: 'No' },
			{ id: 1, title: 'Yes' },
		];

		return (
			<div id="content" className="site-content-inner edit-session">
				<PageTitle value="Edit session" />
				<Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
					<Select
						className="tooltips"
						placeholder="Coach"
						name="coach"
						label="Coach"
						value={session.coach && session.coach.user_id}
						options={coachList}
						onChange={this.handleInputChange}
						prepend={<i className="ion-person" />}
					/>

					<DatePicker
						className="tooltips"
						placeholder="Date"
						name="date"
						label="Date"
						value={session.start_time}
						returnFormat="YYYY-MM-DD"
						futureOnly
						onChange={this.handleInputChange}
						prepend={<i className="ion-calendar" />}
					/>

					<TimePicker
						className="tooltips"
						placeholder="Start time"
						name="startTime"
						label="Start time"
						value={fn.formatDate(session.start_time, 'HH:mm')}
						onChange={this.handleInputChange}
						prepend={<i className="ion-clock" />}
					/>

					<TimePicker
						className="tooltips"
						placeholder="End time"
						name="endTime"
						label="End time"
						value={fn.formatDate(session.end_time, 'HH:mm')}
						onChange={this.handleInputChange}
						prepend={<i className="ion-clock" />}
					/>

					<Select
						className="tooltips"
						placeholder="Venue"
						name="venue"
						label="Venue"
						value={session.address && session.address.address_id}
						options={venueTypes}
						onChange={this.handleInputChange}
						prepend={<i className="ion-location" />}
					/>

					<Radio
						styled
					   name="updateRemaining"
					   label="Do you want to update all future sessions in this programme with these changes?"
					   value="0"
						options={updateOptions}
						onChange={this.handleInputChange}
					/>

					<div className="form-actions">
						{invalidDate && <span className="text-error">Invalid data & time format</span>}

						<Back className="button">Cancel</Back>
						<FormButton label="Save" />
					</div>
				</Form>
			</div>
		);
	}

}
