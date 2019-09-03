import React from 'react';
import { fn } from 'app/utils';

export default class Alert extends React.PureComponent {

	render() {
		const { alerts, show, type } = this.props.data;

		if (show === false || type === 'success') {
			return false;
		}

		const typeLabel = type ? `${_.startCase(_.toLower(type))}!` : '';

		return (
			<div className={`alert alert-${type}`}>
				<button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={fn.hideAlert}>
					<i className="ion-close" />
				</button>
				<ul>
					{alerts && alerts.map((alert, i) => <li key={`alert_${i}`}><strong>{typeLabel}</strong> {alert}</li>)}
				</ul>
			</div>
		);
	}

}
