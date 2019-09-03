import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, Table } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ButtonStandard, ConfirmDialog, Link, PageDescription, PageTitle } from 'app/components';

@connect((store) => {
	return {
		skills: store.skill,
	};
})
export default class List extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			currentPage: 1,
			filters: '',
		};
	}

	componentWillMount() {
		this.fetchData();
	}

	fetchData = (currentPage = 1, newFilters) => {

		this.setState({
			currentPage,
			filters: newFilters || this.state.filters,
		});
		const filters = newFilters === undefined ? this.state.filters : newFilters;
		this.props.dispatch(fetchData({
			type: 'SKILL',
			url: `/skills?page=${currentPage}${filters}`,
			page: currentPage,
		}));
	}

	render() {
		const { skills } = this.props;
		const { currentPage } = this.state;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Skills" />

				<PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.</PageDescription>

				<div className="page-actions">
					<ButtonStandard to={`${url.skill}/add`} icon={<i className="ion-plus" />}>Create skill</ButtonStandard>
				</div>

				<ContentLoader
					filter={{
						filters: skills.filters,
						onUpdate: this.fetchData,
					}}
					pagination={{
						currentPage,
						onPageChange: this.fetchData,
						total: skills.count,
					}}
					data={skills.currentCollection}
					forceRefresh
					isLoading={skills.isLoading}
					notFound="No skills"
				>
					<Table headers={['Skill', 'Category', 'Options']} icon="ion-ios-analytics">
						{_.map(skills.currentCollection, (id) => {
							const skill = skills.collection[id];
							return (
								<tr key={`skill_${skill.skill_id}`}>
									<td>{skill.title}</td>
									<td>{skill.category}</td>
									<td className="table-options">
										<Link to={`${url.skill}/${skill.skill_id}/edit`} className="button icon"><i title="Edit" className="ion-edit" /></Link>
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
