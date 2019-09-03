import React from 'react';
import {connect} from 'react-redux';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import { ContentLoader, Dialog } from '@xanda/react-components';
import { Item, Link, PageDescription, PageTitle} from 'app/components';

@connect((store, ownProps) => {
    return {
        packages: store.pckg,
        licence: store.licence.collection[ownProps.params.licenceId] || {},
    };
})
export default class Change extends React.PureComponent {

    state = {
        confirmErrorMessage: '',
        selectedPackageId: 0,
        selectedPackageTitle: '',
        selectedPackageMaxSlot: '',
        selectedPackagePrice : null,
        disableClass: false
    }

    componentWillMount() {
        this.props.dispatch(fetchData({
            type: 'PACKAGE',
            url: '/packages',
        }));

        this.props.dispatch(fetchData({
            type: 'LICENCE',
            url: '/franchises/packages',
        }));
    }

    onUpdateLicence = async () => {
        // Check selected package max slot greater then current package
        if (this.props.licence.player_no > this.state.selectedPackageMaxSlot) {
            return;
        }

        let formData = new FormData();
        formData.append('package_id', this.state.selectedPackageId);

        const response = await api.update(`/clubs/${this.props.params.licenceId}/update-package`, formData);

        if (!api.error(response, false)) {
            this.refDialog.close();
            fn.navigate(url.licence);
        }
    }

    // Dialog box functions
    onChangeHandelerDialog = (pckg) => {
        // Check if package max slot greater then current slot.
        if (pckg.player_no > this.props.licence.player_no) {
            this.setState({
                disableClass: true
            })
        } else {
            this.setState({
                disableClass: false
            })
        }

        this.setState({
            selectedPackageId: pckg.id,
            selectedPackageTitle: pckg.title,
            selectedPackageMaxSlot: pckg.max_slot,
            selectedPackagePrice : pckg.price
        });

        this.refDialog.open();
    }

    cancelDialog = () => {
        this.refDialog.close();
    }

    onChangeDeleteHandler = () => {

    }

    render() {
        const {
            licence,
            packages,
        } = this.props;

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Change Package"/>
                <PageDescription>
                    Select a package that better suits your club requirements.
                    All current data and passwords for everyone will automatically transfer across to your new package.
                    Only the maximum number of players allowed and monthly fee will change.
                </PageDescription>

                <ContentLoader
                    data={packages.currentCollection}
                    isLoading={packages.isLoading}
                    notFound="No packages"
                >
                    <div className="grid">
                        {_.map(packages.currentCollection, (pckgId) => {
                            const pckg = packages.collection[pckgId];
                            const isCurrentPackage = licence.package_id === pckg.id;
                            const activatedClass = isCurrentPackage ? 'is-activated' : '';
                            const content = (
                                <div>
                                    <div className="player-wrapper">
                                        <span className="upto">up to</span>
                                        <span className="max_no">{pckg.max_slot}</span>
                                        <span className="players">players</span>
                                    </div>
                                    <div className="package-description">
                                        {pckg.description}
                                    </div>
                                    <div className="price">{fn.formatPrice(pckg.price)} per month</div>
                                    <div><span className="includes-vat">(price includes VAT)</span></div>
                                    <div className="form-actions">
                                        {isCurrentPackage ? (
                                            <div className="current-package align-center"
                                                  style={{width: '100%'}}>Current package</div>
                                        ) : (
                                            <React.Fragment>
                                                <button
                                                    onClick={() => this.onChangeHandelerDialog(pckg)}
                                                    className="button">Choose package
                                                </button>
                                            </React.Fragment>
                                        )}
                                    </div>
                                </div>
                            );

                            return (
                                <Item
                                    background={pckg.pic}
                                    backgroundOverlay
                                    content={content}
                                    icon={<i className="ion-pricetag"/>}
                                    itemClass={`item-licence ${activatedClass}`}
                                    key={`package${pckg.id}`}
                                    title={pckg.title}
                                    wrapperClass="grid-xs-12 grid-s-6 grid-m-6 grid-md-6 grid-4"
                                    itemWrapperClass="bg-gray"
                                />
                            );
                        })}
                    </div>
                </ContentLoader>


                <div className="page-bottom-actions">
                    <Link to={`${url.licence}`} className="button">Back</Link>
                    <Link to={`${url.licence}`} className="button">Done</Link>
                </div>

                <Dialog
                    showCloseButton={false}
                    buttons={[
                        <div key="buttons">
                            <button className="button"
                                    onClick={this.cancelDialog}
                            >Cancel
                            </button>

                            <button className={"button hover-blue" + (this.state.disableClass ? "disabled" : '')}
                                    onClick={() => this.onUpdateLicence()}
                            >Change Package
                            </button>
                        </div>
                    ]}
                    ref={ref => this.refDialog = ref}
                    content={
                        <div className="dialog-body-inner">
                            <div className={"dialog-left-sidebar"}>
                                <img src={'/images/ball-soccer.png'}/>
                            </div>
                            <div className={"dialog-right-side"}>
                                <h3>Change Package</h3>
                                <div className={"change-package-content"}>
                                    <div>
                                        <h4>Current Package</h4>
                                        <p>Package name : {licence.package}</p>
                                        <p>Max players: {licence.max_slot}</p>
                                        <p>Monthly fee: £{licence.amount}</p>
                                    </div>

                                    <div>
                                        <h4>New Package</h4>
                                        <p>Package name : {this.state.selectedPackageTitle}</p>
                                        <p>Max players: {this.state.selectedPackageMaxSlot}</p>
                                        <p>Monthly fee: £{this.state.selectedPackagePrice}</p>
                                    </div>
                                </div>
                                {this.state.disableClass ? <p className="text-danger">Sorry you cannot change this package.</p> : ''}
                                <p>You have {licence.player_no} active players in your current package. please confirm you would like to change?</p>
                                <span className="text-danger">{this.state.confirmErrorMessage}</span>
                            </div>
                        </div>
                    }
                >
                    <span className="button hidden">Cancel Package</span>
                </Dialog>
            </div>
        );
    }

}
