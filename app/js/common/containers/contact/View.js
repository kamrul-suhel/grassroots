import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, GoogleMap } from '@xanda/react-components';
import { fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Article, ButtonStandard, Link, Meta, MetaSection, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		collection: store.address,
		address: store.address.collection[ownProps.params.addressId] || {},
	};
})
export default class View extends React.PureComponent {

	addressId = this.props.params.addressId;

	componentWillMount() { 
		const accessLevel = this.props.me.data.user_role;

		//TODO: User role must be sent
		this.props.dispatch(fetchData({
			type: 'ADDRESS',
			url: `/addresses/${this.addressId}?accessLevel=${accessLevel}`,
		}));
	}

	render() {
		const {
			collection,
			address,
		} = this.props;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value={address.title || 'Address details'} />

				<div className="page-actions">
					<ButtonStandard to={`${url.contact}/${address.address_id}/edit`}
									icon={<i className="ion-edit" />}>Edit Contact
					</ButtonStandard>
				</div>

				<ContentLoader
					data={address.address_id}
					forceRefresh
					isLoading={collection.isLoading}
					notFound="No Data"
				>
					<Article bg={<GoogleMap lat={address.lat} lng={address.lng} />}>
						<MetaSection title="Contact details">
							<Meta label="Name" value={address.contact_name} />
							<Meta label="Position" value={address.position} />
							<Meta label="Telephone" value={address.telephone} />
							<Meta label="Mobile" value={address.mobile} />
							<Meta label="Email" value={<a href={`mailto:${address.email}`}>{address.email}</a>} />
							<Meta label="Company" value={address.company} />
							<Meta label="Payment Method" value={address.payment_method} />
						</MetaSection>
						<MetaSection title="Address">
							<Meta label="Title" value={address.title} />
							<Meta label="Type" value={address.address_type} />
							<Meta label="Address" value={address.address} />
							<Meta label="City" value={address.city} />
							<Meta label="Postcode" value={address.postcode} />
						</MetaSection>
					</Article>
				</ContentLoader>
			</div>
		);
	}

}
