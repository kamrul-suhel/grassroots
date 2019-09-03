import React from 'react';
import { connect } from 'react-redux';
import { DatePicker, Form, Radio, Select, TextInput } from '@xanda/react-components';
import moment from 'moment';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, FormButton, FormSection, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		myClub: store.myClub,
	};
})
export default class Settings extends React.PureComponent {

	constructor(props) {
		super(props);

		this.accountId = this.props.params.accountId;

		this.state = {
			accountTypes: [],
		};
	}

	componentWillMount = async () => {
		this.props.dispatch(fetchData({
			type: 'ACCOUNT',
			url: `/accounts/${this.accountId}`,
		}));

		const accountTypes = await api.get('/account-types');
		this.setState({ accountTypes: accountTypes.data.entities });
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const formData = {
			vat_number: this.state.isRegistered == 1 ? this.state.vatNumber : '',
			vat_rate: this.state.isRegistered == 1 ? this.state.vatRate : 0,
			threshold: this.state.threshold,
		};

		const response = await api.update('/clubs/my', formData);

		if (!api.error(response)) {
			this.props.dispatch({ type: 'MYCLUB_UPDATE', payload: response.data });
		}
	}

	render() {
		const { myClub } = this.props;
		const isRegistered = (myClub.data.vat_rate || myClub.data.vat_number) ? 1 : 0;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Settings" />
				<Form wide className="form-section" onSubmit={this.handleSubmit}>
					<Radio styled wide name="isRegistered" label="VAT registered" value={isRegistered} options={[{ id: 1, title: 'Yes' }, { id: 0, title: 'No' }]} onChange={this.handleInputChange} />
					{this.state.isRegistered == 1 && <TextInput className="tooltips" placeholder="VAT Number" name="vatNumber" label="VAT Number" value={myClub.data.vat_number} prepend={<i className="ion-ios-keypad-outline"/>} onChange={this.handleInputChange} />}
					{this.state.isRegistered == 1 && <TextInput className="tooltips" placeholder="VAT Rate" name="vatRate" label="VAT Rate" value={myClub.data.vat_rate} append="%" onChange={this.handleInputChange} />}
					<TextInput className="tooltips" placeholder="VAT Threshold" name="threshold" label="VAT Threshold" prepend="£" value={myClub.data.threshold} onChange={this.handleInputChange} />
					<DatePicker className="tooltips" placeholder="Date form" name="thresholdFrom" label="Date From" prepend={<i className="ion-calendar"/>} onChange={this.handleInputChange} />
					<div className="form-actions">
						<Back className="button">Cancel</Back>
						<FormButton label="Save" />
					</div>
				</Form>
			</div>
		);
	}

}
