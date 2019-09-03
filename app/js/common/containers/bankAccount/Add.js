import React from 'react';
import { Form, Select, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Back, FormButton, PageTitle } from 'app/components';

export default class Add extends React.PureComponent {

	constructor(props) {
		super(props);

		this.clubId = this.props.params.clubId;

		this.state = {
			accountTypes: [],
		};
	}

	componentWillMount = async () => {
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
			bankName,
			sortCode
		} = this.state

		const formData = new FormData();
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

		formData.append('title', title);
		formData.append('type_id', accountType);
		formData.append('club_id', this.clubId);
		accountNumber && formData.append('account_number', accountNumber);
		bankName && formData.append('bank_name', bankName);
		sortCode && formData.append('sort_code', sortCode);

		const response = await api.post('/accounts', formData);

		if (!api.error(response)) {
			this.props.fetchData();
			fn.navigate(`clubs/${this.clubId}/bank-accounts`);
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const { accountTypes, accountType } = this.state;

		return (
			<div id="content"
				 className="site-content-inner account-component">
				<PageTitle value="Add account" />
				<Form loader
					  onSubmit={this.handleSubmit}
					  className="form-section"
					  ref={ref => this.refForm = ref}>
					<TextInput
						className="tooltips"
						placeholder="Account name"
						label="Account name"
						name="title"
						validation="required"
						onChange={this.handleInputChange}
						prepend={<i className="ion-person"/>}
					/>
					<Select
						className="tooltips"
						placeholder="Account type"
						label="Account type"
						name="accountType"
						validation="required"
						onChange={this.handleInputChange}
						options={accountTypes}
						prepend={<i className="ion-card"/>}
					/>

					{accountType === 1 || accountType === 3 ?
						<React.Fragment>
							<TextInput
								className="tooltips"
								placeholder="Bank name"
								label="Bank name"
								name="bankName"
								validation="required"
								onChange={this.handleInputChange}
							/>
							<TextInput
								className="tooltips"
								type="number"
								placeholder="Account number"
								label="Account number"
								name="accountNumber"
								validation="required"
								ref={ref => this.refAccountNumber = ref}
								onChange={this.handleInputChange}
							/>
							<TextInput
								className="tooltips"
								type="number"
								placeholder="Sort code"
								label="Sort code"
								name="sortCode"
								ref={ref => this.refSortCode = ref}
								validation="required"
								onChange={this.handleInputChange}
							/>
						</React.Fragment>
						: null
					}

					<div className="form-actions">
						<Back className="button" confirm={true}>Cancel</Back>
						<FormButton label="Save" />
					</div>
				</Form>
			</div>
		);
	}

}
