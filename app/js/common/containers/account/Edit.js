import React from 'react';
import { connect } from 'react-redux';
import { Form, Select, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, FormButton, FormSection, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		account: store.account.collection[ownProps.params.accountId] || {},
	};
})
export default class Edit extends React.PureComponent {

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
		const formData = new FormData();
		formData.append('title', this.state.title);
		formData.append('type_id', this.state.accountType);
		this.state.accountNumber && formData.append('account_number', this.state.accountNumber);
		this.state.bankName && formData.append('bank_name', this.state.bankName);
		this.state.sortCode && formData.append('sort_code', this.state.sortCode);

		const response = await api.update(`/accounts/${this.accountId}`, formData);

		if (!api.error(response)) {
			fn.navigate(url.account);
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}
	render() {
		const { accountTypes } = this.state;
		const { account } = this.props;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Edit Account" />
				<Form loader wide onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
					<FormSection title="Contact details">
						<TextInput
							className="tooltips"
							placeholder="Title"
							label="Title"
							name="title"
							onChange={this.handleInputChange}
							validation="required"
							value={account.title}
							prepend={<i className="ion-ios-book-outline"/>}
						/>
						<Select
							className="tooltips"
							placeholder="Account type"
							label="Account type"
							name="accountType"
							onChange={this.handleInputChange}
							options={accountTypes}
							validation="required"
							value={account.type_id}
							prepend={<i className="ion-card"/>}
						/>

						{this.state.accountType === 1 &&
							<React.Fragment>
								<TextInput
									className="tooltips"
									placeholder="Bank name"
									label="Bank Name"
									name="bankName"
									onChange={this.handleInputChange}
									validation="required"
									value={account.bank_name}
									prepend={<i className="ion-person"/>}
								/>

								<TextInput
									className="tooltips"
									placeholder="Account number"
									label="Account Number"
									name="accountNumber"
									onChange={this.handleInputChange}
									validation="required"
									value={account.account_number}
									prepend={<i className="ion-ios-keypad-outline"/>}
								/>

								<TextInput
									className="tooltips"
									placeholder="Sort code"
									label="Sort Code"
									name="sortCode"
									onChange={this.handleInputChange}
									validation="required"
									value={account.sort_code}
									prepend={<i className="ion-ios-barcode-outline"/>}
								/>
							</React.Fragment>
						}

						<div className="form-actions">
							<Back className="button" confirm>Cancel</Back>
							<FormButton label="Save" />
						</div>
					</FormSection>
				</Form>
			</div>
		);
	}

}
