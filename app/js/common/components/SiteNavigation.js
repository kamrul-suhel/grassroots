import React from 'react';
import PropTypes from 'prop-types';
import {fn} from 'app/utils';
import {Link, Notification} from './';
import {url} from 'app/constants';
import {Rollover} from 'app/components';
import * as complete from 'app/containers/club/functions'
import {connect} from 'react-redux'

@connect((state) => {
    return {
        club: state.myClub.data,
        clubs: state.club,
        assessment: state.assessmentTemplate,
        programmes: state.programme,
        feedback: state.feedback,
        me: state.me,
        event: state.event
    }
})

class SiteNavigation extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            visibility: true,
            loaded: false,
            hoveredItem: null,
            showNotification: false
        };
        window.addEventListener('resize', this.resizeWindow)
    }

    /**
     * Check setup wizard is complete or not
     * @returns {boolean}
     */
    isSetupWizardComplete() {
        const {
            club,
            clubs,
            me,
            assessment,
            feedback
        } = this.props;

        const selectedClub = clubs.collection[club.club_id]

        if (!selectedClub) {
            return;
        }

        let completed = true

        if (!complete.detailsComplete(selectedClub)) {
            completed = false
        }

        if (!complete.ageGroupsComplete(selectedClub)) {
            completed = false
        }

        if (!complete.academySetupComplete(selectedClub)) {
            completed = false
        }

        if (!complete.fcSetupComplete(selectedClub)) {
            completed = false
        }

        if (!complete.bankAccountsComplete(selectedClub)) {
            completed = false
        }

        if (!complete.kitsComplete(selectedClub)) {
            completed = false
        }

        if (!complete.skillsComplete(selectedClub)) {
            completed = false
        }

        if (!complete.socialComplete(selectedClub)) {
            completed = false
        }

        if (!complete.assessmentFromComplete(assessment)) {
            completed = false
        }

        return completed
    }

    goBack = (e) => {
        e.preventDefault();
        fn.navigate('goBack')
    }

    componentDidMount() {
        this.setState({loaded: true, visibility: window.innerWidth > 979})
    }

    handleClick = () => {
        this.setState({visibility: !this.state.visibility});
    }


    handleItemHover = ({target}) => {
        this.setState({
            screenY: target.getBoundingClientRect().y,
            menutitle: target.getAttribute('menutitle'),
        })
    }

    clickOutside = () => {
        this.setState({
            showNotification: false
        });
    }

    toggleNotification = (event) => {
        event.preventDefault();
        this.setState({showNotification: !this.state.showNotification})
    }

    resizeWindow = () => {
        if (window.innerWidth <= 979) {
            this.setState({visibility: false});
        } else {
            this.setState({visibility: true});
        }
    }

    handleItemLeave = () => this.setState({menutitle: null})

    renderMenuItem = (menuItem) => {
        const {
            programmes,
            me,
            feedback,
            event
        } = this.props
        const programmeCount = programmes && programmes.count
        const userId = me.data && me.data.user_id || 0;

        // Club admin programme notification
        if (menuItem.programme) {
            return (
                <Link to={menuItem.path}
                      activeClassName="is-active"
                      onClick={fn.scrollToTop}>
                    {menuItem.icon &&
                    <i className={`${menuItem.icon}`}
                       menutitle={menuItem.title}/>
                    }
                    <span menutitle={menuItem.title}>{menuItem.title}</span>
                    {
                        programmeCount < 1 ?
                            <div className="setup-wizard-tooltip">
                                <div className="tooltips">Please setup a program</div>
                                <i className="ion-android-alert button-alert-icon"></i>
                            </div>
                            :
                            null
                    }
                </Link>
            )
        }

        if (menuItem.coachStatement) {
            return (
                <Link to={`${url.coach}/${userId}/${menuItem.path}`}
                      activeClassName="is-active"
                      onClick={fn.scrollToTop}>
                    {menuItem.icon &&
                    <i className={`${menuItem.icon}`}
                       menutitle={menuItem.title}/>
                    }
                    <span menutitle={menuItem.title}>{menuItem.title}</span>
                </Link>
            )
        }

        if (menuItem.parentStatement) {
            return (
                <Link to={`${url.guardian}/${userId}/${menuItem.path}`}
                      activeClassName="is-active"
                      onClick={fn.scrollToTop}>
                    {menuItem.icon &&
                    <i className={`${menuItem.icon}`}
                       menutitle={menuItem.title}/>
                    }
                    <span menutitle={menuItem.title}>{menuItem.title}</span>
                </Link>
            )
        }

        if (menuItem.parentFeedback) {
            return (
                <Link to={menuItem.path}
                      activeClassName="is-active"
                      onClick={fn.scrollToTop}>
                    {menuItem.icon &&
                    <i className={`${menuItem.icon}`}
                       menutitle={menuItem.title}/>
                    }
                    <span menutitle={menuItem.title}>{menuItem.title}</span>
                    {
                        feedback.count > 0 ?
                            <div className="setup-wizard-tooltip">
                                <div className="tooltips">Please complete our feedback form</div>
                                <i className="ion-android-alert button-alert-icon"></i>
                            </div>
                            :
                            null
                    }
                </Link>
            )
        }

        // Admin requested event
        if (menuItem.adminRequestedEvent) {
            return (
                <Link to={menuItem.path}
                      activeClassName="is-active"
                      onClick={fn.scrollToTop}>
                    {menuItem.icon &&
                    <i className={`${menuItem.icon}`}
                       menutitle={menuItem.title}/>
                    }
                    <span menutitle={menuItem.title}>{menuItem.title}</span>
                    {
                        event.count > 0 &&
                            <div className="setup-wizard-tooltip">
                                <div className="tooltips">You have new requested event</div>
                                <i className="ion-android-alert button-alert-icon"></i>
                            </div>
                    }
                </Link>
            )
        }

        return (
            <Link to={menuItem.path}
                  activeClassName="is-active"
                  onClick={fn.scrollToTop}>
                {menuItem.icon &&
                <i className={`${menuItem.icon}`}
                   menutitle={menuItem.title}/>
                }
                <span menutitle={menuItem.title}>{menuItem.title}</span>
            </Link>
        )
    }

    render() {
        const {visibility, loaded, screenY, menutitle} = this.state
        const menuItems = fn.getSiteNavigation()
        const visibilityClass = visibility ? 'is-open' : 'is-closed'
        const visibilityClassIcon = visibility ? 'left_arrow.png' : 'right_arrow.png'
        const setupWizard = this.isSetupWizardComplete()

        return (
            <div className={`sidebar ${visibilityClass}`}>
                <div className="sidebar-toggle" onClick={this.handleClick}>
                    <img src={`/images/${visibilityClassIcon}`}/>
                </div>

                <nav role="navigation" className="nav nav-sidebar site-navigation">
                    {loaded &&
                    <Rollover position={screenY} hidden={!menutitle}>
                        <span>{menutitle}</span>
                    </Rollover>
                    }
                    <ul>
                        {menuItems && _.map(menuItems, (menuItem, i) => {
                            if (menuItem.path) {
                                return (
                                    <li className="menu-item tooltip"
                                        key={`menuItem_${i}`}
                                        onMouseOver={this.handleItemHover}
                                        onMouseLeave={this.handleItemLeave}>
                                        {
                                            menuItem.club ?
                                                <Link to={`clubs/${this.props.club.club_id}`}
                                                      activeClassName="is-active"
                                                      onClick={fn.scrollToTop}>
                                                    {menuItem.icon &&
                                                    <i className={`${menuItem.icon}`}
                                                       menutitle={menuItem.title}/>
                                                    }
                                                    <span menutitle={menuItem.title}>
                                                    {menuItem.title}
                                                </span>
                                                    {
                                                        setupWizard ?
                                                            null
                                                            :
                                                            <div className="setup-wizard-tooltip">
                                                                <div className="tooltips">Please complete the setup
                                                                </div>
                                                                <i className="ion-android-alert button-alert-icon"></i>
                                                            </div>
                                                    }

                                                </Link>
                                                :
                                                this.renderMenuItem(menuItem)
                                        }
                                    </li>
                                );
                            }

                            if (menuItem.goback) {
                                return (
                                    <li className="menu-item tooltip goback"
                                        key={`menuItem_${i}`}
                                        onMouseOver={this.handleItemHover}
                                        onMouseLeave={this.handleItemLeave}>
                                        <a href="#"
                                           onClick={(e) => {
                                               fn.scrollToTop()
                                               this.goBack(e)
                                           }}>
                                            <i className='icon-back ion-arrow-left-c'
                                               menutitle="Go back"/>
                                            <span menutitle="Go back">Go back</span>
                                        </a>
                                    </li>
                                )
                            }

                            if (menuItem.notification) {
                                return <li className="menu-item tooltip notification"
                                           ref={ref => this.refNotification = ref}
                                           key={`menuItem_${i}`}
                                           onMouseOver={this.handleItemHover}
                                           onMouseLeave={this.handleItemLeave}>
                                    <a href="#"
                                       onClick={(e) => this.toggleNotification(e)}>
                                        <i className="ion-android-notifications"
                                           menutitle="Notification"/>
                                        <span menutitle="Notification">Notifications</span>
                                    </a>
                                    <Notification key={`menuItem_${i}`}
                                                  showNotification={this.state.showNotification}
                                                  outerWrapper={this.refNotification}
                                                  clickOutside={this.clickOutside}/>
                                </li>
                            }

                            return (
                                <li key={`menuItem_${i}`}>
                                    <div className="menu-item menu-item-title">
                                        <span>{menuItem.title}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        );
    }
}

export default SiteNavigation;
