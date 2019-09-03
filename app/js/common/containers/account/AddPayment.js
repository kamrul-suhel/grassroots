import React from 'react';
import { connect } from 'react-redux';
import { DatePicker, Form, Select, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Back, FormButton, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		myClub: store.myClub,
	};
})
export default class AddPayment extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			accountList: [],
			transactionCodeList: [],
			transactionTypeList: [],
			userList: [],
			defaultUserId: this.props.location.state ? this.props.location.state.userId : 0,
			defaultUserRole: this.props.location.state ? this.props.location.state.userRole : '',
		};
	}

	componentWillMount = async () => {
		const userList = await api.get('/dropdown/users?roles=guardian,coach');
		const accountList = await api.get('/accounts');
		const transactionCodeList = await api.get('/transaction-codes');
		const transactionTypeList = await api.get('/transaction-types');
		const formattedTransactionCodeList = transactionCodeList.data.entities.map((code) => { return { ...code, title: `${code.code} - ${code.title}` }; });
		const formatteduserList = userList.data.map((user) => { return { ...user, title: `${user.title} - ${_.upperFirst(user.role)}` }; });
		this.setState({
			accountList: accountList.data.entities,
			transactionCodeList: formattedTransactionCodeList,
			transactionTypeList: transactionTypeList.data.entities,
			userList: formatteduserList,
		});
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const vatRate = this.state.defaultUserRole === 'coach' ? 0 : this.state.vatRate;
		const formData = new FormData();
		formData.append('account_id', this.state.account);
		formData.append('amount', this.state.amount);
		this.state.transactionCode && formData.append('code_id', this.state.transactionCode);
		formData.append('date', this.state.date);
		formData.append('note', this.state.note);
		formData.append('type_id', this.state.type);
		formData.append('user_id', this.state.party);
		formData.append('vat_rate', vatRate);

		const response = await api.post('/transactions', formData);

		if (!api.error(response)) {
			fn.navigate(url.account);
			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option: {
					message:'Payment has been added successfully',
					color:'dark'
				}
			})
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const {
			accountList,
			defaultUserId,
			transactionCodeList,
			transactionTypeList,
			userList,
		} = this.state;
		const { myClub } = this.props;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Add payment / receipt" />
				<Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
					<Select
						disabled={!!defaultUserId}
						className="tooltips"
						placeholder="Party"
						label="Party"
						name="party"
						onChange={this.handleInputChange}
						options={userList}
						validation="required"
						value={defaultUserId}
						prepend={<i className="ion-person"></i>}
					/>
					<DatePicker
						className="tooltips"
						placeholder="Date"
						label="Date"
						name="date"
						onChange={this.handleInputChange}
						value={fn.formatDate('now', 'YYYY-MM-DD')}
						prepend={<i className="ion-android-calendar"></i>}
					/>
					<Select
						className="tooltips"
						placeholder="Account"
						label="Account"
						name="account"
						onChange={this.handleInputChange}
						options={accountList}
						validation="required"
						prepend={<i className="ion-android-folder-open"></i>}
					/>
					<TextInput
						className="tooltips"
						placeholder="Amount"
						label="Amount"
						name="amount"
						onChange={this.handleInputChange}
						prepend="£"
						validation="required"
						value="0"
					/>
					{this.state.defaultUserRole !== 'coach' &&
						<TextInput
							className="tooltips"
							placeholder="VAT Rate"
							append="%"
							label="VAT Rate"
							name="vatRate"
							onChange={this.handleInputChange}
							value={myClub.data.vat_rate}
						/>
					}
					<Select
						className="tooltips"
						placeholder="Payment method"
						label="Payment Method"
						name="type"
						onChange={this.handleInputChange}
						options={transactionTypeList}
						validation="required"
						prepend={<i className="ion-card"></i>}
					/>
					{!!this.state.type && this.state.type != 1 &&
						<Select
							label="Transaction code"
							name="transactionCode"
							onChange={this.handleInputChange}
							options={transactionCodeList}
							validation="required"
						/>
					}
					<TextInput
						label="Note"
						name="note"
						onChange={this.handleInputChange}
						textarea
						wide
					/>

					<div className="form-actions">
						<Back className="button">Cancel</Back>
						<FormButton label="Save" />
					</div>
				</Form>
			</div>
		);
	}

}
