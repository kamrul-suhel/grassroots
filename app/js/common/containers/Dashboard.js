import React from 'react';
import Store from 'app/store';
import { api, fn } from 'app/utils';
import { ButtonStandard, Link, PageTitle } from 'app/components';
import { url } from 'app/constants';
import { connect } from 'react-redux'
import { fetchData } from 'app/actions';
@connect((state) => {
	return {

	}
})

export default class Dashboard extends React.PureComponent {

	async componentDidMount() {
		this.fetchData()
	}

	fetchData = () => {
		const { me } = this.props

		this.props.dispatch(fetchData({
			type: 'CLUB',
			url: `/clubs/${me.data.club_id}`,
		}));

		this.props.dispatch(fetchData({
			type: 'ASSESSMENT_TEMPLATE',
			url: `/assessments/templates`
		}));
	}

	toggleBanner = async (status) => {
		// make sure user has an email
		if (this.props.me.data.email) {
			this.setState({ showBanner: false });
			const formData = {
				welcome: status,
				email: this.props.me.data.email,
				first_name: this.props.me.data.first_name,
				last_name: this.props.me.data.last_name,
			};
			const response = await api.post('/users/me', formData);

			if (!api.error(response)) {
				Store.dispatch({
					type: 'ME_UPDATE_WELCOME',
					payload: status,
				});
			}
		}
	}

	renderGetStartedBanner = () => {
		const { me } = this.props;

		if (me.data.user_role !== 'admin') {
			return null;
		}

		if (!me.data.welcome) {
			return (
				<span className="button show-tut" onClick={() => this.toggleBanner(1)}>Get Started</span>
			);
		}

		const item = (id, title, content, buttonLink, buttonText) => (
			<div key={`bannerStep${id}`} className="banner-item">
				<span className="title"><span className="count">{id}.</span> {title}</span>
				<p className="content">{content}</p>
				{buttonLink && <div className="button-outer"><ButtonStandard to={buttonLink} icon={<i className="ion-plus" />}>{buttonText}</ButtonStandard></div>}
			</div>
		);

		const programmeUrl = fn.isClubSs() ? `${url.programme}/add-academy-programme` : `${url.programme}/add-fc-programme`;
		const teamUrl = fn.isClubSs() ? `${url.team}/add-skill-group` : `${url.team}/add-team`;

		const steps = [
			{
				id: 1,
				title: 'Create contacts',
				content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
				buttonLink: `${url.contact}/add`,
				buttonText: 'Create contact',
			},
			{
				id: 2,
				title: 'Register coaches',
				content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
				buttonLink: `${url.coach}/add`,
				buttonText: 'Create coach',
			},
			{
				id: 3,
				title: 'Create age groups',
				content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
				buttonLink: `${url.setting}/age-groups`,
				buttonText: 'Create age group'
			},
			{
				id: 4,
				title: 'Create teams',
				content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
				buttonLink: `${url.team}/add-team`,
				buttonText: 'Create team'
			},
			{
				id: 5,
				title: 'Create programmes',
				content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
				buttonLink: programmeUrl,
				buttonText: 'Create programme'
			},
			{
				id: 6,
				title: 'Create kit',
				content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
				buttonLink: `${url.kit}/add`,
				buttonText: 'Create kit',
			},
		];

		return (
			<div className="get-started-banner">
				<h2>Get started</h2>

				{steps.map(step => item(step.id, step.title, step.content, step.buttonLink, step.buttonText))}

				<div className="form-actions">
					<span className="button" onClick={() => this.toggleBanner(0)}>Close</span>
				</div>
			</div>
		);
	}

	renderWidgets = () => {
		const userRole = this.props.me.data.user_role;

		if (userRole === 'groupadmin' || userRole === 'superadmin') {
			return null;
		}

		let widgets = [];

		switch (userRole) {
			case 'admin':
			case 'coach':
			case 'guardian':
				widgets = [
					{ id: 'schedule', title: 'Schedule' },
					{ id: 'finance', title: 'Finance' },
					{ id: 'programme', title: 'Programme' },
				];
				break;
		}

		return widgets.map(widget => (
			<div key={`widget${widget.id}`} className="grid-inner large">
				<Link className="item item-widget">
					<div className="item-content-wrapper">
						<h2 className="item-title">{widget.title}</h2>
					</div>
				</Link>
			</div>
		));
	}

	render() {
		const menuItems = fn.getSiteNavigation();
		const { params } = this.props
		const type = fn.getFaqType('Dashboard');

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Dashboard"
						   faq={true}
						   faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}/>

				{this.renderGetStartedBanner()}

				<div className="section section-dashboard">
					<div className="grid">
						{this.renderWidgets()}
						{menuItems && menuItems.map((menuItem, i) => {
							if (!menuItem.path || menuItem.path == 'dashboard') {
								return null;
							}

							return (
								<div className="grid-inner" key={`dashboardItem_${i}`}>
									<Link className="item item-portrait item-dashboard" to={menuItem.path}>
										<div className="item-bg-wrapper">
											<h2 className="item-title">{menuItem.title}</h2>
											<div className="item-circle" />
											<div className="item-bg overlay" style={{ backgroundImage: `url("${menuItem.bg}")` }} />
											<div className="triangle-overlay">
												<i className={menuItem.icon} />
											</div>
										</div>
									</Link>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}

}
