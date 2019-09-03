import React from 'react';
import PropTypes from 'prop-types';

export default class Block extends React.PureComponent {

	static propTypes = {
		className: PropTypes.string,
		img: PropTypes.string,
		title: PropTypes.string,
	}

	static defaultProps = {
		className: '',
		img: '',
	}

	render() {
		const { className, img, title } = this.props;
		const imgClass = img ? 'has-image' : '';

		return (
			<div className={`block ${imgClass} ${className}`}>
				{title && <h2 className="block-title">{title}</h2>}
				<div className="block-inner">
					{img && <div className="block-image" style={{ backgroundImage: `url(${img})` }} />}
					<div className="block-content-wrapper">
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}

}
