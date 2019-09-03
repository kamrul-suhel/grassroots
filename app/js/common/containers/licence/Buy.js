import React from 'react';
import {connect} from 'react-redux';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ContentLoader, Form, TextInput} from '@xanda/react-components';
import {ButtonStandard, ConfirmDialog, Item, Link, PageDescription, PageTitle} from 'app/components';

@connect((store, ownProps) => {
    return {
        packages: store.pckg,
        licence: store.licence
    };
})
export default class Buy extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            quantity: 0
        }

        this.refForm = {};
        this.refDialog = {};
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData = () => {
        this.props.dispatch(fetchData({
            type: 'PACKAGE',
            url: '/packages',
        }));

        // find out how many package this user brought
        this.props.dispatch(fetchData({
            type: 'LICENCE',
            url: `/franchises/packages?status=1`
        }));
    }

    handleInputChange = (name, value) => this.setState({[name]: value});

    buyPackage = async (packageId) => {
        const formData = new FormData();
        formData.append('package_id', packageId);
        formData.append('quantity', this.state.quantity);

        const response = await api.post('/franchises/buy-package', formData);

        if (!api.error(response)) {
            this.refDialog[packageId] && this.refDialog[packageId].close();
            fn.navigate('licences');
        } else {
            this.refForm[packageId] && this.refForm[packageId].hideLoader();
        }
    }

    render() {
        const {packages, licence} = this.props;
        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Buy New Package"
                           faq={true}
                           faqLink={fn.getFaqLink('saNewPackage')}/>

                <PageDescription>Below you can choose to buy a new package in addition to the package/s you’ve bought,
                    this is typically for clubs with multiple locations and soccer school franchises. The monthly fee
                    for a new package purchased will automatically be set up with your existing payment account. If you
                    wish to change or cancel a package you’ve already purchased this can be done in the Purchased
                    Packages section.</PageDescription>

                <ContentLoader
                    data={packages.currentCollection}
                    isLoading={packages.isLoading}
                    notFound="No packages"
                >
                    <div className="grid">
                        {_.map(packages.currentCollection, (packageId) => {
                            const pckg = packages.collection[packageId];
                            const dialogBody = (
                                <Form loader onSubmit={() => this.buyPackage(pckg.id)}
                                      ref={ref => this.refForm[packageId] = ref}>
                                    <TextInput
                                        type="number"
                                        min="1"
                                        className="input-small"
                                        label="How many new packages do you want to buy?"
                                        name="quantity"
                                        onChange={this.handleInputChange}
                                        validation="required|integer|min:1"
                                        value={1}
                                        wide
                                    />
                                    <p className="text-bold">Current monthly fee: <span
                                        className="price">{fn.formatPrice(licence.total && licence.total)}</span>
                                    </p>
                                    <p className="text-bold">New monthly fee: <span
                                        className="price">{fn.formatPrice(parseFloat(licence.total) + (pckg.price && parseFloat(pckg.price) * (this.state.quantity && parseFloat(this.state.quantity))))}</span>
                                    </p>
                                </Form>
                            );

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
                                    <div className="price">{fn.formatPrice(pckg.price)} per month
                                        <br/>
                                        <span className="includes-vat">(price includes VAT)</span>
                                    </div>
                                    <div className="form-actions">
                                        <ConfirmDialog
                                            className="package-name"
                                            showCloseButton={false}
                                            ref={ref => this.refDialog[packageId] = ref}
                                            body={
                                                <div className={"dialog-right-side"}>
                                                    <h3>BUY NEW PACKAGE</h3>
                                                    <div className={"buy-new-package-top"}>
                                                        <p>Package name: {`${pckg.title && pckg.title}`}</p>
                                                        <p>Max player: {pckg.max_slot}</p>
                                                    </div>
                                                    {dialogBody}
                                                </div>
                                            }
                                            title=""
                                            actions={[
                                                <button key="cancel" className="button">Cancel</button>,
                                                <button key="confirm" className="button hover-blue"
                                                        onClick={() => this.refForm[packageId].submit()}>Buy
                                                    Package</button>,
                                            ]}
                                        >
                                            <span className="button">Buy package</span>
                                        </ConfirmDialog>
                                    </div>
                                </div>
                            );

                            return (
                                <Item
                                    background={pckg.pic}
                                    backgroundOverlay
                                    content={content}
                                    icon={<i className="ion-pricetag"/>}
                                    itemClass="item-licence"
                                    key={`package${pckg.id}`}
                                    title={pckg.title}
                                    wrapperClass="grid-xs-12 grid-s-6 grid-m-6 grid-md-6 grid-4"
                                    itemWrapperClass={`bg-gray`}
                                />
                            );
                        })}
                    </div>
                </ContentLoader>

                <div className="page-bottom-actions">
                </div>

            </div>
        );
    }

}
