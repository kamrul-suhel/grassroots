import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Article, ButtonStandard, Meta, Link, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		collection: store.kit,
		kit: store.kit.collection[ownProps.params.kitId] || {},
	};
})
export default class View extends React.PureComponent {

	constructor(props) {
		super(props);

		this.kitId = this.props.params.kitId;
	}

	componentWillMount() {
		this.props.dispatch(fetchData({
			type: 'KIT',
			url: `/kits/${this.kitId}`,
		}));
	}

	render() {
		const {
			collection,
			kit,
		} = this.props;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value={kit.title || 'Kit item'} />

				{fn.isAdmin() &&
					<div className="page-actions">
						<ButtonStandard to={`${url.kit}/${this.kitId}/edit`} icon={<i className="ion-edit" />}>Edit kit</ButtonStandard>
					</div>
				}

				<ContentLoader
					data={kit.kit_id}
					forceRefresh
					isLoading={collection.isLoading}
					notFound="No Data"
				>
					<Article img={kit.image_url}>
						<Meta label="Title" value={kit.title} />
						<Meta label="Product SKU" value={kit.product_sku} />
						<Meta label="Type" value={kit.type} />
						<Meta label="Available sizes" value={kit.available_sizes && kit.available_sizes.map(o => o.value).join(', ')} />
					</Article>
				</ContentLoader>
			</div>
		);
	}

}
