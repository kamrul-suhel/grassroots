import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Form, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';

export default class SendEmail extends React.PureComponent {

	static propTypes = {
		email: PropTypes.string,
		name: PropTypes.string,
		userId: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
		]).isRequired,
	}

	static defaultProps = {
		email: '',
		name: '',
	}

	confirm = () => {
		this.refForm && this.refForm.submit();
	}

	handleInputChange = (name, value) => this.setState({ [name]: value });

	handleSubmit = async () => {
		const formData = new FormData();
		formData.append('user_id', this.props.userId);
		formData.append('subject', this.state.subject);
		formData.append('content', this.state.content);

		const response = await api.post('/email', formData);

		if (!api.error(response)) {
			fn.showAlert('Your email has been sent successfully!', 'success');
			this.refDialog && this.refDialog.close();
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const { aligned, className, newLine, label, separator, value } = this.props;

		const content = (
			<Form
				loader
				onSubmit={this.handleSubmit}
				ref={ref => this.refForm = ref}
				wide
			>
				<TextInput
					disabled
					label="To"
					name="to"
					value={`${this.props.name} ${this.props.email ? `<${this.props.email}>` : ''}`}
					wide
				/>
				<TextInput
					label="Subject"
					name="subject"
					onChange={this.handleInputChange}
					validation="required"
					wide
				/>
				<TextInput
					label="Content"
					name="content"
					onChange={this.handleInputChange}
					textarea
					validation="required"
					wide
				/>
			</Form>
		);

		const buttons = [
			<button key="cancel" className="button-standard">Cancel</button>,
			<button key="confirm" className="button-standard" onClick={this.confirm}>Confirm</button>,
		];

		return (
			<Dialog
				buttons={buttons}
				content={content}
				ref={ref => this.refDialog = ref}
				title="Send Email"
			>
				<span className="button icon"><i title="Send email" className="ion-android-mail"/></span>
			</Dialog>
		);
	}

}
