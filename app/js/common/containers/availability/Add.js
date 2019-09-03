import React from 'react';
import { DatePicker, Form, Select } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Back, FormButton, PageTitle } from 'app/components';

export default class Add extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			availabilityTypes: [],
		};
	}

	componentWillMount = async () => {
		const availabilityTypes = await api.get('/dropdown/availability-type');
		this.setState({
			availabilityTypes: availabilityTypes.data,
		});
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const response = await api.post('/availabilities', this.state);

		if (!api.error(response)) {
			fn.navigate(url.availability);
			fn.showAlert('Availability has been created successfully!', 'success');
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const { availabilityTypes } = this.state;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Register unavailability" />
				<section className="section section-form">
					<Form loader onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
						<Select
							label="Reason"
							name="type"
							onChange={this.handleInputChange}
							options={availabilityTypes}
							validation="required"
							wide
						/>
						<DatePicker
							futureOnly
							label="Start date"
							name="start_date"
							onChange={this.handleInputChange}
							validation="required"
						/>
						<DatePicker
							futureOnly
							label="End date"
							name="end_date"
							onChange={this.handleInputChange}
							validation="required"
						/>

						<div className="form-actions">
							<Back className="button">Cancel</Back>
							<FormButton label="Save" />
						</div>
					</Form>
				</section>
			</div>
		);
	}

}
