import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Article, ButtonStandard, Meta, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		collection: store.skill,
		skill: store.skill.collection[ownProps.params.skillId] || {},
	};
})
export default class View extends React.PureComponent {

	componentWillMount() {
		this.props.dispatch(fetchData({
			type: 'SKILL',
			url: `/skills/${this.props.params.skillId}`,
		}));
	}

	render() {
		const {
			collection,
			skill,
		} = this.props;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value={skill.title || 'skill'} />

				<div className="page-actions">
					<ButtonStandard to={`${url.skill}/${skill.skill_id}/edit`} icon={<i className="ion-edit" />}>Edit skill</ButtonStandard>
				</div>

				<ContentLoader
					data={skill.skill_id}
					forceRefresh
					isLoading={collection.isLoading}
					notFound="No Data"
				>
					<Article>
						<Meta label="Name" value={skill.title} />
						<Meta label="Category" value={skill.category} />
					</Article>
				</ContentLoader>
			</div>
		);
	}

}
