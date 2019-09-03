import React from 'react';
import { connect } from 'react-redux';
import { Checkbox, FileUpload, Form, Select, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, FormButton, PageTitle, RepeaterInput } from 'app/components';

@connect((store, ownProps) => {
	return {
		kit: store.kit.collection[ownProps.params.kitId] || {},
	};
})
export default class Edit extends React.PureComponent {

	constructor(props) {
		super(props);

		this.kitId = this.props.params.kitId;

		this.state = {
			kitTypes: [],
			playerAssignmentList: [
				{ title: 'Player', id: '1' },
				{ title: 'Coach', id: '0' },
			],
		};
	}

	componentWillMount = async () => {
		this.props.dispatch(fetchData({
			type: 'KIT',
			url: `/kits/${this.kitId}`,
		}));

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
		this.state.pic && formData.append('image_url', this.state.pic);

		const response = await api.post(`/kits/${this.kitId}`, formData);

		if (!api.error(response)) {
			fn.navigate(url.kit);
			fn.showAlert('Kit item has been updated successfully!', 'success');
		} else {
			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const { kitTypes, playerAssignmentList } = this.state;
		const { kit } = this.props;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Edit kit item" />
				<Form loader onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
					<TextInput wide name="title" label="Title" value={kit.title} onChange={this.handleInputChange} />
					<Select disabled name="type" label="Type" options={kitTypes} value={kit.type_id} onChange={this.handleInputChange} />
					<TextInput disabled name="sku" label="Product Code" value={kit.product_sku} onChange={this.handleInputChange} />
					<Checkbox styled disabled name="playerAssignment" label="Kit item for" options={playerAssignmentList} value={kit.is_player_assignment} onChange={this.handleInputChange} />
					<FileUpload
						accept=".jpg,.jpeg,.png"
						clearable
						label="Image"
						name="pic"
						onChange={this.handleInputChange}
						prepend={<i className="ion-android-upload" />}
						validation="file|max:1000"
					/>
					<RepeaterInput
						disabled
						name="sizes"
						onChange={this.handleInputChange}
						placeholder="Size"
						title="Sizes"
						values={kit.available_sizes}
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
