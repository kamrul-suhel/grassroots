import React from 'react';
import { Article, PageTitle } from 'app/components';

export default class UnderDev extends React.PureComponent {

	render() {
		return (
			<div id="content" className="site-content-inner">
				<PageTitle value={this.props.route.pageTitle} />
				<Article bg="/images/under-dev.png">
					<h2>Under development</h2>
					<p>This page is under development, please come back later</p>
				</Article>
			</div>
		);
	}

}
