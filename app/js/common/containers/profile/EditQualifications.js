import React from 'react';
import { FileUpload, Form } from '@xanda/react-components';
import Store from 'app/store';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, FormButton, PageTitle } from 'app/components';

export default class EditQualifications extends React.PureComponent {

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const formData = new FormData();
		this.state.files && this.state.files.map((files) => { formData.append('files[]', files); });

		const response = await api.post('/users/qualifications', formData);

		if (!api.error(response)) {
			Store.dispatch(fetchData({
				type: 'ME',
				url: '/users/me',
			}));

			fn.navigate(url.profile);
			fn.showAlert('Qualifications have been uploaded successfully!', 'success');
		}
	}

	render() {
		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Update qualifications" />

				<Form loader onSubmit={this.handleSubmit}>
					<FileUpload
						accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
						clearable
						label="Qualifications"
						multiple
						name="files"
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
