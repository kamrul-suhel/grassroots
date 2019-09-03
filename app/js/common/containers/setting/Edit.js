import React from 'react';
import { FileUpload, Form, Radio, TextInput } from '@xanda/react-components';
import Store from 'app/store';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { ButtonStandard, FormButton, PageTitle, FormSection } from 'app/components';
import {connect} from "react-redux";

@connect((store, ownProps) => {
	return {

	};
})

export default class Edit extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			type: [],
			clubTypes: [
				{ id: 'academy', title: 'Soccer School' },
				{ id: 'fc', title: 'Football Club' },
				{ id: 'both', title: 'Both' },
			],
		};
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const vatNumber = this.state.isRegistered == 1 ? this.state.vatNumber : '';
		const vatRate = this.state.isRegistered == 1 ? this.state.vatRate : 0;

		const formData = new FormData();
		formData.append('title', this.state.title);
		this.state.type && formData.append('type', this.state.type);
		this.state.address && formData.append('address', this.state.address);
		this.state.email && formData.append('email', this.state.email);
		this.state.pic && formData.append('logo_url', this.state.pic);
		this.state.postcode && formData.append('postcode', this.state.postcode);
		this.state.telephone && formData.append('telephone', this.state.telephone);
		this.state.town && formData.append('town', this.state.town);
		formData.append('vat_number', vatNumber);
		formData.append('vat_rate', vatRate);
		this.state.threshold && formData.append('threshold', this.state.threshold);
		this.state.fcCompany && formData.append('fc_company', this.state.fcCompany);
		this.state.ssCompany && formData.append('ss_company', this.state.ssCompany);
		this.state.website && formData.append('website', this.state.website);

		const response = await api.update('/clubs/my', formData);

		if (!api.error(response)) {
			Store.dispatch({ type: 'MYCLUB_UPDATE', payload: response.data });
			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option: {
					message:'Your club details have been updated successfully!',
					color:'dark'
				}
			})
		}
		this.refForm && this.refForm.hideLoader();
	}

	render() {
		const { clubTypes } = this.state;
		const myClub = this.props.myClub ? this.props.myClub.data : {};
		const isRegistered = (myClub.vat_rate || myClub.vat_number) ? 1 : 0;
		const academySelected = this.state.type && this.state.type.indexOf('fc') === -1;
		const fcSelected = this.state.type && this.state.type.indexOf('academy') === -1;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Settings & Set-up" />

				<div className="page-actions">
					<ButtonStandard to={url.kit} icon={<i className="ion-plus" />}>Kit items</ButtonStandard>
					<ButtonStandard to={url.skill} icon={<i className="ion-plus" />}>Skills</ButtonStandard>
					{/*<ButtonStandard to={url.assessmentTemplate} icon={<i className="ion-plus" />}>Coach assessments</ButtonStandard>*/}
					{/*<ButtonStandard to={`${url.setting}/age-groups`} icon={<i className="ion-plus" />}>Age groups</ButtonStandard>*/}
					<ButtonStandard to={url.account} icon={<i className="ion-plus" />}>Accounts</ButtonStandard>
					{/*<ButtonStandard to={`${url.setting}/licence`} icon={<i className="ion-plus" />}>Licence</ButtonStandard>*/}
				</div>

				<Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
					<FormSection>
						<TextInput
							className="tooltips"
							placeholder="Club name"
							label="Club name"
							name="title"
							onChange={this.handleInputChange}
							validation="required"
							value={myClub.title}
							prepend={<i className="ion-ios-football-outline"/>}
						/>
					</FormSection>

					<Radio
						label="Club structure"
						className={"setting-club-structure"}
						name="type"
						onChange={this.handleInputChange}
						options={clubTypes}
						styled
						validation="required"
						value={myClub.type}
					/>
					{academySelected &&
						<TextInput
							className="tooltips"
							placeholder="Soccer School company name"
							name="ssCompany"
							label="Soccer School company name"
							value={myClub.ss_company}
							validation="required"
							onChange={this.handleInputChange}
							prepend={<i className="ion-social-buffer"/>}
						/>
					}
					{fcSelected &&
						<TextInput
							className="tooltips"
							placeholder="Football club name"
							name="fcCompany"
							label="Football club name"
							value={myClub.fc_company}
							validation="required"
							onChange={this.handleInputChange}
							prepend={<i className="ion-social-buffer"/>}
						/>
					}
					<TextInput
						className="tooltips"
						placeholder="Address"
						label="Address"
						name="address"
						onChange={this.handleInputChange}
						validation="required"
						value={myClub.address}
						prepend={<i className="ion-location"/>}
					/>
					<TextInput
						className="tooltips"
						placeholder="Town"
						name="town"
						label="Town"
						value={myClub.town}
						validation="required"
						onChange={this.handleInputChange}
						prepend={<i className="ion-location"/>}
					/>
					<TextInput
						className="tooltips"
						placeholder="Postcode"
						name="postcode"
						label="Postcode"
						value={myClub.postcode}
						validation="required"
						onChange={this.handleInputChange}
						prepend={<i className="ion-location"/>}
					/>
					<TextInput
						className="tooltips"
						placeholder="Telephone"
						name="telephone"
						label="Telephone"
						value={myClub.telephone}
						validation="required"
						onChange={this.handleInputChange}
						prepend={<i className="ion-ios-telephone"/>}
					/>
					<TextInput
						className="tooltips"
						placeholder="Email"
						name="email"
						label="Email"
						value={myClub.email}
						validation="required|email"
						onChange={this.handleInputChange}
						prepend={<i className="ion-at"/>}
					/>
					<TextInput
						className="tooltips"
						placeholder="Website"
						name="website"
						label="Website"
						value={myClub.website}
						onChange={this.handleInputChange}
						prepend={<i className="ion-ios-world-outline"/>}
					/>
					<FileUpload
						accept=".jpg,.jpeg,.png"
						clearable
						label="Club Badge / Logo"
						name="pic"
						onChange={this.handleInputChange}
						prepend={<i className="ion-android-upload" />}
						validation="file|max:1000"
					/>
					<Radio
						styled
						className="tooltips"
						placeholder="VAT registered"
						name="isRegistered"
						label="VAT registered"
						value={isRegistered}
						options={[{ id: 1, title: 'Yes' }, { id: 0, title: 'No' }]}
						onChange={this.handleInputChange}
					/>
					<TextInput
						className="tooltips"
						placeholder="VAT Threshold"
						name="threshold"
						label="VAT Threshold"
						prepend="£"
						value={myClub.threshold}
						onChange={this.handleInputChange}
					/>
					{this.state.isRegistered == 1 &&
						<TextInput
							className="tooltips"
							placeholder="VAT Number"
							name="vatNumber"
							label="VAT Number"
							value={myClub.vat_number}
							onChange={this.handleInputChange}
							prepend={<i className="ion-ios-keypad-outline"/>}
						/>
					}
					{this.state.isRegistered == 1 &&
						<TextInput
							className="tooltips"
							placeholder="VAT Rate"
							name="vatRate"
							label="VAT Rate"
							value={myClub.vat_rate}
							append="%"
							onChange={this.handleInputChange}
						/>
					}

					<FormButton label="Update details" />
				</Form>
			</div>
		);
	}

}
