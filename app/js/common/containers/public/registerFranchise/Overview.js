import React from 'react';
import { connect } from 'react-redux';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { Select} from '@xanda/react-components';
import { Alert, Link, Meta, SiteHeader } from 'app/components';

export default class Overview extends React.PureComponent {

	removePackage = (packageId) => {
		this.props.dispatch({
			type: 'REGISTERFRANCHISE_REMOVE_PACKAGE',
			payload: packageId,
		});
	}

    onQtyChangeHandle = (key, value, pckg) => {
		pckg.qty = value

		// Remove package if selected value = 0
		if(key === 'qty' && value === 0){
			this.removePackage(pckg.id);
			return
		}

		this.props.dispatch({
			type:'REGISTERFRANCHISE_UPDATE_PACKAGE',
			payload: pckg
		})
	};


	proceedToPayment = () => {
		window.dispatchEvent(new Event('formSubmission.registerFranchise'));
	}

	render() {
		// generate quantity options.
        let qtyField = [];

        _.times(10, (item) => {
            const obj = {
                id: item,
                title: `${item}`
            }
            qtyField.push(obj)
		})


		const { registerFranchise } = this.props;
		const showOverview = _.size(registerFranchise.packages) > 0 ? 'is-visible' : '';
		const registerAccountStep = this.props.location.pathname.indexOf('register-account') !== -1;
		let totalPrice = 0;

		return (
			<div className="overview">
				<div className={`overview-inner ${showOverview}`}>
					<div className="overview-top">
						<h2 className="overview-title">You’re buying</h2>

						{_.map(registerFranchise.packages, (pckg) => {
							const count = pckg.qty > 1 ? `${pckg.qty} x ` : '';
							const price = pckg.price * pckg.qty;
							totalPrice += parseFloat(price);

							return (
								<div key={`overview${pckg.id}`}>
									<div className="item item-overview">
                                        <div className="item-inner">
                                            <p className="item-title">{count}{pckg.title} package</p>
                                            <p className="item-players">up to {pckg.max_slot} player{pckg.max_slot === 1 ? '' : 's'}</p>
                                        </div>
                                        <div className="price">
											{fn.formatPrice(price)} per month
											{/*<span className="delete" onClick={() => this.removePackage(pckg.id)}><i className="ion-android-close" /></span>*/}
										</div>
									</div>

									<div className="qty-section">
										<Select
											placeholder="Select an option"
											name="qty"
											label="Quantity"
											options={qtyField}
											value={pckg.qty}
											onChange={(key, value) => this.onQtyChangeHandle(key, value, pckg)}
										/>
									</div>
								</div>
							);
						})}
					</div>
					<div className="overview-bottom">
						<Meta separator="" label="Subtotal ( excl. VAT )"
							  value={`${fn.formatPrice(totalPrice / 1.2)} per month`} />

						<Meta separator="" label="VAT ( 20% )"
							  value={`${fn.formatPrice(totalPrice - (totalPrice / 1.2))} per month`} />

						<Meta separator=""
							  label="Monthly price ( incl. VAT )"
							  value={`${fn.formatPrice(totalPrice)} per month`} />
						<div className="form-actions">
							{!registerAccountStep &&
								<Link to={`${url.registerFranchise}/register-account`} className="button hover-blue">Proceed</Link>
							}
						</div>
					</div>

				</div>
			</div>
		);
	}

}
