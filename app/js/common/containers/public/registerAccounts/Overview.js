import React from 'react';
import { fn } from 'app/utils';
import { url } from 'app/constants';
import { Link, Meta } from 'app/components';
import moment from 'moment';

export default class Overview extends React.PureComponent {

	removeProgramme = (programmeKey) => {
		this.props.dispatch({
			type: 'REGISTERACCOUNTS_REMOVE_PROGRAMME',
			payload: programmeKey,
		});
	}

	proceedToPayment = () => {
		window.dispatchEvent(new Event('formSubmission.registerAccounts'));
	}

	render() {
		const { registerAccounts } = this.props;
		const showOverview = _.size(registerAccounts.selectedProgrammes) > 0 ? 'is-visible' : '';
		const registerAccountStep = this.props.location.pathname.indexOf('register-account') !== -1;
		let totalPrice = 0;

		return (
			<div className="overview">
				<div className={`overview-inner ${showOverview}`}>
					<div className="overview-top">
						<h2 className="overview-title">You’re buying</h2>

						{_.map(registerAccounts.selectedProgrammes, (programme, key) => {
							const isTrial = programme.isTrial ? `(Trial on ${programme.trialDate})` : `(${programme.numberOfSessions} sessions)`;
							// gets the price based on the price band
							const discount = fn.returnLeft(registerAccounts.siblings, programme.playerId);
							const priceBand = fn.getPriceBand(discount.length);
							// if a trial session then price is 0
							const price = !programme.isTrial ? programme[priceBand] : 0;
							totalPrice += parseFloat(price);

							return (
								<div key={`overview${key}`} className="item item-overview">
									<div className="item-inner">
										<p className="item-title">{programme.programmeTitle} {isTrial}</p>
										<span className="player"><i className="ion-person" />{programme.playerName}</span>
									</div>
									<span className="select-qty">
										<select name="qty">
											<option value="0">0</option>
											<option value="1">1</option>
											<option value="2">2</option>
											<option value="3">3</option>
											<option value="4">4</option>
										</select>
									</span>

									<span className="price">
										{fn.formatPrice(price, true)}
										<span className="delete" onClick={() => this.removeProgramme(key)}><i className="ion-android-close" /></span>
									</span>
								</div>
							);
						})}
					</div>
					<div className="overview-bottom">
						<Meta separator="" label="Total" value={fn.formatPrice(totalPrice, true)} />
						<h5>First month is a free trial.</h5>
						<h5>Payments will start: {moment().add(1, 'months').format("Do MMM YYYY")}</h5>
						<div className="form-actions">
							{!registerAccountStep ? (
								<Link to={`${url.registerAccounts}/register-account`} className="button">Proceed</Link>
							) : (
								<span className="button" onClick={this.proceedToPayment}>Proceed to payment</span>
							)}
						</div>
					</div>

				</div>
			</div>
		);
	}

}
