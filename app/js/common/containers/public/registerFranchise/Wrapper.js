import React from 'react';
import { connect } from 'react-redux';
import { fn } from 'app/utils';
import { url } from 'app/constants';
import { Alert, SiteHeader } from 'app/components';
import { Overview } from './';

@connect((store) => {
	return {
		alerts: store.alert,
		registerFranchise: store.registerFranchise,
	};
})
export default class Wrapper extends React.PureComponent {

	render() {
		const childrenWithProps = React.Children.map(this.props.children, child => React.cloneElement(child, {
			alerts: this.props.alerts,
			dispatch: this.props.dispatch,
			registerFranchise: this.props.registerFranchise,
		}));

		return (
			<div className="site">
				<div className="registration-wizard">
					<SiteHeader/>
					<Alert data={this.props.alerts} />
					{childrenWithProps}
					<Overview {...this.props} />
				</div>
			</div>
		);
	}

}
