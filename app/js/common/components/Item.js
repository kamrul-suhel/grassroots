import React from 'react';
import PropTypes from 'prop-types';
import {Link} from '.';

export default class Item extends React.PureComponent {

    static propTypes = {
        background: PropTypes.string,
        backgroundOverlay: PropTypes.bool,
        content: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.string,
        ]),
        icon: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.object,
            PropTypes.string,
        ]),
        itemClass: PropTypes.string,
        link: PropTypes.string,
        linkTo: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func
        ]),
        title: PropTypes.string,
        wrapperClass: PropTypes.string,
    }

    static defaultProps = {
        background: '',
        className: '',
        onClick: null,
    }

    render() {
        const {background, backgroundOverlay, content, icon, isComplete, itemClass, onClick, link, linkTo, title, wrapperClass, itemWrapperClass} = this.props;
        const ItemTag = link ? Link : 'div';
        const backgroundOverlayClass = backgroundOverlay ? 'overlay' : '';

        return (
            <div className={wrapperClass}>
                <ItemTag className={`item item-portrait ${itemClass}`} to={link || ''} onClick={onClick}>
                    {typeof linkTo != 'function' ? <Link to={linkTo}>
                            <div className={`item-bg-wrapper ${itemWrapperClass}`}>
                                {title && <h2 className="item-title">{title}</h2>}
                                <div className="item-circle"/>
                                {<div className="triangle-overlay">{icon && icon}</div>}
                                {background && <div className={`item-bg ${backgroundOverlayClass}`}
                                                    style={{backgroundImage: `url(${background})`}}/>}
                            </div>
                        </Link> :
                        <div className={`item-bg-wrapper link-effect ${itemWrapperClass}`} onClick={linkTo}>
                            {title && <h2 className="item-title">{title}</h2>}}
                            <div className="item-circle"/>
                            {<div className="triangle-overlay">{icon && icon}</div>}
                            {background && <div className={`item-bg ${backgroundOverlayClass}`}
                                                style={{backgroundImage: `url(${background})`}}/>}
                        </div>}
                    {content && <div className="item-content-wrapper">{content}</div>}
                </ItemTag>
            </div>
        );
    }

}
