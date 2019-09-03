import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {api, fn} from 'app/utils'
import {url} from 'app/constants'
import {fetchData} from 'app/actions'
import {Link} from '.';

@connect((store) => {
    return {
        ...store
    }
})
export default class SiteHeader extends React.PureComponent {

    static propTypes = {
        authArea: PropTypes.bool,
    }

    static defaultProps = {
        authArea: true
    }

    render() {
        const {me} = this.props
        const myClub = this.props.myClub ? this.props.myClub.data : {};
        const facebook = myClub.facebook_url ? myClub.facebook_url : '';
        const twitter = myClub.twitter_url ? myClub.twitter_url : '';
        const youtube = myClub.youtube_url ? myClub.youtube_url : '';
        const instagram = myClub.instagram_url ? myClub.instagram_url : '';
        const showSocialMedia = [1, 2, 3];
        
        return (
            <header role="banner"
                    id="site-header"
                    className={
                        `${_.isEmpty(this.props.params) ? "site-header" : "site-header club-logo-header"} ${fn.getUserRole()}`
                    }>

                <div className="main-bar">
                    <div className="site-provider">
                        <div>
                            <img src="/images/logo_grass.png"
                                 className="provider-logo"
                                 alt="Logo"/>
                        </div>
                    </div>

                    <div className="site-branding">
                        <nav role="navigation"
                             className="nav header-navigation">
                            {fn.isLoggedIn() ? (
                                <div className={me && me.data.role_id === 5 ? "master-admin" : ''}>
                                    {me && me.data.organisation_name && me.data.organisation_name ?
                                        <div className="organisation">{me.data.organisation_name}</div> : ''}

                                    <ul>
                                        <div>
                                        {me && _.includes(showSocialMedia, me.data.role_id) ? (
                                                <React.Fragment>
                                                    <li>
                                                        <a href={facebook}
                                                           target="_blank">
                                                            <i className="ion-social-facebook"/>
                                                        </a>
                                                    </li>

                                                    <li>
                                                        <a href={twitter}
                                                           target="_blank">
                                                            <i className="ion-social-twitter"/>
                                                        </a>
                                                    </li>

                                                    <li>
                                                        <a href={instagram}
                                                           target="_blank">
                                                            <i className="ion-social-instagram"/>
                                                        </a>
                                                    </li>

                                                    <li>
                                                        <a href={youtube}
                                                           target="_blank">
                                                            <i className="ion-social-youtube"/>
                                                        </a>
                                                    </li>
                                                </React.Fragment>
                                            ) :
                                            <React.Fragment>
                                                <li>
                                                    <a href="https://www.facebook.com/groups/1795373297405995/"
                                                       target="_blank">
                                                        <i className="ion-social-facebook"/>
                                                    </a>
                                                </li>

                                                <li>
                                                    <a href="https://twitter.com/footballgrf?lang=en"
                                                       target="_blank">
                                                        <i className="ion-social-twitter"/>
                                                    </a>
                                                </li>

                                                <li>
                                                    <a href="https://www.instagram.com/grassrootgoals/"
                                                       target="_blank">
                                                        <i className="ion-social-instagram"/>
                                                    </a>
                                                </li>

                                                <li>
                                                    <a href="https://www.youtube.com/watch?v=ySjxZDT_5SA"
                                                       target="_blank">
                                                        <i className="ion-social-youtube"/>
                                                    </a>
                                                </li>
                                            </React.Fragment>}
                                            </div>
                                        {me && me.fetched &&
                                        <li className="has-submenu">
                                            <span className="name">{me.data.display_name}</span>
                                            <ul className="submenu">
                                                <li>
                                                    <Link to={`${url.profile}/edit`}>
                                                        <span>My Details</span>
                                                    </Link>
                                                </li>

                                                {fn.isAdmin() &&
                                                <li>
                                                    <Link to={`${url.changePassword}`}>
                                                        <span>Change Password</span>
                                                    </Link>
                                                </li>
                                                }

                                                {fn.isGuardian() &&
                                                <li>
                                                    <Link to={url.refer}>
                                                        <span>Refer</span>
                                                    </Link>
                                                </li>}

                                                {fn.isGuardian() &&
                                                <li>
                                                    <Link to={url.help}>
                                                        <span>Help</span>
                                                    </Link>
                                                </li>}

                                                <li>
                                                    <Link to={url.logout}>
                                                        <span>Log Out</span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        }
                                    </ul>
                                </div>
                            ) : (
                                <ul>
                                    <li>
                                        {/*<Link to={url.login}*/}
                                        {/*activeClassName="active">*/}
                                        {/*<span>Log In</span>*/}
                                        {/*</Link>*/}
                                    </li>
                                </ul>
                            )}
                        </nav>
                    </div>

                    {(this.props.authArea && myClub.logo_url) ?
                        <div className="site-branding-logo club-login">
                            <div className="triangle-overlay"/>
                            <div className="branding-logo-wrap">
                                <img src={myClub.logo_url}
                                     className="branding-logo"
                                     alt="Logo"
                                     width="140"
                                     height="140"/>
                            </div>
                        </div> :
                        (this.props.authClub && this.props.authClub.data.logo_url) ?
                            <div className="site-branding-logo">
                                <div className="triangle-overlay"/>
                                <div className="branding-logo-wrap">
                                    <img src={this.props.authClub.data.logo_url}
                                         className="branding-logo"
                                         alt="Logo"/>
                                </div>
                            </div> : ''
                    }
                </div>
            </header>
        );
    }
}