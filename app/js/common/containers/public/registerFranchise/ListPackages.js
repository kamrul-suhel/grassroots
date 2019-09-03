import React from 'react';
import {connect} from 'react-redux';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ContentLoader} from '@xanda/react-components';
import {Article, Block, Item, Link, Loader, Meta, PageDescription, PageTitle, SiteFooter} from 'app/components';

@connect((store, ownProps) => {
    return {
        packages: store.pckg,
    };
})
export default class ListPackages extends React.PureComponent {

    componentWillMount() {
        this.fetchData();
    }

    fetchData = () => {
        this.props.dispatch(fetchData({
            type: 'PACKAGE',
            url: '/packages',
        }));
    }

    addToBasket = async pckg => {
        let packages = _.find(this.props.registerFranchise.packages, pckg);

        if (packages) {
            pckg.qty = parseInt(packages.qty) + 1;
        } else {
            pckg.qty = 1
        }

        this.props.dispatch({type: 'REGISTERFRANCHISE_ADDTOBASKET', payload: pckg})
    }

    render() {
        const {packages, registerFranchise} = this.props;
        const playerCount = '';

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Packages"/>
                <PageDescription>
                    All packages are priced based on the number of players you have in your club (an unlimited number of admins, parents and coaches may use the system for free).  All prices are based on a rolling monthly contract that you can cancel at anytime. A small transaction fee of 1.25% is charged if you choose to collect money from parents by using our direct debit payment collection system or our instant payment collection system. The transaction fee can be paid by your club or passed onto the the parent, the choice is yours when you set up your package.
                </PageDescription>

                <ContentLoader
                    data={packages.currentCollection}
                    isLoading={packages.isLoading}
                    notFound="No packages"
                >
                    <div className="grid">
                        {_.map(packages.currentCollection, (pckgId) => {
                            const pckg = packages.collection[pckgId];
                            const packageAdded = _.find(registerFranchise.packages, addedPackage => addedPackage.id === pckg.id);
                            const buttonText = packageAdded ? 'Add another' : 'Add to basket';
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
                                    <div className="form-actions align-center">
                                        <span className="price">{fn.formatPrice(pckg.price)} per month
                                            <div className="includes-vat">
                                                (price includes VAT)
                                            </div>
                                        </span>
                                        <span className="button wide"
                                              onClick={() => this.addToBasket(pckg)}>{buttonText}</span>
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
                                    wrapperClass="grid-s-12 grid-m-6 grid-md-6 grid-6"
                                    itemWrapperClass="bg-gray"
                                />
                            );
                        })}
                    </div>
                </ContentLoader>
                <SiteFooter/>
            </div>
        );
    }

}
