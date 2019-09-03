import React from 'react';
import PropTypes from 'prop-types';

export default class FormSection extends React.PureComponent {

	static propTypes = {
		className: PropTypes.string,
		title: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.string,
		]),
	}

	static defaultProps = {
		className: '',
	}

	render() {
		const { className, title } = this.props;

		return (
			<div className={`form-section ${className}`}>
				{title && <h2 className="form-section-title">{title}</h2>}
				{this.props.children}
			</div>
		);
	}

}
