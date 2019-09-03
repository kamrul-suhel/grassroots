import React from 'react';
import { Article, PageTitle, SiteHeader } from 'app/components';

export default class NotFound extends React.PureComponent {

	render() {
		return (
			<div className="site logged-in">
				<div className="site-inner">
					<SiteHeader {...this.props} />
					<div className="site-content">
						<div id="content" className="site-content-inner">
							<PageTitle value="404" />

							<Article>
								<h2>Sorry, the page you are looking for is not found.</h2>
							</Article>
						</div>
					</div>
				</div>
			</div>
		);
	}

}
