import React from 'react';
import { Checkbox, Form, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Back, PageTitle } from 'app/components';

export default class RegisterDetails extends React.PureComponent {

	constructor(props) {
		super(props);

		this.refFormButton = null;
	}

	componentWillMount() {
		if (!this.props.registerAccounts.currentPlayerId) {
			fn.navigate(url.registerAccounts);
		}
	}

	componentDidMount() {
		window.addEventListener('formSubmission.registerAccounts', this.submitForm);
	}

	componentWillUnmount() {
		window.removeEventListener('formSubmission.registerAccounts', this.submitForm);
	}

	submitForm = () => {
		this.refFormButton.click();
	}

	handleInputChange = (name, value) => {
		const payload = {
			name,
			value,
		};

		return this.props.dispatch({ type: 'REGISTERACCOUNTS_UPDATE_ACCOUNT_INFO', payload });
	}

	handleSubmit = async () => {
		const { registerAccounts } = this.props;

		const players = [];

		// loop through players and create the desired array
		_.map(registerAccounts.players, (player) => {
			if (!player.firstName || !player.lastName || !player.dob) {
				return false;
			}

			const discount = fn.returnLeft(registerAccounts.siblings, player.id);
			const priceBand = fn.getPriceBand(discount.length);

			// get programmes assigned to player
			const playerProgrammes = _.filter(registerAccounts.selectedProgrammes, o => o.playerId == player.id);
			const programmes = _.map(playerProgrammes, (programme) => {
				return {
					is_trial: programme.isTrial,
					price_band: priceBand,
					programme_id: programme.programmeId,
					session_id: programme.sessionId || null,
					team_id: programme.teamId,
				};
			});

			return players.push({
				programmes,
				first_name: player.firstName,
				last_name: player.lastName,
				birthday: player.dob,
			});
		});

		const formData = {
			players,
			club_id: this.props.authClub.data.club_id,
			first_name: registerAccounts.account.firstName,
			last_name: registerAccounts.account.lastName,
			email: registerAccounts.account.email,
			telephone: registerAccounts.account.telephone,
			password: registerAccounts.account.password,
			password_confirmation: registerAccounts.account.passwordConfirmation,
			address: registerAccounts.account.address,
			town: registerAccounts.account.town,
			postcode: registerAccounts.account.postcode,
		};

		const response = await api.post('/public/register-accounts', formData);

		if (!api.error(response)) {
			fn.navigate(url.login);
			fn.showAlert('Account successfully created', 'success');
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Enter your details" />
				<Form loader wide onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
					<TextInput name="firstName"
							   label="First name"
							   validation="required"
							   onChange={this.handleInputChange} />

					<TextInput name="lastName"
							   label="Last name"
							   validation="required"
							   onChange={this.handleInputChange} />

					<TextInput name="email"
							   label="Email"
							   validation="required|email"
							   onChange={this.handleInputChange} />

					<TextInput name="telephone"
							   label="Telephone"
							   validation="required"
							   onChange={this.handleInputChange} />

					<TextInput name="password"
							   label="Password"
							   type="password"
							   validation="required"
							   onChange={this.handleInputChange} />

					<TextInput name="passwordConfirmation"
							   label="Confirm password"
							   type="password"
							   validation="required"
							   onChange={this.handleInputChange} />

					<TextInput name="address"
							   label="Address"
							   validation="required"
							   onChange={this.handleInputChange} />

					<TextInput name="town"
							   label="Town"
							   validation="required"
							   onChange={this.handleInputChange} />

					<TextInput name="postcode"
							   label="Postcode"
							   validation="required"
							   onChange={this.handleInputChange} />

					<Checkbox name="terms"
							  className="terms"
							  options={[
							  	{ id: 1, title: <span>I have read and agree to the <a href="http://www.example.com" target="_blank">Terms and Conditions</a></span> }
							  	]}
							  validation="required"
							  onChange={this.handleInputChange} />

					<div className="form-actions">
						<Back className="button">Back</Back>
						<button type="submit" className="button form-submit" ref={ref => this.refFormButton = ref}>Proceed</button>
					</div>
				</Form>
			</div>
		);
	}

}
