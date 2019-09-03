import React from 'react';
import { connect } from 'react-redux';
import { Checkbox, DatePicker, FileUpload, Form, MultiSelect, TextInput, Tooltip } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import {
	Back,
	Card,
	ConfirmDialog,
	FormButton,
	FormSection,
	PageTitle,
	HeaderLogo
} from 'app/components';

@connect((store, ownProps) => {
	return {
		coach: store.coach.collection[ownProps.params.userId] || {},
	};
})
export default class Edit extends React.PureComponent {

	constructor(props) {
		super(props);

		this.coachId = this.props.params.userId;

		this.state = {
			qualificationList: [],
			teamList: [],
		};
	}

	componentWillMount = async () => {
		this.props.dispatch(fetchData({
			type: 'COACH',
			url: `/coaches/${this.coachId}`,
		}));

		const qualificationList = await api.get('/dropdown/qualifications');
		const teamList = await api.get('/dropdown/teams/all');
		const formattedTeamList = teamList.data.map((team) => {
			return {
				...team,
				title: `${team.agegroup_title} - ${team.title} (${team.team_type === 'team' ? 'FC' : 'Soccer School'})`,
			};
		});
		this.setState({
			qualificationList: qualificationList.data,
			teamList: formattedTeamList,
		});
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const formData = new FormData();
		this.state.email && formData.append('email', this.state.email);
		this.state.password && formData.append('password', this.state.password);
		this.state.firstName && formData.append('first_name', this.state.firstName);
		this.state.lastName && formData.append('last_name', this.state.lastName);
		this.state.dob && formData.append('dob', this.state.dob);
		this.state.telephone && formData.append('telephone', this.state.telephone);
		this.state.mobile && formData.append('mobile', this.state.mobile);
		this.state.address && formData.append('address', this.state.address);
		this.state.town && formData.append('town', this.state.town);
		this.state.postcode && formData.append('postcode', this.state.postcode);
		this.state.pic && formData.append('pic', this.state.pic);
		this.state.rate && formData.append('rate', this.state.rate);
		this.state.crbScan && formData.append('crb_scan', this.state.crbScan);
		//UTR Number 
		this.state.utr_number && formData.append("utr_number", this.state.utr_number);
		// TODO: implement backend
		this.state.crbNotProvided && formData.append('crb_not_provided', this.state.crbNotProvided);
		this.state.crbExpiry && formData.append('crb_expiry', this.state.crbExpiry);
		this.state.scScan && formData.append('sc_scan', this.state.scScan);
		// TODO: implement backend
		this.state.scNotProvided && formData.append('sc_not_provided', this.state.scNotProvided);
		this.state.scExpiry && formData.append('sc_expiry', this.state.scExpiry);
		this.state.faLevel1Scan && formData.append('fa_level_1_scan', this.state.faLevel1Scan);
		this.state.eaScan && formData.append('ea_scan', this.state.eaScan);
		// TODO: implement backend
		this.state.eaNotProvided && formData.append('ea_not_provided', this.state.eaNotProvided);
		this.state.eaExpiry && formData.append('ea_expiry', this.state.eaExpiry);
		this.state.fanNumber && formData.append('fan_number', this.state.fanNumber);
		this.state.faCoachingLicenceScan && formData.append('fa_coaching_licence_scan', this.state.faCoachingLicenceScan);
		this.state.faCoachingLicenceNotProvided && formData.append('fa_coaching_licence_not_provided', this.state.faCoachingLicenceNotProvided);
		this.state.faCoachingLicenceExpiry && formData.append('fa_coaching_licence_expiry', this.state.faCoachingLicenceExpiry);
		formData.append('show_money_owned', this.state.show_money_owned);
		

		this.state.qualifications && this.state.qualifications.map((qualification, i) => {
			formData.append(`qualifications[${i}][qualification_id]`, qualification.id);
			qualification.file && formData.append(`qualifications[${i}][file_url]`, qualification.file);
			qualification.expiration && formData.append(`qualifications[${i}][expiration_date]`, qualification.expiration);
		});

		this.state.teams && this.state.teams.map((team) => { formData.append('teams[]', team.id); });

		const response = await api.update(`/coaches/${this.props.coach.user_id}`, formData);

		if (!api.error(response)) {
            this.refForm && this.refForm.hideLoader();
            fn.navigate(url.coach);
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	// creates a dialog onAdd hook
	onAdd = async (option) => {
		this.setState({
			selectedQualificationExpiration: '',
			selectedQualificationScan: '',
		});

		return new Promise((resolve, reject) => {
			const confirm = () => {
				const { selectedQualificationScan, selectedQualificationExpiration } = this.state;

				this.setState({ qualificationDialog: null });

				// get the first option of array
				const firstOption = _.head(option);

				const scanAttached = selectedQualificationScan ? '(Scan attached)' : '';

				// merge the title and the date as a new title
				const optionValue = {
					title: <span>{`${firstOption.title} ${scanAttached}`}</span>,
					file: selectedQualificationScan,
					expiration: selectedQualificationExpiration,
				};
				const newOption = _.merge({}, firstOption, optionValue);

				// resolve promise and return the updated option
				return resolve(newOption);
			};

			const cancel = () => {
				this.setState({ qualificationDialog: null });
				return reject('cancel');
			};

			const dialogBody = (
				<div>
					<FileUpload
						accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
						clearable
						label="Scan"
						name="selectedQualificationScan"
						onChange={this.handleInputChange}
						placeholder="Upload image/file"
						prepend={<i className="ion-android-upload" />}
						validation="file|max:1000"
						wide
					/>
					<DatePicker
						futureOnly
						label="Expiry date"
						name="selectedQualificationExpiration"
						onChange={this.handleInputChange}
						showYearSelect
						wide
					/>
				</div>
			);

			const dialog = (
				<ConfirmDialog
					body={
						<React.Fragment>
							<h3 key={'title'}>Upload scan</h3>,
							{dialogBody}
						</React.Fragment>
					}
					onClose={cancel}
					onConfirm={confirm}
					title=""
				/>
			);

			this.setState({ qualificationDialog: dialog });
		});
	}
	
	render() {
		const {
			qualificationList,
			teamList
		} = this.state

		const {
			coach,
			subComponent
		} = this.props

		const coachTeams = coach.teams && coach.teams.map((team) => {
			return {
				...team,
				title: `${team.agegroup_title} - ${team.title} (${team.team_type === 'team' ? 'FC' : 'Soccer School'})`,
			};
		});

		console.log("Coacch",coach);

		return (
			<div id="content" className="site-content-inner coach-page">
				{!subComponent && <PageTitle value="Edit Coach" />}

				{this.state.qualificationDialog}

				<Form loader
					  wide
					  onValidationError={fn.scrollToTop}
					  onSubmit={this.handleSubmit}
					  ref={ref => this.refForm = ref}>
					<FormSection title="Login Details">
						<TextInput
							className="tooltips"
							placeholder="Email"
							label="Email"
							name="email"
							onChange={this.handleInputChange}
							prepend={<i className="ion-android-mail" />}
							validation="required"
							value={coach.email}
						/>
						<TextInput
							className="tooltips"
							placeholder="Reset password"
							label="Reset Password"
							name="password"
							onChange={this.handleInputChange}
							prepend={<i className="ion-locked" />}
							type="password"
						/>
					</FormSection>

					<FormSection title="Personal Details">
						<TextInput
							className="tooltips"
							placeholder="First name"
							label="First name"
							name="firstName"
							onChange={this.handleInputChange}
							prepend={<i className="ion-person" />}
							validation="required"
							value={coach.first_name}
						/>
						<TextInput
							className="tooltips"
							placeholder="Last name"
							label="Last name"
							name="lastName"
							onChange={this.handleInputChange}
							prepend={<i className="ion-person" />}
							validation="required"
							value={coach.last_name}
						/>
						<DatePicker
							className="tooltips"
							placeholder="Date of birth"
							label="Date of birth"
							name="dob"
							onChange={this.handleInputChange}
							pastOnly
							prepend={<i className="ion-calendar" />}
							returnFormat="YYYY-MM-DD"
							showYearSelect
							value={coach.dob === '0000-00-00 00:00:00' ? '' : coach.dob}
                        />
						<TextInput
							className="tooltips"
							placeholder="Telephone"
							label="Telephone"
							name="telephone"
							onChange={this.handleInputChange}
							prepend={<i className="ion-ios-telephone" />}
							value={coach.telephone}
						/>
						<TextInput
							className="tooltips"
							placeholder="Mobile"
							label="Mobile"
							name="mobile"
							onChange={this.handleInputChange}
							prepend={<i className="ion-ios-telephone" />}
							value={coach.mobile}
						/>
						<TextInput
							className="tooltips"
							placeholder="UTR"
							label="UTR"
							name="utr_number"
							onChange={this.handleInputChange}
							prepend={<i className="ion-person" />}
							value={coach.utr_number}
						/>
						<TextInput
							className="tooltips"
							placeholder="Address"
							label="Address"
							name="address"
							onChange={this.handleInputChange}
							prepend={<i className="ion-location" />}
							validation="required"
							value={coach.address}
						/>
						<TextInput
							className="tooltips"
							placeholder="Town"
							label="Town"
							name="town"
							onChange={this.handleInputChange}
							prepend={<i className="ion-location" />}
							validation="required"
							value={coach.town}
						/>
						<TextInput
							className="tooltips"
							placeholder="Postcode"
							label="Postcode"
							name="postcode"
							onChange={this.handleInputChange}
							prepend={<i className="ion-location" />}
							validation="required"
							value={coach.postcode}
						/>
						<TextInput
							className="tooltips"
							placeholder="Rate per hour"
							label="Rate per hour"
							name="rate"
							onChange={this.handleInputChange}
							prepend="£"
							validation="required"
							value={coach.rate}
						/>
						<FileUpload
							className="tooltips"
							accept=".jpg,.jpeg,.png"
							clearable
							label="Profile image"
							name="pic"
							onChange={this.handleInputChange}
							placeholder="Upload profile image"
							prepend={<i className="ion-android-upload" />}
							validation="file|max:1000"
						/>
						<Checkbox
							name="show_money_owned"
							onChange={this.handleInputChange}
							options={[{ id: 1, title: <Tooltip icon={<span>Show Money Owned?</span>} message="If selected, the coach will be able see the parents money owned" /> }]}
							value={coach.show_money_owned}
						/>
					</FormSection>

					{
						!subComponent && <FormSection title="Mandatory documents">
							<Card title="CRC (DBS Check)">
								<Checkbox
									name="crbNotProvided"
									options={[{
										id: 1,
										title: 'Not Supplied',
									}]}
									onChange={this.handleInputChange}
								/>
								<FileUpload
									accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
									clearable
									name="crbScan"
									onChange={this.handleInputChange}
									placeholder="Upload image/file"
									prepend={<i className="ion-android-upload" />}
									validation="file|max:1000"
									disabled={this.state.crbNotProvided ? true : false}
								/>
								<DatePicker
									className="tooltips"
									placeholder="Expiry date"
									futureOnly
									label="Expiry date"
									name="crbExpiry"
									onChange={this.handleInputChange}
									showYearSelect
									prepend={<i className="ion-android-calendar" />}
								/>
							</Card>
							<Card title="Safeguarding Children">
								<Checkbox
									name="scNotProvided"
									options={[{
										id: 1,
										title: 'Not Supplied',
									}]}
									onChange={this.handleInputChange}
								/>
								<FileUpload
									accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
									clearable
									name="scScan"
									onChange={this.handleInputChange}
									placeholder="Upload image/file"
									prepend={<i className="ion-android-upload" />}
									validation="file|max:1000"
									disabled={this.state.scNotProvided ? true : false}
								/>
								<DatePicker
									className="tooltips"
									placeholder="Expiry date"
									name="scExpiry"
									label="Expiry date"
									futureOnly
									showYearSelect
									onChange={this.handleInputChange}
									prepend={<i className="ion-android-calendar" />}
								/>
							</Card>

							<Card title="Emergency Aid">
								<Checkbox
									name="eaNotProvided"
									options={[{
										id: 1,
										title: 'Not Supplied',
									}]}
									onChange={this.handleInputChange}
								/>
								<FileUpload
									accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
									clearable
									name="eaScan"
									onChange={this.handleInputChange}
									placeholder="Upload image/file"
									prepend={<i className="ion-android-upload" />}
									validation="file|max:1000"
									disabled={this.state.eaNotProvided ? true : false}
								/>
								<DatePicker
									className="tooltips"
									placeholder="Expiry date"
									name="eaExpiry"
									label="Expiry date"
									futureOnly
									showYearSelect
									onChange={this.handleInputChange}
									prepend={<i className="ion-android-calendar" />}
								/>
							</Card>

							<Card title="FA Level 1">
								<FileUpload
									accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
									clearable
									name="faLevel1Scan"
									onChange={this.handleInputChange}
									placeholder="Upload image/file"
									prepend={<i className="ion-android-upload" />}
									validation="file|max:1000"
								/>
							</Card>

							<Card title="FA Coaching License">
								<Checkbox
									name="faCoachingLicenceNotProvided"
									options={[{
										id: 1,
										title: 'Not Supplied',
									}]}
									onChange={this.handleInputChange}
								/>
								<FileUpload
									accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
									clearable
									name="faCoachingLicenceScan"
									onChange={this.handleInputChange}
									placeholder="Upload image/file"
									prepend={<i className="ion-android-upload" />}
									validation="file|max:1000"
									disabled={this.state.faCoachingLicenceNotProvided ? true : false}
								/>
								<DatePicker
									futureOnly
									className="tooltips"
									placeholder="Expiry date"
									label="Expiry date"
									name="faCoachingLicenceExpiry"
									onChange={this.handleInputChange}
									showYearSelect
									prepend={<i className="ion-android-calendar" />}
								/>
							</Card>

							<Card title="FAN Number">
								<TextInput
									className="tooltips"
									label="Number"
									name="fanNumber"
									onChange={this.handleInputChange}
									prepend={<i className="ion-calculator" />}
								/>
							</Card>
						</FormSection>
					}

					{
						!subComponent && <FormSection title="Additional qualifications">
							<MultiSelect
								label={['Additional qualifications', 'Selected qualifications']}
								name="qualifications"
								onAdd={this.onAdd}
								onChange={this.handleInputChange}
								options={qualificationList}
								value={coach.qualifications}
								wide
							/>
						</FormSection>
					}

					{
						!subComponent && <FormSection title="Assigned teams and groups">
							<MultiSelect
								label={['Available teams and groups', 'Assigned teams and groups']}
								name="teams"
								onChange={this.handleInputChange}
								options={teamList}
								value={coachTeams}
								wide
							/>
						</FormSection>
					}

					<FormSection className="mt-0">
						<div className="form-actions mt-0">
							<Back className="button" confirm>Cancel</Back>
							<FormButton label="Save" />
						</div>
					</FormSection>

				</Form>
			</div>
		);
	}

}
