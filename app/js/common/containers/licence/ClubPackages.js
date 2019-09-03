import React from 'react';
import { connect } from 'react-redux';
import { fn } from 'app/utils';
import {Item, PageTitle} from 'app/components';

@connect((store) => {
    return {
        licences: store.licence,
        packages: store.pckg
    }
})

export default class ClubPackages extends React.PureComponent {
    constructor(props) {
        super(props)

    }

    render() {
        const { params } = this.props;
        const packages  = this.props.myClub.data.packages

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Package"
                           faq={true}
                           faqLink={fn.getFaqLink(`caPackage`, `/${params.clubSlug}/`)}/>

                    <div className="grid">
                        {_.map(packages, (pckg) => {
                            const content = (
                                <div>
                                    <div className="player-wrapper">
                                        <span className="upto">package includes up to</span>
                                        <span className="max_no">{pckg.max_slot}</span>
                                        <span className="players">players</span>
                                    </div>
                                    <div>
                                        <p className="package-description">{pckg.description}</p>
                                    </div>
                                    <div className="price">{fn.formatPrice(pckg.price)} per month</div>
                                    <span className="includes-vat">(price includes VAT)</span>
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
                                    wrapperClass="grid-4 grid-m-6 grid-s-6 grid-xs-12"
                                    itemWrapperClass={`bg-color`}
                                />
                            );
                        })}
                    </div>
            </div>
        )
    }
}