import React from 'react';
import { connect } from 'react-redux';
import { DatePicker, FileUpload, Form, Radio, Select, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import View from './View'
import {
	Back,
	FormButton,
	FormSection,
	PageTitle,
	ButtonStandard,
	HeaderLogo
} from 'app/components';
import moment, { months } from 'moment';
import _ from "lodash";

@connect((store, ownProps) => {
	return {
		player: store.player.collection[ownProps.params.playerId] || {},
	};
})
export default class Edit extends React.PureComponent {

	constructor(props) {
		super(props);

		this.playerId = this.props.params.playerId;

		this.state = {
			genderList: [
				{ id: 'male', title: 'Male' },
				{ id: 'female', title: 'Female' },
			],
			guardianList: [],
			statusList: []
		};
	}

	componentWillMount = async () => {
		this.fetchData()
	}

	async fetchData(){
		this.props.dispatch(fetchData({
			type: 'PLAYER',
			url: `/players/${this.playerId}`,
		}));

		const statusList = await api.get('/dropdown/player-statuses');
		const guardianList = await api.get('/dropdown/guardians');
		this.setState({
			guardianList: guardianList.data,
			statusList: statusList.data,
		});
	}

	handleInputChange = async (name, value) => {
		this.setState({ [name]: value });

		if ( name === "birthday") {
			moment.updateLocale('en', {
				relativeTime: {
					past: '%s'
				}
			});

			const agegroupList = await api.get('/age-groups')

			let playerAgegroup
			_.forEachRight(agegroupList.data.entities, (agegroup)=> {
				if ( agegroup.max_age > fn.diffDate(value) ) { playerAgegroup = {...agegroup} }
			})

			if (playerAgegroup) {
				this.setState({ potentialAgeGroup: playerAgegroup.title })
			} else {
				this.setState({potentialAgeGroup: ''})
			}
		}
	}

	handleSubmit = async () => {
		const formData = new FormData();
		this.state.firstName && formData.append('first_name', this.state.firstName);
		this.state.lastName && formData.append('last_name', this.state.lastName);
		this.state.middleName && formData.append('middle_name', this.state.middleName);
		this.state.fanNumber && formData.append('fan_no', this.state.fanNumber);
		this.state.birthday && formData.append('birthday', this.state.birthday);
		this.state.gender && formData.append('gender', this.state.gender);
		this.state.school && formData.append('school', this.state.school);
		this.state.livingGuardian && formData.append('living_guardian', this.state.livingGuardian);
		this.state.billingGuardian && formData.append('billing_guardian', this.state.billingGuardian);
		this.state.medicalConditions && formData.append('medical_conditions', this.state.medicalConditions);
		formData.append('status', this.state.status);
		this.state.pic && formData.append('pic', this.state.pic);
		const response = await api.update(`/players/${this.playerId}`, formData);

		if (!api.error(response)) {
            this.refForm && this.refForm.hideLoader();

            fn.scrollToTop();
            this.fetchData()
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const {
			player
		} = this.props;

		const { genderList, guardianList, statusList } = this.state;
		const displayName = player.display_name && player.display_name

		return (
			<div
				id="content"
				className="site-content-inner player-page"
			>
				<PageTitle value={displayName} />
				<ButtonStandard to={`${url.player}/${player.player_id}/all-assessments`}
								icon={<i className="ion-ios-analytics" />}>View Skill Assessments
				</ButtonStandard>
				<Form
					loader
					wide
					className="form-section"
					onSubmit={this.handleSubmit}
					ref={ref => this.refForm = ref}
				>
					<FormSection title="Personal details">
						<HeaderLogo logo={player.pic} top={-20}></HeaderLogo>
						<TextInput
							className="tooltips"
							placeholder="First name"
							label="First name"
							name="firstName"
							onChange={this.handleInputChange}
							prepend={<i className="ion-person" foo="bar" />}
							validation="required"
							value={player.first_name}
						/>
						<TextInput
							className="tooltips"
							placeholder="Last name"
							label="Last name"
							name="lastName"
							onChange={this.handleInputChange}
							prepend={<i className="ion-person" />}
							validation="required"
							value={player.last_name}
						/>

                        <TextInput
							className="tooltips"
							placeholder="Middle name"
                            label="Middle name"
                            name="middleName"
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-person" />}
                            value={player.middle_name}
                        />

                        <TextInput
							className="tooltips"
							placeholder="FAN No."
                            label="FAN No."
                            name="fanNumber"
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-person" />}
                            value={player.fan_no}
                        />

						<DatePicker
							className="tooltips"
							placeholder="Date of birth"
							label="Date of birth"
							name="birthday"
							onChange={this.handleInputChange}
							pastOnly
							showYearSelect
							validation="required"
							value={player.birthday}
							prepend={<i className="ion-calendar" />}
						/>

						<TextInput
							className="tooltips"
							placeholder="Suggested age group"
							label="Suggested Age Group"
							name="potential_age_group"
							value={this.state.potentialAgeGroup}
							prepend={<i className="ion-ios-people-outline" />}
							disabled
						/>

						<TextInput
							className="tooltips"
							placeholder="School"
							label="School"
							name="school"
							onChange={this.handleInputChange}
							validation="required"
							value={player.school}
							prepend={<i className="ion-university" />}
						/>
						<Select
							className="tooltips"
							placeholder="Living with..."
							label="Living with"
							name="livingGuardian"
							onChange={this.handleInputChange}
							options={guardianList}
							value={player.living_guardian}
							prepend={<i className="ion-person-add" />}
						/>
						<Select
							className="tooltips"
							placeholder="Billing contact"
							label="Billing contact"
							name="billingGuardian"
							onChange={this.handleInputChange}
							options={guardianList}
							value={player.billing_guardian}
							prepend={<i className="ion-person-add" />}
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
							className="tooltips"
							placeholder="Change profile image"
							accept=".jpg,.jpeg,.png"
							clearable
							label="Change profile image"
							name="pic"
							onChange={this.handleInputChange}
							prepend={<i className="ion-android-upload" />}
							validation="file|max:1000"
						/>
						<TextInput
							wide
							textarea
							name="medicalConditions"
							label="Medical notes"
							value={player.medical_conditions}
							onChange={this.handleInputChange}
						/>
						<Select
							className="tooltips"
							placeholder="Player status"
							label="Player status"
							name="status"
							onChange={this.handleInputChange}
							options={statusList}
							value={player.status}
						/>
					</FormSection>

					<div className="form-actions">
						<Back className="button" confirm>Cancel</Back>
						<FormButton label="Save personal details" />
					</div>
				</Form>

				<View {...this.props}></View>
			</div>
		);
	}

}
