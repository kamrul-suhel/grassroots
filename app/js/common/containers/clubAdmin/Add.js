import React from 'react';
import { Form, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Back, FormButton, PageTitle } from 'app/components';

export default class Add extends React.PureComponent {

	constructor(props) {
		super(props);

		this.clubId = this.props.params.clubId;
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const formData = new FormData();
		formData.append('club_id', this.clubId);
		formData.append('email', this.state.email);
		formData.append('first_name', this.state.firstName);
		formData.append('last_name', this.state.lastName);
		formData.append('no_address', 1);
		formData.append('password_confirmation', this.state.password);
		formData.append('password', this.state.password);
		formData.append('role', 1); // admin
		formData.append('telephone', this.state.telephone);

		const response = await api.post('/auth/register', formData);

		if (!api.error(response)) {
			fn.navigate(`${url.club}/${this.clubId}/admins`);
			fn.showAlert('Club admin has been created successfully!', 'success');
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Add new admin" />

				<Form loader wide onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
					<TextInput
						label="Email"
						name="email"
						onChange={this.handleInputChange}
						prepend={<i className="ion-android-mail" />}
						validation="required"
					/>
					<TextInput
						label="Password"
						name="password"
						onChange={this.handleInputChange}
						prepend={<i className="ion-locked" />}
						type="password|min:6"
						validation="required"
					/>
					<TextInput
						label="First name"
						name="firstName"
						onChange={this.handleInputChange}
						prepend={<i className="ion-person" />}
						validation="required"
					/>
					<TextInput
						label="Last name"
						name="lastName"
						onChange={this.handleInputChange}
						prepend={<i className="ion-person" />}
						validation="required"
					/>
					<TextInput
						label="Telephone"
						name="telephone"
						onChange={this.handleInputChange}
						prepend={<i className="ion-person" />}
					/>

					<div className="form-actions">
						<Back className="button" confirm>Cancel</Back>
						<FormButton label="Save" />
					</div>
				</Form>
			</div>
		);
	}

}
