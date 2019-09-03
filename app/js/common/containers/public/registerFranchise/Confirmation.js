import React from 'react';
import { connect } from 'react-redux';
import { fn } from 'app/utils';
import { url } from 'app/constants';
import { FormButton, Link, PageTitle } from 'app/components';

@connect((store) => {
	return {
		registerFranchise: store.registerFranchise,
	};
})
export default class Confirmation extends React.PureComponent {

	render() {

		const { registerFranchise } = this.props;
		const { packages } = registerFranchise;
		const packageKeys = Object.keys(packages);
		const packageText = `package${packageKeys.length === 1 ? ` ${packages[packageKeys[0]].title}` : 's'}`;
		return (
			<div id="content" className="site-content-inner">
				<section className="section section-confirmation">
					<PageTitle value="Thank You" />
					<p>Thank you for purchasing My Grassroots Club and welcome to the club! <br/>An email confirmation has been sent to you. Please verify the email and log in to get started.</p>
				</section>
			</div>
		);
	}
}
