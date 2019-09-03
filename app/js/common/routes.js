import React from 'react'
import {
	IndexRedirect,
	IndexRoute,
	Route
} from 'react-router'
import { url } from './constants'
import * as C from './containers'

// Admin Routes
import * as AdminFAQ from './containers/_admin/faq'
import * as AdminFranchise from './containers/_admin/franchise'
import * as AdminPackage from './containers/_admin/package'
import * as AdminPage from './containers/_admin/page'

// User Routes
import * as Account from './containers/account';
import * as AssessmentTemplate from './containers/assessmentTemplate';
import * as Attendance from './containers/attendance';
import * as AttendanceRegister from './containers/attendanceRegister';
import * as Auth from './containers/auth';
import * as Availability from './containers/availability';
import * as BankAccount from './containers/bankAccount';
import * as Calendar from './containers/calendar';
import * as Club from './containers/club';
import * as ClubAdmin from './containers/clubAdmin';
import * as Coach from './containers/coach';
import * as CoachAssessment from './containers/coachAssessment';
import * as CoachAvailability from './containers/coachAvailability';
import * as CoachSchedule from './containers/coachSchedule';
import * as Consent from './containers/consent';
import * as Contact from './containers/contact';
import * as Download from './containers/download';
import * as Email from './containers/email';
import * as Event from './containers/event';
import * as FAQ from './containers/faq';
import * as Feedback from './containers/feedback';
import * as Fixture from './containers/fixture';
import * as Franchise from './containers/franchise';
import * as Guardian from './containers/guardian';
import * as Homework from './containers/homework';
import * as Invoice from './containers/invoice';
import * as Kid from './containers/kid';
import * as Kit from './containers/kit';
import * as Licence from './containers/licence';
import * as MessageBoard from './containers/messageBoard';
import * as Page from './containers/page';
import * as Player from './containers/player';
import * as Profile from './containers/profile';
import * as Programme from './containers/programme';
import * as RegisterAccounts from './containers/public/registerAccounts';
import * as RegisterFranchise from './containers/public/registerFranchise';
import * as Schedule from './containers/coachSchedule';
import * as Session from './containers/session';
import * as Setting from './containers/setting';
import * as Skill from './containers/skill';
import * as SkillAssessment from './containers/skillAssessment';
import * as Statement from './containers/statement';
import * as Team from './containers/team';
import * as Timetable from './containers/timetable';
import * as Todo from './containers/todo';
import * as Tutorial from './containers/tutorial';

/**
 * Route props
 *
 * @param   {Object}   	path			Paths are imported from constants.js
 * @param   {Object}   	component		Components are imported from the containers folder
 * @param   {Array}   	accessLevel		The array contains the user role string. If not set all user roles can acces. ['admin', 'coach', 'guardian']
 * @param   {Boolean}   hideNavigation	Used props to hide the sidebar navigation. (see dashboard)
 */

const Routes = (
	<Route>
		<Route component={C.AuthenticationArea}>
			<IndexRedirect to={url.login} />
			<Route path="/" component={Auth.Login} />
			<Route path={url.login} component={Auth.Login} />
			<Route path={url.register} component={Auth.Register} />
			<Route path={url.forgotPassword} component={Auth.ForgotPassword} />
			<Route path={`${url.resetPassword}/:token`} component={Auth.ResetPassword} />
		</Route>

		<Route path={`${url.page}/:pageSlug`} component={Page.View} />

		<Route path={url.registerFranchise}>
			<Route component={C.AuthenticationArea}>
				<Route path="confirmation" component={RegisterFranchise.Confirmation} />
			</Route>
			{/* // Purchasing */}
			<Route component={RegisterFranchise.Wrapper}>
				<IndexRoute component={RegisterFranchise.ListPackages} />
				<Route path="register-account" component={RegisterFranchise.RegisterDetails} />
			</Route>
		</Route>

		{/* // Super admin, franchise admin terminal */}
		<Route component={C.AuthorizedArea}>
			<IndexRedirect component={AdminPackage.List} accessLevel={['superadmin']} />
			{/*<Route path={url.dashboard} component={C.Dashboard} />*/}

			{/* // Super Admin routes */}
			<Route path={url.package}>
				<IndexRoute component={AdminPackage.List} accessLevel={['superadmin']} />
				<Route path="add" component={AdminPackage.Add} accessLevel={['superadmin']} />
				<Route path=":packageId/edit" component={AdminPackage.Edit} accessLevel={['superadmin']} />
			</Route>

			<Route path={url.franchise}>
				<IndexRoute component={AdminFranchise.List} accessLevel={['superadmin']} />
				<Route path=":franchiseId" component={AdminFranchise.View} accessLevel={['superadmin']} />
				<Route path="group_admin/:userId/update-password" component={Profile.EditPassword} accessLevel={['superadmin']} />
				<Route path=":franchiseId/set-account-manager" component={AdminFranchise.AccountManager} accessLevel={['superadmin']}/>
				<Route path=":franchiseId/add-statement" component={Statement.Add} accessLevel={['superadmin']}/>
				<Route path=":franchiseId/edit-statement" component={Statement.Edit} accessLevel={['superadmin']}/>
			</Route>

			<Route path={url.manageFaq}>
				<IndexRoute component={AdminFAQ.List} accessLevel={['superadmin']} />
				<Route path="add" component={AdminFAQ.Add} accessLevel={['superadmin']} />
				<Route path=":faqId" component={AdminFAQ.View} accessLevel={['superadmin','groupadmin','admin','coach','guardian']} />
				<Route path=":faqId/edit" component={AdminFAQ.Edit} accessLevel={['superadmin']} />
			</Route>

			<Route path={url.page}>
				<IndexRoute component={AdminPage.List} accessLevel={['superadmin']} />
				<Route path=":pageSlug/edit" component={AdminPage.Edit} accessLevel={['superadmin']} />
				<Route path=":pageSlug" component={Page.View} />
			</Route>

			{/* // Group Admin routes */}
			<Route path={url.licence}>
				<IndexRoute component={Licence.List} accessLevel={['groupadmin']} />
				<Route path=":licenceId/change" component={Licence.Change} accessLevel={['groupadmin']} />
			</Route>

			<Route path={url.faq} component={FAQ.View} accessLevel={['groupadmin']} />

			<Route path={url.accountInfo} component={Franchise.Edit} accessLevel={['groupadmin']} />

			<Route path={url.licenceBuy} component={Licence.Buy} accessLevel={['groupadmin']} />

			<Route path={url.club} component={Club.Wrapper}>
				<IndexRoute component={Club.List} accessLevel={['groupadmin']} />
				<Route path=":clubId" component={Club.View} accessLevel={['groupadmin']} />
				<Route path=":clubId/academy-setup" component={Club.AcademySetup} accessLevel={['groupadmin']} />
				<Route path=":clubId/details" component={Club.Details} accessLevel={['groupadmin']} />
				<Route path=":clubId/edit-licence" component={Club.Structure} accessLevel={['groupadmin']} />
				<Route path=":clubId/fc-setup" component={Club.FCSetup} accessLevel={['groupadmin']} />
				<Route path=":clubId/fc-setup" component={Club.FCSetup} accessLevel={['groupadmin']} />
				<Route path=":clubId/age-groups" component={Club.AgeGroup} accessLevel={['groupadmin']} />
				<Route path=":clubId/kits" component={Club.Kit} accessLevel={['groupadmin']} />
				<Route path=":clubId/setup" component={Club.Setup} accessLevel={['groupadmin']} />
				<Route path=":clubId/skills" component={Club.Skill} accessLevel={['groupadmin']} />
				<Route path=":clubId/social" component={Club.SocialLink} accessLevel={['groupadmin']} />

				<Route path=":clubId/admins">
					<IndexRoute component={ClubAdmin.List} accessLevel={['groupadmin']} />
					<Route path="add" component={ClubAdmin.Add} accessLevel={['groupadmin']} />
					<Route path=":userId/edit" component={ClubAdmin.Edit} accessLevel={['groupadmin']} />
				</Route>

				<Route path=":clubId/bank-accounts">
					<IndexRoute component={BankAccount.List} accessLevel={['groupadmin']} />
					<Route path="add" component={BankAccount.Add} accessLevel={['groupadmin']} />
					<Route path=":accountId" component={BankAccount.View} accessLevel={['groupadmin']} />
					<Route path=":accountId/edit" component={BankAccount.Edit} accessLevel={['groupadmin']} />
				</Route>
			</Route>

			<Route path={url.profile}>
				<IndexRoute component={Profile.Edit} />
				<Route path="edit" component={Profile.Edit} />
				<Route path={url.changePassword} component={Profile.EditPassword} />
			</Route>
		</Route>

		<Route path={url.logout} component={Auth.Logout} />

		<Route path="404" component={C.NotFound} />

		{/* // Club admin, coach, guardian terminal */}
		<Route path="/:clubSlug" component={C.App} > 
			<Route component={C.AuthenticationArea}>
				<IndexRoute to={url.login} />
				<Route path={url.login} component={Auth.Login} />
				<Route path={url.register} component={Auth.Register} />
				<Route path={url.forgotPassword} component={Auth.ForgotPassword} />
				<Route path={`${url.resetPassword}/:token`} component={Auth.ResetPassword} />

				<Route path={url.page}>
					<Route path=":pageSlug" component={Page.View} />
				</Route>
			</Route>

			<Route path={`${url.page}/:pageSlug`} component={Page.View} />

			<Route path={url.logout} component={Auth.Logout} />

			<Route path={url.registerAccounts} component={RegisterAccounts.Wrapper}>
				<IndexRoute component={RegisterAccounts.RegisterPlayer} />
				<Route path="view-programme" component={RegisterAccounts.ViewProgramme} />
				<Route path="register-account" component={RegisterAccounts.RegisterDetails} />
			</Route>

			<Route component={C.AuthorizedArea}>
				<IndexRedirect component={Account.List} accessLevel={['admin']} />
				<Route path={url.dashboard} component={C.Dashboard} />

				<Route path={url.account}>
					<IndexRoute component={Account.List} accessLevel={['admin']} />
					<Route path="add" component={Account.Add} accessLevel={['admin']} />
					<Route path="add-payment" component={Account.AddPayment} accessLevel={['admin']} />
					<Route path="create-invoice" component={Account.AddInvoice} accessLevel={['admin']} />
					<Route path="settings" component={Account.Settings} accessLevel={['admin']} />
					<Route path=":accountId" component={Account.View} accessLevel={['admin']} />
					<Route path=":accountId/edit" component={Account.Edit} accessLevel={['admin']} />
				</Route>

				<Route path={url.attendanceRegister} >
					<IndexRoute component={AttendanceRegister.List} accessLevel={['admin', 'coach']}/>
					<Route path=":playerId" component={AttendanceRegister.View} accessLevel={['admin', 'coach']}/>
				</Route>


				<Route path={url.calendar} component={Calendar.View} accessLevel={['admin', 'coach', 'guardian']} />

				<Route path={url.email} component={Email.Compose} accessLevel={['admin']} />

				<Route path={url.contact}>
					<IndexRoute component={Contact.List} accessLevel={['admin', 'coach', 'guardian']} />
					<Route path="add" component={Contact.Add} accessLevel={['admin', 'coach', 'guardian']} />
					<Route path=":addressId" component={Contact.Edit} accessLevel={['admin', 'coach', 'guardian']} />
					<Route path=":addressId/edit" component={Contact.Edit} accessLevel={['admin', 'coach', 'guardian']} />
				</Route>

				<Route path={url.assessmentTemplate}>
					<IndexRoute component={AssessmentTemplate.List} accessLevel={['admin']} />
					<Route path="add" component={AssessmentTemplate.Add} accessLevel={['admin']} />
					<Route path=":assessmentId" component={AssessmentTemplate.View} accessLevel={['admin']} />
				</Route>

				<Route path={url.attendance}>
					<IndexRoute component={Attendance.List} accessLevel={['coach']} />
					<Route path=":sessionId" component={Attendance.View} accessLevel={['coach']} />
				</Route>

				<Route path={url.availability}>
					<IndexRoute component={Availability.List} accessLevel={['coach']} />
					<Route path="add" component={Availability.Add} accessLevel={['coach']} />
					<Route path=":availabilityId/edit" component={Availability.Edit} accessLevel={['coach']} />
				</Route>

				<Route path={url.coach}>
					<IndexRoute component={Coach.List} accessLevel={['admin']} />
					<Route path="add" component={Coach.Add} accessLevel={['admin']} />
					<Route path=":userId/edit" component={Coach.Edit} accessLevel={['admin']} />
					<Route path={`:userId/${url.statement}`} component={Statement.List} accessLevel={['admin','coach']} type="coach" />
					<Route path=":userId" component={Coach.View} accessLevel={['admin']} />
					<Route path={`:userId/${url.statement}/add`} component={Coach.AddStatement} accessLevel={['admin']} />
					<Route path={`:userId/${url.statement}/edit`} component={Coach.EditStatement} accessLevel={['admin']} />
				</Route>

				<Route path={url.coachAssessment}>
					<IndexRoute component={CoachAssessment.List} accessLevel={['admin', 'coach']} />
					<Route path="add" component={CoachAssessment.Add} accessLevel={['admin']} />
					<Route path=":assessmentId/edit" component={CoachAssessment.Edit} accessLevel={['admin']} />
					<Route path=":assessmentId" component={CoachAssessment.View} accessLevel={['admin', 'coach']} />
				</Route>

				<Route path={url.coachAvailability}>
					<IndexRoute component={CoachAvailability.List} accessLevel={['admin']} />
					<Route path=":availabilityId/edit" component={Availability.Edit} accessLevel={['admin']} />
				</Route>

				<Route path={url.coachSchedule}>
					<IndexRoute component={CoachSchedule.List} accessLevel={['admin']} />
				</Route>

				<Route path={url.consent}>
					<IndexRoute component={Consent.List} />
					<Route path="add" component={Consent.Add} />
					<Route path=":consentId" component={Consent.View} />
				</Route>

				<Route path={url.download}>
					<IndexRoute component={Download.List} />
					<Route path="add" component={Download.Add} accessLevel={['admin']} />
					<Route path=":downloadId/edit" component={Download.Edit} accessLevel={['admin']} />
				</Route>

				<Route path={url.dropOffProcedure} component={C.DropOffProcedure} />

				<Route path={url.endOfYear} component={C.EndOfYear} accessLevel={['admin']} />


				<Route path={url.export} component={C.Export} pageTitle="Export" />

				<Route path={url.faq} component={FAQ.View} />
				<Route path="manage-faq/:faqId" component={AdminFAQ.View} />

				<Route path={url.feedback}>
					<IndexRoute component={Feedback.List} />
					<Route path="add" component={Feedback.Add} accessLevel={['admin']} />
					<Route path=":feedbackId" component={Feedback.View} />
				</Route>

				<Route path={url.fixture}>
					<IndexRoute component={Fixture.List} />
					<Route path="add" component={Fixture.Add} accessLevel={['admin']} />
					<Route path=":fixtureId" component={Fixture.View} />
					<Route path=":fixtureId/player/:playerId" component={Fixture.View} />
					<Route path=":fixtureId/edit" component={Fixture.Edit} accessLevel={['admin']} />
				</Route>

				<Route path={url.invoice}>
					<IndexRoute component={Invoice.List} accessLevel={['admin']} />
					<Route path="add" component={Invoice.Add} accessLevel={['admin']} />
					<Route path=":invoiceId" component={Invoice.View} accessLevel={['admin']} />
				</Route>

				<Route path={url.guardian}>
					<IndexRoute component={Guardian.List} accessLevel={['admin']} />
					<Route path="add" component={Guardian.Add} accessLevel={['admin']} />
					<Route path=":userId/edit" component={Guardian.Edit} accessLevel={['admin']} />
					<Route path=":userId/add-player" component={Player.Add} accessLevel={['admin']} type="guardian" />
					<Route path=":userId">
						<IndexRoute component={Guardian.View} accessLevel={['admin']} />
						<Route path={`${url.statement}`} component={Statement.List} accessLevel={['admin','guardian']} type="guardian" />
						<Route path={`${url.statement}/add`} component={Guardian.AddStatement} accessLevel={['admin']}/>
						<Route path={`${url.statement}/edit`} component={Guardian.EditStatement} accessLevel={['admin']}/>
					</Route>
				</Route>

				<Route path={url.help} component={C.Help} />

				<Route path={url.homework}>
					<IndexRoute component={Homework.List} accessLevel={['coach', 'guardian']} />
					<Route path="add" component={Homework.Add} accessLevel={['coach']} />
					<Route path=":homeworkId" component={Homework.View} accessLevel={['coach', 'guardian']} />
					<Route path=":homeworkId/player/:playerId" component={Homework.View} accessLevel={['coach', 'guardian']} />
				</Route>

				<Route path={url.kid}>
					<IndexRoute component={Kid.List} accessLevel={['guardian']} />
					<Route path="add" component={Kid.Add} accessLevel={['guardian']} />
					<Route path=":playerId" component={Kid.View} accessLevel={['guardian']} />
					<Route path=":playerId/edit" component={Kid.Edit} accessLevel={['guardian']} />
				</Route>

				<Route path={url.kit} component={Club.Wrapper}>
					<IndexRoute component={Club.Kit} />
					<Route path="add" component={Kit.Add} accessLevel={['admin']} />
					<Route path=":kitId" component={Kit.View} />
					<Route path=":kitId/edit" component={Kit.Edit} accessLevel={['admin']} />
				</Route>

				<Route path={url.messageBoard}>
					<IndexRoute component={MessageBoard.List} />
					<Route path="topics/:topicId" component={MessageBoard.List} />
				</Route>

				<Route path={`${url.page}/:pageSlug`} component={Page.View} />

				<Route path={url.player}>
					<IndexRoute component={Player.List} />
					<Route path="add" component={Player.Add} accessLevel={['admin']} />
					<Route path=":playerId" component={Player.View} />
					<Route path=":playerId/edit" component={Player.Edit} accessLevel={['admin']} />
					<Route path=":playerId/kit-assignment" component={Player.KitAssignment} accessLevel={['admin']} />
					<Route path=":playerId/kits" component={Player.Kit} />
					<Route path=":playerId/skill-assessments" component={Player.SkillAssessment} accessLevel={['admin', 'coach']} />
					<Route path=":playerId/skill-group" component={Player.SkillGroup} accessLevel={['admin']} />
					<Route path=":playerId/all-assessments" component={Player.AllAssessment} accessLevel={['admin', 'guardian']} />
				</Route>

				<Route path={url.profile}>
					<IndexRoute exact component={Profile.View} />
					<Route path={url.changePassword} component={Profile.EditPassword} />
					<Route path="crb-profle" component={Profile.EditCRB} accessLevel={['coach']} />
					<Route path="qualifications" component={Profile.EditQualifications} accessLevel={['coach']} />
					<Route path="edit" component={Profile.Edit} />
				</Route>

				<Route path={url.changePassword} component={Profile.EditPassword} />

				<Route path={url.programme}>
					<IndexRoute component={Programme.List} />
					<Route path="add" component={Programme.Add} accessLevel={['admin']} />
					<Route path="add-fc-programme" component={Programme.Add} type="fc" accessLevel={['admin']} />
					<Route path="add-academy-programme" component={Programme.Add} type="academy" accessLevel={['admin']} />
					<Route path=":programmeId" component={Programme.View} />
					<Route path=":programmeId/player/:playerId" component={Programme.View} />
				</Route>

				<Route path={url.refer} component={C.Refer} />

				<Route path={url.event}>
					<IndexRoute component={Event.List} accessLevel={['admin', 'guardian']} />
					<Route path="add" component={Event.Add} accessLevel={['guardian']} />
					{/*<Route path="add-event" component={Programme.Add} type="event" accessLevel={['admin']} />*/}
					<Route path="add-event" component={Event.Add} type="event" accessLevel={['admin']} />
					<Route path=":requestId" component={Event.View} accessLevel={['admin', 'guardian']} />
					<Route path=":requestId/edit" component={Event.Edit} accessLevel={['guardian']} />
				</Route>

				<Route path={url.schedule}>
					<IndexRoute component={Schedule.List} />
					<Route path="add" component={Schedule.ListAll} />
				</Route>

				<Route path={url.session}>
					<Route path=":sessionId" component={Session.View} accessLevel={['admin', 'coach']} />
					<Route path=":sessionId/player/:playerId" component={Session.View} accessLevel={['guardian']} />
					<Route path=":sessionId/edit" component={Session.Edit} accessLevel={['admin']} />
				</Route>

				<Route path={url.setting}>
					<IndexRoute component={Setting.Edit} accessLevel={['admin']} />
					<Route path="age-groups" component={Club.AgeGroup} accessLevel={['admin']} />
					<Route path="licence" component={Club.Licence} accessLevel={['admin']} />
				</Route>

				<Route path={url.skill}>
					<IndexRoute component={Skill.List} accessLevel={['admin']} />
					<Route path="add" component={Skill.Add} accessLevel={['admin']} />
					<Route path=":skillId" component={Skill.View} accessLevel={['admin']} />
					<Route path=":skillId/edit" component={Skill.Edit} accessLevel={['admin']} />
				</Route>

				<Route path={url.skillAssessment}>
					<IndexRoute component={SkillAssessment.List} accessLevel={['admin', 'coach']} />
				</Route>

				<Route path={url.statement}>
					<IndexRoute component={Statement.List} />
				</Route>

				<Route path={url.team}>
					<IndexRoute component={Team.List} accessLevel={['admin', 'coach']} />
					<Route path="add-team" component={Team.Add} type="team" accessLevel={['admin']} />
					<Route path="add-skill-group" component={Team.Add} type="skill-group" accessLevel={['admin']} />
					<Route path=":teamId" component={Team.View} accessLevel={['admin', 'coach']} />
					<Route path=":teamId/edit" component={Team.Edit} accessLevel={['admin']} />
					<Route path=":teamId/kits" component={Team.Kits} accessLevel={['admin']} />
					<Route path=":teamId/players" component={Team.Players} accessLevel={['admin']} />
				</Route>

				<Route path={url.kitItem} component={Team.KitAssign} type="team" accessLevel={['admin']} />

				<Route path={url.timetable}>
					<IndexRoute component={Timetable.List} accessLevel={['guardian']} />
				</Route>

				<Route path={url.todo}>
					<IndexRoute component={Todo.List} />
					<Route path="add" component={Todo.Add} />
					<Route path=":todoId" component={Todo.View} />
					<Route path=":todoId/edit" component={Todo.Edit} />
				</Route>

				<Route path={url.tutorial} component={Tutorial.View} />

				<Route path={url.underDev} component={C.UnderDev} />

				<Route path={url.clubPackages} component={Licence.ClubPackages} />


				/** Club route **/
                <Route path={url.club} component={Club.Wrapper}>
                    <IndexRoute component={Club.List} accessLevel={['admin']} />
                    <Route path=":clubId" component={Club.View} accessLevel={['admin']} />
                    <Route path=":clubId/academy-setup" component={Club.AcademySetup} accessLevel={['admin']} />
                    <Route path=":clubId/details" component={Club.Details} accessLevel={['admin']} />
                    <Route path=":clubId/edit-licence" component={Club.Structure} accessLevel={['admin']} />
                    <Route path=":clubId/fc-setup" component={Club.FCSetup} accessLevel={['admin']} />
                    <Route path=":clubId/fc-setup" component={Club.FCSetup} accessLevel={['admin']} />
                    <Route path=":clubId/age-groups" component={Club.AgeGroup} accessLevel={['admin']} />
                    <Route path=":clubId/kits" component={Club.Kit} accessLevel={['admin']} />
                    <Route path=":clubId/setup" component={Club.Setup} accessLevel={['admin']} />
                    <Route path=":clubId/skills" component={Club.Skill} accessLevel={['admin']} />
                    <Route path=":clubId/social" component={Club.SocialLink} accessLevel={['admin']} />

                    <Route path=":clubId/admins">
                        <IndexRoute component={ClubAdmin.List} accessLevel={['admin']} />
                        <Route path="add" component={ClubAdmin.Add} accessLevel={['admin']} />
                        <Route path=":userId/edit" component={ClubAdmin.Edit} accessLevel={['admin']} />
                    </Route>

                    <Route path=":clubId/bank-accounts">contact
                        <IndexRoute component={BankAccount.List} accessLevel={['admin']} />
                        <Route path="add" component={BankAccount.Add} accessLevel={['admin']} />
                        <Route path=":accountId" component={BankAccount.View} accessLevel={['admin']} />
                        <Route path=":accountId/edit" component={BankAccount.Edit} accessLevel={['admin']} />
                    </Route>
                </Route>

			</Route>

			<Route path="*" component={C.NotFound} />

		</Route>
	</Route>
);

export default Routes;
