import React from 'react';
import {Form, FileUpload, TextInput, Dialog} from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Back, FormButton, FormSection, PageTitle } from 'app/components';

export default class Add extends React.PureComponent {

	constructor(props) {
		super(props)

		this.state = {
			guardianError: false,
			errorMessage: ''
		}
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	closeBox = () => {
		this.setState({
			guardianError: false,
			errorMessage: ''
		})
		this.refDialog.close()
	}

	handleSubmit = async () => {
		const formData = new FormData();
		formData.append('address', this.state.address);
		formData.append('email', this.state.email);
		formData.append('emergency_number', this.state.emergency_number);
		formData.append('first_name', this.state.first_name);
		formData.append('last_name', this.state.last_name);
		formData.append('mobile', this.state.mobile);
		formData.append('password_confirmation', this.state.password);
		formData.append('password', this.state.password);
		formData.append('postcode', this.state.postcode);
		formData.append('role', 3); // guardian
		formData.append('telephone', this.state.telephone);
		formData.append('town', this.state.town);
		formData.append('partner_name', this.state.partner_name);
		formData.append('partner_tel', this.state.partner_tel);

		const response = await api.post('/users', formData);

		if (!api.error(response, false)) {
			fn.navigate(url.guardian);
			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option: {
					message:'Guardian has been created successfully!',
					color:'dark'
				}
			})
		} else {
			const errorHtml = api.getErrorsHtml(response.data);

			this.setState({
				statementError: true,
				errorMessage : errorHtml,
			});
		}
		this.refForm && this.refForm.hideLoader();
		this.refDialog.open();
	}

	render() {
		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Add new parent/guardian" />
				<Form loader wide onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
					<FormSection title="Account">
						<TextInput
							className="tooltips"
							placeholder="Email"
							label="Email"
							name="email"
							onChange={this.handleInputChange}
							prepend={<i className="ion-android-mail" />}
							validation="required"
						/>
						<TextInput
							className="tooltips"
							placeholder="Password"
							label="Password"
							name="password"
							onChange={this.handleInputChange}
							prepend={<i className="ion-locked" />}
							type="password"
							validation="required"
						/>
					</FormSection>

					<FormSection title="Personal Details">
						<TextInput
							className="tooltips"
							placeholder="First name"
							label="First name"
							name="first_name"
							onChange={this.handleInputChange}
							prepend={<i className="ion-person" />}
							validation="required"
						/>
						<TextInput
							className="tooltips"
							placeholder="Last name"
							label="Last name"
							name="last_name"
							onChange={this.handleInputChange}
							prepend={<i className="ion-person" />}
							validation="required"
						/>
						<TextInput
							className="tooltips"
							placeholder="Mobile"
							label="Mobile"
							name="mobile"
							onChange={this.handleInputChange}
							prepend={<i className="ion-android-phone-portrait" />}
						/>
						<TextInput
							className="tooltips"
							placeholder="Telephone"
							prepend={<i className="ion-ios-telephone" />}
							name="telephone"
							label="Telephone"
							onChange={this.handleInputChange}
						/>
						<TextInput
							className="tooltips"
							placeholder="Emergency contact number"
							label="Emergency Contact Number"
							name="emergency_number"
							onChange={this.handleInputChange}
							prepend={<i className="ion-ios-telephone" />}
						/>
						<TextInput
							className="tooltips"
							placeholder="Address"
							label="Address"
							name="address"
							onChange={this.handleInputChange}
							prepend={<i className="ion-location" />}
						/>
						<TextInput
							className="tooltips"
							placeholder="City"
							label="City"
							name="city"
							onChange={this.handleInputChange}
							prepend={<i className="ion-location" />}
						/>
						<TextInput
							className="tooltips"
							placeholder="Postcode"
							label="Postcode"
							name="postcode"
							onChange={this.handleInputChange}
							prepend={<i className="ion-location" />}
						/>
						<TextInput
							className="tooltips"
							placeholder="Add partner"
							label="Add Partner"
							name="partner_name"
							onChange={this.handleInputChange}
							prepend={<i className="ion-person" />}
						/>
						<TextInput
							className="tooltips"
							placeholder="Partner's telephone"
							label="Partner's Telephone"
							name="partner_tel"
							onChange={this.handleInputChange}
							prepend={<i className="ion-ios-telephone" />}
						/>

						<div className="form-actions">
							<Back className="button" confirm>Cancel</Back>
							<FormButton label="Save" />
						</div>
					</FormSection>

				</Form>

				<Dialog
					ref={ref => this.refDialog = ref}
					close={false}
					showCloseButton={false}
					content={
						<div className="dialog-body-inner">
							<div className={"dialog-left-sidebar"}>
								<img src={'/images/ball-soccer.png'}/>
							</div>
							<div className={"dialog-right-side"}>
								<h3>{Error}</h3>
								{this.state.errorMessage}
							</div>
						</div>
					}
					buttons={[
						<button className="button" onClick={() => this.closeBox()}>Go Back</button>,
					]}
				>
					<button className="button hidden"></button>
				</Dialog>
			</div>
		);
	}

}
