import React from 'react';
import { connect } from 'react-redux';
import { Form, Repeater, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Article, Back, FormButton, Meta, PageDescription, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		clubLicence: store.myClubLicence || {},
		me: store.me
	};
})
export default class Licence extends React.PureComponent {

	componentWillMount() {
		this.props.dispatch(fetchData({
			type: 'MYCLUB_LICENCE',
			url: '/clubs/my/package',
		}));
	}

	render() {
		const { clubLicence, me } = this.props;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Your Package" />
				<Article className="licence-view block-content-wrapper">
					<Meta aligned={false} label="Licence" value={clubLicence.data.package_title} />
					<Meta aligned={false} label="Maximum number of active players" value={clubLicence.data.max_slot} />
					<Meta aligned={false} label="Current active players" value={clubLicence.data.active_players} />
					<Meta aligned={false} label="Remaining slots" value={clubLicence.data.max_slot - clubLicence.data.active_players} />
					<Meta aligned={false} label="Expires" value={fn.formatDate(clubLicence.data.expire_date)} />
					<Meta aligned={false} label="Status" value={!!clubLicence.data.status && 'Active'} />
				</Article>

				<div>
					<p>If you wish to change or update your package, please contact {me.data.super_admin && me.data.super_admin.first_name} who will be able to make the changes via the Super Admin Terminal.</p>
				</div>

				<div className="form-actions">
					<Back className="button">Back</Back>
				</div>
			</div>
		);
	}

}
