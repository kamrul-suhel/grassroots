import React from 'react';
import { connect } from 'react-redux';
import { DatePicker, FileUpload, Form, Radio, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, FormButton, FormSection, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		player: store.kid.collection[ownProps.params.playerId] || {},
	};
})
export default class Edit extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			genderList: [
				{ id: 'male', title: 'Male' },
				{ id: 'female', title: 'Female' },
			],
		};
	}

	componentWillMount = async () => {
		this.props.dispatch(fetchData({
			type: 'KID',
			url: `/players/${this.props.params.playerId}`,
		}));
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const formData = new FormData();
		this.state.firstName && formData.append('first_name', this.state.firstName);
		this.state.lastName && formData.append('last_name', this.state.lastName);
		this.state.birthday && formData.append('birthday', this.state.birthday);
		this.state.school && formData.append('school', this.state.school);
		this.state.gender && formData.append('gender', this.state.gender);
		this.state.medicalConditions && formData.append('medical_conditions', this.state.medicalConditions);
		this.state.pic && formData.append('pic', this.state.pic);

		const response = await api.update(`/players/${this.props.params.playerId}`, formData);

		if (!api.error(response)) {
			fn.navigate(url.kid);
			fn.showAlert('Player has been updated successfully!', 'success');
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const { player } = this.props;
		const { genderList } = this.state;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Edit child" />
				<Form loader wide onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
					<FormSection title="Personal details">
						<TextInput
							label="First name"
							name="firstName"
							onChange={this.handleInputChange}
							validation="required"
							value={player.first_name}
						/>
						<TextInput
							label="Last name"
							name="lastName"
							onChange={this.handleInputChange}
							validation="required"
							value={player.last_name}
						/>
						<DatePicker
							label="Date of birth"
							name="birthday"
							onChange={this.handleInputChange}
							pastOnly
							showYearSelect
							validation="required"
							value={player.birthday}
						/>
						<TextInput
							label="School"
							name="school"
							onChange={this.handleInputChange}
							validation="required"
							value={player.school}
						/>
						<Radio
							label="Gender"
							name="gender"
							onChange={this.handleInputChange}
							options={genderList}
							styled
							validation="required"
							value={player.gender}
						/>
						<FileUpload
							accept=".jpg,.jpeg,.png"
							clearable
							label="Change profile image"
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
							value={player.medical_conditions}
							wide
						/>
					</FormSection>

					<div className="form-actions">
						<Back className="button">Cancel</Back>
						<FormButton label="Save" />
					</div>
				</Form>
			</div>
		);
	}

}
