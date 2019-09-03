import React from 'react';
import { connect } from 'react-redux';
import { fn } from 'app/utils';
import { url } from 'app/constants';
import { Alert, SiteHeader } from 'app/components';
import { Overview } from './';

@connect((store) => {
	return {
		alerts: store.alert,
		registerAccounts: store.registerAccounts,
	};
})
export default class Wrapper extends React.PureComponent {

	render() {
		const childrenWithProps = React.Children.map(this.props.children, child => React.cloneElement(child, {
			authClub: this.props.authClub,
			dispatch: this.props.dispatch,
			registerAccounts: this.props.registerAccounts,
		}));

		return (
			<div className="site">
				<div className="registration-wizard">
					<Alert data={this.props.alerts} />
					{childrenWithProps}
					<Overview {...this.props} />
				</div>
			</div>
		);
	}

}
