import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader, Radio, TextInput } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Article, Back, PageTitle, SiteHeader, SiteFooter, SiteNavigation, Link } from 'app/components';

@connect((store, ownProps) => {
	return {
		collection: store.page,
		page: store.page.collection[ownProps.params.pageSlug] || {},
	};
})
export default class ViewWrapper extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			visibility: true
		}

		window.addEventListener('resize', this.resizeWindow)
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.params.pageSlug !== this.props.params.pageSlug) {
			this.fetchData();
		}
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData = () => {
		this.props.dispatch(fetchData({
			type: 'PAGE',
			url: `/pages/${this.props.params.pageSlug}`,
		}));
	}

	resizeWindow = () => {
		if(window.innerWidth <= 979){
			this.setState({visibility: false});
		}else{
			this.setState({visibility: true});
		}
	}

	render() {
		const { collection, page } = this.props;
		const { visibility } = this.state
		const loggedIn = fn.isLoggedIn()
		const visibilityClass = visibility ? 'is-open' : 'is-closed'

		return (
			<div className="site not-logged-in bg page">
				<SiteHeader {...this.props} authArea={false} />
				<div className={`site-inner ${visibilityClass}`}>
					{loggedIn && <SiteNavigation/>}
					<div className={`site-content `}>
						<ContentLoader
							data={page.title}
							forceRefresh
							isLoading={collection.isLoading}
							notFound="No Data"
						>
							<PageTitle value={page.title} />

							<Article>
								{page.content}
							</Article>
						</ContentLoader>
                        <div style={{"marginBottom": "50px", "display" : "flex", "justifyContent": "flex-end"}} >
							{loggedIn ? <Back className="button">Back</Back> : <Link to={url.login} className="button">Back to log in</Link>}
                    	</div>

                        <SiteFooter />
					</div>
				</div>

			</div>
		);
	}

}
