import React from 'react';
import { fn } from 'app/utils';
import { Article, ConfirmDialog, MetaSection, PageTitle } from 'app/components';

export default class EndOfYear extends React.PureComponent {

	// TODO: make it work
	graduatePlayers = () => {
		console.log('graduatePlayers');
		fn.showAlert('Players have been graduated', 'success');
	}

	// TODO: make it work
	unassignPlayers = () => {
		console.log('unassignPlayers');
		fn.showAlert('Players have been unassigned', 'success');
	}

	render() {
		const { params } = this.props;
		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="End of year"
						   faq={true}
						   faqLink={fn.getFaqLink(`caReEnrollment`, `/${params.clubSlug}/`)}/>
				<Article className="end-of-year">
					<MetaSection title="Unassign players">
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris</p>
						<ConfirmDialog
							onConfirm={this.unassignPlayers}
							showClose={false}
							title=""
							body={
								<h3>Are you sure you want to unassign all players?</h3>
							}
						>
							<span className="button">Unassign all players</span>
						</ConfirmDialog>
					</MetaSection>
					<br></br>
					<MetaSection title="Graduate players">
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris</p>
						<ConfirmDialog
							onConfirm={this.graduatePlayers}
							title=""
							body={
								<React.Fragment>
									<h3>Are you sure you want to graduate all players?</h3>
								</React.Fragment>
							}
						>
							<span className="button">Graduate all players</span>
						</ConfirmDialog>
					</MetaSection>
				</Article>
			</div>
		);
	}

}
