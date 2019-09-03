import React from 'react';
import { DatePicker, FileUpload, Form } from '@xanda/react-components';
import Store from 'app/store';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, FormButton, PageTitle } from 'app/components';

export default class EditCRB extends React.PureComponent {

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const formData = new FormData();
		formData.append('expiry', this.state.expiry);
		this.state.file && formData.append('file', this.state.file);

		const response = await api.post('/users/scans?type=CRB', formData);

		if (!api.error(response)) {
			Store.dispatch(fetchData({
				type: 'ME',
				url: '/users/me',
			}));

			fn.navigate(url.profile);
			fn.showAlert('CRB Scan has been uploaded successfully!', 'success');
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Update CRB profile" />

				<Form loader onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
					<DatePicker name="expiry" label="CRB Expiry" futureOnly showYearSelect onChange={this.handleInputChange} />
					<FileUpload
						accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
						clearable
						label="CRB Scan"
						name="file"
						onChange={this.handleInputChange}
						placeholder="Upload image/file"
						prepend={<i className="ion-android-upload" />}
						validation="file|max:1000"
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
