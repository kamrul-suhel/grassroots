import React from 'react';
import { connect } from 'react-redux';
import { Form, Select, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, FormButton, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		bankAccount: store.bankAccount.collection[ownProps.params.accountId] || {},
	};
})
export default class Edit extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			accountTypes: [],
		};
	}

	componentWillMount = async () => {
		this.props.dispatch(fetchData({
			type: 'BANKACCOUNT',
			url: `/accounts/${this.props.params.accountId}?club_id=${this.props.params.clubId}`,
		}));

		const accountTypes = await api.get('/account-types');
		this.setState({ accountTypes: accountTypes.data.entities });
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const {
			title,
			accountType,
			accountNumber,
			sortCode,
			bankName
		} = this.state

		const formData = new FormData();
		formData.append('title', title);
		formData.append('type_id', accountType);
		formData.append('club_id', this.props.params.clubId);

		// validate form
		// check accountNumber is set or not
		if(accountNumber && accountNumber.length < 8){
			this.refAccountNumber.setValidationMessage({valid: false, errors: ['Your account number should be 8 numbers']});
			this.refForm && this.refForm.hideLoader();
			return;
		}

		// check sort code is set or not
		if(sortCode && sortCode.length < 6){
			this.refSortCode.setValidationMessage({valid: false, errors: ['Your sort code should be 6 numbers']});
			this.refForm && this.refForm.hideLoader();
			return;
		}

		accountNumber && formData.append('account_number', this.state.accountNumber);
		bankName && formData.append('bank_name', bankName);
		sortCode && formData.append('sort_code', sortCode);

		const response = await api.update(`/accounts/${this.props.params.accountId}`, formData);

		if (!api.error(response)) {
			this.props.fetchData();
			fn.navigate(`clubs/${this.props.params.clubId}/bank-accounts`);

			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option: {
					message:'Account has been updated',
					color:'dark'
				}
			})
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const { bankAccount } = this.props;
		const { accountTypes, accountType } = this.state;

		return (
			<div id="content" className="site-content-inner account-component">
				<PageTitle value="Add account" />
				<Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
					<TextInput
						className="tooltips"
						placeholder="Account name"
						label="Account name"
						name="title"
						onChange={this.handleInputChange}
						validation="required"
						value={bankAccount.title}
						prepend={<i className="ion-person"/>}
					/>
					<Select
						className="tooltips"
						placeholder="Account type"
						label="Account type"
						name="accountType"
						onChange={this.handleInputChange}
						options={accountTypes}
						validation="required"
						value={bankAccount.type_id}
						prepend={<i className="ion-card"/>}
					/>

					{accountType === 1 || accountType === 3 ?
						<React.Fragment>
							<TextInput
								className="tooltips"
								placeholder="Bank name"
								label="Bank name"
								name="bankName"
								onChange={this.handleInputChange}
								validation="required"
								value={bankAccount.bank_name}
								prepend={<i className="ion-home"/>}
							/>
							<TextInput
								className="tooltips"
								placeholder="Account number"
								label="Account number"
								name="accountNumber"
								ref={ref => this.refAccountNumber = ref}
								onChange={this.handleInputChange}
								validation="required"
								value={bankAccount.account_number}
								prepend={<i className="ion-ios-keypad-outline"/>}
							/>
							<TextInput
								className="tooltips"
								placeholder="Sort code"
								label="Sort code"
								name="sortCode"
								ref={ref => this.refSortCode = ref}
								onChange={this.handleInputChange}
								validation="required"
								value={bankAccount.sort_code}
								prepend={<i className="ion-ios-barcode"/>}
							/>
						</React.Fragment> : null
					}

					<div className="form-actions">
						<Back className="button">Cancel</Back>
						<FormButton label="Save" />
					</div>
				</Form>
			</div>
		);
	}

}
