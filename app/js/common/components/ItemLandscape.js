import React from 'react';
import PropTypes from 'prop-types';
import { Link } from './';

export default class ItemLandscape extends React.PureComponent {

	static propTypes = {
		actions: PropTypes.oneOfType([
			PropTypes.array,
			PropTypes.element,
		]),
		background: PropTypes.string,
		content: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.string,
		]),
		icon: PropTypes.string,
		itemClass: PropTypes.string,
		title: PropTypes.string,
	}

	static defaultProps = {
		background: 'http://f.jwwb.nl/public/2/2/0/bibi-gedichten/11899994_849687378417793_4465132990483196566_n.jpg',
		className: '',
	}

	render() {
		const { actions, background, content, icon, itemClass, title } = this.props;

		return (
			<div className={`item item-landscape ${itemClass}`}>
				<div className="item-bg-wrapper has-triangle">
					{icon && <div className="triangle-overlay"><i className={icon} /></div>}
					{background && <div className="item-bg" style={{ backgroundImage: `url(${background})` }} />}
				</div>
				<div className="item-content-wrapper">
					{title && <h2 className="item-title">{title}</h2>}
					{content && <p className="item-content">{content}</p>}
				</div>
				<div className="item-actions">
					{actions}
				</div>
			</div>
		);
	}

}
