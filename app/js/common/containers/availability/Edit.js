import React from 'react';
import { connect } from 'react-redux';
import {DatePicker, Form, Select, TextInput} from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, FormButton, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		availability: store.availability.collection[ownProps.params.availabilityId] || {},
	};
})
export default class Edit extends React.PureComponent {

	constructor(props) {
		super(props);

		this.availabilityId = this.props.params.availabilityId;

		this.state = {
			availabilityTypes: [],
		};
	}

	componentWillMount = async () => {
		this.props.dispatch(fetchData({
			type: 'AVAILABILITY',
			url: `/availabilities/${this.availabilityId}`,
		}));

		const availabilityTypes = await api.get('/dropdown/availability-type');
		this.setState({
			availabilityTypes: availabilityTypes.data,
		});
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const { availability } = this.props;
		const formData = {
			type: this.state.type,
			start_date: this.state.start_date,
			end_date: this.state.end_date,
		};

		const response = await api.update(`/availabilities/${availability.availability_id}`, formData);

		if (!api.error(response)) {
			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option: {
					message:'Availability has been updated successfully!',
					color:'dark'
				}
			})
			fn.navigate(fn.isAdmin ? url.coachAvailability : url.availability);
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const { availability } = this.props;
		const { availabilityTypes } = this.state;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Edit availability" />
				<Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
					<Select
						className="tooltips"
						placeholder="Reason"
						label="Reason"
						name="type"
						onChange={this.handleInputChange}
						options={availabilityTypes}
						validation="required"
						value={availability.type_id}
						prepend={<i className="ion-calendar" />}
					/>
					<DatePicker
						futureOnly
						className="tooltips"
						placeholder="Start date"
						label="Start date"
						name="start_date"
						onChange={this.handleInputChange}
						validation="required"
						value={availability.start_date}
						prepend={<i className="ion-clock" />}
					/>
					<DatePicker
						futureOnly
						className="tooltips"
						placeholder="End date"
						label="End date"
						name="end_date"
						onChange={this.handleInputChange}
						validation="required"
						value={availability.end_date}
						prepend={<i className="ion-clock" />}
					/>

					<div className="form-actions">
						<Back className="button">Cancel</Back>
						<FormButton label="Save" />
					</div>
				</Form>
			</div>
		);
	}

}
