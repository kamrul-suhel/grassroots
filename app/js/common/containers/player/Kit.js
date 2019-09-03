import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, Select, Table } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ConfirmDialog, PageDescription, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		collection: store.player,
		player: store.player.collection[ownProps.params.playerId] || {},
	};
})
export default class Kit extends React.PureComponent {

	constructor(props) {
		super(props);

		this.playerId = this.props.params.playerId;
	}

	componentWillMount() {
		this.fetchData();
	}

	fetchData = (currentPage) => {

		this.setState({ currentPage });
		this.props.dispatch(fetchData({
			type: 'PLAYER',
			url: `/players/${this.playerId}/kits?page=${currentPage}`,
			page: currentPage,
		}));
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
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
							<Select name={`size${kit.id}`} options={kit.available_sizes} onChange={this.handleInputChange} />
							{saveButton}
						</div>
					);
				}
				break;
		}

		return <td className="kit-size-select">{size}</td>;
	}

	render() {
		const {
			collection,
			player,
		} = this.props;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value={`Kit items for ${player.display_name}`} />

				<PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.</PageDescription>

				<ContentLoader
					data={player.player_id}
					forceRefresh
					isLoading={collection.isLoading}
					notFound="There are no kits assigned to your account."
				>
					<Table headers={['', 'Team', 'Type', 'Size']} icon="ion-tshirt">
						{_.map(player.kits, kit => (
							<tr key={`kit_${kit.kit_id}`}>
								<td>{kit.title}</td>
								<td>{kit.team}</td>
								<td>{kit.type}</td>
								{this.renderKitSize(kit)}
							</tr>
						))}
					</Table>
				</ContentLoader>
			</div>
		);
	}

}
