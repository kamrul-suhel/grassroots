import React from 'react';
import { url } from 'app/constants';
import { fn } from 'app/utils';
import { Select, Table } from '@xanda/react-components';
import { Article, Back, ConfirmDialog, Link, Meta, MetaSection, PageTitle } from 'app/components';

export default class View extends React.PureComponent {

	constructor(props) {
		super(props);

		const data = props.registerAccounts;
		const currentPlayer = data.players[`player${data.currentPlayerId}`];
		const currentProgramme = currentPlayer && _.find(currentPlayer.programmes, o => o.programme_id == data.currentProgrammeId);

		this.state = {
			currentPlayer,
			currentProgramme: currentProgramme || {},
			freeTrialDialog: null,
		};
	}

	componentWillMount() {
		if (!this.props.registerAccounts.currentPlayerId) {
			return fn.navigate(url.registerAccounts);
		}
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	freeTrial = () => {

		const sessionList = [];

		this.state.currentProgramme.sessions.map((session) => {
			sessionList.push({
				title: fn.formatDate(session.start_time, 'ddd, Do MMM YYYY [at] HH:mm'),
				id: session.session_id,
			});
		});

		const confirm = () => {
			const { selectedTrialDate } = this.state;

			// return if coach is not selected and programme type is not event
			if (!selectedTrialDate.id) {
				return false;
			}

			this.setState({ freeTrialDialog: null });

			return this.handleRequest(1);
		};

		const cancel = () => this.setState({ freeTrialDialog: null });

		const dialog = (
			<ConfirmDialog
				title=""
				body={
					<React.Fragment>
						<h3>Choose a trial session</h3>
						<Select wide name="selectedTrialDate" options={sessionList} returnFields="all" onChange={this.handleInputChange} />
					</React.Fragment>
				}
				onClose={cancel}
				onConfirm={confirm}
			/>
		);

		this.setState({ freeTrialDialog: dialog });
	}

	bookNow = () => {
		this.handleRequest();
	}

	handleRequest = (isTrial = 0) => {
		const { registerAccounts } = this.props;
		const { selectedTrialDate } = this.state;

		const payload = {
			isTrial,
			numberOfSessions: !isTrial ? this.state.currentProgramme.session_count : 1,
			playerId: registerAccounts.currentPlayerId,
			playerName: `${this.state.currentPlayer.firstName} ${this.state.currentPlayer.lastName}`,
			price2: !isTrial ? this.state.currentProgramme.price2 : 0,
			price2plus: !isTrial ? this.state.currentProgramme.price2plus : 0,
			price: !isTrial ? this.state.currentProgramme.price : 0,
			programmeId: registerAccounts.currentProgrammeId,
			programmeTitle: this.state.currentProgramme.title,
			sessionId: selectedTrialDate && selectedTrialDate.id || null,
			teamId: this.state.currentProgramme.team_id,
			trialDate: selectedTrialDate && selectedTrialDate.title || null,
		};

		this.props.dispatch({ type: 'REGISTERACCOUNTS_ADD_PROGRAMME', payload });
		return fn.navigate(url.registerAccounts);
	}

	render() {
		const { currentProgramme } = this.state;
		const { registerAccounts } = this.props;

		const singlingCount = fn.returnLeft(registerAccounts.siblings, registerAccounts.currentPlayerId);
		const priceBand = fn.getPriceBand(singlingCount.length);
		const totalPrice = fn.formatPrice(currentProgramme[priceBand], false);
		const discount = currentProgramme.price - currentProgramme[priceBand];
		const hideFreeTrial = _.find(registerAccounts.selectedProgrammes, { playerId: registerAccounts.currentPlayerId, isTrial: 1 });

		const tableFooter = [
			<Meta key="noSessions" label="No of sessions" value={currentProgramme.session_count} />,
			discount > 0 && <Meta key="discount" label="Sibling discount" value={fn.formatPrice(discount)} />,
			<Meta key="totalPrice" label="Total" value={totalPrice} />,
			<div key="formActions" className="form-actions">
				{!hideFreeTrial && <span className="button" onClick={() => this.freeTrial()}>Free trial</span>}
				<span className="button" onClick={() => this.bookNow()}>Book now</span>
			</div>,
		];

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value={currentProgramme.title}>
					<Back className="button">Back</Back>
				</PageTitle>

				{this.state.freeTrialDialog}

				<Article>
					<Meta label="Programme" value={currentProgramme.title} />
					<Meta label="Programme type" value={currentProgramme.type} />
					<Meta label="Description" value={currentProgramme.notes} />
				</Article>

				<PageTitle value="Sessions" subTitle />

				<Table
					total={currentProgramme.session_count}
					footer={tableFooter}
					headers={['', 'Venue', 'Coach', 'Time', 'Price']}
					icon="ion-android-calendar"
				>
					{currentProgramme.sessions && currentProgramme.sessions.map(session => (
						<tr key={`session_${session.session_id}`}>
							<td>{fn.formatDate(session.start_time)}</td>
							<td>{session.venue_title}</td>
							<td>{session.coach_name}</td>
							<td>{fn.formatDate(session.start_time, 'HH:mm')} - {fn.formatDate(session.end_time, 'HH:mm')}</td>
							<td>{fn.formatPrice(session.price, true)}</td>
						</tr>
					))}
				</Table>
			</div>
		);
	}

}
