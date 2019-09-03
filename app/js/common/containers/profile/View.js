import React from 'react';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Block, ButtonStandard, FileIcon, Meta, PageTitle } from 'app/components';

export default class View extends React.PureComponent {

	renderPageActions = () => {
		switch (fn.getUserRole()) {
			case 'coach':
				return (
					<div className="page-actions">
						<ButtonStandard to={`${url.profile}/edit`} icon={<i className="ion-edit" />}>Edit details</ButtonStandard>
						<ButtonStandard to={`${url.profile}/change-password`} icon={<i className="ion-locked" />}>Update password</ButtonStandard>
						<ButtonStandard to={`${url.profile}/qualifications`} icon={<i className="ion-plus" />}>Upload qualifications</ButtonStandard>
						<ButtonStandard to={`${url.profile}/crb-profle`} icon={<i className="ion-plus" />}>Upload CRB profile</ButtonStandard>
					</div>
				);
			default:
				return (
					<div className="page-actions">
						<ButtonStandard to={`${url.profile}/edit`} icon={<i className="ion-edit" />}>Edit details</ButtonStandard>
						<ButtonStandard to={`${url.profile}/change-password`} icon={<i className="ion-locked" />}>Update password</ButtonStandard>
					</div>
				);
		}
	}

	render() {
		const { me } = this.props;
		let docType = '';

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="My details" />

				{this.renderPageActions()}

				<Block>
					<Meta label="Name" value={me.data.display_name} />
					<Meta label="Email" value={<a href={`mailto:${me.data.email}`}>{me.data.email}</a>} />
					<Meta label="Telephone" value={me.data.telephone} />
					<Meta label="Address" value={me.data.address} />
					<Meta label="Town" value={me.data.town} />
					<Meta label="Postcode" value={me.data.postcode} />
					{me.data.documents && me.data.documents.map((doc) => {
						const showDocType = docType !== doc.type;
						docType = doc.type;
						return (
							<div key={`doc_${doc.scan_id}`}>
								{showDocType && <h2>{doc.type}</h2>}
								<FileIcon title={doc.title} url={doc.file_url} />
							</div>
						);
					})}
				</Block>
			</div>
		);
	}

}
