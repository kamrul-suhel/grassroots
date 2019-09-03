import React from 'react';
import { Checkbox, FileUpload, Form, Select, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Back, FormButton, PageTitle, RepeaterInput } from 'app/components';
import {connect} from "react-redux";

@connect((store, ownProps) => {
	return {

	};
})

export default class Add extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			kitTypes: [],
			playerAssignmentList: [
				{ title: 'Player', id: 1 },
				{ title: 'Coach', id: 0 },
			],
		};
	}

	componentWillMount = async () => {
		const kitTypes = await api.get('/dropdown/kit-types');
		this.setState({
			kitTypes: kitTypes.data,
		});
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const formData = new FormData();
		this.state.title && formData.append('title', this.state.title);
		this.state.type && formData.append('type_id', this.state.type);
		this.state.playerAssignment && formData.append('is_player_assignment', this.state.playerAssignment);
		this.state.sku && formData.append('product_sku', this.state.sku);
		this.state.pic && formData.append('image_url', this.state.pic);
		this.state.sizes && _.map(this.state.sizes, size => size.title && formData.append('sizes[]', size.title));

		const response = await api.post('/kits', formData);

		if (!api.error(response)) {
			fn.navigate(url.kit);
			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option:{
					message:'Kit item has been created successfully!',
					color: 'dark'
				}
			});
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const { kitTypes, playerAssignmentList } = this.state;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Add kit item" />
				<Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
					<TextInput
						className="tooltips"
						placeholder="Title"
						name="title" label="Title"
						prepend={<i className="ion-ios-book-outline"/>}
						onChange={this.handleInputChange}
					/>
					<Select
						className="tooltips"
						placeholder="Type"
						name="type"
						label="Type"
						options={kitTypes}
						prepend={<i className="ion-ios-bookmarks-outline" />}
						onChange={this.handleInputChange}
					/>
					<TextInput
						className="tooltips"
						placeholder="Product code"
						name="sku" label="Product Code"
						prepend={<i className="ion-ios-barcode" />}
						onChange={this.handleInputChange}
					/>
					<Checkbox
						styled
						name="playerAssignment"
						label="Kit item for"
						options={playerAssignmentList}
						onChange={this.handleInputChange}
					/>
					<FileUpload
						accept=".jpg,.jpeg,.png"
						clearable
						label="Photo"
						name="pic"
						onChange={this.handleInputChange}
						prepend={<i className="ion-android-upload" />}
						validation="file|max:1000"
					/>
					<RepeaterInput
						name="sizes"
						onChange={this.handleInputChange}
						placeholder="Size"
						title="Sizes"
					/>

					<div className="form-actions">
						<Back className="button" confirm>Cancel</Back>
						<FormButton label="Save" />
					</div>
				</Form>
			</div>
		);
	}

}
