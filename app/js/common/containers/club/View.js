import React from 'react';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {ContentLoader, Tooltip} from '@xanda/react-components';
import {Link, Meta, PageTitle} from 'app/components';
import * as complete from './functions';

export default class View extends React.PureComponent {

    constructor(props) {
        super(props);

        this.clubId = this.props.params.clubId;
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    getMenuItems = () => {
        const {club, params} = this.props;
        const fc = club.type !== 'academy';
        const academy = club.type !== 'fc';
        const clubSlug = params.clubSlug;
        return [
            {
                id: 'details',
                title: 'General Details',
                link: 'details',
                notification: 'true'
            },

            ...(academy ? [{
                id: 'academySetup',
                title: 'Soccer School Setup',
                link: 'academy-setup',
                notification: 'true'
            }] : []),

            ...(fc ? [{
                id: 'fcSetup',
                title: 'Football Club Setup',
                link: 'fc-setup', notification: 'true'
            }] : []),

            {
                id: 'bankAccounts',
                title: 'Financial Accounts',
                link: 'bank-accounts', notification: 'true'},
            {
                id: 'kits',
                title: 'Kit Items',
                link: 'kits',
                notification: 'true'
            },

            {
                id: 'skills',
                title: 'Skills',
                link: 'skills',
                notification: 'true'
            },

            {
                id: 'socialURL',
                title: 'Social Media',
                link: 'social',
                notification: 'true'
            },

            {
                id: 'coachAssessment',
                title: 'Assessment Forms',
                link: `assessments`,
                notification: 'true'
            },

            {
                id: 'programmes',
                title: 'Programmes',
                link: `programmes`,
                notification: 'true'
            },

            {
                id: 'licence',
                title: 'Your Package',
                link: `${url.setting}/${url.licence}`,
                notification: 'false'
            }
        ];
    }

    finishedProcess = (processType) => {
        const {club, assessments, programme} = this.props;

        switch (processType) {
            case 'details':
                return complete.detailsComplete(club);
            case 'age-groups':
                return complete.ageGroupsComplete(club);
            case 'academySetup':
                return complete.academySetupComplete(club);
            case 'fcSetup':
                return complete.fcSetupComplete(club);
            case 'bankAccounts':
                return complete.bankAccountsComplete(club);
            case 'kits':
                return complete.kitsComplete(club);
            case 'skills':
                return complete.skillsComplete(club);
            case 'socialURL':
                return complete.socialComplete(club);
            case 'coachAssessment':
                return complete.assessmentFromComplete(assessments);
            case 'programmes':
                return complete.hasOneProgramme(programme);
            case 'licence':
                return true;
            default:
                return false;
        }
    }

    getLink(menuItem) {
        switch (menuItem.id) {
            case 'coachAssessment':
                return 'assessments'
            case 'licence':
                return `${url.setting}/licence`
            case 'programmes':
                return menuItem.link
            default:
                return `${url.club}/${this.clubId}/${menuItem.link}`
        }
    }

    handleFinish = () => {
        const {club} = this.props;
        const formData = new FormData();
        const isComplete = complete.allComplete(club);
        let completed_status;
        isComplete ? completed_status = 3 : completed_status = 1;

        formData.append('completed_status', completed_status);
        api.post(`/clubs/${club.club_id}/complete-package/`, formData);
    }

    renderProgress = () => {
        let progress = 0;
        const menuItems = this.getMenuItems();

        menuItems.map((menuItem) => {
            if (this.finishedProcess(menuItem.id)) {
                progress += 1;
            }
        });

        const percentage = progress / menuItems.length * 100;

        return (
            <div className={`progress-bar progress-${Math.ceil(percentage / 5) * 5}`}>
                <div className="progress-inner">
                    <span className="percent">{percentage.toFixed(0)}%</span>
                </div>
            </div>
        );
    }

    getNotification = (menuItem) => {
        return (
            <div className="notification-wrapper label">
                <div className="notification-title">
                    {menuItem.title}
                    {this.getNotificationItem(menuItem)}
                </div>
            </div>
        )
    }

    getNotificationItem = (menuItem) => {
        const {club, assessments, programme} = this.props;

        switch (menuItem.id) {
            case 'details':
                const processComplete = complete.detailsComplete(club)
                if(processComplete){
                    return null
                }

                return (
                    <React.Fragment>
                        <span className="notification-item">!</span>
                        <span className="notification-tooltips">Please setup your club.</span>
                    </React.Fragment>
                );

            case 'academySetup':
                const totalSchool = complete.totalSoccerSchool(club)
                return (
                    <React.Fragment>
                        <span className="notification-item">{totalSchool}</span>
                        <span className="notification-tooltips">You have set up {totalSchool} soccer school groups</span>
                    </React.Fragment>
                );

            case 'fcSetup':
                const totalFootballTeam = complete.totalFootballClub(club)
                return (
                    <React.Fragment>
                        <span className="notification-item">{totalFootballTeam}</span>
                        <span className="notification-tooltips">You have set up {totalFootballTeam} football club teams</span>
                    </React.Fragment>
                );

            case 'bankAccounts':
                const financialAccount = complete.totalFinancialAccount(club);
                return (
                    <React.Fragment>
                        <span className="notification-item">{financialAccount}</span>
                        <span className="notification-tooltips">You have {financialAccount} accounts</span>
                    </React.Fragment>
                );

            case 'kits':
                const totalKitItem = complete.totalKitItem(club);
                return (
                    <React.Fragment>
                        <span className="notification-item">{totalKitItem}</span>
                        <span className="notification-tooltips">You have {totalKitItem} kit items<br/>
                            {_.isEmpty(club.size_chart) ? `You have (not) uploaded a size chart` : null}
                        </span>
                    </React.Fragment>
                );

            case 'skills':
                const totalSkills = complete.totalSkill(club)
                return (
                    <React.Fragment>
                        <span className="notification-item">{totalSkills}</span>
                        <span className="notification-tooltips">You have {totalSkills} skills categories</span>
                    </React.Fragment>
                );

            case 'socialURL':
                const totalSocialLink = complete.totalSocialLinkComplete(club);
                return (
                    <React.Fragment>
                        <span className="notification-item">{totalSocialLink}</span>
                        <span className="notification-tooltips">You have entered {totalSocialLink}/4 social media links</span>
                    </React.Fragment>
                );

            case 'coachAssessment':
                return (
                    <React.Fragment>
                        <span className="notification-item">{assessments.count && assessments.count}</span>
                        <span className="notification-tooltips">
                            You have setup {assessments.count && assessments.count} assessment form
                        </span>
                    </React.Fragment>
                );

            case 'programmes':
                return (
                    <React.Fragment>
                        <span className="notification-item">{programme.count && programme.count}</span>
                        <span className="notification-tooltips">
                            You have {programme.count && programme.count} programmes
                        </span>
                    </React.Fragment>
                );

            default:
                return null;

        }
    }

    renderMenu = () => {
        const menuItems = this.getMenuItems();

        return _.map(menuItems, (menuItem) => {
            if (!menuItem) {
                return null;
            }

            const finishedProcess = this.finishedProcess(menuItem.id);
            const buttonText = finishedProcess ? 'edit' : 'setup';
            const finishedClass = finishedProcess ? 'process-completed' : '';

            return (

                <div className="meta aligned"
                     key={menuItem.id}>
                    {menuItem.notification === 'true' ?
                        this.getNotification(menuItem)
                        :
                        <div className="label">{menuItem.title}</div>
                    }
                    <span>
                       <Link
                           className={`button ${buttonText}`}
                           to={this.getLink(menuItem)}>
                          {buttonText}
                       </Link>

                        {
                            finishedProcess ? <span className="complete"><i className="icon ion-checkmark"></i></span> : null
                        }

                        {(!finishedProcess && menuItem.title === 'Financial Accounts') ?
                            <Tooltip icon={<i className="ion-android-alert button-alert-icon"/>}
                                     message="You need to add account details"/> : ''
                        }
                    </span>
                </div>
            );
        });
    }

    render() {
        const {collection, params} = this.props;

        return (
            <div id="content" className="site-content-inner ml-10">
                <PageTitle value="Setup"
                           faq={true}
                           faqLink={fn.getFaqLink(`caSetupWizard`, `/${params.clubSlug}/`)}/>

                <ContentLoader
                    data
                    forceRefresh
                    isLoading={collection.isLoading}
                    notFound="No Data"
                >
                    <div className="progress-wrapper">
                        <div className="meta-wrapper">
                            {this.renderMenu()}
                        </div>
                        {/*{this.renderProgress()}*/}
                    </div>
                </ContentLoader>
            </div>
        );
    }

}
