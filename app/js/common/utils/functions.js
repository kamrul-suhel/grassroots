import {browserHistory} from 'react-router'
import Store from 'app/store'
import {showAlert, hideAlert, storeToken, fetchData} from 'app/actions'
import Cookie from 'universal-cookie'
import {url} from 'app/constants'
import moment from 'moment'

const cookie = new Cookie()

export default {

    /**
     * Shows alert
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @param   {array}   alerts    Array of alerts
     * @param   {array}   type        Type (success, warning, error)
     */
    showAlert(alerts, type) {
        alerts = typeof alerts === 'string' ? [alerts] : alerts
        Store.dispatch(showAlert({alerts, type}))

        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
    },

    /**
     * Hides the currently showing alert
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @return  {object}    Redux object
     */
    hideAlert() {
        return Store.dispatch(hideAlert())
    },

    /**
     * Deletes cookie by key
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @param   {string}   key    Stored cookie key
     */
    deleteCookie(key) {
        return cookie.remove(key, {path: '/'})
    },

    /**
     * Gets cookie by key
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @param   {string}   key    Stored cookie key
     * @return  {string}        Value of the cookie
     */
    getCookie(key) {
        return cookie.get(key);
    },

    /**
     * Saves cookie
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @param   {string}   key        Cookie key
     * @param   {string}   value    Cookie value
     * @param   {object}   options    Options such as path, age, etc.
     */
    saveCookie(key, value, options) {
        return cookie.set(key, value, options);
    },

    /**
     * Gets token and return its value
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @param   {string}   key    Token key
     * @return  {string}        Token value
     */
    getToken(key) {
        const value = this.getCookie(key);
        Store.dispatch(storeToken(this.parseToken(value)));
        return this.parseToken(value);
    },

    /**
     * Converts token to a readable json object
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @param   {string}   token    Token string
     * @return  {object}            Formatted token object
     */
    parseToken(token = '') {
        if (!token) {
            return false;
        }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    },

    /**
     * Formates date in the desired format
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @param   {string}   date        Date in YYYY-MM-DD HH:mm:SS format
     * @param   {string}   format    Date format
     * @return  {string}            Formatted date
     */
    formatDate(date, format = 'ddd, Do MMM YYYY') {
        if (!date) {
            return null;
        }

        date = date !== 'now' ? date : undefined;

        return moment(date).format(format);
    },

    /**
     * Returns the difference between 2 dates
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @param   {string}   date        Date in YYYY-MM-DD HH:mm:SS format
     * @param   {string}   diff        Difference, if not set defaults to 'years'
     * @return  {string}            Difference between 2 dates
     */
    diffDate(date, diff = 'years') {
        return moment().diff(moment(date, 'YYYY-MM-DD hh:mm:ss'), diff);
    },

    /**
     * Returns a nicer date such as today, yesterday, last friday, etc.
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @param   {[type]}   date        Date in YYYY-MM-DD HH:mm:SS format
     * @return  {string}            Formatted date
     */
    prettyDate(date) {
        return moment(date).calendar();
    },

    /**
     * Converts slug to readable string
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @param   {string}   str    Slug
     * @return  {string}        Readable string
     */
    slugToReadableString(str) {
        if (!str) {
            return '';
        }

        let returnString = str[0].toUpperCase();

        for (let i = 1; i < str.length; i++) {
            if (str[i] >= 'A' && str[i] <= 'Z') {
                returnString += ` ${str[i]}`;
            } else if (str[i] === '-' || str[i] === '_') {
                returnString += ' ';
            } else {
                returnString += str[i];
            }
        }

        return returnString;
    },

    /**
     * Converts readable string to slug
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @param   {string}   str    Readable string
     * @return  {string}        Slug
     */
    stringToSlug(str) {
        if (!str) {
            return '';
        }

        return str.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    },

    /**
     * Checks if the build is production
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @return  {boolean}        True if production, false if development
     */
    isProduction() {
        return process.env.NODE_ENV && process.env.NODE_ENV === 'production';
    },

    /**
     * Navigate to an internal URL
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-31
     */
    navigate(to) {
        // if to is goBack then go back to the previous page
        if (to === 'goBack') {
            return browserHistory.goBack();
        }

        const basename = this.getBasename();
        const prependUrl = (url) => {
            if (!basename) {
                return `/${url}`;
            }

            if (url === '/') {
                return `/${basename}/`;
            }

            return `/${basename}/${url}`;
        };

        if (_.isPlainObject(to)) {
            return browserHistory.push({
                ...to,
                pathname: to.pathname ? prependUrl(to.pathname) : '',
            });
        }

        return browserHistory.push(prependUrl(to));
    },

    /**
     * Set the club basename
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-31
     */
    setBasename(basename = '') {
        this.basename = basename;
        this.saveCookie('basename', basename, {
            path: '/',
            maxAge: 86400,
        });
    },

    /**
     * Get the club basename
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-31
     */
    getBasename() {
        return this.basename || '';
    },

    /**
     * Get the club base url
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2018-03-07
     */
    getClubUrl() {
        const basename = this.getBasename();
        const basenameFormatted = basename ? `${basename}/` : '';

        return `${window.location.origin}/${basenameFormatted}${url.resetPassword}`;
    },

    /**
     * Get the club base url
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2018-03-07
     */
    getClubId() {
        const store = Store.getState();
        return ((store.authClub || {}).data || {}).club_id || 0;
    },

    /**
     * Generates the site navigation based on the current user role
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @return  {object}        Generated site navigation
     */
    getSiteNavigation(path = '') {
        const defaultImages = [
            '/images/Main Page 1 & Dashboard 1.jpg',
            // '/images/Main Page 2 & Dashboard 2.jpg',
            // '/images/Main Page 3 & Dashboard 3.jpg',
        ];
        const defaultImage = defaultImages[Math.floor(defaultImages.length * Math.random())];
        let menuItems = [];

        switch (this.getUserRole()) {
            case 'superadmin':
                menuItems = [
                    // { title: 'Notification', notification: true },
                    {
                        title: 'Master Admin Terminal'
                    },

                    {
                        title: 'Club Admin Terminal',
                        goback: true
                    },

                    {
                        title: 'Notification',
                        notification: true
                    },

                    // { title: 'Dashboard', path: url.dashboard, icon: 'ion-home', bg: '/images/Main Page 1 & Dashboard 1.jpg' },
                    {
                        title: 'Customers',
                        path: url.franchise,
                        icon: 'ion-ios-people'
                    },

                    {title: 'Packages', path: url.package, icon: 'ion-pricetag'},
                    {title: 'Info & Support', path: url.manageFaq, icon: 'ion-help'},
                    {title: 'Legal & Content', path: url.page, icon: 'ion-document-text'},
                ];
                break;

            case 'groupadmin':
                menuItems = [
                    {title: 'Super Admin Terminal'},
                    {title: 'Club Admin Terminal', goback: true},
                    {title: 'Notification', notification: true},
                    {title: 'Purchased Packages', path: url.licence, icon: 'ion-pricetag'},
                    {title: 'Buy New Package', path: url.licenceBuy, icon: 'ion-plus'},
                    {title: 'Account Details', path: url.profile + '/edit', icon: 'ion-gear-a'},
                    {title: 'Info & Support', path: url.faq, icon: 'ion-help'},
                ];
                break;

            case 'admin':
                menuItems = [
                    {
                        title: 'Club Admin Terminal'
                    },

                    {
                        title: 'Go Back',
                        goback: true
                    },

                    {
                        title: 'Notification',
                        notification: true
                    },

                    {
                        title: 'Setup wizard',
                        path: url.setting,
                        club: true,
                        icon: 'ion-ios-gear'
                    },

                    // { title: 'Dashboard', path: url.dashboard, icon: 'ion-home', bg: '/images/Main Page 1 & Dashboard 1.jpg' },
                    {
                        title: 'Calendar',
                        path: url.calendar,
                        icon: 'ion-calendar',
                        bg: '/images/Calendar.jpg'
                    },

                    {
                        title: 'To-do list',
                        path: url.todo,
                        icon: 'ion-android-list',
                        bg: '/images/Main Page 1 & Dashboard 1.jpg'
                    },

                    {
                        title: 'Communication',
                        bg: '/images/Communication.jpg'
                    },

                    {
                        title: 'Contacts',
                        path: url.contact,
                        icon: 'ion-person-stalker',
                        bg: '/images/menu-contact.jpg'
                    },

                    {
                        title: 'Email',
                        path: url.email,
                        icon: 'ion-plus',
                        bg: '/images/Communication.jpg'
                    },

                    {
                        title: 'Message board',
                        path: url.messageBoard,
                        icon: 'ion-chatboxes',
                        bg: '/images/menu-messageboard.jpg'
                    },

                    {
                        title: 'Coaches'
                    },

                    // availability
                    // schedule
                    {
                        title: 'Coaches',
                        path: url.coach,
                        icon: 'ion-speakerphone',
                        bg: '/images/Coaches.jpg'
                    },

                    {
                        title: 'Availability',
                        path: url.coachAvailability,
                        icon: 'ion-android-calendar',
                        bg: '/images/Coaches.jpg'
                    },

                    {
                        title: 'Schedules',
                        path: url.coachSchedule,
                        icon: 'ion-clock',
                        bg: '/images/Coaches.jpg'
                    },

                    // coach kits
                    {
                        title: 'Coach assessments',
                        path: url.coachAssessment,
                        icon: 'ion-clipboard',
                        bg: '/images/Coaches.jpg'
                    },


                    {
                        title: 'Documents'
                    },

                    {
                        title: 'Consent',
                        path: url.consent,
                        icon: 'ion-android-checkbox-outline',
                        bg: '/images/menu-consent.jpg'
                    },

                    {
                        title: 'Downloads',
                        path: url.download,
                        icon: 'ion-android-download',
                        bg: '/images/menu-download.jpg'
                    },

                    {
                        title: 'Exports',
                        path: url.export,
                        icon: 'ion-log-out',
                        bg: '/images/Documents _ Reports & T&C\'s.jpg'
                    },

                    {
                        title: 'Feedback',
                        path: url.feedback,
                        icon: 'ion-android-clipboard',
                        bg: '/images/menu-feedback.jpg'
                    },

                    {
                        title: 'Finance'
                    },

                    {
                        title: 'Accounts',
                        path: url.account,
                        icon: 'ion-card',
                        bg: '/images/Accounts_Finance.jpg'
                    },

                    // reports
                    // exports
                    {
                        title: 'Parents'
                    },

                    {
                        title: 'Parents',
                        path: url.guardian,
                        icon: 'ion-android-contact',
                        bg: '/images/Parents & Guardians.jpg'
                    },

                    {
                        title: 'Players'
                    },

                    // development reports
                    // homework
                    {
                        title: 'Players',
                        path: url.player,
                        icon: 'ion-ios-person',
                        bg: '/images/Players.jpg'
                    },

                    // waiting list
                    {
                        title: 'Teams & Groups'
                    },

                    {
                        title: 'Assign Kits',
                        path: url.kitItem,
                        icon: 'ion-tshirt',
                        bg: '/images/menu-kit.jpg'
                    },

                    {
                        title: 'Registers',
                        path: url.attendanceRegister,
                        icon: 'ion-filing',
                        bg: '/images/Teams & Groups.jpg'
                    },

                    // attendance
                    {
                        title: 'Re-enrollment',
                        path: url.endOfYear,
                        icon: 'ion-refresh',
                        bg: '/images/Teams & Groups.jpg'
                    },

                    {
                        title: 'Requested Events',
                        path: url.event,
                        icon: 'ion-ios-book',
                        bg: '/images/menu-event.jpg',
                        adminRequestedEvent: true
                    },

                    {
                        title: 'Fixtures',
                        path: url.fixture,
                        icon: 'ion-ios-football',
                        bg: '/images/Fixtures.jpg'
                    },

                    {
                        title: 'Football Teams',
                        path: url.team,
                        icon: 'ion-ios-people',
                        bg: '/images/Teams & Groups.jpg'
                    },

                    {
                        title: 'Programmes',
                        programme: true,
                        path: url.programme,
                        icon: 'ion-android-calendar',
                        bg: '/images/menu-programme.jpg'
                    },

                    // Soccer school groups
                    {
                        title: 'Settings & Set-up'
                    },

                    {
                        title: 'Info & Support',
                        path: url.faq,
                        icon: 'ion-help'
                    },

                    {
                        title: 'Package',
                        path: url.clubPackages,
                        icon: 'ion-ios-americanfootball-outline',
                        bg: '/images/Settings & Set-Up.jpg'
                    },

                    {
                        title: 'Details',
                        path: `${url.profile}/edit`,
                        icon: 'ion-ios-barcode',
                        exact: true,
                        bg: '/images/Settings & Set-Up.jpg'
                    },

                    {
                        title: 'Tutorial',
                        path: url.tutorial,
                        icon: 'ion-edit',
                        bg: '/images/Settings & Set-Up.jpg'
                    },
                    // { title: 'Settings & Set-up', path: url.setting, icon: 'ion-ios-gear', bg: '/images/Settings & Set-Up.jpg' }
                ];
                break;

            case 'coach':
                menuItems = [
                    {
                        title: 'Coach Terminal'
                    },

                    {
                        title: 'Club Admin Terminal',
                        goback: true
                    },

                    // { title: 'Dashboard', path: url.dashboard, icon: 'ion-ios-keypad', bg: '/images/Main Page 1 & Dashboard 1.jpg' },
                    {
                        title: 'Calendar',
                        path: url.calendar,
                        icon: 'ion-calendar',
                        bg: '/images/Calendar'
                    },

                    {
                        title: 'Contacts',
                        path: url.contact,
                        icon: 'ion-person-stalker'
                    },

                    {
                        title: 'Attendance',
                        path: url.attendance,
                        icon: 'ion-android-checkmark-circle',
                        bg: ''
                    },

                    {
                        title: 'Statements',
                        path: url.statement,
                        icon: 'ion-briefcase',
                        bg: '/images/menu-statement.jpg',
                        coachStatement: true
                    },

                    {
                        title: 'My Schedule',
                        path: url.schedule,
                        icon: 'ion-clock',
                        bg: ''
                    },

                    {
                        title: 'Skills assessments',
                        path: url.skillAssessment,
                        icon: 'ion-ios-analytics',
                        bg: ''
                    },

                    {
                        title: 'To-do list',
                        path: url.todo,
                        icon: 'ion-android-list'
                    },

                    {
                        title: 'Programmes',
                        path: url.programme,
                        icon: 'ion-android-calendar',
                        bg: '/images/menu-programme.jpg'
                    },

                    {
                        title: 'Feedback',
                        path: url.feedback,
                        icon: 'ion-android-clipboard',
                        bg: '/images/menu-feedback.jpg'
                    },

                    {
                        title: 'Message board',
                        path: url.messageBoard,
                        icon: 'ion-chatboxes',
                        bg: '/images/menu-messageboard.jpg'
                    },

                    {
                        title: 'Homework',
                        path: url.homework,
                        icon: 'ion-edit',
                        bg: '/images/menu-homework.jpg'
                    },

                    {
                        title: 'Availability',
                        path: url.availability,
                        icon: 'ion-android-calendar',
                        bg: ''
                    },

                    {
                        title: 'Coaching Kit',
                        path: url.kit,
                        icon: 'ion-tshirt',
                        bg: '/images/menu-kit.jpg'
                    },

                    {
                        title: 'Players',
                        path: url.player,
                        icon: 'ion-ios-person',
                        bg: '/images/Players.jpg'
                    },

                    {
                        title: 'Info & Support',
                        path: url.faq,
                        icon: 'ion-help'
                    },

                    {
                        title: 'HIVE',
                        path: 'https://www.hivelearning.com/signin',
                        icon: 'ion-ios-person',
                        bg: '/images/menu-kid.jpg'
                    },
                ];
                break;

            case 'guardian':
                menuItems = [
                    {
                        title: 'Parent Terminal'
                    },

                    {
                        title: 'Club Admin Terminal',
                        goback: true
                    },

                    // { title: 'Dashboard', path: url.dashboard, icon: 'ion-ios-keypad', bg: '/images/Main Page 1 & Dashboard 1.jpg' },
                    {
                        title: 'Calendar',
                        path: url.calendar,
                        icon: 'ion-calendar',
                        bg: '/images/Calendar'
                    },

                    {
                        title: 'Contacts',
                        path: url.contact,
                        icon: 'ion-person-stalker'
                    },

                    {
                        title: 'Account',
                        path: '',
                        icon: '',
                        bg: ''
                    },

                    {
                        title: 'My children',
                        path: url.kid,
                        icon: 'ion-android-people',
                        bg: '/images/menu-kid.jpg'
                    },

                    {
                        title: 'Message board',
                        path: url.messageBoard,
                        icon: 'ion-chatboxes',
                        bg: '/images/menu-messageboard.jpg'
                    },

                    {
                        title: 'Events',
                        path: url.event,
                        icon: 'ion-ios-book',
                        bg: '/images/menu-event.jpg'
                    },

                    {
                        title: 'Timetable',
                        path: url.timetable,
                        icon: 'ion-android-time',
                        bg: '/images/menu-programme.jpg'
                    },

                    {
                        title: 'Homework',
                        path: url.homework,
                        icon: 'ion-edit',
                        bg: '/images/menu-homework.jpg'
                    },

                    {
                        title: 'To-do list',
                        path: url.todo,
                        icon: 'ion-android-list'
                    },

                    {
                        title: 'Feedback',
                        path: url.feedback,
                        icon: 'ion-android-clipboard',
                        parentFeedback: true,
                        bg: '/images/menu-feedback.jpg'
                    },

                    {
                        title: 'Consent',
                        path: url.consent,
                        icon: 'ion-android-checkbox-outline',
                        bg: '/images/menu-consent.jpg'
                    },

                    {
                        title: 'Drop off procedure',
                        path: url.dropOffProcedure,
                        icon: 'ion-android-pin',
                        bg: '/images/menu-dropoff.jpg'
                    },

                    {
                        title: 'Statements / Payments',
                        path: url.statement,
                        icon: 'ion-briefcase',
                        parentStatement: true,
                        bg: '/images/menu-statement.jpg'
                    },

                    {
                        title: 'Downloads',
                        path: url.download,
                        icon: 'ion-android-download',
                        bg: '/images/Documents & Reporting.jpg'
                    },

                    {
                        title: 'Programmes',
                        path: url.programme,
                        icon: 'ion-android-calendar',
                        bg: '/images/menu-programme.jpg'
                    },

                    {
                        title: 'My kit',
                        path: url.kit,
                        icon: 'ion-tshirt',
                        bg: '/images/menu-kit.jpg'
                    },

                    {
                        title: 'Info & Support',
                        path: url.faq,
                        icon: 'ion-help'
                    }
                ];
                break;

            default:
                menuItems = [];
                break;
        }

        if (path) {
            return _.find(menuItems, {path});
        }

        return menuItems;
    },

    /**
     * Returns the values of an array until a given key
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @return  {array}        Updated array
     */
    returnLeft(array = [], key) {
        const newArray = [];

        for (let i = 0; i < array.length; i++) {
            const value = array[i];
            if (value === key) {
                break;
            }
            newArray.push(value);
        }

        return newArray;
    },

    /**
     * Returns the price band based on the number of siblings
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @return  {string}        Priceband
     */
    getPriceBand(sibling = 0) {
        switch (sibling) {
            case 0:
                return 'price';
            case 1:
                return 'price2';
            default:
                return 'price2plus';
        }
    },

    /**
     * Return icon name based on the transaction code
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-09-28
     * @return  {string}        icon
     */
    getTransactionIcon(code) {
        switch (code) {
            case '1000': {
                return 'ion-person-stalker';
            }
            case '2000': {
                return 'ion-speakerphone';
            }
            default:
                return '';
        }
    },

    /**
     * Formats the programme status
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @param   {integer}   status    Status of the programme (0, 1, 2)
     * @return  {string}            Formatted status
     */
    formatProgrammeStatus(status) {
        switch (status) {
            case 1:
                return 'Accepted';
            case 2:
                return 'Rejected';
            case 3:
                return "Pending for team"
            default:
                return 'Pending';
        }
    },

    /**
     * Formats the price
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @param   {number}    number    Int or string number
     * @return  {string}            Formatted price string
     */
    formatPrice(number, zeroToFree = false) {
        if (number === '' || number === undefined || number === null) {
            return false;
        }

        if (zeroToFree && number == 0) {
            return 'Free';
        }

        const insertCommas = (string) => {
            const [front, trail] = string.split('.', 2);
            const j = (front.length > 3) ? front.length % 3 : 0;
            const formatted = `${(j ? `${front.substr(0, j)},` : '') + front.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + ',')}.${trail}`;
            return formatted;
        };

        // const formatPrice = num => parseFloat(num).toFixed(2);
        const formatPrice = num => insertCommas(`${parseFloat(num).toFixed(2)}`);

        if (number < 0) {
            const price = number * -1;
            return `-£${formatPrice(price)}`;
        }

        return `£${formatPrice(number)}`;
    },

    /**
     * Formats the size to human readable size format
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @param   {number}   bytes    Bytes in number
     * @return  {string}            Formatted size
     */
    bytesToSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) {
            return 'N/A';
        }

        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
        if (i === 0) {
            return `${bytes} ${sizes[i]})`;
        }

        return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
    },

    /**
     * Logs out the user, clears the redux object
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     */
    logOut() {
        this.userRole = '';
        this.deleteCookie('token');
        Store.dispatch({type: 'USER_LOGOUT'});
    },

    /**
     * Checks if user logged in or not
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @return  {boolean}        True if logged in, false if logged out
     */
    isLoggedIn() {
        if (this.getCookie('token')) {
            return true;
        }

        return false;
    },

    /**
     * Gets the current logged in user's role
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @return  {string}        User role
     */
    getUserRole() {
        // if user role set return
        if (this.userRole) {
            return this.userRole;
        }

        // get global store
        const store = Store.getState();

        // check if user is fetched and has user_role
        if (!store.me.fetched || !store.me.data.user_role) {
            return false;
        }

        // cache user role
        this.userRole = store.me.data.user_role;

        return store.me.data.user_role;
    },

    /**
     * return you club type
     * @returns {boolean|*}
     */
    getClubType() {
        // if type set return
        if (this.clubType) {
            return this.clubType;
        }

        // get global store
        const store = Store.getState();

        // check if club is fetched and has type
        if (!store.myClub.fetched || !store.myClub.data.type) {
            return false;
        }

        // cache club type
        this.clubType = store.myClub.data.type;

        return store.myClub.data.type;
    },

    /**
     * Check club type is football club
     * @returns {boolean}
     */
    isClubSs() {
        if (this.getClubType() === 'fc') {
            return false;
        }

        return true;
    },

    /**
     * Check club type is academy
     * @returns {boolean}
     */
    isClubFc() {
        if (this.getClubType() === 'academy') {
            return false;
        }

        return true;
    },

    /**
     * Checks if the current user is superadmin
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @return  {boolean}        True if user is superadmin, false if user is not superadmin
     */
    isSuperAdmin() {
        if (this.getUserRole() !== 'superadmin') {
            return false;
        }

        return true;
    },

    /**
     * Checks if the current user is groupadmin
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @return  {boolean}        True if user is groupadmin, false if user is not groupadmin
     */
    isGroupAdmin() {
        if (this.getUserRole() !== 'groupadmin') {
            return false;
        }

        return true;
    },

    /**
     * Checks if the current user is admin
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @return  {boolean}        True if user is admin, false if user is not admin
     */
    isAdmin() {
        if (this.getUserRole() !== 'admin') {
            return false;
        }

        return true;
    },

    /**
     * Checks if the current user is coach
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @return  {boolean}        True if user is coach, false if user is not coach
     */
    isCoach() {
        if (this.getUserRole() !== 'coach') {
            return false;
        }

        return true;
    },

    /**
     * Checks if the current user is guardian
     *
     * @author  Mark Homoki
     * @version 1.0
     * @since   2017-07-21
     * @return  {boolean}        True if user is guardian, false if user is not guardian
     */
    isGuardian() {
        if (this.getUserRole() !== 'guardian') {
            return false;
        }

        return true;
    },

    /**
     * Dispatches multiple actions
     *
     * @author Jareth Bower
     * @version 1.0
     * @since 2018-10-01
     */
    dispatchMany(...args) {
        args.forEach(dispatchParams => Store.dispatch(fetchData(dispatchParams)));
    },

    /**
     * Make first character uppercase
     * @param value
     * @returns {string}
     */
    ucFirst(value) {
        if (value.length) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return '';
    },

    /**
     * Generate FAQ link
     * @param faqSection
     * @param path
     * @returns {string}
     */
    getFaqLink(faqSection = '', path = '') {
        return `${path}faq?type=${this.getUserRole()}&faq_section=${faqSection}`;
    },

    /**
     * Return you what type of FAQ
     * @param slug
     * @returns {string}
     */
    getFaqType(slug) {
        const role = this.getUserRole();
        let type = '';
        if (role === 'coach') {
            type = `c${slug}`
        } else if (role === 'guardian') {
            type = `g${slug}`
        } else {
            type = `ca${slug}`
        }
        return type;
    },

    /**
     * It will return FAQ title
     * @param location
     * @returns {*|string}
     */
    getFaqTitle(location) {
        let type = location.query.faq_section ? location.query.faq_section : 'Info & Support'

        switch (type) {
            case 'caCoaches':
                type = 'Coaches'
                break;

            case 'caCalendar':
                type = 'Calendar'
                break;

            case 'caTodoList':
                type = 'Todo List'
                break;

            case 'caSetupWizard':
                type = 'Setup Wizard'
                break;

            case 'caContact':
                type = 'Contact'
                break;

            case 'caEmail':
                type = 'Email'
                break;

            case 'caMessageBoard':
                type = 'Message Board'
                break;

            case 'caAvailability':
                type = 'Availability'
                break;

            case 'caSchedules':
                type = 'Schedules'
                break;

            case 'caCoachAssessments':
                type = 'Coach Assessments'
                break;

            case 'caConsent':
                type = 'Consent'
                break;

            case 'Downloads':
                type = 'Downloads'
                break;

            case 'caExports':
                type = 'Exports'
                break;

            case 'caFeedback':
                type = 'Feedback'
                break;

            case 'caAccount':
                type = 'Account'
                break;

            case 'caParentsGuardians':
                type = 'Parents Guardians'
                break;

            case 'caPlayers':
                type = 'Players'
                break;

            case 'caAssignKit':
                type = 'Assign Kit'
                break;

            case 'caRegisters':
                type = 'Registers'
                break;

            case 'caReEnrollment':
                type = 'ReEnrollment'
                break;

            case 'caEvents':
                type = 'Events'
                break;

            case 'caFixtures':
                type = 'Fixtures'
                break;

            case 'caProgrammes':
                type = 'Programmes'
                break;

            case 'caPackage':
                type = 'Package'
                break;

            case 'caDetails':
                type = 'Details'
                break;

            case 'caChangePassword':
                type = 'Change Password'
                break;

            case 'saPurchasedPackage':
                type = 'Purchased Package'
                break;

            case 'saNewPackage':
                type = 'New Package'
                break;

            case 'saDetails':
                type = 'Details'
                break;

            case 'caFootballTeams':
                type = 'Football'
                break;

            case 'gDashboard':
                type = 'Dashboard'
                break;

            case 'gCalendar':
                type = 'Calendar'
                break;

            case 'gContacts':
                type = 'Contacts'
                break;

            case 'gAttendance':
                type = 'Attendance'
                break;

            case 'gStatements':
                type = 'Statements & Payments'
                break;

            case 'gChildren':
                type = 'Children'
                break;

            case 'gTimetable':
                type = 'Timetable'
                break;

            case 'gDropOff':
                type = 'Drop Off'
                break;

            case 'gSchedule':
                type = 'Schedule'
                break;

            case 'gDownload':
                type = 'Download'
                break;

            case 'gAssessments':
                type = 'Assessments'
                break;

            case 'gTodoList':
                type = 'TodoList'
                break;

            case 'gProgrammes':
                type = 'Programmes'
                break;

            case 'gFeedback':
                type = 'Feedback'
                break;

            case 'gMessage':
                type = 'Message'
                break;

            case 'gHomework':
                type = 'Homework'
                break;

            case 'gAvailability':
                type = 'Availability'
                break;

            case 'gCoachingKit':
                type = 'Coaching Kit'
                break;

            case 'gPlayers':
                type = 'Players'
                break;

            case 'gHelpDesk':
                type = 'Info & Support'
                break;

            case 'gHive':
                type = 'gHive'
                break;

            case 'cDashboard':
                type = 'Dashboard'
                break;

            case 'cCalendar':
                type = 'Calendar'
                break;

            case 'cContacts':
                type = 'Contacts'
                break;

            case 'cAttendance':
                type = 'Attendance'
                break;

            case 'cStatements':
                type = 'Statements'
                break;

            case 'cSchedule':
                type = 'Schedule'
                break;

            case 'cAssessments':
                type = 'Assessments'
                break;

            case 'cToDoList':
                type = 'ToDo'
                break;

            case 'cProgrammes':
                type = 'Programmes'
                break;
            case 'cFeedback':
                type = 'Feedback'
                break;

            case 'cMessageBoard':
                type = 'MessageBoard'
                break;

            case 'cHomework':
                type = 'Homework'
                break;

            case 'cAvailability':
                type = 'Availability'
                break;

            case 'cCoachingKit':
                type = 'Coaching Kit'
                break;

            case 'cPlayers':
                type = 'Players'
                break;

            case 'cHelpDesk':
                type = 'Info & Support'
                break;

            case 'cHive':
                type = 'Hive'
                break;
        }

        return type;
    },

    /**
     * Allow you to go top of the page
     */
    scrollToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        const siteContent = document.getElementById('site-content');
        siteContent.scrollTop = 0
    }
    
};
