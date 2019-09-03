import React from 'react';
import { connect } from 'react-redux';
import { DatePicker, Form, Repeater, Select, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Back, FormButton, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		myClub: store.myClub,
	};
})
export default class AddInvoice extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			userList: [],
			companyList: [],
		};
	}

	componentWillMount = async () => {
		const companyList = await api.get('/dropdown/companies');
		const userList = await api.get('/dropdown/users?roles=guardian');
		this.setState({
			companyList: companyList.data,
			userList: userList.data,
		});
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {

		const formData = new FormData();

		this.state.date && formData.append('date', this.state.date)
		this.state.description && formData.append('description', this.state.description)
		this.state.company && formData.append('company', this.state.company)

		_.map(this.state.lines, (value, index) => {
			if(_.isObject(value)) {
				_.map(value, (k, j) => {
					formData.append(`lines[${index}][${j}]`, k)
				})
			}
		})

		this.state.party && formData.append('user_id', this.state.party)
		this.state.vatRate && formData.append('vat_rate', this.state.vatRate)

		const response = await api.post('/invoices', formData);



		if (!api.error(response)) {
			fn.navigate(url.account);
			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option: {
					message:'Invoice has been created successfully!',
					color:'dark'
				}
			})
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const { myClub } = this.props;
		const { companyList, userList } = this.state;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Create invoice" />
				<Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
					<Select
						className="tooltips"
						placeholder="Party - Only Parents"
						label="Party - Only Parents"
						name="party"
						onChange={this.handleInputChange}
						options={userList}
						validation="required"
						prepend={<i className="ion-person-stalker"/>}
					/>
					<Select
						className="tooltips"
						placeholder="From"
						label="From"
						name="company"
						onChange={this.handleInputChange}
						options={companyList}
						validation="required"
						prepend={<i className="ion-person-stalker"/>}
					/>
					<DatePicker
						className="tooltips"
						placeholder="Date"
						label="Date"
						name="date"
						onChange={this.handleInputChange}
						value={fn.formatDate('now', 'YYYY-MM-DD')}
						prepend={<i className="ion-calendar"/>}
					/>
					<TextInput
						className="tooltips"
						placeholder="VAT Rate"
						append="%"
						label="VAT Rate"
						name="vatRate"
						onChange={this.handleInputChange}
						value={myClub.data.vat_rate}
					/>

					<Repeater
						addButton="Add new item"
						count={1}
						name="lines"
						onChange={this.handleInputChange}
					>
						<TextInput className="tooltips" placeholder="Description" name="title" label="Description" prepend={<i className="ion-clipboard"/>}/>
						<TextInput className="tooltips" placeholder="Amount" name="amount" prepend="£" label="Amount" />
					</Repeater>

					<div className="form-actions">
						<Back className="button" confirm>Cancel</Back>
						<FormButton label="Save" />
					</div>
				</Form>
			</div>
		);
	}

}
