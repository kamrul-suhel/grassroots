import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router";

export default class PageTitle extends React.PureComponent {

    static propTypes = {
        subTitle: PropTypes.bool,
        value: PropTypes.string,
        faq: PropTypes.bool,
        faqLink: PropTypes.string
    }

    static defaultProps = {
        subTitle: false,
        value: '',
        faq: false,
        faqLink: ''
    }

    render() {
        const {
            subTitle,
            value,
            children,
            faq,
            faqLink,
            subHeading,
            img
        } = this.props

        if (subTitle) {
            return (
                <React.Fragment>
                    <h2 className="page-sub-title">{value}</h2>
                    {subHeading && <h3 className="sub-heading">{subHeading}</h3>}
                </React.Fragment>
            )
        }

        return (
            <div className="page-header">
                <div className="page-title">
                    {img && !_.isEmpty(img) &&
                        <div className="page-title-img"
                             style={{backgroundImage:`url(${img})`}}>
                        </div>
                    }
                    <h1>{value}</h1>
                    {faq ? <div className="faq-link">
                        <Link to={faqLink}>
                            <i className="ion-help"/>
                        </Link>
                    </div> : null}
                    {subHeading && <h3 className="sub-heading">{subHeading}</h3>}
                </div>

                <div className="page-actions">
                    {children}
                </div>
            </div>
        );
    }
}
