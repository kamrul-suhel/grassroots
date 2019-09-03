import React from 'react';
import { connect } from 'react-redux';
import { fetchData } from 'app/actions';

@connect((store, ownProps) => {
	return {
		club: store.club.collection[ownProps.params.clubId ||  store.me.data.club_id] || {},
		clubSetup: store.clubSetup,
		collection: store.club,
		licence: store.licence.collection[ownProps.params.clubId ||  store.me.data.club_id] || {},
		assessments: store.assessmentTemplate,
		programme: store.programme,
		me: store.me.data,
		setupWizard: store.setupWizard
	};
})
export default class Wrapper extends React.PureComponent {
	componentWillMount() {
        const licenceId = _.parseInt(this.props.location.query.licenceId);

		this.props.dispatch({
			type: 'CLUBSETUP_CLEAR',
			payload: 'clubSetup',
		});
		
		this.fetchData();

        licenceId &&
        this.props.dispatch(fetchData({
            type: 'LICENCE',
            url: `/franchises/packages?rel_club_package_id=${licenceId}`,
        }));
	}
	
	clubId = this.props.params.clubId || this.props.me.club_id;
	
	fetchData = () => {

		this.props.dispatch(fetchData({
			type: 'CLUB',
			url: `/clubs/${this.clubId}`,
		}));

		this.props.dispatch(fetchData({
			type: 'MYCLUB',
			url: '/clubs/my',
		}))

        this.props.dispatch(fetchData({
            type: 'CLUBADMIN',
            url: `/clubs/${this.props.params.clubId}/admins`,
        }))

		this.props.dispatch(fetchData({
			type: 'ASSESSMENT_TEMPLATE',
			url: `/assessments/templates`,
		}));

		
	}


	render() {
		return React.cloneElement(this.props.children, {
			...this.props,
			fetchData: this.fetchData,
		});
	}

}
