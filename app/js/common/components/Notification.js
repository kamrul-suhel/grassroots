import React from 'react';
import {connect} from 'react-redux';
import {api} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {Link} from './';
import moment from 'moment';

@connect((store) => {
    return {
        notifications: store.notification,
    };
})
export default class Notification extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            showNotification: false,
        };

        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentWillMount() {
        this.fetchData();
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    fetchData = () => {
        this.props.dispatch(fetchData({
            type: 'NOTIFICATION',
            url: '/notifications',
        }));
    }

    handleClickOutside = (event) => {
        const domNode = this.refNotificationWrapper;
        if ((!domNode || !domNode.contains(event.target))) {

            const outerWrapper = this.props.outerWrapper;

            if(!outerWrapper && outerWrapper.contains(event.target)){
            }

            this.hideNotification();
            this.props.clickOutside();
        }
    }

    dismissNotification = async (id) => {
        this.hideNotification();
        await api.update(`/notifications/${id}`);
        this.fetchData();
    }

    markAllAsRead = async () => {
        await api.update('/notifications');
        this.fetchData();
    }

    hideNotification = () => this.setState({showNotification: false})

    toggleNotification = (e) => {
        e.stopPropagation();
        this.setState({showNotification: !this.state.showNotification})
    }

    renderNotification = ({id, type, sub_type, source_id, user_id, player_id, player_name, seen, time}) => {
        let link = '';
        let message = '';
        let icon = '';
        const className = !seen ? 'unread' : '';
        const urlPlayerArg = player_id ? `/player/${player_id}` : '';
        const forPlayerName = player_name ? ` for ${player_name}` : '';

        switch (type) {
            case 'consent':
                link = `${url.consent}/${source_id}`;
                message = 'New consent is available for you';
                icon = 'ion-android-checkbox-outline';
                break;

            case 'homework':
                link = `${url.homework}/${source_id}${urlPlayerArg}`;
                message = `You have a new homework${forPlayerName}`;
                icon = 'ion-edit';
                break;

            case 'event':
                link = url.event;
                message = `You have a new event request${forPlayerName}`;
                icon = 'ion-ios-book';
                break;

            case 'event-request':
                link = `${url.event}/${source_id}`;
                message = 'You have a new event request';
                icon = 'ion-ios-book';
                break;

            case 'feedback':
                link = `${url.feedback}/${source_id}`;
                message = 'You have a new feedback';
                icon = 'ion-android-clipboard';
                break;

            case 'fixture':
                link = `${url.fixture}/${source_id}${urlPlayerArg}`;
                message = `You have a new fixture request${forPlayerName}`;
                icon = 'ion-ios-football';
                break;

            case 'kit':
                link = `${url.kit}/${source_id}`;
                message = `You have a new kit${forPlayerName}`;
                icon = 'ion-tshirt';
                break;

            case 'no-kids':
                link = `${url.kid}/add`;
                message = 'Add your child now';
                icon = 'ion-ios-person';
                break;

            case 'player':
                link = `${url.player}/${source_id}`;
                message = `New player (${player_name}) has been created`;
                icon = 'ion-ios-person';
                break;

            case 'programme':
                link = `${url.programme}/${source_id}${urlPlayerArg}`;
                message = `You have a new programme request${forPlayerName}`;
                icon = 'ion-android-calendar';
                break;

            case 'request-rejected':
                link = `${url.event}/${source_id}`;
                message = 'Your event request has been rejected';
                icon = 'ion-ios-book';
                break;

            case 'update-kids':
                link = url.kid;
                message = 'Update your children details';
                icon = 'ion-person-stalker';
                break;

            case 'welcome':
                link = '';
                message = 'Welcome to Grass Roots';
                icon = 'ion-star';
                break;
        }

        if (!message) {
            return null;
        }

        return (
            <li key={`notification${id}`}>
                <Link className={`notification-item ${className}`}
                      to={link} onClick={() => this.dismissNotification(id)}>

					<span className="notification-icon">
						<i className={icon}/>
					</span>

                    <span className="notification-content-wrapper">
						<span className="notification-message">{message}!</span>
						<span className="notification-time"><i
                            className="ion-android-time"/>{moment(time).fromNow()}
						</span>
					</span>
                </Link>
            </li>
        );
    }

    renderNotifications = () => {
        const {notifications} = this.props;

        if (notifications && _.size(notifications.currentCollection) > 0) {
            return (
                <ul>
                    {_.map(notifications.currentCollection, (id) => {
                        const notification = notifications.collection[id];
                        return this.renderNotification(notification);
                    })}
                </ul>
            );
        }

        return <span className="no-notifications">You do not have notifications</span>;
    }

    render() {
        const notificationCount = this.props.notifications && this.props.notifications.misc.notification_count;
        const notificationShowClass = this.props.showNotification ? 'show' : '';

        return (
            <React.Fragment>
                <span className={`notification-toggle ${notificationCount ? 'unseen' : ''}`}>
						{notificationCount &&
                        <span className="count">
                            {notificationCount}
                        </span>}
                </span>

                <div ref={ref => this.refNotificationWrapper = ref}>
                    <div className={`notifications ${notificationShowClass}`}>
                        <div className="notification-header">
                            <h6 className="notification-title">Notifications</h6>
                            {notificationCount &&
                            <span className="mark-all"
                                  onClick={this.markAllAsRead}>Mark all as read
							</span>}
                        </div>

                        <div className="notification-list">
                            {this.renderNotifications()}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}