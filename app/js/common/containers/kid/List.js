import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ButtonStandard, Item, Link, Meta, PageTitle } from 'app/components';
import moment from 'moment';

@connect((store) => {
	return {
		kids: store.kid,
	};
})
export default class List extends React.PureComponent {

	componentWillMount() {
		this.props.dispatch(fetchData({
			type: 'KID',
			url: '/players',
		}));
	}

	render() {
		const { kids, params } = this.props;
		const type = fn.getFaqType('Children')

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="My children"
						   faq={true}
						   faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}/>

				<div className="page-actions">
					<ButtonStandard to={`${url.kid}/add`} icon={<i className="ion-plus" />}>Add child</ButtonStandard>
				</div>

				<ContentLoader
					data={kids.currentCollection}
					forceRefresh
					isLoading={kids.isLoading}
					notFound="No kids"
				>
					<div className="grid">
						{_.map(kids.currentCollection, (id) => {
							const player = kids.collection[id];
							const icon = player.gender === 'male' ? 'ion-male' : 'ion-female';
							const content = (
								<div>
									<Meta aligned={false} label="Age" value={`${moment().diff(moment(player.birthday, 'YYYY-MM-DD hh:mm:ss'), 'years')} years old`} />
									<Meta aligned={false} label="Gender" value={_.startCase(player.gender)} />
									{'teams' in player && player.teams.length > 0 && player.teams.map(team => <Meta aligned={false} key={`team_${team.team_id}`} label="Team" value={team.title} />)}
								</div>
							);

							return (
								<Item
									key={`kid_${player.player_id}`}
									background={player.pic}
									backgroundOverlay
									content={content}
									icon={<i className={icon} />}
									itemClass="item-player"
									link={`${url.kid}/${player.player_id}`}
									title={player.display_name}
									wrapperClass="grid-xs-12 grid-s-4"
								/>
							);
						})}
					</div>
				</ContentLoader>
			</div>
		);
	}

}
