import React from 'react';
import { fn } from 'app/utils';
import { PageTitle } from 'app/components';

export default class Export extends React.PureComponent {

	render() {
		const { params } = this.props
		const token = fn.getCookie('token');
		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Export" faq={true}
						   faqLink={fn.getFaqLink(`caExports`, `/${params.clubSlug}/`)}/>

				<div className="page-actions">
					<a className="button-standard-wrapper medium"
					   href={`http://api2.grassroots.hostings.co.uk/v1/export/players?token=${token}`}>
						<i className="ion-archive" />
						<span className="button-standard">Export players to CSV</span>
					</a>
					<a className="button-standard-wrapper medium"
					   href={`http://api2.grassroots.hostings.co.uk/v1/export/teams?token=${token}`}>
						<i className="ion-archive" />
						<span className="button-standard">Export teams to CSV</span>
					</a>
					<a className="button-standard-wrapper large"
					   href={`http://api2.grassroots.hostings.co.uk/v1/export/guardians?token=${token}`}>
						<i className="ion-archive" />
						<span className="button-standard">Export parents to CSV</span>
					</a>
				</div>
			</div>
		);
	}

}
