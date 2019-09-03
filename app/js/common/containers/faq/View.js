import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Radio, TextInput, Accordion} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {
    Article,
    FormButton,
    Meta,
    MetaSection,
    PageTitle,
    Link,
    Back
} from 'app/components';

@connect((store, ownProps) => {
    return {
        faqs: store.faq,
        me: store.me
    };
})
export default class View extends React.PureComponent {

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        this.props.dispatch(fetchData({
            type: 'FAQ',
            url: `/faq${this.getParams(this.props.location)}`,
        }));
    }

    getParams(location) {
        let params = '';
        if (location.query.type === 'groupadmin') {
            location.query.type ? params += `type=superadmin` : null
        } else if (location.query.type === 'admin') {
            location.query.type ? params += `type=clubadmin` : null
        } else {
            location.query.type ? params += `type=${location.query.type}` : null
        }

        location.query.faq_section ? params += `&faq_section=${location.query.faq_section}` : null
        return `?${params}`
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.location.query !== this.props.location.query) {
            this.props.dispatch(fetchData({
                type: 'FAQ',
                url: `/faq${this.getParams(nextProps.location)}`
            }));
        }
    }

    render() {
        const {
            faqs,
            location
        } = this.props;

        const userRole = fn.getUserRole();
        const faqTitle = fn.getFaqTitle(location)

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value={faqTitle}/>
                {location.query.faq_section ?
                    <ContentLoader
                        data={faqs.currentCollection}
                        forceRefresh
                        isLoading={faqs.isLoading}
                        notFound="No Data"
                    >
                        <Article className="section-faq">
                            {_.map(faqs.currentCollection, (id) => {
                                const faq = faqs.collection[id];
                                return (
                                    <div key={faq.id} className={"faq-list"}>
                                        <Link to={`${url.manageFaq}/${faq.id}`}>{faq.question}</Link>
                                    </div>
                                );
                            })}
                        </Article>
                    </ContentLoader>

                    :

                    <section className={"faq-section"}>
                        {userRole === 'admin' &&
                            <React.Fragment>
                                <div>
                                    <h5 className="text-primary">Club Admin terminal</h5>
                                    <ul>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caSetupWizard'}>
                                                <i className={'ion-ios-gear'}></i>Setup Wizard
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caCalendar'}>
                                                <i className={'ion-calendar'}></i>Calendar
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caToDoList'}>
                                                <i className={'ion-android-list'}></i>To-do List
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="text-primary">Communication</h5>
                                    <ul>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caContact'}>
                                                <i className={'ion-person-stalker'}></i>Contacts
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caEmail'}>
                                                <i className={'ion-plus'}></i>Email
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caMessageBoard'}>
                                                <i className={'ion-chatboxes'}></i>Message Board
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="text-primary">Coaches</h5>
                                    <ul>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caCoaches'}>
                                                <i className={'ion-speakerphone'}></i>Coaches
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caAvailability'}>
                                                <i className={'ion-android-calendar'}></i>Availability
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caSchedule'}>
                                                <i className={'ion-clock'}></i>Schedules
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caCoachAssessments'}>
                                                <i className={'ion-clipboard'}></i>Coach Assessments
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="text-primary">Documents</h5>
                                    <ul>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caConsent'}>
                                                <i className={'ion-android-checkbox-outline'}></i>Consent
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caDownload'}>
                                                <i className={'ion-android-download'}></i>Downloads
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caExports'}>
                                                <i className={'ion-log-out'}></i>Exports
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caFeedback'}>
                                                <i className={'ion-android-clipboard'}></i>Feedback
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="text-primary">Finance</h5>
                                    <ul>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caAccount'}>
                                                <i className={'ion-card'}></i>Accounts
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="text-primary">Parents</h5>
                                    <ul>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caParentsGuardians'}>
                                                <i className={'ion-android-contact'}></i>Parents
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="text-primary">Players</h5>
                                    <ul>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caPlayers'}>
                                                <i className={'ion-ios-person'}></i>Players
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="text-primary">Teams & Groups</h5>
                                    <ul>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caAssignKit'}>
                                                <i className={'ion-tshirt'}></i>Assign Kits</Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caRegisters'}>
                                                <i className={'ion-filing'}></i>Registers</Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caReEnrollment'}>
                                                <i className={'ion-refresh'}></i>RE-enrollment</Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caEvents'}>
                                                <i className={'ion-ios-book'}></i>Events</Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caFixtures'}>
                                                <i className={'ion-ios-football'}></i>Fixtures</Link>
                                        </li>

                                        <li><
                                            Link to={'faq?type=admin&faq_section=caFootballTeams'}>
                                            <i className={'ion-ios-people'}></i>Football Teams</Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caProgrammes'}>
                                                <i className={'ion-android-calendar'}></i>Programmes</Link>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="text-primary">Settings & Set-up</h5>
                                    <ul>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caPackage'}>
                                                <i className={'ion-ios-americanfootball-outline'}></i>Package</Link>
                                        </li>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caDetails'}>
                                                <i className={'ion-ios-barcode'}></i>Details</Link>
                                        </li>
                                        <li>
                                            <Link to={'faq?type=admin&faq_section=caChangePassword'}>
                                                <i className={'ion-ios-locked'}></i>Change Password</Link>
                                        </li>
                                    </ul>
                                </div>
                            </React.Fragment>
                        }

                        {
                            userRole === 'groupadmin' &&
                            <React.Fragment>
                                <div>
                                    <h5 className="text-primary">Super admin terminal</h5>
                                    <ul>
                                        <li>
                                            <Link to={'faq?type=groupadmin&faq_section=saPurchasedPackage'}>
                                                <i className={'ion-pricetag'}></i> Purchase Packages</Link>
                                        </li>
                                        <li>
                                            <Link to={'faq?type=groupadmin&faq_section=saNewPackage'}>
                                                <i className={'ion-plus'}></i> Buy New Package</Link>
                                        </li>
                                        <li>
                                            <Link to={'faq?type=groupadmin&faq_section=saDetails'}>
                                                <i className={'ion-gear-a'}></i>Account Details</Link>
                                        </li>
                                    </ul>
                                </div>
                            </React.Fragment>
                        }

                        {
                            userRole === 'coach' &&
                            <React.Fragment>
                                <div>
                                    <h5 className="text-primary">Coach terminal</h5>
                                    <ul>
                                        <li>
                                            <Link to={'faq?type=coach&faq_section=cCalendar'}>
                                                <i className={'ion-calendar'}></i>Calender
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=coach&faq_section=cContact'}>
                                                <i className={'ion-person-stalker'}></i>Contacts
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=coach&faq_section=cAttendance'}>
                                                <i className={'ion-android-checkmark-circle'}></i>Attendance
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=coach&faq_section=cStatements'}>
                                                <i className={'ion-briefcase'}></i>Statements
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=coach&faq_section=cSchedule'}>
                                                <i className={'ion-clock'}></i>My Schedule
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=coach&faq_section=cAssessments'}>
                                                <i className={'ion-ios-analytics'}></i>Skills Assessments
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=coach&faq_section=cToDoList'}>
                                                <i className={'ion-android-list'}></i>To-do List
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=coach&faq_section=cProgrammes'}>
                                                <i className={'ion-android-calendar'}></i>Programmes
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=coach&faq_section=cFeedback'}>
                                                <i className={'ion-android-clipboard'}></i>Feedback
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=coach&faq_section=cMessageBoard'}>
                                                <i className={'ion-chatboxes'}></i>Message Board
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=coach&faq_section=cHomework'}>
                                                <i className={'ion-edit'}></i>Homework
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=coach&faq_section=cAvailability'}>
                                                <i className={'ion-android-calendar'}></i>Availability
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=coach&faq_section=cCoachingKit'}>
                                                <i className={'ion-tshirt'}></i>Coaching Kit
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=coach&faq_section=cPlayers'}>
                                                <i className={'ion-ios-person'}></i>Players
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </React.Fragment>
                        }

                        {
                            userRole === 'guardian' &&
                            <React.Fragment>
                                <div>
                                    <h5 className="text-primary">guardian terminal</h5>
                                    <ul>
                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=gCalendar'}>
                                                <i className={'ion-calendar'}></i>Calender
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=gContact'}>
                                                <i className={'ion-person-stalker'}></i>Contacts
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="text-primary">Account</h5>
                                    <ul>
                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=gChildren'}>
                                                <i className={'ion-android-people'}></i>My Children
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=gMessageBoard'}>
                                                <i className={'ion-chatboxes'}></i>Message Board
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=caEvents'}>
                                                <i className={'ion-ios-book'}></i>Events
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=gTimetable'}>
                                                <i className={'ion-android-time'}></i>Timetable
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=gHomework'}>
                                                <i className={'ion-edit'}></i>Homework
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=gToDoList'}>
                                                <i className={'ion-android-list'}></i>To-do List
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=gFeedback'}>
                                                <i className={'ion-android-clipboard'}></i>Feedback
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=caConsent'}>
                                                <i className={'ion-android-checkbox-outline'}></i>Consent
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=gDropOff'}>
                                                <i className={'ion-android-pin'}></i>Drop Off Procedure
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=gStatements'}>
                                                <i className={'ion-briefcase'}></i>Statements / Payments
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=gDownload'}>
                                                <i className={'ion-android-download'}></i>Downloads
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=gProgrammes'}>
                                                <i className={'ion-android-calendar'}></i>Programmes
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={'faq?type=guardian&faq_section=gCoachingKit'}>
                                                <i className={'ion-tshirt'}></i>My Kit
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </React.Fragment>
                        }
                    </section>
                }

                <div className="form-actions">
                    <Back className="button">Go Back</Back>
                </div>
            </div>
        );
    }
}
