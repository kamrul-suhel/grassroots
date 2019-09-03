import React from 'react';
import { connect } from 'react-redux';
import {Checkbox, FileUpload, Form, Select, TextInput} from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, FormButton, PageTitle } from 'app/components';
import FormSection from "../../components/FormSection";

@connect((store, ownProps) => {
	return {
		download: store.download.collection[ownProps.params.downloadId] || {},
	};
})
export default class Edit extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			roleList: [
				{ id: 'coach', title: 'Coaches' },
				{ id: 'guardian', title: 'Parents' },
			],
			categoryList: [
				{ id: '1', title: 'Category 1' },
				{ id: '2', title: 'Category 2' },
			],
		};

		this.downloadId = this.props.params.downloadId;
	}

	componentWillMount() {
		this.props.dispatch(fetchData({
			type: 'DOWNLOAD',
			url: `/downloads/${this.downloadId}`,
		}));
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const {
			title,
			category,
			content,
			file,
			visibility,
			order,
			status
		} = this.state

		this.refForm && this.refForm.hideLoader()

		const dVisibility = visibility.length > 1 ? 'all' : visibility
		const formData = new FormData()
		formData.append('title', title)
		formData.append('category_id', category)
		formData.append('content', content)
		formData.append('file', file)
		formData.append('visibility', dVisibility)
		order && formData.append('order', order)
		status && formData.append('status', status)

		const response = await api.update(`/downloads/${this.downloadId}`, formData);
		if (!api.error(response)) {
			fn.navigate(url.download)
		} else {
			this.refForm && this.refForm.hideLoader()
		}
	}

	render() {
		const { download } = this.props
		const {
			categoryList,
			roleList,
		} = this.state

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Edit download" />
				<Form loader onSubmit={this.handleSubmit} classname="form-section" ref={ref => this.refForm = ref}>
					<FormSection>
						<TextInput
							className="tooltips"
							placeholder="Title"
							label="Title"
							name="title"
							onChange={this.handleInputChange}
							validation="required"
							value={download.title}
							prepend={<i className="ion-ios-book-outline"/>}
						/>
						<Select
							className="tooltips"
							placeholder="Category"
							label="Category"
							name="category"
							onChange={this.handleInputChange}
							options={categoryList}
							validation="required"
							value={download.category_id}
							prepend={<i className="ion-clipboard"/>}
						/>

						<TextInput
							className="tooltips"
							placeholder="Content"
							label="Content"
							name="content"
							onChange={this.handleInputChange}
							textarea
							value={download.content}
							wide
						/>

						<FileUpload
							wide
							className="tooltips"
							placeholder="Upload file"
							accept=".jpg,.jpeg,.png,.pdf"
							clearable
							label="Upload file"
							name="file"
							onChange={this.handleInputChange}
							prepend={<i className="ion-android-upload" />}
							validation="required"
						/>

						<Checkbox
							label="Visibility"
							multiple
							name="visibility"
							onChange={this.handleInputChange}
							options={roleList}
							styled
							validation="required"
							value={download.visibility}
							wide
						/>

						<div className="form-actions">
							<Back className="button" confirm>Cancel</Back>
							<FormButton label="Save" />
						</div>
					</FormSection>
				</Form>
			</div>
		);
	}

}
