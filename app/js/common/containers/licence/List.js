import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Radio, TextInput, Dialog, Tooltip} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ButtonStandard, ConfirmDialog, Item, Link, PageDescription, PageTitle} from 'app/components';
import {allComplete} from 'app/containers/club/functions';

@connect((store, ownProps) => {
    return {
        licences: store.licence,
    };
})
export default class List extends React.PureComponent {

    constructor() {
        super();
        this.state = {
            filters: null,
            currentPage: 1,
            confirmDelete: '',
            confirmDeleteId: null,
            confirmErrorMessage: '',
            confirmError: false,
            logOutSlug: null,
            loginClubName:'',
            selectedPackage: {}
        };
    }

    onChangeDeleteHandler = (key, value) => {
        this.setState({
            confirmDelete: value
        })
    }

    onOpenDialogHandler = (licence) => {
        this.setState({
            confirmDeleteId: licence.id,
            selectedPackage: {...licence}
        });
        this.refDialog.open();
    }

    cancelLicence = () => {
        const deleteString = this.state.confirmDelete.toLowerCase();

        if (deleteString === 'cancel package') {
            this.setState({
                confirmError: true,
            });
        }
    }

    confirmCancelLicence = async () => {
        const deleteString = this.state.confirmDelete.toLowerCase();
        if (deleteString === 'cancel package' && this.state.confirmError) {
            const response = await api.update(`/clubs/${this.state.confirmDeleteId}/package-action?status=0`);
            if (!api.error(response, false)) {
                this.refDialog.close();
                this.fetchData();

                this.setState({
                    confirmDelete: '',
                    confirmDeleteId: null,
                    confirmErrorMessage: ''
                });
            } else {
                this.setState({
                    confirmErrorMessage: response.data
                });
            }
        }
    }

    closeDialogbox = () => {
        this.setState({
            confirmErrorMessage: '',
            confirmError: false
        });
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData = (currentPage = 1, newFilters) => {
        this.setState({
            currentPage,
            filters: newFilters || this.state.filters,
        });
        const filters = newFilters === undefined ? this.state.filters : newFilters;

        this.props.dispatch(fetchData({
            type: 'LICENCE',
            url: `/franchises/packages?page=${currentPage}&${filters}&status=1`,
            page: currentPage,
        }));
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    loginToClub = (slug, clubName = null) => {
        this.setState({
            logOutSlug: slug,
            loginClubName: clubName
        });

        this.refLogOut.open();
    }

    closeLogOutDialogbox = () => {
        this.setState({
            logOutSlug: '',
            loginClubName: ''
        });
    }

    confirmLogOut = () => {
        this.refLogOut.close();
        fn.logOut();
        fn.navigate(`${this.state.logOutSlug}/login`);
    }

    isComplete = (club) => {

    }

    render() {
        const {licences} = this.props;
        const {currentPage, selectedPackage} = this.state;

        return (
            <div id="content" className="site-content-inner licence-list-page">
                <PageTitle value="Purchased Packages"
                           faq={true}
                           faqLink={fn.getFaqLink('saPurchasedPackage')}/>

                <PageDescription>Below are your purchased packages, you need to set up a package to your requirements
                    before you can begin to use it. You can also change a package to another package (within limits) and
                    you can also choose to cancel a package.</PageDescription>
                <div>
                    <p>Total Monthly Fee for all Packages<span className="price">{` £${licences.total} includes VAT`}</span></p>
                </div>
                <ContentLoader
                    filter={{
                        filters: licences && licences.filters,
                        onUpdate: this.fetchData,
                    }}
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchData,
                        total: licences.count,
                    }}
                    data={licences.currentCollection}
                    forceRefresh
                    isLoading={licences.isLoading}
                    notFound="No packages found"
                >
                    <div className="grid">
                        {_.map(licences.currentCollection, (id, id2) => {
                            const licence = licences.collection[id];
                            const isActivated = licence.club_id !== 0;
                            const linkTo = isActivated ? () => this.loginToClub(licence.slug, licence.club_name) : `clubs/${licence.club_id}/setup?licenceId=${licence.id}`;
                            const activatedClass = isActivated ? 'is-activated' : '';
                            const title = isActivated ? licence.club_name : 'Setup';
                            const link = isActivated ? `${url.club}/${licence.club_id}/setup?licenceId=${licence.id}` : `${url.club}/${licence.club_id}/setup?licenceId=${licence.id}`;
                            const icon = isActivated ?
                                <div className="icon">
                                    <span className="count">{licence.player_no}</span>
                                    <span className="title">active players</span>
                                </div> :
                                <div className="icon">
                                    <span className="count">
                                        <i className="ion-pricetag" menutitle="Account Details"></i>
                                    </span>
                                </div>;

                            const setupText = isActivated ?
                                <Tooltip icon={<span className="ion-ios-cog"/>} message="Setup Package"/>
                                : <Tooltip icon={<span className="ion-ios-cog"/>} message="Setup Package"/>;

                            const content = (
                                <div>
                                    <span className="license-type">{licence.package}</span>

                                    <div className="player-wrapper">
                                        <span className="upto">up to</span>
                                        <span className="max_no">{licence.max_slot}</span>
                                        <span className="players">players</span>
                                    </div>

                                    <div className="package-description">{licence.description}</div>

                                    <div>
                                        <span className="price">{`£${licence.amount} per month`}</span>
                                        <div className="includes-vat">
                                            (price includes VAT)
                                        </div>
                                    </div>

                                    <div className="form-actions ion-button">
                                        <Link
                                            to={link}>
                                            {(licence.completed_status === 3 ?
                                                <Tooltip icon={<span className="ion-ios-cog"/>}
                                                         message="Edit"/> : setupText)}
                                        </Link>

                                        <Link
                                            to={`${url.licence}/${licence.id}/change`}
                                            className="text-gold">
                                            <Tooltip icon={<span className="ion-pricetag"/>} message="Change Package"/>
                                        </Link>

                                        <span className='text-danger' onClick={() => this.onOpenDialogHandler(licence)}>
                                            <Tooltip icon={<span className="ion-android-cancel"/>}
                                                     message="Cancel Package"/>
                                        </span>

                                        {isActivated &&
                                        <span className="text-green"
                                              onClick={() => this.loginToClub(licence.slug, licence.club_name)}>
                                            <Tooltip icon={<span className="ion-log-in"/>} message="Log In To Club System"/>
                                        </span>}
                                    </div>
                                </div>
                            );

                            return (
                                <Item
                                    background={licence.pic}
                                    backgroundOverlay
                                    content={content}
                                    icon={icon}
                                    isactive={isActivated}
                                    isComplete={licence.completed_status}
                                    itemClass={`item-licence ${activatedClass}`}
                                    key={`licence${licence.id}`}
                                    linkTo={linkTo}
                                    title={title}
                                    wrapperClass="grid-4 grid-m-6 grid-s-6 grid-xs-12"
                                    itemWrapperClass={isActivated ? `bg-color` : `bg-gray`}
                                />
                            );
                        })}
                    </div>
                </ContentLoader>

                <Dialog
                    className="package-name"
                    title=""
                    showCloseButton={false}
                    buttons={[
                        <button
                            key="cancel"
                            className="button"
                        >Go Back</button>,
                        <button
                            key="submit"
                            className="button hover-blue"
                            onClick={() => this.state.confirmError ? this.confirmCancelLicence() : this.cancelLicence()}
                        >Cancel Package</button>
                    ]}
                    ref={ref => this.refDialog = ref}

                    onClose={this.closeDialogbox}

                    content={
                        <div className="dialog-body-inner">
                            <div className={"dialog-left-sidebar"}>
                                <img src={'/images/ball-soccer.png'}/>
                            </div>
                            <div className={"dialog-right-side"}>
                                <h3>{`Cancel ${selectedPackage.club_name ? fn.slugToReadableString(selectedPackage.club_name) : selectedPackage.package + ' package'}`}</h3>
                                <TextInput
                                    className="input-small"
                                    label="Type “CANCEL PACKAGE” to confirm you are happy to cancel this package."
                                    onChange={this.onChangeDeleteHandler}/>
                                {this.state.confirmError ?
                                    <span className="text-danger">Are you sure you want to cancel this package? This package is about to be cancelled and all data will be lost and cannot be recovered. <br/>Click CANCEL PACKAGE to proceed.</span> : ''}
                            </div>
                        </div>
                    }
                >
                    <span className="button hidden">Cancel Package</span>
                </Dialog>

                <Dialog
                    showCloseButton={false}
                    title=""
                    buttons={[
                        <button
                            key="cancel"
                            className="button"
                            onClick={() => this.closeLogOutDialogbox() }
                        >Go Back</button>,
                        <button
                            key="submit"
                            className="button hover-blue"
                            onClick={() => this.confirmLogOut() }
                        >Log In</button>

                    ]}
                    ref={ref => this.refLogOut = ref}
                    onClose={this.closeLogOutDialogbox}
                    content={
                        <div className="dialog-body-inner">
                            <div className={"dialog-left-sidebar"}>
                                <img src={'/images/ball-soccer.png'}/>
                            </div>
                            <div className={"dialog-right-side"}>
                                <h3>{`LOGIN ${this.state.loginClubName}`}</h3>
                                <span className="">
                                    You will be logged out as a Super Admin and directed to the Club Admin terminal login page for {this.state.loginClubName}.
                                </span>
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
