import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import address from './address';
import alert from './alert';
import assessmentTemplate from './assessmentTemplate';
import account from './account';
import attendance from './attendance';
import authClub from './authClub';
import availability from './availability';
import bankAccount from './bankAccount';
import club from './club';
import clubAdmin from './clubAdmin';
import clubSetup from './clubSetup';
import coach from './coach';
import coachAssessment from './coachAssessment';
import consent from './consent';
import download from './download';
import event from './event';
import faq from './faq';
import feedback from './feedback';
import fixture from './fixture';
import franchise from './franchise';
import guardian from './guardian';
import homework from './homework';
import invoice from './invoice';
import kid from './kid';
import kit from './kit';
import licence from './licence';
import me from './me';
import myClub from './myClub';
import myClubLicence from './myClubLicence';
import notification from './notification';
import page from './page';
import pckg from './package';
import player from './player';
import programme from './programme';
import registerAccounts from './registerAccounts';
import registerFranchise from './registerFranchise';
import request from './request';
import schedule from './schedule';
import session from './session';
import skill from './skill';
import skillAssessment from './skillAssessment';
import statement from './statement';
import team from './team';
import timetable from './timetable';
import todo from './todo';
import topic from './topic';
import transaction from './transaction';
import user from './user';
import ageGroup from './ageGroup'
import snackBarMessage from './snackBarMessage'

const appReducer = combineReducers({
	account,
	address,
	alert,
	assessmentTemplate,
	attendance,
	authClub,
	availability,
	bankAccount,
	club,
	clubAdmin,
	clubSetup,
	coach,
	coachAssessment,
	consent,
	download,
	event,
	faq,
	feedback,
	fixture,
	franchise,
	guardian,
	homework,
	invoice,
	kid,
	kit,
	licence,
	me,
	myClub,
	myClubLicence,
	notification,
	page,
	pckg,
	player,
	programme,
	registerAccounts,
	registerFranchise,
	request,
	schedule,
	session,
	skill,
	skillAssessment,
	statement,
	team,
	timetable,
	todo,
	topic,
	transaction,
	user,
    snackBarMessage,
	ageGroup,
	routing: routerReducer,
});

const rootReducer = (state, action) => {
	if (action.type === 'USER_LOGOUT') {
		state = undefined;
	}

	if (_.includes(action.type, '_CLEAR')) {
		const type = action.payload || action.type.replace('_CLEAR', '').toLowerCase();
		state[type] = undefined;
	}

	return appReducer(state, action);
};

export default rootReducer;
