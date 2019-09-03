import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, FileUpload, Form, Repeater, Select, Table, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ButtonStandard, ConfirmDialog, Link, PageDescription, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		kits: store.kit,
	};
})
export default class List extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			currentPage: 1,
		};
	}

	async componentWillMount() {
		this.fetchData();

		const kitTypes = await api.get('/dropdown/kit-types');
		this.setState({
			kitTypes: kitTypes.data,
		});
	}

	fetchData = (currentPage) => {

		this.setState({ currentPage });
		this.props.dispatch(fetchData({
			type: 'KIT',
			url: `/kits?page=${currentPage}`,
			page: currentPage,
		}));
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async (typeId, kitId = '') => {
		const formData = new FormData();
		formData.append('club_id', this.props.myClub.data.club_id);
		this.state.type && formData.append('type_id', this.state.type);
		this.state.title && formData.append('title', this.state.title);
		this.state.sku && formData.append('product_sku', this.state.sku);
		this.state.pic && formData.append('image_url', this.state.pic);
		this.state.sizes && _.map(this.state.sizes, ({ size }) => size && formData.append('sizes[]', size));

		const response = await api.post(`/kits/${kitId}`, formData);

		if (!api.error(response)) {
			this.fetchData();
			const refKitId = kitId || 'add';
			this.refDialog[refKitId] && this.refDialog[refKitId].close();
		}
	}

	addItem = () => {
		this.refForm && this.refForm.submit();
	}

	saveSize = async (kitId) => {
		const size = this.state[`size${kitId}`];

		if (!size) {
			return false;
		}

		const formData = {
			size,
		};

		const response = await api.post(`/kits/${kitId}/select-size`, formData);

		if (!api.error(response)) {
			fn.showAlert('Size has been selected!', 'success');
			this.fetchData();
		}
	}

	deleteData = async (id) => {
		const response = await api.delete(`/kits/${id}`);

		if (!api.error(response)) {
			fn.showAlert('Kit item has been deleted!', 'success');
			this.fetchData();
		}
	}

	generateTableHeader = () => {
		let header = ['', 'Child', 'Team', 'Type', 'Size', 'Options'];

		switch (fn.getUserRole()) {
			case 'admin':
				header = ['', 'Team', 'Type', 'Sizes', 'Options'];
				break;
			case 'coach':
				header = ['', 'Team', 'Type', 'Size', 'Options'];
				break;
		}

		return header;
	}

	renderKitSize = (kit) => {
		let size = kit.size;

		switch (fn.getUserRole()) {
			case 'admin':
				size = kit.available_sizes && kit.available_sizes.map(size => size.value).join(', ');
				break;
			default:
				if (!kit.size) {
					let saveButton = null;

					// check if size is set for that id
					if (this.state[`size${kit.id}`]) {
						saveButton = <span key="saveSize" className="button" onClick={() => this.saveSize(kit.id)}>Save</span>;
					}

					size = (
						<div className="flex">
							<Select name={`size${kit.id}`} valueKey="value" options={kit.available_sizes} onChange={this.handleInputChange} />
							{saveButton}
						</div>
					);
				}
				break;
		}

		return <td className="kit-size-select">{size}</td>;
	}

	renderDialogContent = (kit = {}) => (
		<Form ref={ref => this.refForm = ref} className="kit-form" onSubmit={this.handleSubmit}>
			<TextInput
				name="title"
				onChange={this.handleInputChange}
				placeholder="Title"
				validation="required"
				value={kit.title}
			/>
			<Select
				name="type"
				placeholder="Type"
				options={this.state.kitTypes && [...this.state.kitTypes]}
				onChange={this.handleInputChange}
			/>
			<TextInput
				name="sku"
				onChange={this.handleInputChange}
				placeholder="Product Code"
				value={kit.product_sku}
			/>
			<FileUpload
				accept=".jpg,.jpeg,.png"
				clearable
				name="pic"
				onChange={this.handleInputChange}
				placeholder="Product Image"
				prepend={<i className="ion-android-upload" />}
				validation="file|max:1000"
			/>
			<Repeater
				addButton="Add New size"
				count={1}
				name="sizes"
				onChange={this.handleInputChange}
				removeButton={<i className="button-icon ion-android-close" />}
				title="Sizes"
				value={kit.available_sizes}
				valueExtractor={{ size: 'value' }}
			>
				<TextInput wide name="size" placeholder="Size" validation="required" />
			</Repeater>
		</Form>
	)

	render() {
		const { kits } = this.props;
		const { currentPage } = this.state;
		const addItemDialogBody = this.renderDialogContent()

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="My kit items" />

				<PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.</PageDescription>

				{fn.isAdmin() &&
					<div className="page-actions">
						<a className="button-standard-wrapper">
							<ConfirmDialog
								onlyContent
								title=""
								body={addItemDialogBody}
								actions={[
									<button key="cancel" className="button-standard">Cancel</button>,
									<button key="confirm" className="button-standard hover-blue" onClick={this.addItem}>Confirm</button>,
								]}
							>
								<h3>Add kit item</h3>
								<span className="button-standard">Add kit item</span>
							</ConfirmDialog>
						</a>
						<ButtonStandard to={url.team}>Assign kit</ButtonStandard>
					</div>
				}

				<ContentLoader
					pagination={{
						currentPage,
						onPageChange: this.fetchData,
						total: kits.count,
					}}
					data={kits.currentCollection}
					forceRefresh
					isLoading={kits.isLoading}
					notFound="There are no kits assigned to your account."
				>
					<Table
						total={kits.count}
						headers={this.generateTableHeader()}
						icon="ion-tshirt"
					>
						{_.map(kits.currentCollection, (id) => {
							const kit = kits.collection[id];
							return (
								<tr key={`kit_${kit.id}`}>
									<td><Link to={`${url.kit}/${kit.kit_id}`}>{kit.title}</Link></td>
									{fn.isGuardian() && <td><Link to={`${url.player}/${kit.player_id}`}>{kit.player_name}</Link></td>}
									<td>{kit.teams && kit.teams.map(team => team.title).join(', ')}</td>
									<td>{kit.type}</td>
									{this.renderKitSize(kit)}
									<td className="table-options">
										<Link to={`${url.kit}/${kit.kit_id}`} className="button icon"><i title="View" className="ion-search" /></Link>
									</td>
								</tr>
							);
						})}
					</Table>
				</ContentLoader>
			</div>
		);
	}

}
