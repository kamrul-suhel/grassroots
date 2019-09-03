import React from 'react';
import { Form, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { FormButton, PageDescription, PageTitle } from 'app/components';

export default class Refer extends React.PureComponent {

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const formData = {
			name: this.state.name,
			email: this.state.email,
		};

		const response = await api.post('/refer', formData);

		if (!api.error(response)) {
			fn.navigate(url.refer);
			fn.showAlert('Your referral message has been sent.', 'success');
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Refer" />
				<PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.</PageDescription>
				<Form loader onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
					<TextInput wide name="name" label="Name" onChange={this.handleInputChange} />
					<TextInput wide name="email" label="Email" onChange={this.handleInputChange} />
					<FormButton label="Send" />
				</Form>
			</div>
		);
	}

}
