import React from 'react';
import { Form, TextInput} from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { FormButton, Link, PageTitle } from 'app/components';
import {connect} from "react-redux";

@connect((store, ownProps) => {
	return {

	};
})

export default class Register extends React.PureComponent {

	handleInputChange = (name, value) => {
		this.setState({
			[name]: value,
		});
	}

	handleSubmit = async () => {
		const response = await api.post('/auth/register', this.state);

		if (!api.error(response)) {
			fn.navigate(url.login);
			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option: {
					message:'Account successfully created!',
					color:'white'
				}
			})
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}
	render() {
		return (
			<div id="content" className="site-content-inner">
				<section className="section section-auth">
					<PageTitle value="Register" />
					<Form loader wide onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
						<TextInput
							className="organisation"
							name="organisationName"
							placeholder="Organisation name"
							onChange={this.handleInputChange} />

						<TextInput
							name="first_name"
							placeholder="First name"
							onChange={this.handleInputChange} />

						<TextInput
							name="last_name"
							placeholder="Last name"
							onChange={this.handleInputChange} />

						<TextInput
							name="email"
							placeholder="Email"
							onChange={this.handleInputChange} />

						<TextInput
							name="telephone"
							placeholder="Telephone"
							onChange={this.handleInputChange} />

						<TextInput
							name="password"
							placeholder="Password"
							type="password"
							onChange={this.handleInputChange} />

						<TextInput
							name="password_confirmation"
							placeholder="Confirm password"
							type="password"
							onChange={this.handleInputChange} />

						<TextInput
							name="address"
							placeholder="Address"
							onChange={this.handleInputChange} />

						<TextInput
							name="town"
							placeholder="Town"
							onChange={this.handleInputChange} />

						<TextInput
							name="postcode"
							placeholder="Postcode"
							onChange={this.handleInputChange} />

						<div className="form-actions">
							<FormButton label="Register" />
						</div>
					</Form>
					<Link to={url.login} className="link link-small darken forgot-password">Have an account? Log In</Link>
					<Link to={url.forgotPassword} className="link link-small darken forgot-password">Forgot Your Password?</Link>
				</section>
			</div>
		);
	}

}
