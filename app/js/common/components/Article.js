import React from 'react';
import PropTypes from 'prop-types';

export default class Article extends React.PureComponent {

	static propTypes = {
		bg: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.string,
		]),
		backgroundOnLeft: PropTypes.bool,
		className: PropTypes.string,
		img: PropTypes.string,
	}

	static defaultProps = {
		bg: '',
		backgroundOnLeft: false,
		img: '',
		className: '',
	}

	render() {
		const { bg, backgroundOnLeft, className, img } = this.props;
		const backgroundOnLeftClass = backgroundOnLeft ? 'on-left' : '';

		return (
			<article className={`article ${className}`}>
				<div className="content-wrapper">
					{this.props.children}
				</div>
				{(bg || img) &&
					<div className={`bg-wrapper ${backgroundOnLeftClass}`}>
						{bg && _.isString(bg) && <div className="bg" style={{ backgroundImage: `url(${bg})` }} />}
						{bg && !_.isString(bg) && <div className="bg">{bg}</div>}
						{img && <div className="img" style={{ backgroundImage: `url(${img})` }} />}
					</div>
				}
			</article>
		);
	}

}
