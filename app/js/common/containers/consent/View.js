import React from 'react';
import { connect } from 'react-redux';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { ContentLoader } from '@xanda/react-components';
import { Article, Link, Meta, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		collection: store.consent,
		consent: store.consent.collection[ownProps.params.consentId] || {},
	};
})
export default class View extends React.PureComponent {

	consentId = this.props.params.consentId;

	componentWillMount() {
		this.props.dispatch(fetchData({
			type: 'CONSENT',
			url: `/consents/${this.consentId}`,
		}));
	}

	agreeConsent = async (event) => {
		event.preventDefault();
		const { consent } = this.props;
		const response = await api.update(`/consents/${consent.consent_id}`, 1);

		if (!api.error(response)) {
			fn.navigate(url.consent);
			fn.showAlert(`Consent (${consent.title}) has been agreed.`, 'success');
		}
	}

	render() {
		const {
			collection,
			consent,
		} = this.props;
		const status = consent.agreed_at === '0000-00-00 00:00:00' || !consent.agreed_at ? 'Pending' : 'Agreed';

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value={consent.title || 'Consent'} />
				<ContentLoader
					data={consent.consent_id}
					forceRefresh
					isLoading={collection.isLoading}
					notFound="No Data"
				>
					<Article>
						<Meta label="Title" value={consent.title} />
						<Meta label="Status" value={status} />
						{fn.isGuardian() && status === 'Pending' &&
							<div className="form-actions">
								<Link className="button" to={`${url.consent}/${consent.consent_id}/agree`} onClick={this.agreeConsent}>I Agree</Link>
							</div>
						}
					</Article>
				</ContentLoader>
			</div>
		);
	}

}
