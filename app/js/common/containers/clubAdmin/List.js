import React from 'react';
import { connect } from 'react-redux';
import {ContentLoader, Dialog, Table} from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ButtonStandard, ConfirmDialog, Link, PageDescription, PageTitle } from 'app/components';

@connect((store) => {
	return {
		clubAdmins: store.clubAdmin,
	};
})
export default class List extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			currentPage: 1,
			filters: '',
			deleteUserId: 0
		};
	}

	componentWillMount() {
		this.props.dispatch({
			type: 'CLUBADMIN_CLEAR',
			payload: 'clubAdmin',
		});

		this.fetchData();
	}

    deleteUser = (userId) => {
		this.refDialog.open();

		this.setState({
			deleteUserId : userId
		})
	}


	fetchData = () => {
		this.props.dispatch(fetchData({
			type: 'CLUBADMIN',
			url: `/clubs/${this.props.params.clubId}/admins`,
		}));
	}

	deleteData = async () => {
		console.log(this.state.deleteUserId);
		return;
		const response = await api.delete(`/users/${id}`);

		if (!api.error(response)) {
			fn.showAlert('Admin has been deleted!', 'success');
			this.fetchData();
		}
	}

	render() {
		const { clubAdmins } = this.props;
		const { currentPage } = this.state;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Club admins" />

				<PageDescription>Create Club Admin accounts for your club managers.</PageDescription>

				<div className="page-actions">
					<ButtonStandard to={`${url.club}/${this.props.params.clubId}/admins/add`} icon={<i className="ion-plus" />}>Add new admin</ButtonStandard>
					<ButtonStandard to={`${url.club}/${this.props.params.clubId}`} icon={<i className="ion-checkmark" />}>Complete Setup</ButtonStandard>
				</div>

				<ContentLoader
					data={clubAdmins.currentCollection}
					forceRefresh
					isLoading={clubAdmins.isLoading}
					notFound="No admins"
				>
					<Table
						headers={['', 'Email address', 'Telephone', 'Options']}
						icon="ion-person"
					>
						{_.map(clubAdmins.currentCollection, (id) => {
							const user = clubAdmins.collection[id];
							const refDialog = user.user_id;
							return (
								<tr key={`admin${user.user_id}`}>
									<td>{user.display_name}</td>
									<td>{user.email}</td>
									<td>{user.telephone}</td>
									<td className="short table-options">
										<Link to={`${url.club}/${this.props.params.clubId}/admins/${user.user_id}/edit`} className="button icon"><i title="Edit" className="ion-edit" /></Link>
										<span className="button icon" onClick={this.deleteUser(user.user_id)}><i title="Delete" className="ion-trash-b" /></span>
									</td>
								</tr>
							);
						})}
					</Table>
				</ContentLoader>

				<div className="page-bottom-actions">
					<Link to={`${url.licence}`} className="button">Back</Link>
					<Link to={`${url.licence}`} className="button">Done</Link>
				</div>
			</div>
		);
	}

}
