import React from 'react';
import { Checkbox, FileUpload, Form, Select, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Back, FormButton, PageTitle } from 'app/components';
import FormSection from "../../components/FormSection";
import {connect} from "react-redux";
import {Dialog} from "@xanda/react-components";
import {Add as DownloadCategory} from 'app/containers/downloadCategory'

@connect((store, ownProps) => {
	return {

	};
})

export default class Add extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			roleList: [
				{ id: 'coach', title: 'Coaches' },
				{ id: 'guardian', title: 'Parents' },
			],
			categoryList: [],
			categoryDialog: false
		};
	}

	componentWillMount() {
		this.fetchCategories();
	}

	fetchCategories = async () => {
		// Get all categories
		const response = await api.get('download-categories');

		let categories = [];
		// Add new category option first.
		categories.push({id: 'add', title: 'Add new category'})
		_.map(response.data, (category) => {
			categories.push(category)
		})

		this.setState({
			categoryList: [...categories]
		})
	}

	handleInputChange = (name, value) => {
		// Check if name is category, if category check value is add, 
		// If name is category & value is add then show dialogbox.
		if(name === 'category' && value === 'add'){
			this.setState({
				categoryDialog: true
			})
			return
		}
		
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		let visibility = this.state.visibility.length > 1 ? 'all' : this.state.visibility;
		const formData = new FormData();
		this.state.title && formData.append('title', this.state.title);
		this.state.category && formData.append('category_id', this.state.category);
		this.state.content && formData.append('content', this.state.content);
		this.state.visibility && formData.append('visibility', visibility);
		this.state.order && formData.append('order', this.state.order);
		this.state.status && formData.append('status', this.state.status);
		this.state.file && formData.append('file', this.state.file);

		const response = await api.post('/downloads', formData);

		if (!api.error(response, false)) {
			fn.navigate(url.download);
		} else {
			const element = document.getElementsByClassName('category')[0]
			let spanELement = document.createElement('span')
			spanELement.setAttribute('class', 'error text-error')
			let textNode = document.createTextNode(response.data.category_id[0])

			spanELement.appendChild(textNode)
			element.appendChild(spanELement)
			this.refForm && this.refForm.hideLoader();
		}
	}

	renderAddCategoryContent = () => {
		return (
			<DownloadCategory
				closeDialog={this.closeCategoryDialog}
			/>
		)
	}

	closeCategoryDialog = () => {
		this.setState({
			categoryDialog: false
		})

		this.fetchCategories()
	}

	render() {
		const { roleList, categoryList, categoryDialog } = this.state;

		return (
			<div id="content" className="site-content-inner download-component">
				<PageTitle value="Add download" />
				<Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
					<TextInput
						className="tooltips"
						placeholder="Title"
						label="Title"
						name="title"
						onChange={this.handleInputChange}
						validation="required"
						prepend={<i className="ion-clipboard"/>}
					/>

					<Select
						ref={ref => this.refCategory = ref}
						className="tooltips category"
						placeholder="Category"
						label="Category"
						name="category"
						onChange={this.handleInputChange}
						options={categoryList}
						validation="required"
						prepend={<i className="ion-clipboard"/>}
					/>

					<TextInput
						className="tooltips"
						placeholder="Content"
						label="Content"
						name="content"
						onChange={this.handleInputChange}
						textarea
						wide
					/>

					<FileUpload
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

					<FormSection>
						<Checkbox
							label="Visibility"
							multiple
							name="visibility"
							onChange={this.handleInputChange}
							options={roleList}
							styled
							validation="required"
						/>
					</FormSection>

					<div className="form-actions">
						<Back className="button" confirm>Cancel</Back>
						<FormButton label="Save" />
					</div>
				</Form>

				{/*Add new category dialog*/}
				{categoryDialog && <Dialog
					title="Add category"
					showCloseButton={false}
					content={this.renderAddCategoryContent()}
				>
				</Dialog>
				}
			</div>
		);
	}

}
