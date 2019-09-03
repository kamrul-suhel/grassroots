import React from 'react';
import PropTypes from 'prop-types';
import { Link } from './';

export default class Badge extends React.PureComponent {

	static propTypes = {
		className: PropTypes.string,
		img: PropTypes.string,
		link: PropTypes.string,
		title: PropTypes.string,
	}

	static defaultProps = {
		className: '',
		link: '',
	}

	render() {
		const { className, img, link, title, defaultImg } = this.props;
		const Element = link ? Link : 'div';

		const backgroundImg = defaultImg && !img ? '/images/ball-soccer.png' : img

		return (
			<Element className={`badge ${className}`} to={link}>
				<div className="badge-icon" style={{ backgroundImage: `url(${backgroundImg})` }} />
				<span className="badge-title">{title}</span>
			</Element>
		);
	}

}
