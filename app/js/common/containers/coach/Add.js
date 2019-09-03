import React from 'react';
import { Checkbox, DatePicker, FileUpload, Form, MultiSelect, TextInput, Tooltip } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Back, Card, ConfirmDialog, FormButton, FormSection, PageTitle } from 'app/components';
import {connect} from "react-redux";

@connect((store, ownProps) => {
	return {

	};
})

export default class Add extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			qualificationList: [],
			teamList: [],
		};
	}

	componentWillMount = async () => {
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

		const {subComponent} = this.props

		const formData = new FormData()
		this.state.email && formData.append('email', this.state.email)
		this.state.password && formData.append('password', this.state.password)
		this.state.firstName && formData.append('first_name', this.state.firstName)
		this.state.lastName && formData.append('last_name', this.state.lastName)
		this.state.dob && formData.append('dob', this.state.dob)
		this.state.telephone && formData.append('telephone', this.state.telephone)
		this.state.mobile && formData.append('mobile', this.state.mobile)
		this.state.address && formData.append('address', this.state.address)
		this.state.town && formData.append('town', this.state.town)
		this.state.postcode && formData.append('postcode', this.state.postcode)
		this.state.pic && formData.append('pic', this.state.pic)
		this.state.rate && formData.append('rate', this.state.rate)
		this.state.crbScan && formData.append('crb_scan', this.state.crbScan)
		this.state.crbExpiry && formData.append('crb_expiry', this.state.crbExpiry)
		this.state.scScan && formData.append('sc_scan', this.state.scScan)
		this.state.scExpiry && formData.append('sc_expiry', this.state.scExpiry)
		this.state.faLevel1Scan && formData.append('fa_level_1_scan', this.state.faLevel1Scan)
		this.state.faLevel2Scan && formData.append('fa_level_2_scan', this.state.faLevel2Scan)
		this.state.eaScan && formData.append('ea_scan', this.state.eaScan)
		this.state.eaExpiry && formData.append('ea_expiry', this.state.eaExpiry)
		this.state.fanNumber && formData.append('fan_number', this.state.fanNumber)
		this.state.utrNumber && formData.append('utr_number', this.state.utrNumber)
		this.state.faCoachingLicenceScan && formData.append('fa_coaching_licence_scan', this.state.faCoachingLicenceScan)
		this.state.faCoachingLicenceExpiry && formData.append('fa_coaching_licence_expiry', this.state.faCoachingLicenceExpiry)
		formData.append('show_money_owned', this.state.show_money_owned)

		this.state.qualifications && this.state.qualifications.map((qualification, i) => {
			formData.append(`qualifications[${i}][qualification_id]`, qualification.id)
			qualification.file && formData.append(`qualifications[${i}][file_url]`, qualification.file)
			qualification.expiration && formData.append(`qualifications[${i}][expiration_date]`, qualification.expiration)
		});

		this.state.teams && this.state.teams.map((team) => { formData.append('teams[]', team.id); })

		const response = await api.post('/coaches', formData)

		if (!api.error(response)) {

			// If this component load as a sub component then we need to redirect to which ever component is load
			// For now it is loading as a sub component when creating a programme
			if(subComponent){
				this.refForm && this.refForm.hideLoader()
				this.props.onCloseDialog()
				return
			}

			fn.navigate(url.coach)
		} else {
			this.refForm && this.refForm.hideLoader()
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
				const { selectedQualificationScan, selectedQualificationExpiration } = this.state

				this.setState({ qualificationDialog: null })

				// get the first option of array
				const firstOption = _.head(option)

				const scanAttached = selectedQualificationScan ? '(Scan attached)' : ''

				// merge the title and the date as a new title
				const optionValue = {
					title: <span>{`${firstOption.title} ${scanAttached}`}</span>,
					file: selectedQualificationScan,
					expiration: selectedQualificationExpiration,
				};
				const newOption = _.merge({}, firstOption, optionValue)

				// resolve promise and return the updated option
				return resolve(newOption)
			};

			const cancel = () => {
				this.setState({ qualificationDialog: null })
				return reject('cancel')
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
							<h3>Upload scan</h3>
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

	handleSubComponentClose = (event) => {
		event.preventDefault()
		this.props.onCloseDialog()
	}
	
	render() {
		// If load as subcomponent then you should have subComponent property
		const {subComponent} = this.props
		const { qualificationList, teamList } = this.state;
		return (
			<div id="content" className="site-content-inner coach-page">
				<PageTitle value="Add new coach" />

				{this.state.qualificationDialog}

				<Form onValidationError={fn.scrollToTop} loader onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
					<FormSection title="Login Details">
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
								name="firstName"
								onChange={this.handleInputChange}
								prepend={<i className="ion-person" />}
								validation="required"
							/>
							<TextInput
								className="tooltips"
								placeholder="Last name"
								label="Last name"
								name="lastName"
								onChange={this.handleInputChange}
								prepend={<i className="ion-person" />}
								validation="required"
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
							/>
							<TextInput
								className="tooltips"
								placeholder="Telephone"
								label="Telephone"
								name="telephone"
								onChange={this.handleInputChange}
								prepend={<i className="ion-ios-telephone" />}
								validation="required"
							/>
							<TextInput
								className="tooltips"
								placeholder="Mobile"
								label="Mobile"
								name="mobile"
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
								validation="required"
							/>
							<TextInput
								className="tooltips"
								placeholder="Town"
								label="Town"
								name="town"
								onChange={this.handleInputChange}
								prepend={<i className="ion-location" />}
								validation="required"
							/>
							<TextInput
								className="tooltips"
								placeholder="Postcode"
								label="Postcode"
								name="postcode"
								onChange={this.handleInputChange}
								prepend={<i className="ion-location" />}
								validation="required"
							/>
							<TextInput
								className="tooltips"
								placeholder="Rate per hour"
								label="Rate per hour"
								name="rate"
								onChange={this.handleInputChange}
								prepend="£"
								validation="required"
							/>
							<FileUpload
								className="tooltips"
								accept=".jpg,.jpeg,.png"
								clearable
								label="Upload photo"
								name="pic"
								onChange={this.handleInputChange}
								placeholder="Upload photo"
								prepend={<i className="ion-android-upload" />}
								validation="file|max:1000"
							/>
							<Checkbox
								name="show_money_owned"
								onChange={this.handleInputChange}
								options={[{ id: 1, title: <Tooltip icon={<span>Show Money Owned?</span>} message="If selected, the coach will be able see the parents money owned" /> }]}
							/>
					</FormSection>

					<FormSection title="Mandatory documents">
						<Card title="CRC (DBS Check)">
							<FileUpload
								className="tooltips"
								accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
								clearable
								label="Upload image/file"
								name="crbScan"
								onChange={this.handleInputChange}
								placeholder="Upload image/file"
								prepend={<i className="ion-android-upload" />}
								validation="required|file|max:1000"
							/>
							<DatePicker
								futureOnly
								className="tooltips"
								placeholder="Expiry date"
								label="Expiry date"
								name="crbExpiry"
								onChange={this.handleInputChange}
								showYearSelect
								validation="required"
								prepend={<i className="ion-android-calendar" />}
							/>
						</Card>
						<Card title="Safeguarding Children">
							<FileUpload
								className="tooltips"
								accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
								clearable
								label="Upload image/file"
								name="scScan"
								onChange={this.handleInputChange}
								placeholder="Upload image/file"
								prepend={<i className="ion-android-upload" />}
								validation="required|file|max:1000"
							/>
							<DatePicker
								futureOnly
								className="tooltips"
								placeholder="Expiry date"
								label="Expiry date"
								name="scExpiry"
								onChange={this.handleInputChange}
								showYearSelect
								validation="required"
								prepend={<i className="ion-android-calendar" />}
							/>
						</Card>

						<Card title="Emergency Aid">
							<FileUpload
								className="tooltips"
								accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
								clearable
								label="Upload image/file"
								name="eaScan"
								onChange={this.handleInputChange}
								placeholder="Upload image/file"
								prepend={<i className="ion-android-upload" />}
								validation="required|file|max:1000"
							/>
							<DatePicker
								futureOnly
								className="tooltips"
								placeholder="Expiry date"
								label="Expiry date"
								name="eaExpiry"
								onChange={this.handleInputChange}
								showYearSelect
								validation="required"
								prepend={<i className="ion-android-calendar" />}
							/>
						</Card>

						<Card title="FA Coaching License">
							<FileUpload
								className="tooltips"
								accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
								clearable
								label="Upload image/file"
								name="faCoachingLicenceScan"
								onChange={this.handleInputChange}
								placeholder="Upload image/file"
								prepend={<i className="ion-android-upload" />}
								validation="file|max:1000"
							/>
							<DatePicker
								futureOnly
								className="tooltips"
								placeholder="Expiry date"
								label="Expiry date"
								name="faCoachingLicenceExpiry"
								onChange={this.handleInputChange}
								prepend={<i className="ion-android-calendar" />}
								showYearSelect
							/>
						</Card>

						<Card title="Registrations">
							<TextInput
								className="tooltips show-tooltip"
								placeholder="FAN Number"
								label="FAN Number"
								name="fanNumber"
								onChange={this.handleInputChange}
								prepend={<i className="ion-calculator" />}
							/>

							<TextInput
								className="tooltips"
								placeholder={'UTR Number'}
								label="UTR Number"
								name="utrNumber"
								onChange={this.handleInputChange}
								prepend={<i className="ion-calculator" />}
							/>
						</Card>

						<Card></Card>

						<Card title="FA Level 1">
							<FileUpload
								className="tooltips"
								accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
								clearable
								label="Upload image/file"
								name="faLevel1Scan"
								onChange={this.handleInputChange}
								placeholder="Upload image/file"
								prepend={<i className="ion-android-upload" />}
								validation="file|max:1000"
							/>
						</Card>

						<Card title="FA LEVEL 2">
							<FileUpload
								className="tooltips"
								accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
								clearable
								label="Upload image/file"
								name="faLevel2Scan"
								onChange={this.handleInputChange}
								placeholder="Upload image/file"
								prepend={<i className="ion-android-upload" />}
								validation="file|max:1000"
							/>
						</Card>
						<Card></Card>
					</FormSection>

					<FormSection title="Assigned teams and groups">
						<MultiSelect
							label={['Available teams and groups', 'Assigned teams and groups']}
							name="teams"
							onChange={this.handleInputChange}
							options={teamList}
							wide
						/>

						<div className="form-actions">
							{subComponent ?
								<button className="button"
										onClick={this.handleSubComponentClose}>Cancel
								</button>
								:
								<Back className="button"
									   showCloseButton={false}
									   confirm>Cancel
								</Back>
							}

							<FormButton label="Save" />
						</div>

					</FormSection>

				</Form>
			</div>
		);
	}

}
