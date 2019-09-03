import React from 'react';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Form, TextInput } from '@xanda/react-components';
import { FormButton, PageTitle } from 'app/components';
import {connect} from "react-redux";

@connect((store, ownProps) => {
	return {

	};
})

export default class ResetPassword extends React.PureComponent {

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const response = await api.update(`/auth/password-reset/${this.props.params.token}`, this.state);

		if (!api.error(response)) {
			fn.navigate(url.login);
			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option: {
					message:'You have successfully reset your password!',
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
				<section className="section section-auth short">
					<PageTitle value="Reset password" />
					<Form loader onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
						<TextInput
							label="Password"
							name="password"
							onChange={this.handleInputChange}
							type="password"
							validation="required"
							wide
						/>
						<TextInput
							label="Confirm password"
							name="password_confirmation"
							onChange={this.handleInputChange}
							type="password"
							validation="required"
							wide
						/>
						<FormButton label="Submit" />
					</Form>
				</section>
			</div>
		);
	}

}
