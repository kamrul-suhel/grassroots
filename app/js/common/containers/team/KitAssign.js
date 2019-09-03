import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, Table } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ButtonStandard, Link, PageDescription, PageTitle } from 'app/components';

@connect((store) => {
	return {
		teams: store.team,
	};
})
export default class KitAssign extends React.PureComponent {

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
			type: 'TEAM',
			url: `/teams?page=${currentPage}${filters}`,
			page: currentPage,
		}));
	}

	getGenderImage = (team) => {
		switch (team.gender) {
			case 'boy':
				return <i className="icon ion-male"></i>
				break;

			case 'girl':
				return <i className="icon ion-female"></i>
				break;

			case 'mixed':
				return <i className="icon ion-transgender"></i>
				break;
		}
	}

	render() {
		const { teams, params, myClub } = this.props;
		const { currentPage } = this.state;
		const assignKitUrl = `clubs/${myClub.data.club_id}/kits`

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Assign Kits"
						   faq={true}
						   faqLink={fn.getFaqLink(`caAssignKit`, `/${params.clubSlug}/`)}/>

				<PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.</PageDescription>

				<ButtonStandard to={assignKitUrl}
								className={"mb-20"}
								icon={<i className='ion-plus'/>}>Add new kit item
				</ButtonStandard>

				<ContentLoader
					filter={{
						filters: teams.filters,
						onUpdate: this.fetchData,
					}}
					pagination={{
						currentPage,
						onPageChange: this.fetchData,
						total: teams.count,
					}}
					data={teams.currentCollection}
					forceRefresh
					isLoading={teams.isLoading}
					notFound="No teams"
				>
					<Table
						className={"header-transparent"}
						total={teams.count}
						headers={['Team', 'Age Group', 'Options']}
						icon="ion-ios-people"
					>
						{_.map(teams.currentCollection, (id) => {
							const team = teams.collection[id];
							const type = team.type === 'team' ? 'FC' : 'Academy';
							return (
								<tr key={`team_${team.team_id}`}>
									<td>
										<Link to={`${url.team}/${team.team_id}/kits?redirect=${url.kitItem}`}>
											<span className={`${team.total_kit > 0 ? '' : 'text-red'}`}>{this.getGenderImage(team)} {team.title} ({team.total_kit})</span>
										</Link>
									</td>

									<td>
										<span className={`${team.total_kit > 0 ? '' : 'text-red'}`}>{team.agegroup}</span>
									</td>

									<td className="short">
										<Link to={`${url.team}/${team.team_id}/kits`}><i className="icon ion-tshirt"></i>
										</Link>
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
