import React from 'react';
import { connect } from 'react-redux';
import {Dialog, Form, Select, TextInput} from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, FormButton, PageTitle, ConfirmDialog } from 'app/components';

@connect((store, ownProps) => {
	return {
		franchise: store.franchise.collection[ownProps.me.data.franchise_id] || {},
	};
})
export default class Edit extends React.PureComponent {

	componentWillMount() {
		this.fetchData();
	}

	fetchData = () => {
		this.props.dispatch(fetchData({
			type: 'FRANCHISE',
			url: 'franchises/my',
		}));
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const formData = new FormData();

		formData.append('email', this.state.email);
		formData.append('telephone', this.state.telephone);
		formData.append('emergency_telephone', this.state.emergencyTelephone);
		formData.append('website', this.state.website);
		formData.append('address', this.state.address);
		formData.append('town', this.state.town);
		formData.append('postcode', this.state.postcode);
		formData.append('company_number', this.state.companyNumber);
		formData.append('vat_number', this.state.vatNumber);

		const response = await api.post(`/franchises/${this.props.me.data.franchise_id}`, formData);

		if (!api.error(response)) {
			this.fetchData();
			fn.showAlert('Account Details has been updated!', 'success');
		}

		this.refForm && this.refForm.hideLoader();
	}

	render() {
		const { franchise } = this.props;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Account Details" />
				<Form loader onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
					<TextInput
						disabled
						label="Account name"
						name="title"
						onChange={this.handleInputChange}
						value={franchise.title}
					/>
					<TextInput
						label="Email"
						name="email"
						onChange={this.handleInputChange}
						validation="required"
						value={franchise.email}
					/>
					<TextInput
						label="Telephone"
						name="telephone"
						onChange={this.handleInputChange}
						validation="required"
						value={franchise.telephone}
					/>
					<TextInput
						label="Emergency Telephone"
						name="emergencyTelephone"
						onChange={this.handleInputChange}
						validation="required"
						value={franchise.emergency_telephone}
					/>
					<TextInput
						label="Website"
						name="website"
						onChange={this.handleInputChange}
						value={franchise.website}
					/>
					<TextInput
						label="Address"
						name="address"
						onChange={this.handleInputChange}
						validation="required"
						value={franchise.address}
					/>
					<TextInput
						label="City"
						name="town"
						onChange={this.handleInputChange}
						validation="required"
						value={franchise.town}
					/>
					<TextInput
						label="Postcode"
						name="postcode"
						onChange={this.handleInputChange}
						validation="required"
						value={franchise.postcode}
					/>
					{/*<TextInput*/}
						{/*label="Company Number (if applicable)"*/}
						{/*name="companyNumber"*/}
						{/*onChange={this.handleInputChange}*/}
						{/*value={franchise.company_number}*/}
					{/*/>*/}
					{/*<TextInput*/}
						{/*label="VAT Number (if applicable)"*/}
						{/*name="vatNumber"*/}
						{/*onChange={this.handleInputChange}*/}
						{/*value={franchise.vat_number}*/}
					{/*/>*/}

					<div className="form-actions">
						<Back className="button" confirm>Cancel</Back>
						<FormButton label="Save" />
					</div>
				</Form>
			</div>
		);
	}

}
