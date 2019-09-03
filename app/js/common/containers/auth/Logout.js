import React from 'react';
import { fn } from 'app/utils';
import { url } from 'app/constants';
import {connect} from "react-redux";

@connect((store, ownProps) => {
	return {

	};
})

export default class Logout extends React.PureComponent {

	componentWillMount() {
		const { location } = this.props;
		const showDefaultAlert = location.state ? location.state.showDefaultAlert : true;

		console.log("Logout component called",)

		fn.logOut();
		fn.navigate({ pathname: url.login, state: { forceLogin: 1 } });
	}

	render() {
		return null;
	}

}
