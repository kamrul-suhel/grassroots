import React from 'react';
import { DatePicker, FileUpload, Form, Radio, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Back, FormButton, FormSection, PageTitle } from 'app/components';

export default class Add extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			genderList: [
				{ id: 'male', title: 'Male' },
				{ id: 'female', title: 'Female' },
			],
		};
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const formData = new FormData();
		this.state.firstName && formData.append('first_name', this.state.firstName);
		this.state.lastName && formData.append('last_name', this.state.lastName);
		this.state.birthday && formData.append('birthday', this.state.birthday);
		this.state.gender && formData.append('gender', this.state.gender);
		this.state.school && formData.append('school', this.state.school);
		this.state.medicalConditions && formData.append('medicalConditions', this.state.medicalConditions);
		this.state.pic && formData.append('pic', this.state.pic);

		const response = await api.post('/players', formData);

		if (!api.error(response)) {
			fn.navigate(url.kid);
			fn.showAlert('Child has been created successfully!', 'success');
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const { genderList } = this.state;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Add Player" />
				<Form loader wide onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
					<FormSection title="Personal details">
						<TextInput
							label="First name"
							name="firstName"
							onChange={this.handleInputChange}
							validation="required"
						/>
						<TextInput
							label="Last name"
							name="lastName"
							onChange={this.handleInputChange}
							validation="required"
						/>
						<DatePicker
							label="Date of birth"
							name="birthday"
							onChange={this.handleInputChange}
							pastOnly
							showYearSelect
							validation="required"
						/>
						<TextInput
							label="School"
							name="school"
							onChange={this.handleInputChange}
							validation="required"
						/>
						<Radio
							label="Gender"
							name="gender"
							onChange={this.handleInputChange}
							options={genderList}
							styled
							validation="required"
						/>
						<FileUpload
							accept=".jpg,.jpeg,.png"
							clearable
							label="Profile image"
							name="pic"
							onChange={this.handleInputChange}
							prepend={<i className="ion-android-upload" />}
							validation="file|max:1000"
						/>
						<TextInput
							label="Medical notes"
							name="medicalConditions"
							onChange={this.handleInputChange}
							textarea
							wide
						/>

						<div className="form-actions">
							<Back className="button">Cancel</Back>
							<FormButton label="Save" />
						</div>
					</FormSection>

				</Form>
			</div>
		);
	}

}
